from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database import SessionLocal
from backend.dependencies import role_required

from backend.services.dashboard_service import (
    dashboard_data
)

router = APIRouter()


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# DASHBOARD
@router.get("/")
def dashboard(

    db: Session = Depends(get_db),

    current_user=Depends(
        role_required(["Admin", "HR"])
    )
):

    return dashboard_data(db)