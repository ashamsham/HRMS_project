from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.schemas.asset import AssetCreate

from app.services.asset_service import (
    allocate_asset,
    get_all_assets,
    get_employee_assets,
    return_asset
)

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
    db: Session = Depends(get_db)
):
    return allocate_asset(db, asset)


@router.get("/all")
def all_assets(
    db: Session = Depends(get_db)
):
    return get_all_assets(db)


@router.get("/{employee_id}")
def employee_assets(
    employee_id: str,
    db: Session = Depends(get_db)
):
    return get_employee_assets(db, employee_id)


@router.put("/return/{asset_id}")
def asset_return(
    asset_id: int,
    return_status: str,
    damage_notes: str = None,
    db: Session = Depends(get_db)
):
    return return_asset(
        db,
        asset_id,
        return_status,
        damage_notes
    )