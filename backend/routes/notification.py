from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database import SessionLocal

from backend.dependencies import (
    get_current_user
)
from backend.services.notification_service import (
    get_employee_notifications,
    get_notifications_for_user,
    create_notification,
    emergency_leave_alert,
    monthly_leave_limit_check,
    mark_notification_read,
    update_notification,
    delete_notification,
)
from backend.schemas.notification import (
    NotificationCreate,
    NotificationCreateByEmployee,
    NotificationUpdate,
)
router = APIRouter(
    tags=["Notification"]
)


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()




# All Notifications for current user or full roles
@router.get("/all")
def all_notifications(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return get_notifications_for_user(db, current_user)


@router.get("/my-notifications")
def my_notifications(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return get_notifications_for_user(db, current_user)


@router.post("/create")
def create_notification_route(
    notification: NotificationCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return create_notification(
        db,
        notification.user,
        notification.title,
        notification.message
    )


@router.post("/employee/{employee_id}")
def send_employee_notification(
    employee_id: str,
    notification: NotificationCreateByEmployee,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return create_notification(
        db,
        employee_id,
        notification.title,
        notification.message
    )


# Mark notification as read
@router.put("/mark-read/{notification_id}")
def mark_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return mark_notification_read(db, notification_id, current_user)


@router.put("/update/{notification_id}")
def update_notification_route(
    notification_id: int,
    notification: NotificationUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return update_notification(db, notification_id, notification)


@router.delete("/delete/{notification_id}")
def delete_notification_route(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return delete_notification(db, notification_id)


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