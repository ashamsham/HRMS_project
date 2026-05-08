from pydantic import BaseModel

class AuditLogCreate(BaseModel):

    employee_id: str

    action: str

    module: str

    status: str