from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime

from app.database import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)

    employee_id = Column(String(20), nullable=False)

    title = Column(String(255), nullable=False)

    message = Column(String(500), nullable=False)

    is_read = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)