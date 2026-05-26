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


#TOKEN RESPONSE 

class TokenResponse(BaseModel):

    access_token: str

    token_type: str

    role: str

class config:

    from_attributes = True