from typing import Optional
from pydantic import BaseModel


class NotificationCreate(BaseModel):
    user: str
    title: str
    message: str


class NotificationCreateByEmployee(BaseModel):
    title: str
    message: str


class NotificationUpdate(BaseModel):
    title: Optional[str] = None
    message: Optional[str] = None
