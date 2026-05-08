from fastapi import FastAPI
from app.database import engine, Base
from app.routes import (
    auth,
    employee,
    attendance,
    leave,
    dashboard,
    payroll,
    appraisal,
    asset,
    notification,
    audit_log)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="HRMS API")

app.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication"]
)

app.include_router(
    employee.router,
    prefix="/employee",
    tags=["Employee Management"]
)

app.include_router(
    attendance.router,
    prefix="/attendance",
    tags=["Attendance Management"]
)

app.include_router(
    leave.router,
    prefix="/leave",
    tags=["Leave Management"]
)

app.include_router(
    dashboard.router,
    prefix="/dashboard",
    tags=["Reports & Dashboard"]
)

app.include_router(
    payroll.router,
    prefix="/payroll",
    tags=["Payroll Management"]
)

app.include_router(
    appraisal.router,
    prefix="/appraisal",
    tags=["Appraisal Management"]
)

app.include_router(
    asset.router,
    prefix="/asset",
    tags=["Asset Management"]
)

app.include_router(
    notification.router
)

app.include_router(
    audit_log.router,
    prefix="/audit-log",
    tags=["Audit Logs"]
)



@app.get("/")
def home():
    return {"message": "HRMS Backend Started Successfully"}

 