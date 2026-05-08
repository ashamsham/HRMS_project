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