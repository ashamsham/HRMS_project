from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.schemas.leave import (
    LeaveCreate,
    LeaveApproval
)

from app.services.leave_service import (
    apply_leave,
    get_all_leaves,
    approve_or_reject_leave
)

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/apply")
def create_leave(
    leave: LeaveCreate,
    db: Session = Depends(get_db)
):
    return apply_leave(db, leave)


@router.get("/all")
def all_leaves(
    db: Session = Depends(get_db)
):
    return get_all_leaves(db)


@router.put("/approve/{leave_id}")
def approve_leave(
    leave_id: int,
    leave: LeaveApproval,
    db: Session = Depends(get_db)
):
    return approve_or_reject_leave(
        db,
        leave_id,
        leave
    )