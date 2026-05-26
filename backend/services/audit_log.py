from backend.models.audit_log import AuditLog
from sqlalchemy import func, desc
from datetime import datetime, timedelta

def create_audit_log(db, audit_data):

    new_log = AuditLog(
        employee_id=audit_data.employee_id,
        action=audit_data.action,
        module=audit_data.module,
        status=audit_data.status
    )

    db.add(new_log)
    db.commit()
    db.refresh(new_log)

    return new_log


def get_all_logs(db):

    return db.query(AuditLog).order_by(desc(AuditLog.created_at)).all()


def get_employee_logs(db, employee_id):

    return db.query(AuditLog).filter(
        AuditLog.employee_id == employee_id
    ).order_by(desc(AuditLog.created_at)).all()


def get_logs_by_module(db, module):
    """Get logs by module"""
    return db.query(AuditLog).filter(
        AuditLog.module == module
    ).order_by(desc(AuditLog.created_at)).all()


def get_logs_by_date_range(db, start_date, end_date):
    """Get logs within date range"""
    return db.query(AuditLog).filter(
        AuditLog.created_at >= start_date,
        AuditLog.created_at <= end_date
    ).order_by(desc(AuditLog.created_at)).all()


def get_audit_analytics(db):
    """Get audit analytics"""
    total_logs = db.query(func.count(AuditLog.id)).scalar()

    actions_by_type = db.query(
        AuditLog.action,
        func.count(AuditLog.id)
    ).group_by(AuditLog.action).all()

    modules_by_type = db.query(
        AuditLog.module,
        func.count(AuditLog.id)
    ).group_by(AuditLog.module).all()

    status_distribution = db.query(
        AuditLog.status,
        func.count(AuditLog.id)
    ).group_by(AuditLog.status).all()

    # Recent activity (last 7 days)
    seven_days_ago = datetime.now() - timedelta(days=7)
    recent_activity = db.query(func.count(AuditLog.id)).filter(
        AuditLog.created_at >= seven_days_ago
    ).scalar()

    return {
        "total_logs": total_logs,
        "actions_by_type": dict(actions_by_type),
        "modules_by_type": dict(modules_by_type),
        "status_distribution": dict(status_distribution),
        "recent_activity": recent_activity
    }


def log_employee_action(db, employee_id, action, module, status="success", details=None):
    """Helper function to log employee actions"""
    from backend.schemas.audit_log import AuditLogCreate

    audit_data = AuditLogCreate(
        employee_id=employee_id,
        action=action,
        module=module,
        status=status,
        details=details
    )

    return create_audit_log(db, audit_data)
