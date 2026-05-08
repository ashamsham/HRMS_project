from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from fastapi import HTTPException, status


pwd_context = CryptContext(
    schemes=["bcrypt"], 
    deprecated="auto")


SECRET_KEY="supersecretkey" 

ALGORITHM="HS256"


ACCESS_TOKEN_EXPIRE_MINUTES = 60



def hash_password(password):
    return pwd_context.hash(password)


def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})

    return jwt.encode(
        to_encode,
        SECRET_KEY, 
        algorithm=ALGORITHM
    )

def verify_token(token: str):
    
    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except JWTError:

        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )