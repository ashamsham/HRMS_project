from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.schemas.task import TaskCreate, TaskUpdate
from backend.services.task_service import (
    assign_task,
    get_tasks_for_employee,
    get_tasks_for_manager,
    update_task_status
)
from backend.dependencies import get_current_user, role_required
from backend.models.employee import Employee

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/assign")
def assign_task_to_employee(
    task_data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(role_required(["Manager"]))
):
    employee = db.query(Employee).filter(Employee.employee_id == task_data.assigned_to).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Assigned employee not found")

    return assign_task(db, task_data, current_user["user_id"])


@router.get("/my-tasks")
def my_tasks(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"].lower() != "employee":
        return []

    employee = db.query(Employee).filter(Employee.id == current_user["user_id"]).first()
    if not employee:
        return []

    return get_tasks_for_employee(db, employee.employee_id)


@router.get("/team-tasks")
def team_tasks(
    db: Session = Depends(get_db),
    current_user: dict = Depends(role_required(["Manager"]))
):
    return get_tasks_for_manager(db, current_user["user_id"])


@router.put("/status/{task_id}")
def change_task_status(
    task_id: int,
    task_update: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    task = update_task_status(db, task_id, task_update.status)
    if isinstance(task, dict) and task.get("error"):
        raise HTTPException(status_code=404, detail=task["error"])
    return task
