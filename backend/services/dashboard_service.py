
from collections import defaultdict
from sqlalchemy import func

from backend.models.employee import Employee
from backend.models.payroll import Payroll
from backend.models.leave import Leave
from backend.models.attendance import Attendance
from backend.models.appraisal import Appraisal


def dashboard_data(db):
    total_employees = db.query(Employee).count()
    total_payrolls = db.query(Payroll).count()
    total_leaves = db.query(Leave).count()
    total_attendance = db.query(Attendance).count()

    salary_paid = db.query(func.coalesce(func.sum(Payroll.net_salary), 0)).filter(
        Payroll.status == "Paid"
    ).scalar() or 0
    salary_pending = db.query(func.coalesce(func.sum(Payroll.net_salary), 0)).filter(
        Payroll.status == "Pending"
    ).scalar() or 0

    attendance_by_status = {
        status: count
        for status, count in db.query(Attendance.status, func.count(Attendance.id)).group_by(Attendance.status).all()
    }

    late_marks = db.query(Attendance).filter(
        Attendance.late_mark == "yes"
    ).count()

    overtime_hours = db.query(func.coalesce(func.sum(Attendance.overtime_hours), 0)).scalar() or 0

    leave_type_breakdown = {
        leave_type: count
        for leave_type, count in db.query(Leave.leave_type, func.count(Leave.id)).group_by(Leave.leave_type).all()
    }

    leave_status_breakdown = {
        status: count
        for status, count in db.query(Leave.status, func.count(Leave.id)).group_by(Leave.status).all()
    }

    department_headcount = {
        department or "Unknown": count
        for department, count in db.query(Employee.department, func.count(Employee.id)).group_by(Employee.department).all()
    }

    join_years = defaultdict(int)
    for emp in db.query(Employee).all():
        if emp.joining_date:
            join_years[str(emp.joining_date.year)] += 1
        else:
            join_years["Unknown"] += 1

    appraisal_count = db.query(Appraisal).count()
    appraisal_average_rating = db.query(func.coalesce(func.avg(Appraisal.rating), 0)).scalar() or 0
    appraisal_recommendations = {
        recommendation or "Unknown": count
        for recommendation, count in db.query(Appraisal.promotion_recommendation, func.count(Appraisal.id)).group_by(Appraisal.promotion_recommendation).all()
    }

    return {
        "total_employees": total_employees,
        "total_payrolls": total_payrolls,
        "total_leaves": total_leaves,
        "total_attendance": total_attendance,
        "payroll_summary": {
            "paid_salary": salary_paid,
            "pending_salary": salary_pending,
        },
        "attendance_summary": {
            "by_status": attendance_by_status,
            "late_marks": late_marks,
            "total_overtime_hours": overtime_hours,
        },
        "leave_trends": {
            "by_type": leave_type_breakdown,
            "by_status": leave_status_breakdown,
        },
        "department_headcount": department_headcount,
        "employee_growth": dict(join_years),
        "appraisal_analytics": {
            "total_appraisals": appraisal_count,
            "average_rating": float(appraisal_average_rating),
            "promotion_recommendations": appraisal_recommendations,
        },
    }
