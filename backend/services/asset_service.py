from backend.models.asset import Asset
from sqlalchemy import func

def allocate_asset(db, asset_data):

    new_asset = Asset(
        employee_id=asset_data.employee_id,
        asset_type=asset_data.asset_type,
        asset_name=asset_data.asset_name,
        asset_serial_number=asset_data.asset_serial_number,
        allocated_date=asset_data.allocated_date,
        return_date=asset_data.return_date,
        return_status=asset_data.return_status,
        damage_notes=asset_data.damage_notes
    )

    db.add(new_asset)
    db.commit()
    db.refresh(new_asset)

    return new_asset


def get_all_assets(db):

    return db.query(Asset).all()


def get_employee_assets(db, employee_id):

    return db.query(Asset).filter(
        Asset.employee_id == employee_id
    ).all()


def return_asset(db, asset_id, return_status, damage_notes=None):

    asset = db.query(Asset).filter(
        Asset.id == asset_id
    ).first()

    if not asset:
        return {"error": "Asset not found"}

    asset.return_status = return_status
    asset.damage_notes = damage_notes

    db.commit()
    db.refresh(asset)

    return asset


def get_asset_by_id(db, asset_id):
    """Get asset by ID"""
    return db.query(Asset).filter(Asset.id == asset_id).first()


def update_asset(db, asset_id, asset_data):
    """Update asset information"""
    asset = db.query(Asset).filter(Asset.id == asset_id).first()

    if not asset:
        return {"error": "Asset not found"}

    update_data = asset_data.dict(exclude_unset=True)

    for key, value in update_data.items():
        setattr(asset, key, value)

    db.commit()
    db.refresh(asset)

    return asset


def get_asset_analytics(db):
    """Get asset analytics for dashboard"""
    total_assets = db.query(func.count(Asset.id)).scalar()

    asset_types = db.query(
        Asset.asset_type,
        func.count(Asset.id)
    ).group_by(Asset.asset_type).all()

    allocated_assets = db.query(func.count(Asset.id)).filter(
        Asset.return_status == "allocated"
    ).scalar()

    returned_assets = db.query(func.count(Asset.id)).filter(
        Asset.return_status == "returned"
    ).scalar()

    damaged_assets = db.query(func.count(Asset.id)).filter(
        Asset.damage_notes.isnot(None)
    ).scalar()

    return {
        "total_assets": total_assets,
        "asset_types": dict(asset_types),
        "allocated_assets": allocated_assets,
        "returned_assets": returned_assets,
        "damaged_assets": damaged_assets
    }


def get_overdue_assets(db):
    """Get assets that are overdue for return"""
    from datetime import date

    today = date.today()
    return db.query(Asset).filter(
        Asset.return_date < today,
        Asset.return_status == "allocated"
    ).all()
