from sqlalchemy import Column,Integer,String,Date,Time,Float,ForeignKey
from backend.database import Base

class Attendance(Base):

    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True)

    employee_id = Column(
        String(50),
        ForeignKey("employees.employee_id")
    )

    attendance_date = Column(Date)

    check_in = Column(Time)

    check_out = Column(Time)

    status = Column(String(50))

    late_mark = Column(
        String(10),
        default="no"
    )

    overtime_hours = Column(
        Float,
        default=0
    )