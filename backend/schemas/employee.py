from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional

class EmployeeCreate(BaseModel):
    full_name: str
    department: str
    designation: str
    joining_date: date
    contact_number: str
    email: EmailStr
    reporting_manager: str
    


class EmployeeUpdate(BaseModel):
    full_name: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None
    contact_number: Optional[str] = None
    email: Optional[EmailStr] = None
    reporting_manager: Optional[str] = None
