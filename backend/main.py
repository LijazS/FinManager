from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import os
from dotenv import load_dotenv

from pydantic import BaseModel
from typing import Optional, List

from database import get_db
import models
import schemas
from auth import get_password_hash, verify_password, verify_access_token, create_access_token, get_user_id
from database import engine, Base


load_dotenv()

app = FastAPI() 
secret_key = os.getenv("SECRET_KEY")

origins = [
    "http://localhost:5173",  # Vite's default port
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # Allow these origins
    allow_credentials=True,
    allow_methods=["*"],        # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],        # Allow all headers (Auth, etc.)
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

############################ PROTECTED ROUTE EXAMPLE ###############################

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

#############################  END PROTECTED ROUTE EXAMPLE  ###############################

# --- Imports needed for the Chat Agent ---
from agent import react_graph # Import your compiled graph
from langchain_core.messages import HumanMessage
from fastapi.security import OAuth2PasswordBearer # Required for header extraction
from langchain_core.messages import AIMessage
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage


SYSTEM_PROMPT = (
    "You are a financial expense tracking assistant.\n"
    "When the user mentions spending money, infer:\n"
    "- amount (a number)\n"
    "- category from this set only: Food, Transport, Utilities, Entertainment, "
    "Groceries, Rent, Healthcare, Other.\n"
    "- description: a short name of what they bought (e.g. 'coffee', 'Uber to office').\n"
    "If the user says something like 'I spent 10 on coffee', infer category=Food and "
    "description='coffee' without asking again.\n"
    "Only ask follow-up questions if a field is truly missing (for example, "
    "no amount given at all). Do NOT repeatedly ask for category/description "
    "when they can be inferred from the sentence."
)

# Define scheme so Depends knows where to find the token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Create a dependency wrapper for your get_user_id function
async def get_current_user_id(token: str = Depends(oauth2_scheme)) -> str:
    user_id = get_user_id(token, secret_key) # Calls your auth.py function
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token or missing User ID")
    return user_id

@app.post("/chat")
async def chat_endpoint(
    request: schemas.ChatRequest, 
    user_id: str = Depends(get_current_user_id)
):
    print(f"Current user ID: {user_id}")

    messages = [SystemMessage(content=SYSTEM_PROMPT)]  # <-- add system message first

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




if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)