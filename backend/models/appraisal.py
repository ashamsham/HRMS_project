from sqlalchemy import Column, Integer, String, Text, Float, Date
from backend.database import Base
from backend.models.base_model import TimestampMixin

class Appraisal(Base,TimestampMixin):
    
    __tablename__ = "appraisals"

    id = Column(Integer, primary_key=True, index=True)

    employee_id = Column(String(20), nullable=False)

    review_period = Column(String(50), nullable=False)

    goals = Column(Text)

    self_review = Column(Text)

    manager_review = Column(Text)

    rating = Column(Float)

    comments = Column(Text)

    promotion_recommendation = Column(String(10))

    review_date = Column(Date)