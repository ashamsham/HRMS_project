from pydantic import BaseModel
from typing import Optional

class AuditLogCreate(BaseModel):

    employee_id: str

    action: str

    module: str

    status: str

    details: Optional[str] = None