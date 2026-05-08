from app.models.asset import Asset

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