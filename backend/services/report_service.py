
from collections import defaultdict
from sqlalchemy import func

from backend.models.employee import Employee
from backend.models.attendance import Attendance
from backend.models.leave import Leave
from backend.models.payroll import Payroll
from backend.models.appraisal import Appraisal


def generate_reports(db):
    total_employees = db.query(Employee).count()
    total_attendance = db.query(Attendance).count()
    total_leaves = db.query(Leave).count()
    total_payrolls = db.query(Payroll).count()

    payroll_paid = db.query(func.coalesce(func.sum(Payroll.net_salary), 0)).filter(
        Payroll.status == "Paid"
    ).scalar() or 0
    payroll_pending = db.query(func.coalesce(func.sum(Payroll.net_salary), 0)).filter(
        Payroll.status == "Pending"
    ).scalar() or 0

    attendance_by_status = {
        status: count
        for status, count in db.query(Attendance.status, func.count(Attendance.id)).group_by(Attendance.status).all()
    }

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

    employees = db.query(Employee).all()
    employee_data = [
        {
            "employee_id": emp.employee_id,
            "employee_name": emp.full_name,
            "department": emp.department,
            "designation": emp.designation,
        }
        for emp in employees
    ]

    return {
        "total_employees": total_employees,
        "total_attendance": total_attendance,
        "total_leaves": total_leaves,
        "total_payrolls": total_payrolls,
        "payroll_summary": {
            "paid_salary": payroll_paid,
            "pending_salary": payroll_pending,
        },
        "attendance_summary": attendance_by_status,
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
        "employees": employee_data,
    }
