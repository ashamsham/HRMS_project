from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional


from backend.database import SessionLocal
from backend.dependencies import (
    get_current_user,
    role_required
)

from backend.schemas.attendance import (
    AttendanceCreate,
    AttendanceResponse,
    AttendanceCheckIn,
    AttendanceCheckOut
)
from backend.services.attendance_service import (
    mark_attendance,
    get_all_attendance,
    get_employee_attendance,
    get_daily_attendance_report,
    get_monthly_attendance_report,
    check_in_employee,
    check_out_employee
)

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ALL LOGGED USERS CAN VIEW
@router.get("/all", response_model=List[AttendanceResponse])
def all_attendance(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_all_attendance(db)


# Get attendance for a specific employee; optional month format as text (may) or numeric (05)
@router.get("/employee/{employee_id}")
def employee_attendance(
    employee_id: str,
    month: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_employee_attendance(db, employee_id, month)


# Check-in endpoint (marks current time)
@router.post("/check-in/{employee_id}", response_model=AttendanceResponse)
def check_in(
    employee_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return check_in_employee(db, employee_id)


# Check-out endpoint (marks current time)
@router.post("/check-out/{employee_id}", response_model=AttendanceResponse)
def check_out(
    employee_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return check_out_employee(db, employee_id)


# Daily report (returns JSON list of dicts)
@router.get("/daily-report/{target_date}")
def daily_report(
    target_date: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_daily_attendance_report(db, target_date)


# Monthly report for an employee
@router.get("/monthly/{employee_id}/{year}/{month}")
def monthly_report(
    employee_id: str,
    year: int,
    month: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_monthly_attendance_report(db, employee_id, year, month)


