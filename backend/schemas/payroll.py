from pydantic import BaseModel, ConfigDict, field_validator
from datetime import date, datetime


class PayrollCreate(BaseModel):

    employee_id: str

    payroll_month: str

    basic_salary: float

    allowances: float

    deductions: float

    tax: float

    pf: float

    status: str = "Pending"

    generated_date: date

    model_config = ConfigDict(arbitrary_types_allowed=True)

    @field_validator("payroll_month", mode="before")
    def normalize_payroll_month(cls, value):
        if isinstance(value, int):
            if 1 <= value <= 12:
                return f"{value:02d}"
            raise ValueError("payroll_month must be a month number between 1 and 12")
        if isinstance(value, str):
            if value.isdigit():
                month_num = int(value)
                if 1 <= month_num <= 12:
                    return f"{month_num:02d}"
            # allow textual month names? convert to digits if possible
            value_lower = value.strip().lower()
            import calendar
            for i, name in enumerate(calendar.month_name[1:], 1):
                if name.lower() == value_lower:
                    return f"{i:02d}"
            return value
        raise ValueError("payroll_month must be a month number or name")


class PayrollResponse(BaseModel):

    id: int

    employee_id: str

    payroll_month: str

    basic_salary: float

    allowances: float

    deductions: float

    tax: float

    pf: float

    net_salary: float

    status: str

    generated_date: date

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)