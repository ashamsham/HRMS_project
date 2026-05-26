from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database import SessionLocal
from backend.dependencies import role_required

from backend.services.report_service import (
    generate_reports
)

router = APIRouter()


# DATABASE CONNECTION
def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# REPORT API
# ONLY ADMIN + HR CAN ACCESS
@router.get("/")
def reports(

    db: Session = Depends(get_db),

    current_user=Depends(
        role_required(["Admin", "HR"])
    )
):

    return generate_reports(db)
