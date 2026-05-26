import uuid

def generate_employee_id():
    return f"EMP-{str(uuid.uuid4())[:8]}"