from backend.models.task import Task


def assign_task(db, task_data, assigned_by):
    new_task = Task(
        title=task_data.title,
        description=task_data.description,
        assigned_to=task_data.assigned_to,
        assigned_by=str(assigned_by),
        due_date=task_data.due_date,
        priority=task_data.priority
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task


def get_tasks_for_employee(db, employee_identifier):
    return db.query(Task).filter(Task.assigned_to == employee_identifier).all()


def get_tasks_for_manager(db, manager_id):
    return db.query(Task).filter(Task.assigned_by == str(manager_id)).all()


def update_task_status(db, task_id, status):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return {"error": "Task not found"}
    task.status = status
    db.commit()
    db.refresh(task)
    return task
