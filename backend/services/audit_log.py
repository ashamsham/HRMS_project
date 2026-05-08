from app.models.audit_log import AuditLog

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

    return db.query(AuditLog).all()


def get_employee_logs(db, employee_id):

    return db.query(AuditLog).filter(
        AuditLog.employee_id == employee_id
    ).all()