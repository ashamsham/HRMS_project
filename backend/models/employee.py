from sqlalchemy import Column, Integer, String, Date
from app.database import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)

    employee_id = Column(String(20), unique=True, nullable=False)

    full_name = Column(String(100), nullable=False)

    department = Column(String(100), nullable=False)

    designation = Column(String(100), nullable=False)

    joining_date = Column(Date)

    contact_number = Column(String(20))

    email = Column(String(100), unique=True)

    reporting_manager = Column(String(100))

    
