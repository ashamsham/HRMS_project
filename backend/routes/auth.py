from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.services.auth_service import login_user
from backend.utils.jwt_handler import create_access_token
from backend.models.employee import Employee
from backend.services.auth_service import register_user
from backend.schemas.auth import UserCreate
from fastapi import Request
from backend.utils.jwt_handler import verify_token
from backend.models.user import User
from sqlalchemy.orm import Session

router = APIRouter()


@router.post("/login")
def login(

    form_data: OAuth2PasswordRequestForm = Depends(),

    db: Session = Depends(get_db)

):

    user = login_user(

        db,

        form_data.username,

        form_data.password

    )

    if not user:

        raise HTTPException(

            status_code=401,

            detail="Invalid email or password"

        )

    # Only Admin and HR allowed

    allowed_roles = [

        "admin",

        "hr"

    ]

    if user.role.lower() not in allowed_roles:

        raise HTTPException(

            status_code=403,

            detail="Access denied. Only HR and Admin can login."

        )

    token = create_access_token(

        data={

            "sub": user.email,

            "role": user.role,

            "employee_id": None if user is None else (
                (db.query(Employee).filter(Employee.email == user.email).first().employee_id)
                if db.query(Employee).filter(Employee.email == user.email).first() is not None
                else None
            )

        }

    )

    return {

        "access_token": token,

        "token_type": "bearer",

        "role": user.role,

        "employee_id": None if user is None else (
            (db.query(Employee).filter(Employee.email == user.email).first().employee_id)
            if db.query(Employee).filter(Employee.email == user.email).first() is not None
            else None
        )

    }

@router.post("/register")
def register(
    user: UserCreate,
    db: Session = Depends(get_db),
    request: Request = None
):
    # If no users exist yet, allow bootstrap registration (create first admin/hr)
    total_users = db.query(User).count()
    if total_users == 0:
        return register_user(db, user)

    # Otherwise require Authorization header with Bearer token
    auth = None
    if request is not None:
        auth = request.headers.get("authorization") or request.headers.get("Authorization")

    if not auth:
        raise HTTPException(
            status_code=401,
            detail=(
                "Not authenticated. Obtain a token from POST /auth/login and "
                "then click 'Authorize' in Swagger and paste the bearer token."
            ),
        )

    parts = auth.split()
    if len(parts) == 1:
        token = parts[0]
    elif len(parts) == 2 and parts[0].lower() == "bearer":
        token = parts[1]
    else:
        raise HTTPException(status_code=401, detail="Invalid authorization header format")

    payload = verify_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")

    role = payload.get("role", "").lower()
    if role not in ["admin", "hr"]:
        raise HTTPException(status_code=403, detail="Only Admin and HR can register users")

    allowed_roles = ["employee", "manager", "hr", "admin"]
    if user.role.lower() not in allowed_roles:
        raise HTTPException(status_code=400, detail="Invalid role for new user")

    return register_user(db, user)