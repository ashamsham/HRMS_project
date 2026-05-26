from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.requests import Request
from fastapi.middleware.cors import CORSMiddleware

from backend.database import Base, engine


# IMPORT ROUTES

from backend.routes import (
    auth,
    employee,
    attendance,
    leave,
    payroll,
    appraisal,
    asset,
    dashboard,
    notification,
    audit_log,
    holiday,
    reports
)

# CREATE DATABASE TABLES
Base.metadata.create_all(bind=engine)

# CREATE FASTAPI APP
backend = FastAPI(

    title="HRMS API",

    description="Human Resource Management System Backend API",

    version="1.0.0"
)

# CORS
backend.add_middleware(

    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

# ================= AUTH =================

backend.include_router(

    auth.router,

    prefix="/auth",

    tags=["Authentication"]
)

# ================= EMPLOYEE =================

backend.include_router(

    employee.router,

    prefix="/employee",

    tags=["Employee Management"]
)

# ================= ATTENDANCE =================

backend.include_router(

    attendance.router,

    prefix="/attendance",

    tags=["Attendance Management"]
)

# ================= LEAVE =================

backend.include_router(

    leave.router,

    prefix="/leave",

    tags=["Leave Management"]
)

# ================= PAYROLL =================

backend.include_router(

    payroll.router,

    prefix="/payroll",

    tags=["Payroll Management"]
)

# ================= APPRAISAL =================

backend.include_router(

    appraisal.router,

    prefix="/appraisal",

    tags=["Appraisal Management"]
)

# ================= ASSET =================

backend.include_router(

    asset.router,

    prefix="/asset",

    tags=["Asset Management"]
)

# ================= DASHBOARD =================

backend.include_router(

    dashboard.router,

    prefix="/dashboard",

    tags=["Dashboard"]
)

# ================= NOTIFICATION =================

backend.include_router(

    notification.router,

    prefix="/notification",

    tags=["Notification"]
)

# ================= AUDIT LOG =================

backend.include_router(

    audit_log.router,

    prefix="/audit-log",

    tags=["Audit Logs"]
)

# ================= HOLIDAY =================

backend.include_router(

    holiday.router,

    prefix="/holidays",

    tags=["Holiday Calendar"]
)

# ================= REPORTS =================

backend.include_router(

    reports.router,

    prefix="/reports",

    tags=["Reports"]
)

# ================= GLOBAL ERROR =================

@backend.exception_handler(Exception)
async def global_exception_handler(

    request: Request,

    exc: Exception
):

    return JSONResponse(

        status_code=500,

        content={

            "success": False,

            "message": str(exc)
        }
    )

# ================= ROOT API =================

@backend.get("/")
def home():

    return {

        "success": True,

        "message": "HRMS Backend Running Successfully",

    }

# ================= HEALTH CHECK =================

@backend.get("/health")
def health_check():

    return {

        "status": "OK",

        "server": "Running"
    }