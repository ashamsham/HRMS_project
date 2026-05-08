from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.services.dashboard_service import (
    get_dashboard_stats,
    department_headcount,
    leave_trends,
    attendance_summary
)

# Create Router
router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


# Database Dependency
def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# Dashboard Statistics
@router.get("/stats")
def dashboard_stats(
    db: Session = Depends(get_db)
):

    return get_dashboard_stats(db)


# Department Employee Count
@router.get("/departments")
def department_report(
    db: Session = Depends(get_db)
):

    return department_headcount(db)


# Leave Reports
@router.get("/leave-trends")
def leave_report(
    db: Session = Depends(get_db)
):

    return leave_trends(db)


# Attendance Reports
@router.get("/attendance-summary")
def attendance_report(
    db: Session = Depends(get_db)
):

    return attendance_summary(db)