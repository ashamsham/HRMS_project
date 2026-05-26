# backend/services/auth_service.py

from sqlalchemy.orm import Session
from fastapi import HTTPException
import bcrypt
from backend.models.user import User
from backend.schemas.auth import UserCreate
# note: token creation is handled by the route; this module returns user instances


# ================= PASSWORD FUNCTIONS =================

def hash_password(password: str):
    # Truncate to 72 bytes and use bcrypt directly
    b = password.encode("utf-8")[:72]
    hashed = bcrypt.hashpw(b, bcrypt.gensalt())
    return hashed.decode('utf-8')

def verify_password(
    plain_password: str,
    stored_password: str,
    role: str
):

    # Admin + HR → hashed verify
    if role.lower() in ["admin", "hr"]:
        b = plain_password.encode("utf-8")[:72]
        # stored_password is stored as string; convert to bytes for bcrypt.checkpw
        return bcrypt.checkpw(b, stored_password.encode('utf-8'))

    # Employee + Manager → normal compare
    return plain_password == stored_password


#  REGISTER 

def register_user(
    db: Session,
    user: UserCreate
):

    existing = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing:

        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    password = user.password

    if user.role.lower() in ["admin", "hr"]:

        password = hash_password(
            user.password
        )

    new_user = User(

        name=user.name,

        email=user.email,

        hashed_password=password,

        role=user.role,

        department=user.department,

        is_active=True

    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {

        "success": True,

        "message": "User registered",

        "role": new_user.role
    }


# ================= LOGIN =================

def login_user(
    db: Session,
    email: str,
    password: str
):

    user = db.query(User).filter(

        User.email == email

    ).first()

    if not user:

        raise HTTPException(

            status_code=401,

            detail="Invalid Email"

        )

    valid = verify_password(

        password,

        user.hashed_password,

        user.role

    )

    if not valid:

        raise HTTPException(

            status_code=401,

            detail="Wrong Password"

        )

    role = user.role.lower()

    # Only HR and Admin allowed

    if role not in [

        "admin",

        "hr"

    ]:

        raise HTTPException(

            status_code=403,

            detail=(
                "Only HR and Admin "
                "can access HRMS"
            )

        )
    # return the user model for the route to generate a token
    return user