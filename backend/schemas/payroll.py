from pydantic import BaseModel
from datetime import date

class PayrollCreate(BaseModel):

    employee_id: str

    payroll_month: str

    basic_salary: float

    allowances: float

    deductions: float

    tax: float

    pf: float

    generated_date: date