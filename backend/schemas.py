from pydantic import BaseModel, EmailStr
from uuid import UUID

# --- USERS ---------
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: UUID           # match the UUID from the DB
    email: EmailStr

    class Config:
        orm_mode = True  # <-- must be orm_mode, not from_attributes
