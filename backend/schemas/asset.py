from pydantic import BaseModel
from datetime import date
from typing import Optional

class AssetCreate(BaseModel):

    employee_id: str

    asset_type: str

    asset_name: str

    asset_serial_number: str

    allocated_date: date

    return_date: Optional[date] = None

    return_status: Optional[str] = "Not Returned"

    damage_notes: Optional[str] = None