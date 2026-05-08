from datetime import date
from sqlalchemy import extract

from app.models.notification import Notification
from app.models.leave import Leave


# Create Notification
def create_notification(
    db,
    employee_id,
    title,
    message
):

    notification = Notification(

        employee_id=employee_id,

        title=title,

        message=message
    )

    db.add(notification)

    db.commit()

    db.refresh(notification)

    return notification


# Get Employee Notifications
def get_employee_notifications(
    db,
    employee_id
):

    return db.query(Notification).filter(
        Notification.employee_id == employee_id
    ).all()


# Holiday Notification
def send_holiday_notification(
    db,
    employee_id,
    holiday_name,
    holiday_date
):

    title = "Holiday Announcement"

    message = (
        f"{holiday_name} holiday on "
        f"{holiday_date}"
    )

    return create_notification(
        db,
        employee_id,
        title,
        message
    )


# Emergency Leave Alert
def emergency_leave_alert(
    db,
    employee_id,
    reason
):

    title = "Emergency Leave Request"

    message = (
        f"Emergency leave requested: {reason}"
    )

    return create_notification(
        db,
        employee_id,
        title,
        message
    )


# Monthly Leave Limit Check
def monthly_leave_limit_check(
    db,
    employee_id
):

    current_month = date.today().month

    current_year = date.today().year

    leave_count = db.query(Leave).filter(

        Leave.employee_id == employee_id,

        extract("month", Leave.start_date)
        == current_month,

        extract("year", Leave.start_date)
        == current_year

    ).count()

    # Monthly leave limit = 2
    if leave_count >= 2:

        title = "Leave Limit Warning"

        message = (
            "You already used "
            "2 leaves this month."
        )

        return create_notification(
            db,
            employee_id,
            title,
            message
        )

    return {
        "message": "Leave limit not exceeded"
    }

# Mark Notification As Read
def mark_notification_read(
    db,
    notification_id
):

    notification = db.query(Notification).filter(
        Notification.id == notification_id
    ).first()

    if not notification:

        return {
            "message": "Notification not found"
        }

    notification.is_read = True

    db.commit()

    return {
        "message": "Notification marked as read"
    }