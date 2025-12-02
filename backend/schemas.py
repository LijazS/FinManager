from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from uuid import UUID
from enum import Enum
from datetime import date

# --- USERS ---------
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: UUID           # match the UUID from the DB
    email: EmailStr
    token: str | None = None

    class Config:
        orm_mode = True  # <-- must be orm_mode, not from_attributes


# --- LOGIN ---------
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    id: str           # UUID as string
    email: EmailStr
    # optionally add token if using JWT
    token: str | None = None

    class Config:
        orm_mode = True


# --------- CHAT REQUEST ----------
class ChatRequest(BaseModel):
    message: str = Field(..., description="The user's message to the chat agent")
    history: List[dict] = [] 



# --- EXPENSES ---------

class ExpenseCategory(str, Enum):
    FOOD = "Food"
    TRANSPORT = "Transport"
    UTILITIES = "Utilities"
    ENTERTAINMENT = "Entertainment"
    GROCERIES = "Groceries"
    RENT = "Rent"
    HEALTHCARE = "Healthcare"
    OTHER = "Other"

class Expense(BaseModel):
    amount: float = Field(description="The numeric value of the expense")
    currency: str = Field(default="INR",description="The currency code, e.g., USD, EUR")
    category: ExpenseCategory = Field(description="The category of the expense based on description")
    description: str = Field(description="A brief description of the expense")
    date_added: date | None = Field(default=None, description="YYYY-MM-DD")

    class Config:
        orm_mode = True

class calcResponse(BaseModel):
    todays: float
    months: float
    years: float

    class Config:
        orm_mode = True

