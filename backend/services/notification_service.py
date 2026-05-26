from datetime import date, datetime
from sqlalchemy import extract, func, or_

from backend.models.notification import Notification, NotificationRecipient
from backend.models.leave import Leave
from backend.models.employee import Employee
from backend.models.user import User
from backend.models.audit_log import AuditLog


def _recipient_identifier_for_user(db, current_user):
    if not current_user:
        return None

    if current_user.get("employee_id"):
        return str(current_user["employee_id"])

    sub = current_user.get("sub")
    if not sub:
        return None

    employee = db.query(Employee).filter(Employee.email == sub).first()
    if employee:
        return employee.employee_id or str(employee.id)

    return f"user:{sub.lower()}"


def _recipient_identifier_for_user_record(db, user):
    if not user:
        return None

    employee = db.query(Employee).filter(Employee.email == user.email).first()
    if employee:
        return employee.employee_id or str(employee.id)

    return f"user:{user.email.lower()}"


def _resolve_employee_by_target(db, target):
    target_text = (str(target or "")).strip()
    if not target_text:
        return None

    employee = db.query(Employee).filter(
        or_(Employee.employee_id == target_text, Employee.email == target_text)
    ).first()
    if employee:
        return employee

    try:
        numeric_id = int(target_text)
        employee = db.query(Employee).filter(Employee.id == numeric_id).first()
        if employee:
            return employee
    except ValueError:
        pass

    return None


def _log_to_audit(db, employee_id, action, module="Notification", status="Success"):
    """Log action to audit logs"""
    try:
        audit_log = AuditLog(
            employee_id=employee_id or "system",
            action=action,
            module=module,
            status=status
        )
        db.add(audit_log)
        db.commit()
    except Exception:
        pass


def create_notification(db, target, title, message):
    notification = Notification(
        employee_id=target,
        title=title,
        message=message,
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)

    target_text = (target or "").strip()
    recipients = []
    target_lower = target_text.lower()

    if target_lower in ("all", "everyone"):
        users = db.query(User).all()
        for user in users:
            identifier = _recipient_identifier_for_user_record(db, user)
            if identifier:
                recipients.append(NotificationRecipient(notification_id=notification.id, employee_id=identifier))

    elif target_lower in ("employee", "employees"):
        employees = db.query(Employee).all()
        for emp in employees:
            identifier = emp.employee_id or str(emp.id)
            recipients.append(NotificationRecipient(notification_id=notification.id, employee_id=identifier))

    elif target_lower in ("admin", "hr", "manager"):
        users = db.query(User).filter(func.lower(User.role) == target_lower).all()
        for user in users:
            identifier = _recipient_identifier_for_user_record(db, user)
            if identifier:
                recipients.append(NotificationRecipient(notification_id=notification.id, employee_id=identifier))

    else:
        employee = _resolve_employee_by_target(db, target_text)
        if employee:
            identifier = employee.employee_id or str(employee.id)
        else:
            user = db.query(User).filter(func.lower(User.email) == target_lower).first()
            if user:
                identifier = _recipient_identifier_for_user_record(db, user)
            else:
                identifier = target_text

        if identifier:
            recipients.append(NotificationRecipient(notification_id=notification.id, employee_id=identifier))

    if recipients:
        db.add_all(recipients)
        db.commit()

    _log_to_audit(db, "system", f"Created notification: {title}")
    return notification


def get_notifications_for_user(db, current_user):
    """Get today's notifications for current user, deduplicated"""
    today = date.today()
    recipient_id = _recipient_identifier_for_user(db, current_user)
    notifications = {}
    seen_msg_hashes = set()

    if recipient_id:
        recs = db.query(NotificationRecipient).filter(
            NotificationRecipient.employee_id == recipient_id
        ).all()
        for r in recs:
            n = db.query(Notification).filter(Notification.id == r.notification_id).first()
            if not n or n.created_at.date() != today:
                continue
            msg_hash = (n.title, n.message)
            if msg_hash in seen_msg_hashes:
                continue
            seen_msg_hashes.add(msg_hash)
            notifications[n.id] = {
                "id": n.id,
                "title": n.title,
                "message": n.message,
                "employee_id": n.employee_id,
                "is_read": r.is_read,
                "created_at": n.created_at,
                "updated_at": r.updated_at,
            }

    role = (current_user.get("role") or "").lower()
    role_targets = ["all"]
    if role:
        role_targets.append(role)
        if role == "employee":
            role_targets.extend(["employee", "employees"])

    if role_targets:
        notifs = db.query(Notification).filter(
            Notification.employee_id.in_(role_targets)
        ).all()
        for n in notifs:
            if n.created_at.date() != today:
                continue
            if n.id in notifications:
                continue
            msg_hash = (n.title, n.message)
            if msg_hash in seen_msg_hashes:
                continue
            seen_msg_hashes.add(msg_hash)
            notifications[n.id] = {
                "id": n.id,
                "title": n.title,
                "message": n.message,
                "employee_id": n.employee_id,
                "is_read": False,
                "created_at": n.created_at,
                "updated_at": n.updated_at,
            }

    return list(notifications.values())


def get_employee_notifications(db, employee_id):
    recs = db.query(NotificationRecipient).filter(NotificationRecipient.employee_id == employee_id).all()
    results = []
    for r in recs:
        n = db.query(Notification).filter(Notification.id == r.notification_id).first()
        if not n:
            continue
        results.append({
            "id": n.id,
            "title": n.title,
            "message": n.message,
            "employee_id": n.employee_id,
            "is_read": r.is_read,
            "created_at": n.created_at,
            "updated_at": r.updated_at,
        })

    return results


def mark_notification_read(db, notification_id, current_user):
    recipient_id = _recipient_identifier_for_user(db, current_user)
    if not recipient_id:
        return {"message": "Notification recipient not found"}

    recipient = db.query(NotificationRecipient).filter(
        NotificationRecipient.notification_id == notification_id,
        NotificationRecipient.employee_id == recipient_id,
    ).first()

    if not recipient:
        notif = db.query(Notification).filter(Notification.id == notification_id).first()
        if not notif:
            return {"message": "Notification not found"}
        recipient = NotificationRecipient(
            notification_id=notification_id,
            employee_id=recipient_id,
            is_read=True
        )
        db.add(recipient)
        db.commit()
        _log_to_audit(db, recipient_id, f"Marked notification {notification_id} as read")
        return {"message": "Notification marked as read"}

    recipient.is_read = True
    recipient.updated_at = datetime.utcnow()
    db.commit()
    _log_to_audit(db, recipient_id, f"Marked notification {notification_id} as read")

    return {"message": "Notification marked as read"}


def update_notification(db, notification_id, notification_data):
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notification:
        return {"message": "Notification not found"}

    if notification_data.title is not None:
        notification.title = notification_data.title

    if notification_data.message is not None:
        notification.message = notification_data.message

    db.commit()

    return {"message": "Notification updated"}


# Emergency Leave Alert
def emergency_leave_alert(db, employee_id, reason):
    title = "Emergency Leave Request"
    message = f"Emergency leave requested: {reason}"
    return create_notification(db, employee_id, title, message)


# Monthly Leave Limit Check
def monthly_leave_limit_check(db, employee_id):
    current_month = date.today().month
    current_year = date.today().year

    leave_count = db.query(Leave).filter(
        Leave.employee_id == employee_id,
        extract("month", Leave.start_date) == current_month,
        extract("year", Leave.start_date) == current_year,
    ).count()

    # Monthly leave limit = 2
    if leave_count >= 2:
        title = "Leave Limit Warning"
        message = "You already used 2 leaves this month."
        return create_notification(db, employee_id, title, message)

    return {"message": "Leave limit not exceeded"}


# Delete Notification
def delete_notification(db, notification_id):
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notification:
        return {"message": "Notification not found"}
    
    recipients = db.query(NotificationRecipient).filter(
        NotificationRecipient.notification_id == notification_id
    ).all()
    
    for recipient in recipients:
        db.delete(recipient)
    
    db.delete(notification)
    db.commit()
    _log_to_audit(db, "system", f"Deleted notification {notification_id}: {notification.title}")
    
    return {"message": "Notification deleted successfully"}
