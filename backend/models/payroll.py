from sqlalchemy import Column, Integer, String, Float, Date
from backend.database import Base
from backend.models.base_model import TimestampMixin

class Payroll(Base,TimestampMixin):
    __tablename__ = "payrolls"

    id = Column(Integer, primary_key=True, index=True)

    employee_id = Column(String(20), nullable=False)

    payroll_month = Column(String(20), nullable=False)

    basic_salary = Column(Float, nullable=False)

    allowances = Column(Float, default=0)

    deductions = Column(Float, default=0)

    tax = Column(Float, default=0)

    pf = Column(Float, default=0)

    net_salary = Column(Float, nullable=False)

    status = Column(String(20), default="Pending")

    generated_date = Column(Date)