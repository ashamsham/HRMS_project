from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date, time


class AttendanceCreate(BaseModel):

    employee_id: str

    attendance_date: date

    check_in: Optional[time] = None

    check_out: Optional[time] = None

    status: str

    late_mark: Optional[str] = "no"

    overtime_hours: Optional[float] = 0


class AttendanceCheckIn(BaseModel):

    employee_id: str

    remarks: Optional[str] = None


class AttendanceCheckOut(BaseModel):

    employee_id: str

    remarks: Optional[str] = None


class AttendanceResponse(BaseModel):

    id: int

    employee_id: str

    attendance_date: date

    check_in: Optional[time] = None

    check_out: Optional[time] = None

    status: str

    late_mark: str

    overtime_hours: float

    model_config = ConfigDict(
        from_attributes=True
    )