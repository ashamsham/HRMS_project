from app.models.employee import Employee
from app.models.attendance import Attendance
from app.models.leave import Leave

from sqlalchemy import func


def get_dashboard_stats(db):

    total_employees = db.query(Employee).count()

    total_attendance = db.query(Attendance).count()

    total_leaves = db.query(Leave).count()

    return {
        "total_employees": total_employees,
        "total_attendance": total_attendance,
        "total_leaves": total_leaves
    }


def department_headcount(db):

    data = db.query(
        Employee.department,
        func.count(Employee.id)
    ).group_by(Employee.department).all()

    return [
        {
            "department": dept,
            "employee_count": count
        }
        for dept, count in data
    ]


def leave_trends(db):

    data = db.query(
        Leave.leave_type,
        func.count(Leave.id)
    ).group_by(Leave.leave_type).all()

    return [
        {
            "leave_type": leave_type,
            "count": count
        }
        for leave_type, count in data
    ]


def attendance_summary(db):

    data = db.query(
        Attendance.status,
        func.count(Attendance.id)
    ).group_by(Attendance.status).all()

    return [
        {
            "status": status,
            "count": count
        }
        for status, count in data
    ]