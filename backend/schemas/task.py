from pydantic import BaseModel
from datetime import date
from typing import Optional


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    assigned_to: str
    due_date: date
    priority: Optional[str] = "Normal"


class TaskUpdate(BaseModel):
    status: str
