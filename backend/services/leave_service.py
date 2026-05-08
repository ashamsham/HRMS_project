from app.models.leave import Leave

def apply_leave(db, leave_data):

    new_leave = Leave(
        employee_id=leave_data.employee_id,
        leave_type=leave_data.leave_type,
        start_date=leave_data.start_date,
        end_date=leave_data.end_date,
        reason=leave_data.reason
    )

    db.add(new_leave)
    db.commit()
    db.refresh(new_leave)

    return new_leave


def get_all_leaves(db):

    return db.query(Leave).all()


def approve_or_reject_leave(db, leave_id, leave_data):

    leave = db.query(Leave).filter(
        Leave.id == leave_id
    ).first()

    if not leave:
        return {"error": "Leave request not found"}

    leave.status = leave_data.status

    db.commit()
    db.refresh(leave)

    return leave