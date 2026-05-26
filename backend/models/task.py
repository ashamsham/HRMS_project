from sqlalchemy import Column, Integer, String, Date
from backend.database import Base
from backend.models.base_model import TimestampMixin


class Task(Base, TimestampMixin):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(String(500))
    assigned_to = Column(String(20), nullable=False)
    assigned_by = Column(String(20), nullable=True)
    due_date = Column(Date, nullable=True)
    status = Column(String(50), default="Pending")
    priority = Column(String(50), default="Normal")
