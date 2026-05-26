from sqlalchemy import Column, Integer, String, Boolean, DateTime
from backend.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    email = Column(String(120), unique=True, nullable=False)

    hashed_password = Column(String(255), nullable=False)

    role = Column(String(50), default="employee")

    department = Column(String(100))

    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )