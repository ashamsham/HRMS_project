from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from backend.database import SessionLocal

from backend.dependencies import (
    get_current_user,
    role_required
)

from backend.schemas.leave import (
    LeaveCreate,
    LeaveApproval,
    LeaveUpdate,
    LeaveResponse
)

from backend.services.leave_service import (
    apply_leave,
    approve_leave,
    get_all_leaves,
    reject_leave,
    update_leave
)

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ALL USERS CAN APPLY
@router.post("/apply", response_model=LeaveResponse)
def create_leave(
    leave: LeaveCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return apply_leave(db, leave)


# HR + ADMIN APPROVAL
@router.put("/approve/{leave_id}", response_model=LeaveResponse)
def leave_approval(
    leave_id: int,
    approval: LeaveApproval,
    db: Session = Depends(get_db),
    current_user=Depends(
        role_required(["Admin", "HR"])
    )
):
    return approve_leave(db, leave_id, approval.status)


# HR + ADMIN UPDATE
@router.put("/update/{leave_id}", response_model=LeaveResponse)
def update_leave_request(
    leave_id: int,
    leave: LeaveUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(
        role_required(["Admin", "HR"])
    )
):
    return update_leave(db, leave_id, leave)


# HR + ADMIN REJECT
@router.put("/reject/{leave_id}", response_model=LeaveResponse)
def reject_leave_request(
    leave_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(
        role_required(["Admin", "HR"])
    )
):
    return reject_leave(db, leave_id)


# HR + ADMIN CAN VIEW
@router.get("/all", response_model=List[LeaveResponse])
def all_leaves(
    db: Session = Depends(get_db),
    current_user=Depends(
        role_required(["Admin", "HR"])
    )
):
    return get_all_leaves(db)
