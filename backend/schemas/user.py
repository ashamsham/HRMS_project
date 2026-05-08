from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str
    department: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str