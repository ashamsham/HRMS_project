from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.schemas.employee import EmployeeCreate,EmployeeUpdate
from app.services.employee_service import (
    create_employee,
    get_all_employees,
    delete_employee,
    update_employee
)
from app.dependencies import (
    get_current_user,
    role_required
)

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/add")
def add_employee(
    employee: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        role_required(["Admin", "HR"])
    )
):
    return create_employee(db, employee)



@router.get("/all")
def all_employees(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        get_current_user
    )
):
    return get_all_employees(db)


@router.put("/update/{employee_id}")
def edit_employee(
    employee_id: str,
    employee: EmployeeUpdate,
    db: Session = Depends(get_db)
):
    return update_employee(db, employee_id, employee)


@router.delete("/delete/{employee_id}")
def remove_employee(
    employee_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        role_required(["Admin"])
    )
):
    return delete_employee(db, employee_id)