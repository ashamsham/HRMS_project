from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database import SessionLocal

from backend.dependencies import (
    role_required,
    get_current_user
)

from backend.schemas.employee import (
    EmployeeCreate,
    EmployeeUpdate
)
from backend.schemas.employee import EmployeeResponse

from backend.services.employee_service import (
    create_employee,
    get_all_employees,
    delete_employee,
    update_employee
)

router = APIRouter()


# DATABASE CONNECTION
def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# ADD EMPLOYEE
# ACCESS: Admin, HR
@router.post("/add", response_model=EmployeeResponse)
def add_employee(

    employee: EmployeeCreate,

    db: Session = Depends(get_db),

    current_user = Depends(
        role_required(["Admin", "HR"])
    )
):

    return create_employee(db, employee)


# VIEW ALL EMPLOYEES
# ACCESS: Admin, HR, Manager
@router.get("/all", response_model=list[EmployeeResponse])
def all_employees(

    db: Session = Depends(get_db),

    current_user = Depends(
        role_required(["Admin", "HR", "Manager"])
    )
):

    return get_all_employees(db)


# UPDATE EMPLOYEE
# ACCESS: Admin, HR
@router.put("/update/{employee_id}", response_model=EmployeeResponse)
def edit_employee(

    employee_id: str,

    employee: EmployeeUpdate,

    db: Session = Depends(get_db),

    current_user = Depends(
        role_required(["Admin", "HR"])
    )
):

    return update_employee(
        db,
        employee_id,
        employee
    )


# DELETE EMPLOYEE
# ACCESS: Admin ONLY
@router.delete("/delete/{employee_id}")
def remove_employee(

    employee_id: str,

    db: Session = Depends(get_db),

    current_user = Depends(
        role_required(["Admin"])
    )
):

    return delete_employee(
        db,
        employee_id
    )