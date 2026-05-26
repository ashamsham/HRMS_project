from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

from backend.utils.jwt_handler import verify_token

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


# GET CURRENT USER
def get_current_user(

    token: str = Depends(
        oauth2_scheme
    )

):

    payload = verify_token(token)

    if payload is None:

        raise HTTPException(

            status_code=401,

            detail="Invalid token"

        )

    return payload


# ROLE CHECKER
def role_required(

    allowed_roles: list

):

    def role_checker(

        current_user: dict = Depends(
            get_current_user
        )

    ):

        user_role = current_user.get(
            "role",
            ""
        ).lower()

        allowed = [

            role.lower()

            for role in allowed_roles

        ]

        if user_role not in allowed:

            raise HTTPException(

                status_code=403,

                detail="Access denied"

            )

        return current_user

    return role_checker