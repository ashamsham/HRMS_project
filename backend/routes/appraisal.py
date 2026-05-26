from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database import SessionLocal

from backend.schemas.appraisal import AppraisalCreate, AppraisalUpdate, SelfReview, ManagerReview

from backend.services.appraisal_service import (
    create_appraisal,
    get_all_appraisals,
    get_employee_appraisals,
    update_appraisal,
    get_appraisal_analytics
)
from backend.dependencies import get_current_user, role_required

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
    db: Session = Depends(get_db),
    current_user: dict = Depends(role_required(["Admin", "HR", "Manager"]))
):
    return create_appraisal(db, appraisal)


@router.get("/all")
def all_appraisals(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return get_all_appraisals(db)



@router.put("/update/{appraisal_id}")
def edit_appraisal(
    appraisal_id: int,
    appraisal: AppraisalUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(role_required(["Admin", "HR", "Manager"]))
):
    return update_appraisal(db, appraisal_id, appraisal)


@router.get("/analytics/summary")
def appraisal_analytics(
    db: Session = Depends(get_db),
    current_user: dict = Depends(role_required(["Admin", "HR", "Manager"]))
):
    return get_appraisal_analytics(db)




@router.get("/{employee_id}")
def employee_appraisals(
    employee_id: str,
    db: Session = Depends(get_db)
):
    return get_employee_appraisals(db, employee_id)
