from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.services.notification_service import (

    get_employee_notifications,

    send_holiday_notification,

    emergency_leave_alert,

    monthly_leave_limit_check
)

router = APIRouter(
    prefix="/notification",
    tags=["Notification"]
)


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# Employee Notifications
@router.get("/{employee_id}")
def employee_notifications(
    employee_id: str,
    db: Session = Depends(get_db)
):

    return get_employee_notifications(
        db,
        employee_id
    )


# Holiday Notification
@router.post("/holiday")
def holiday_notification(
    employee_id: str,
    holiday_name: str,
    holiday_date: str,
    db: Session = Depends(get_db)
):

    return send_holiday_notification(
        db,
        employee_id,
        holiday_name,
        holiday_date
    )


# Emergency Leave Notification
@router.post("/emergency-leave")
def emergency_leave_notification(
    employee_id: str,
    reason: str,
    db: Session = Depends(get_db)
):

    return emergency_leave_alert(
        db,
        employee_id,
        reason
    )


# Monthly Leave Limit Alert
@router.post("/leave-limit/{employee_id}")
def leave_limit_alert(
    employee_id: str,
    db: Session = Depends(get_db)
):

    return monthly_leave_limit_check(
        db,
        employee_id
    )