from app.models.user import User
from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token
)

def register_user(db, user_data):

    new_user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        role=user_data.role,
        department=user_data.department
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully"
    }


def login_user(db, login_data):

    user = db.query(User).filter(
        User.email == login_data.email
    ).first()

    if not user:
        return {
            "error": "Invalid credentials"
        }

    if not verify_password(
        login_data.password,
        user.hashed_password
    ):
        return {
            "error": "Invalid credentials"
        }

    token = create_access_token({
        "user_id": user.id,
        "role": user.role
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }