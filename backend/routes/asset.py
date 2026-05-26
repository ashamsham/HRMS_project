from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database import SessionLocal

from backend.schemas.asset import AssetCreate, AssetUpdate

from backend.services.asset_service import (
    allocate_asset,
    get_all_assets,
    get_employee_assets,
    return_asset,
    get_asset_by_id,
    update_asset,
    get_asset_analytics,
    get_overdue_assets
)
from backend.dependencies import role_required

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/allocate")
def create_asset(
    asset: AssetCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(role_required(["Admin", "HR"]))
):
    return allocate_asset(db, asset)


@router.get("/all")
def all_assets(
    db: Session = Depends(get_db)
):
    return get_all_assets(db)




@router.put("/return/{asset_id}")
def asset_return(
    asset_id: int,
    return_status: str,
    damage_notes: str = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(role_required(["Admin", "HR"]))
):
    return return_asset(
        db,
        asset_id,
        return_status,
        damage_notes
    )


@router.put("/update/{asset_id}")
def update_asset_endpoint(
    asset_id: int,
    asset: AssetUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(role_required(["Admin", "HR"]))
):
    return update_asset(db, asset_id, asset)


@router.get("/analytics/summary")
def asset_analytics(
    db: Session = Depends(get_db),
    current_user: dict = Depends(role_required(["Admin", "HR"]))
):
    return get_asset_analytics(db)


@router.get("/overdue/list")
def overdue_assets(
    db: Session = Depends(get_db),
    current_user: dict = Depends(role_required(["Admin", "HR"]))
):
    return get_overdue_assets(db)



@router.get("/{employee_id}")
def employee_assets(
    employee_id: str,
    db: Session = Depends(get_db)
):
    return get_employee_assets(db, employee_id)