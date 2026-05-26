from pydantic import BaseModel
from datetime import date

class HolidayCreate(BaseModel):
    holiday_name: str
    holiday_date: date