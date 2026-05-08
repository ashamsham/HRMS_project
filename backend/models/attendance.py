from sqlalchemy import Column, Integer, String, Date, Time
from app.database import Base

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)

    employee_id = Column(String(20), nullable=False)

    attendance_date = Column(Date, nullable=False)

    check_in = Column(Time)

    check_out = Column(Time)

    status = Column(String(50))

    late_mark = Column(String(10))

    overtime_hours = Column(Integer, default=0)