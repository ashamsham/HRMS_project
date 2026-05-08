from app.models.attendance import Attendance

def mark_attendance(db, attendance_data):

    new_attendance = Attendance(
        employee_id=attendance_data.employee_id,
        attendance_date=attendance_data.attendance_date,
        check_in=attendance_data.check_in,
        check_out=attendance_data.check_out,
        status=attendance_data.status, # present, absent, on_leave
        late_mark=attendance_data.late_mark,#yes, no
        overtime_hours=attendance_data.overtime_hours
    )

    db.add(new_attendance)
    db.commit()
    db.refresh(new_attendance)

    return new_attendance


def get_all_attendance(db):
    return db.query(Attendance).all()


def get_employee_attendance(db, employee_id):

    return db.query(Attendance).filter(
        Attendance.employee_id == employee_id
    ).all()