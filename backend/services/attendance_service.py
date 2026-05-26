from backend.models.attendance import Attendance
from backend.models.employee import Employee

from datetime import datetime, date
from sqlalchemy import extract
from calendar import monthrange


# ------------------------
# Manual Attendance Entry
# ------------------------

def mark_attendance(db, attendance_data):

    attendance = Attendance(
        employee_id=attendance_data.employee_id,
        attendance_date=attendance_data.attendance_date,
        check_in=attendance_data.check_in,
        check_out=attendance_data.check_out,
        status=attendance_data.status,
        late_mark=attendance_data.late_mark,
        overtime_hours=attendance_data.overtime_hours
    )

    db.add(attendance)
    db.commit()
    db.refresh(attendance)

    return attendance


# ------------------------
# Employee Check In
# ------------------------

def check_in_employee(db, employee_id):

    today = date.today()

    existing = db.query(
        Attendance
    ).filter(
        Attendance.employee_id == employee_id,
        Attendance.attendance_date == today,
        Attendance.check_out == None
    ).first()

    if existing:
        return existing

    attendance = Attendance(
        employee_id=employee_id,
        attendance_date=today,
        check_in=datetime.now().time(),
        status="present",
        late_mark="no",
        overtime_hours=0
    )

    db.add(attendance)
    db.commit()
    db.refresh(attendance)

    return attendance


# ------------------------
# Employee Check Out
# ------------------------

def check_out_employee(db, employee_id):

    today = date.today()

    attendance = db.query(
        Attendance
    ).filter(
        Attendance.employee_id == employee_id,
        Attendance.attendance_date == today,
        Attendance.check_out == None
    ).order_by(
        Attendance.check_in.desc()
    ).first()

    if not attendance:
        return None

    now = datetime.now()

    attendance.check_out = now.time()

    work_hours = (
        now -
        datetime.combine(
            today,
            attendance.check_in
        )
    ).total_seconds() / 3600

    attendance.overtime_hours = max(
        0,
        round(work_hours - 8, 2)
    )

    attendance.status = "present"

    db.commit()
    db.refresh(attendance)

    return attendance


# ------------------------
# Daily Attendance
# ------------------------

def get_daily_attendance_report(
    db,
    date_str
):

    target_date = datetime.strptime(
        date_str,
        "%Y-%m-%d"
    ).date()

    employees = db.query(
        Employee
    ).all()

    result = []

    for emp in employees:

        record = db.query(
            Attendance
        ).filter(
            Attendance.employee_id == emp.employee_id,
            Attendance.attendance_date == target_date
        ).first()

        result.append({

            "employee_id":
            emp.employee_id,

            "employee_name":
            emp.full_name,

            "status":
            "present" if record else "absent",

            "check_in":
            record.check_in if record else None,

            "check_out":
            record.check_out if record else None
        })

    return result


# ------------------------
# Monthly Attendance
# ------------------------

def get_monthly_attendance_report(
    db,
    employee_id,
    year,
    month
):

    records = db.query(
        Attendance
    ).filter(

        Attendance.employee_id == employee_id,

        extract(
            "year",
            Attendance.attendance_date
        ) == year,

        extract(
            "month",
            Attendance.attendance_date
        ) == month

    ).all()

    present = sum(
        1 for r in records
        if r.status == "present"
    )

    absent = (
        monthrange(year, month)[1]
        - present
    )

    return {

        "employee_id":
        employee_id,

        "month":
        month,

        "year":
        year,

        "present_days":
        present,

        "absent_days":
        absent,

        "records":
        records
    }


# ------------------------
# Yearly Attendance
# ------------------------

def get_yearly_attendance_report(
    db,
    employee_id,
    year
):

    records = db.query(
        Attendance
    ).filter(

        Attendance.employee_id == employee_id,

        extract(
            "year",
            Attendance.attendance_date
        ) == year

    ).all()

    present = sum(
        1 for r in records
        if r.status == "present"
    )

    absent = 365 - present

    return {

        "employee_id":
        employee_id,

        "year":
        year,

        "present_days":
        present,

        "absent_days":
        absent,

        "records":
        records
    }


# ------------------------
# Employee Attendance
# ------------------------

def get_employee_attendance(
    db,
    employee_id,
    month: str = None
):

    if month:
        try:
            # Try to parse as numeric (05 or 5)
            if month.isdigit():
                month_num = int(month)
                if not (1 <= month_num <= 12):
                    raise ValueError("Month must be 1-12")
            else:
                # Try to parse as text month name (may, May, MAY, etc.)
                import calendar
                month_num = None
                for i, name in enumerate(calendar.month_name[1:], 1):
                    if name.lower() == month.lower():
                        month_num = i
                        break
                if month_num is None:
                    # Fallback to current month if invalid
                    today = date.today()
                    month_num = today.month
        except (ValueError, AttributeError):
            # If user passes invalid month format, default to current month
            today = date.today()
            month_num = today.month
    else:
        today = date.today()
        month_num = today.month

    today = date.today()
    year = today.year

    records = db.query(
        Attendance
    ).filter(
        Attendance.employee_id == employee_id,
        extract("year", Attendance.attendance_date) == year,
        extract("month", Attendance.attendance_date) == month_num,
        Attendance.status == "present"
    ).all()

    present_dates = [str(r.attendance_date) for r in records]

    return {
        "employee_id": employee_id,
        "month": month_num,
        "year": year,
        "present_dates": present_dates
    }


# ------------------------
# All Attendance
# ------------------------

def get_all_attendance(db):

    return db.query(
        Attendance
    ).all()