from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

from app.utils.security import verify_token

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


def get_current_user(
    token: str = Depends(oauth2_scheme)
):

    payload = verify_token(token)

    return payload


def role_required(allowed_roles: list):

    def role_checker(
        current_user: dict = Depends(get_current_user)
    ):

        if current_user["role"] .lower() not in [
            role.lower() for role in allowed_roles
        ]:

            raise HTTPException(
                status_code=403,
                detail="Access denied"
            )

        return current_user

    return role_checker