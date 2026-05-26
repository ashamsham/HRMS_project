from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
import calendar

from sqlalchemy import func, or_

from backend.database import SessionLocal
from backend.dependencies import role_required

from backend.schemas.payroll import PayrollCreate, PayrollResponse

from backend.services.payroll_service import (
    create_salary,
    get_all_payrolls,
    pay_salary
)
from backend.models.payroll import Payroll
from backend.models.employee import Employee
from backend.models.user import User

router = APIRouter()


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# CREATE SALARY
@router.post("/create", response_model=PayrollResponse)
def create_salary_route(

    payroll: PayrollCreate,

    db: Session = Depends(get_db),

    current_user=Depends(
        role_required(["Admin", "HR"])
    )
):

    return create_salary(db, payroll)


# GET ALL PAYROLLS
@router.get("/all", response_model=list[PayrollResponse])
def all_payrolls(

    db: Session = Depends(get_db),

    current_user=Depends(
        role_required(["Admin", "HR"])
    )
):

    return get_all_payrolls(db)


# PENDING SALARYS - list payrolls with status pending
@router.get("/pending")
def pending_payrolls(
    month: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user=Depends(
        role_required(["Admin", "HR"])
    )
):
    # determine target month number
    if month:
        if month.isdigit():
            try:
                mnum = int(month)
                if not (1 <= mnum <= 12):
                    mnum = date.today().month
            except ValueError:
                mnum = date.today().month
        else:
            # parse textual month name
            mnum = None
            for i, name in enumerate(calendar.month_name[1:], 1):
                if name.lower() == month.lower():
                    mnum = i
                    break
            if mnum is None:
                mnum = date.today().month
    else:
        mnum = date.today().month

    lower_month = calendar.month_name[mnum].lower()

    # Filter pending payrolls for the target month (handles textual or numeric payroll_month)
    records = db.query(Payroll).filter(
        Payroll.status.ilike('%pending%'),
        or_(
            func.lower(Payroll.payroll_month) == lower_month,
            Payroll.payroll_month == str(mnum),
            Payroll.payroll_month == f"{mnum:02d}"
        )
    ).all()

    # Group pending payrolls by employee so UI can show which employees didn't get paid
    pending_by_employee = {}
    for r in records:
        # normalize status to 'paid' or 'unpaid'
        status_norm = 'paid' if r.status and 'paid' in r.status.lower() else 'unpaid'
        pending_by_employee.setdefault(r.employee_id, []).append({
            "payroll_id": r.id,
            "payroll_month": r.payroll_month,
            "status": status_norm,
            "net_salary": r.net_salary,
            "generated_date": r.generated_date
        })

    result = []
    for emp_id, items in pending_by_employee.items():
        # try to get employee name and user role
        emp = db.query(Employee).filter(Employee.employee_id == emp_id).first()
        user = None
        if emp and emp.email:
            user = db.query(User).filter(User.email == emp.email).first()

        result.append({
            "employee_id": emp_id,
            "employee_name": emp.full_name if emp else None,
            "role": user.role if user else None,
            "pending_payrolls": items
        })

    return result


# LIST ALL EMPLOYEES (for payroll management) including role from users table
@router.get("/employees")
def payroll_employees(
    db: Session = Depends(get_db),
    current_user=Depends(
        role_required(["Admin", "HR"])
    )
):
    emps = db.query(Employee).all()
    out = []
    for e in emps:
        user = db.query(User).filter(User.email == e.email).first()
        out.append({
            "employee_id": e.employee_id,
            "full_name": e.full_name,
            "email": e.email,
            "department": e.department,
            "role": user.role if user else None
        })
    return out