from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.schemas.attendance import AttendanceCreate
from app.services.attendance_service import (
    mark_attendance,
    get_all_attendance,
    get_employee_attendance
)

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/mark")
def create_attendance(
    attendance: AttendanceCreate,
    db: Session = Depends(get_db)
):
    return mark_attendance(db, attendance)


@router.get("/all")
def all_attendance(db: Session = Depends(get_db)):
    return get_all_attendance(db)


@router.get("/{employee_id}")
def employee_attendance(
    employee_id: str,
    db: Session = Depends(get_db)
):
    return get_employee_attendance(db, employee_id)