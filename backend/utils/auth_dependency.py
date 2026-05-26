from fastapi import Depends
from fastapi import HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from backend.utils.jwt_handler import verify_token


# Use HTTP Bearer so Swagger UI shows a simple Bearer token input
bearer_scheme = HTTPBearer()


def get_current_user(

    creds: HTTPAuthorizationCredentials = Depends(bearer_scheme)

):

    if not creds or not creds.credentials:
        raise HTTPException(
            status_code=401,
            detail=(
                "Not authenticated. Obtain a token from POST /auth/login and "
                "then click 'Authorize' in Swagger and paste the bearer token."
            ),
        )

    token = creds.credentials

    payload = verify_token(token)

    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")

    return payload