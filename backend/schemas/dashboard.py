from pydantic import BaseModel

class DashboardStats(BaseModel):

    total_employees: int

    total_attendance: int

    total_leaves: int