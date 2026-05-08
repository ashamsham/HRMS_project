from app.models.payroll import Payroll

from app.utils.payroll_calculator import (
    calculate_net_salary
)

def create_payroll(db, payroll_data):

    net_salary = calculate_net_salary(
        payroll_data.basic_salary,
        payroll_data.allowances,
        payroll_data.deductions,
        payroll_data.tax,
        payroll_data.pf
    )

    new_payroll = Payroll(
        employee_id=payroll_data.employee_id,
        payroll_month=payroll_data.payroll_month,
        basic_salary=payroll_data.basic_salary,
        allowances=payroll_data.allowances,
        deductions=payroll_data.deductions,
        tax=payroll_data.tax,
        pf=payroll_data.pf,
        net_salary=net_salary,
        generated_date=payroll_data.generated_date
    )

    db.add(new_payroll)
    db.commit()
    db.refresh(new_payroll)

    return new_payroll


def get_all_payrolls(db):

    return db.query(Payroll).all()


def get_employee_payroll(db, employee_id):

    return db.query(Payroll).filter(
        Payroll.employee_id == employee_id
    ).all()