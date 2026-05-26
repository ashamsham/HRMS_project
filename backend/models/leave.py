from sqlalchemy import Column, Integer, String, Date
from backend.database import Base


class Leave(Base):

    __tablename__ = "leaves"

    id = Column(Integer, primary_key=True, index=True)

    employee_name = Column(String(100), nullable=False)

    employee_id = Column(String(50))

    leave_type = Column(String(50))

    start_date = Column(Date)

    end_date = Column(Date)

    reason = Column(String(500))

    status = Column(String(20), default="Pending")
    