from backend.models.employee import Employee
from backend.models.attendance import Attendance
from backend.utils.employee_id_generator import generate_employee_id

def create_employee(db, employee_data):

    new_employee = Employee(
        employee_id=generate_employee_id(),
        full_name=employee_data.full_name,
        department=employee_data.department,
        designation=employee_data.designation,
        joining_date=employee_data.joining_date,
        contact_number=employee_data.contact_number,
        email=employee_data.email,
        reporting_manager=employee_data.reporting_manager
    )

    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)

    return new_employee


def update_employee(db, employee_id, employee_data):
    
    employee = db.query(Employee).filter(
        Employee.employee_id == employee_id
    ).first()

    if not employee:
        return {"error": "Employee not found"}

    update_data = employee_data.dict(exclude_unset=True)

    for key, value in update_data.items():
        setattr(employee, key, value)

    db.commit()
    db.refresh(employee)

    return employee


def get_all_employees(db):
    return db.query(Employee).all()


def delete_employee(db, employee_id):
    employee = db.query(Employee).filter(
        Employee.employee_id == employee_id
    ).first()

    if not employee:
        return {"error": "Employee not found"}

    db.query(Attendance).filter(
        Attendance.employee_id == employee.id
    ).delete()

    db.delete(employee)
    db.commit()

    return {"message": "Employee deleted successfully"}