from pydantic import BaseModel

class NotificationCreate(BaseModel):

    employee_id: str

    title: str

    message: str