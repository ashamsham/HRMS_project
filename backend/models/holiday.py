from sqlalchemy import Column, Integer, String, Date
from app.database import Base

class Holiday(Base):
    __tablename__ = "holidays"


    holiday_name = Column(String(100), nullable=False)

    holiday_date = Column(Date, nullable=False)