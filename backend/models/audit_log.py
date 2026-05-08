from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from app.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)

    employee_id = Column(String(20), nullable=False)

    action = Column(String(255), nullable=False)

    module = Column(String(100), nullable=False)

    status = Column(String(50), nullable=False)

    timestamp = Column(DateTime, default=datetime.utcnow)