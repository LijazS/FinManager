import os
from typing import Annotated
from typing_extensions import TypedDict
import uuid

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.tools import tool
from langchain_core.runnables import RunnableConfig
from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import ToolNode, tools_condition
from langgraph.graph.message import add_messages

from database import AsyncSessionLocal
from models import ExpenseModel
from schemas import ExpenseCategory
from datetime import date, datetime
from sqlalchemy import select
from dotenv import load_dotenv

# 1. SETUP
load_dotenv()

if not os.getenv("GEMINI_API_KEY"):
    raise ValueError("❌ GEMINI_API_KEY is missing! Check your .env file.")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0
)

# 2. DEFINE TOOLS (Fixed to use Config)

@tool
async def save_expense(
    amount: float,
    category: ExpenseCategory,
    description: str,
    config: RunnableConfig,
):
    """
    Saves a financial expense.
    Required: amount, category, description.
    """
    user_id_str = config.get("configurable", {}).get("user_id")
    print(f"Saving expense for user_id: {user_id_str}")

    if not user_id_str:
        return "❌ Error: User ID missing."

    try:
        user_uuid = uuid.UUID(user_id_str)
    except ValueError:
        return f"❌ Error: Invalid user ID format: {user_id_str}"

    async with AsyncSessionLocal() as session:
        try:
            new_expense = ExpenseModel(
                user_id=user_uuid,
                amount=amount,
                category=category.value,
                description=description,
                # rely on model default for currency="INR" or set explicitly:
                # currency="INR",
                date_added=date.today(),
            )
            session.add(new_expense)
            await session.commit()
            return f"✅ Saved: {amount} for {category.value}"
        except Exception as e:
            await session.rollback()
            print("DATABASE ERROR IN save_expense:", repr(e))
            return f"❌ Error saving: {str(e)}"
    


@tool
async def get_expenses(config: RunnableConfig):
    """
    Retrieves all expenses for the current user.
    """
    user_id_str = config.get("configurable", {}).get("user_id")
    if not user_id_str:
        return "❌ Error: User ID missing."

    try:
        user_uuid = uuid.UUID(user_id_str)  # convert string -> UUID
    except ValueError:
        return f"❌ Error: Invalid user ID format: {user_id_str}"

    async with AsyncSessionLocal() as session:
        try:
            stmt = select(ExpenseModel).where(ExpenseModel.user_id == user_uuid)
            result = await session.execute(stmt)
            expenses = result.scalars().all()

            if not expenses:
                return "No expenses found."

            lines = []
            for exp in expenses:
                lines.append(
                    f"- {exp.amount} {exp.currency} ({exp.category}) on {exp.date_added}: {exp.description}"
                )
            return "Here are your expenses:\n" + "\n".join(lines)

        except Exception as e:
            # Log actual DB error so you see it in the terminal
            print("DATABASE ERROR IN get_expenses:", repr(e))

            
@tool
async def get_expenses_by_date(
    target_date: str,  # e.g. "2025-12-01"
    config: RunnableConfig,
):
    """
    Retrieves all expenses for the current user on a specific date.
    target_date must be in YYYY-MM-DD format.
    """
    user_id_str = config.get("configurable", {}).get("user_id")
    if not user_id_str:
        return "❌ Error: User ID missing."

    try:
        user_uuid = uuid.UUID(user_id_str)
    except ValueError:
        return f"❌ Error: Invalid user ID format: {user_id_str}"

    # Parse the date string
    try:
        parsed_date = datetime.strptime(target_date, "%Y-%m-%d").date()
    except ValueError:
        return "❌ Error: Date must be in YYYY-MM-DD format (e.g., 2025-12-01)."

    async with AsyncSessionLocal() as session:
        try:
            stmt = (
                select(ExpenseModel)
                .where(
                    (ExpenseModel.user_id == user_uuid) &
                    (ExpenseModel.date_added == parsed_date)
                )
            )
            result = await session.execute(stmt)
            expenses = result.scalars().all()

            if not expenses:
                return f"No expenses found on {parsed_date}."

            lines = []
            for exp in expenses:
                lines.append(
                    f"- {exp.amount} {exp.currency} ({exp.category}) on {exp.date_added}: {exp.description}"
                )
            return f"Here are your expenses on {parsed_date}:\n" + "\n".join(lines)

        except Exception as e:
            print("DATABASE ERROR IN get_expenses_by_date:", repr(e))
            return f"❌ Error retrieving expenses: {str(e)}"
# 3. BUILD THE GRAPH

# List of tools available to the agent
tools = [save_expense, get_expenses, get_expenses_by_date]

# Bind tools to Gemini so it knows they exist
llm_with_tools = llm.bind_tools(tools)

# Define State (Just a list of messages)
class AgentState(TypedDict):
    messages: Annotated[list, add_messages]

# Node: The LLM thinking process
def reasoner_node(state: AgentState):
    return {"messages": [llm_with_tools.invoke(state["messages"])]}

# Create Graph
builder = StateGraph(AgentState)

builder.add_node("reasoner", reasoner_node)
builder.add_node("tools", ToolNode(tools)) # Handles tool execution

# Define Flow
builder.add_edge(START, "reasoner")
builder.add_conditional_edges(
    "reasoner",
    tools_condition, # Check: Did LLM call a tool? -> Go to "tools" node
)
builder.add_edge("tools", "reasoner") # Loop back to LLM after tool runs

# Compile
react_graph = builder.compile()
