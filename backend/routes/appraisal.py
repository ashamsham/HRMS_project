from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.schemas.appraisal import AppraisalCreate

from app.services.appraisal_service import (
    create_appraisal,
    get_all_appraisals,
    get_employee_appraisals
)

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/create")
def add_appraisal(
    appraisal: AppraisalCreate,
    db: Session = Depends(get_db)
):
    return create_appraisal(db, appraisal)


@router.get("/all")
def all_appraisals(
    db: Session = Depends(get_db)
):
    return get_all_appraisals(db)


@router.get("/{employee_id}")
def employee_appraisals(
    employee_id: str,
    db: Session = Depends(get_db)
):
    return get_employee_appraisals(db, employee_id)