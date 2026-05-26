from sqlalchemy import Column, Integer, String, Date, DateTime
from backend.database import Base
from datetime import datetime

class Holiday(Base):

    __tablename__ = "holidays"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    holiday_date = Column(Date, nullable=False)

    description = Column(String(255))

    created_at = Column(DateTime, default=datetime.utcnow)