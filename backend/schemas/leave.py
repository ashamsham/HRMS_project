from pydantic import BaseModel
from datetime import date
from typing import Optional

class LeaveCreate(BaseModel):

    employee_id: str

    leave_type: str

    start_date: date

    end_date: date

    reason: Optional[str] = None


class LeaveApproval(BaseModel):

    status: str


class LeaveUpdate(BaseModel):

    leave_type: Optional[str] = None

    start_date: Optional[date] = None

    end_date: Optional[date] = None

    reason: Optional[str] = None


class LeaveResponse(BaseModel):

    id: int

    employee_name: str

    employee_id: str

    leave_type: str

    start_date: date

    end_date: date

    reason: Optional[str] = None

    status: str

class Config:
        from_attributes = True