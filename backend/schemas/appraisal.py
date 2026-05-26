from pydantic import BaseModel
from datetime import date
from typing import Optional

class AppraisalCreate(BaseModel):
    employee_id: str
    review_period: str
    goals: Optional[str] = None
    self_review: Optional[str] = None
    manager_review: Optional[str] = None
    rating: Optional[float] = None
    comments: Optional[str] = None
    promotion_recommendation: Optional[str] = None
    review_date: date

class AppraisalUpdate(BaseModel):
    goals: Optional[str] = None
    self_review: Optional[str] = None
    manager_review: Optional[str] = None
    rating: Optional[float] = None
    comments: Optional[str] = None
    promotion_recommendation: Optional[str] = None

class SelfReview(BaseModel):
    appraisal_id: int
    self_review: str
    goals_achieved: Optional[str] = None

class ManagerReview(BaseModel):
    appraisal_id: int
    manager_review: str
    rating: float
    promotion_recommendation: Optional[str] = None
    comments: Optional[str] = None
    
class Config:
    from_attributes = True
