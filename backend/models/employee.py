from sqlalchemy import (
    Column,
    Integer,
    String,
    Date
)

from backend.database import Base

from backend.models.base_model import TimestampMixin
from sqlalchemy.orm import relationship


class Employee(Base, TimestampMixin):

    __tablename__ = "employees"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    employee_id = Column(
        String(50),
        unique=True
    )

    full_name = Column(String(100))

    department = Column(String(100))

    designation = Column(String(100))

    joining_date = Column(Date)

    contact_number = Column(String(20))

    email = Column(String(100),unique=True)

    password=Column(String(255) 
    )

    reporting_manager = Column(String(100))
