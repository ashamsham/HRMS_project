from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from backend.database import SessionLocal

from backend.schemas.audit_log import AuditLogCreate

from backend.services.audit_log import (
    create_audit_log,
    get_all_logs,
    get_employee_logs,
    get_logs_by_module,
    get_logs_by_date_range,
    get_audit_analytics
)
from backend.dependencies import role_required

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/create")
def add_audit_log(
    audit: AuditLogCreate,
    db: Session = Depends(get_db)
):
    return create_audit_log(db, audit)


@router.get("/all")
def all_logs(
    db: Session = Depends(get_db),
    current_user: dict = Depends(role_required(["Admin"]))
):
    return get_all_logs(db)



@router.get("/module/{module}")
def logs_by_module(
    module: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(role_required(["Admin"]))
):
    return get_logs_by_module(db, module)


@router.get("/analytics/summary")
def audit_analytics(
    db: Session = Depends(get_db),
    current_user: dict = Depends(role_required(["Admin"]))
):
    return get_audit_analytics(db)


@router.get("/date-range/{start_date}/{end_date}")
def logs_by_date_range(
    start_date: str,
    end_date: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(role_required(["Admin"]))
):
    try:
        start = datetime.fromisoformat(start_date)
        end = datetime.fromisoformat(end_date)
        return get_logs_by_date_range(db, start, end)
    except ValueError:
        return {"error": "Invalid date format. Use ISO format (YYYY-MM-DDTHH:MM:SS)"}


@router.get("/{employee_id}")
def employee_logs(
    employee_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(role_required(["Admin", "HR"]))
):
    return get_employee_logs(db, employee_id)
