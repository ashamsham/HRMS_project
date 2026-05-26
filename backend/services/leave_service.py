from backend.models.leave import Leave
from backend.models.employee import Employee


def apply_leave(db, leave_data):

    employee = db.query(Employee).filter(
        Employee.employee_id == leave_data.employee_id
    ).first()

    if not employee:
        raise Exception("Employee not found")

    leave = Leave(
        employee_id=leave_data.employee_id,
        employee_name=employee.full_name,
        leave_type=leave_data.leave_type,
        start_date=leave_data.start_date,
        end_date=leave_data.end_date,
        reason=leave_data.reason,
        status="Pending"
    )

    db.add(leave)
    db.commit()
    db.refresh(leave)

    return leave


def update_leave(db, leave_id, leave_data):

    leave = db.query(Leave).filter(
        Leave.id == leave_id
    ).first()

    if not leave:
        raise Exception("Leave request not found")

    if leave_data.leave_type is not None:
        leave.leave_type = leave_data.leave_type

    if leave_data.start_date is not None:
        leave.start_date = leave_data.start_date

    if leave_data.end_date is not None:
        leave.end_date = leave_data.end_date

    if leave_data.reason is not None:
        leave.reason = leave_data.reason

    db.commit()
    db.refresh(leave)

    return leave


def approve_leave(db, leave_id, status="Approved"):

    leave = db.query(Leave).filter(
        Leave.id == leave_id
    ).first()

    if not leave:
        raise Exception("Leave request not found")

    leave.status = status

    db.commit()

    return leave


def reject_leave(db, leave_id):

    leave = db.query(Leave).filter(
        Leave.id == leave_id
    ).first()

    if not leave:
        raise Exception("Leave request not found")

    leave.status = "Rejected"

    db.commit()

    return leave


def get_all_leaves(db):

    return db.query(Leave).all()