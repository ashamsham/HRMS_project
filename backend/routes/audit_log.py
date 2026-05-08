from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.schemas.audit_log import AuditLogCreate

from app.services.audit_log import (
    create_audit_log,
    get_all_logs,
    get_employee_logs
)

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
    db: Session = Depends(get_db)
):
    return get_all_logs(db)


@router.get("/{employee_id}")
def employee_logs(
    employee_id: str,
    db: Session = Depends(get_db)
):
    return get_employee_logs(db, employee_id)