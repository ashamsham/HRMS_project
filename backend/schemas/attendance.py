from pydantic import BaseModel
from datetime import date, time

class AttendanceCreate(BaseModel):

    employee_id: str

    attendance_date: date

    check_in: time

    check_out: time

    status: str

    late_mark: str

    overtime_hours: int