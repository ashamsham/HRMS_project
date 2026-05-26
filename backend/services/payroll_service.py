from fastapi import HTTPException
from backend.models.payroll import Payroll
from backend.models.employee import Employee


# CREATE SALARY
def create_salary(db, payroll_data):
    
    employee = db.query(Employee).filter(
        Employee.employee_id == payroll_data.employee_id
    ).first()

    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    net_salary = (
        payroll_data.basic_salary
        + payroll_data.allowances
        - payroll_data.deductions
        - payroll_data.tax
        - payroll_data.pf
    )

    payroll_month = payroll_data.payroll_month
    if isinstance(payroll_month, str) and payroll_month.isdigit():
        month_num = int(payroll_month)
        if 1 <= month_num <= 12:
            payroll_month = f"{month_num:02d}"

    payroll = Payroll(
        employee_id=payroll_data.employee_id,
        payroll_month=payroll_month,
        basic_salary=payroll_data.basic_salary,
        allowances=payroll_data.allowances,
        deductions=payroll_data.deductions,
        tax=payroll_data.tax,
        pf=payroll_data.pf,
        net_salary=net_salary,
        status=payroll_data.status,
        generated_date=payroll_data.generated_date
    )

    db.add(payroll)
    db.commit()
    db.refresh(payroll)

    return payroll


# GET ALL PAYROLLS
def get_all_payrolls(db):

    return db.query(Payroll).all()


# PAY SALARY
def pay_salary(db, payroll_id):

    payroll = db.query(Payroll).filter(
        Payroll.id == payroll_id
    ).first()

    if not payroll:
        raise HTTPException(
            status_code=404,
            detail="Payroll not found"
        )

    payroll.status = "Paid"

    db.commit()

    return {

        "message": "Salary paid successfully"
    }