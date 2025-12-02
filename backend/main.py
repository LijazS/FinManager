from datetime import date, timedelta
import json
import uuid
from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import os
from dotenv import load_dotenv

from pydantic import BaseModel
from typing import Optional, List

from database import get_db, AsyncSessionLocal
import models
import schemas
from auth import get_password_hash, verify_password, verify_access_token, create_access_token, get_user_id
from database import engine, Base


load_dotenv()

app = FastAPI() 
secret_key = os.getenv("SECRET_KEY")

origins = [
    "http://localhost:5173",  
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      
    allow_credentials=True,
    allow_methods=["*"],        
    allow_headers=["*"],        
)

@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/")
async def root():
    return {"message": "Hello from FastAPI"}



############################ USER REGISTRATION ###############################

@app.post("/signup", response_model=schemas.UserResponse)
async def signup(user: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    print(user)

    # Check if email already exists
    stmt = select(models.User).where(models.User.email == user.email)
    result = await db.execute(stmt)
    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    # Hash password using your bcrypt function
    hashed_pw = get_password_hash(user.password)

    # Create user object
    new_user = models.User(
        email=user.email,
        hashed_password=hashed_pw
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    token = create_access_token(data={"sub": str(new_user.id)}, secret_key=secret_key)

    return {
        "id": str(new_user.id),
        "email": new_user.email,
        "token": token  # Placeholder for JWT or other token
    }


#############################  END USER REGISTRATION  ###############################

############################ USER LOGIN ###############################

@app.post("/login", response_model=schemas.LoginResponse)
async def login(user: schemas.UserLogin, db: AsyncSession = Depends(get_db)):
    stmt = select(models.User).where(models.User.email == user.email)
    result = await db.execute(stmt)
    existing_user = result.scalar_one_or_none()

    if not existing_user:
        raise HTTPException(status_code=400, detail="Email doesnt exist, Please sign up")
    
    if not verify_password(user.password, existing_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    
    token = create_access_token(data={"sub": str(existing_user.id)}, secret_key=secret_key)
    
    return {
        "id": str(existing_user.id),
        "email": existing_user.email,
        "token": token  # Placeholder for JWT or other token
    }

#############################  END USER LOGIN  ###############################

############################ PROTECTED ROUTE ###############################

@app.get("/protected")
async def protected_route(request: Request):
    token = request.headers.get("Authorization")
    if not token:
        raise HTTPException(status_code=401, detail="Token missing")

    token = token.replace("Bearer ", "")
    payload = verify_access_token(token, secret_key=secret_key)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return {"message": "You have access to this protected route", "user": payload.get("sub"), "accessFlag": True}

#############################  END PROTECTED ROUTE  ###############################



##############################  AI AGENT ENDPOINT  ##############################

# --- Imports needed for the Chat Agent ---
from agent import react_graph, llm # Import your compiled graph
from langchain_core.messages import HumanMessage
from fastapi.security import OAuth2PasswordBearer # Required for header extraction
from langchain_core.messages import AIMessage
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

import prompts



# Define scheme so Depends knows where to find the token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Create a dependency wrapper for your get_user_id function
async def get_current_user_id(token: str = Depends(oauth2_scheme)) -> str:
    user_id = get_user_id(token, secret_key) # Calls your auth.py function
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token or missing User ID")
    return user_id

########################## CHAT ENDPOINT ###############################

@app.post("/chat")
async def chat_endpoint(
    request: schemas.ChatRequest, 
    user_id: str = Depends(get_current_user_id)
):
    print(f"Current user ID: {user_id}")

    messages = [SystemMessage(content=prompts.SYSTEM_PROMPT_CHAT)]  # <-- add system message first

    for msg in request.history:
        if msg['role'] == 'user':
            messages.append(HumanMessage(content=msg['text']))
        elif msg['role'] == 'bot':
            messages.append(AIMessage(content=msg['text']))
    
    messages.append(HumanMessage(content=request.message))

    initial_state = {"messages": messages}
    config = {"configurable": {"user_id": user_id}}

    try:
        result = await react_graph.ainvoke(initial_state, config=config)
        return {"response": result["messages"][-1].content}
    except Exception as e:
        print(f"Agent Error: {e}")
        raise HTTPException(status_code=500, detail="Agent failed")
    ###############################  END CHAT ENDPOINT  ###############################

########################## INSIGHTS ENDPOINT ###############################

@app.get("/insights")
async def insights_endpoint(
    request: Request,
    user_id: str = Depends(get_current_user_id),
):
    # 1. Load this user's expenses (e.g., last 30 days)
    try:
        user_uuid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user ID")

    async with AsyncSessionLocal() as session:
        # Example: last 30 days; adjust as you like
        start_date = date.today() - timedelta(days=30)

        stmt = (
            select(models.ExpenseModel)
            .where(
                (models.ExpenseModel.user_id == user_uuid)
                & (models.ExpenseModel.date_added >= start_date)
            )
        )
        result = await session.execute(stmt)
        expenses = result.scalars().all()

    if not expenses:
        return {"insights": "You don't have any expenses in the last 30 days yet."}

    # 2. Convert to a simple JSON structure for the LLM
    expenses_data = [
        {
            "amount": float(exp.amount),
            "currency": exp.currency,
            "category": exp.category,
            "description": exp.description,
            "date": exp.date_added.isoformat(),
        }
        for exp in expenses
    ]

    # 3. Build messages for the insights prompt
    messages = [
        SystemMessage(content=prompts.SYSTEM_PROMPT_INSIGHTS),
        HumanMessage(
            content=(
                "Here is this user's expense history for the last 30 days as JSON:\n"
                f"{json.dumps(expenses_data, ensure_ascii=False)}\n\n"
                "Analyze this data and provide:\n"
                "- 3–5 key insights about their spending habits\n"
                "- any notable spikes or patterns\n"
                "- 2–3 concrete suggestions to optimize or adjust their spending.\n"
                "Be concise and use bullet points."
            )
        ),
    ]

    # 4. Ask Gemini for insights
    try:
        response = await llm.ainvoke(messages)
        return {"insights": response.content}
    except Exception as e:
        print("INSIGHTS LLM ERROR:", repr(e))
        raise HTTPException(status_code=500, detail="Failed to generate insights")

##############################  END INSIGHTS ENDPOINT  ###############################

##############################  AI AGENT ENDPOINT  ###############################


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)