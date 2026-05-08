from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.schemas.payroll import PayrollCreate

from app.services.payroll_service import (
    create_payroll,
    get_all_payrolls,
    get_employee_payroll
)

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/generate")
def generate_payroll(
    payroll: PayrollCreate,
    db: Session = Depends(get_db)
):
    return create_payroll(db, payroll)


@router.get("/all")
def all_payrolls(
    db: Session = Depends(get_db)
):
    return get_all_payrolls(db)


@router.get("/{employee_id}")
def employee_payroll(
    employee_id: str,
    db: Session = Depends(get_db)
):
    return get_employee_payroll(db, employee_id)