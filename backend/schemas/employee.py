from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import date, datetime
from typing import Optional


class EmployeeCreate(BaseModel):

    full_name: str
    department: str
    designation: str
    joining_date: date
    contact_number: str
    email: EmailStr
    password: str
    reporting_manager: str


class EmployeeUpdate(BaseModel):

    full_name: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None
    contact_number: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    reporting_manager: Optional[str] = None


class EmployeeResponse(BaseModel):

    id: int
    employee_id: str
    full_name: str
    department: str
    designation: str
    joining_date: date
    contact_number: str
    email: EmailStr
    reporting_manager: str

    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(
        from_attributes=True
    )