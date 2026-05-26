from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database import SessionLocal

from backend.services.holiday_service import (
    get_indian_holidays,
    send_holiday_notifications
)

router = APIRouter()


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# Get Holiday List
@router.get("/")
def holiday_list():

    return get_indian_holidays()


# Send Holiday Notifications
@router.post("/notify/{employee_id}")
def notify_holidays(
    employee_id: str,
    db: Session = Depends(get_db)
):

    return send_holiday_notifications(
        db,
        employee_id
    )