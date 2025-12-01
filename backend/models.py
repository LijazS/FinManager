from sqlalchemy import Column, Integer, String, text, ForeignKey,Float, Date
from database import Base
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import date 

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

class ExpenseModel(Base):
    __tablename__ = "expenses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    amount = Column(Float, nullable=False)
    currency = Column(String, nullable=False, default="INR")  # <-- change here
    category = Column(String, nullable=False)
    description = Column(String, nullable=False)

    date_added = Column(Date, nullable=False, default=date.today)