from sqlalchemy import Column, Integer, String, Date, Text
from app.database import Base

class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    
    employee_id = Column(String(20), nullable=False)

    asset_type = Column(String(100), nullable=False)

    asset_name = Column(String(100), nullable=False)

    asset_serial_number = Column(String(100), unique=True)

    allocated_date = Column(Date)

    return_date = Column(Date, nullable=True)

    return_status = Column(String(50), default="Not Returned")

    damage_notes = Column(Text, nullable=True)