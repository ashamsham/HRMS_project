from fastapi import APIRouter, Depends
from app.database import SessionLocal
from app.schemas.user import UserCreate, UserLogin
from app.services.auth_service import register_user, login_user
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register")
def register(user: UserCreate, db=Depends(get_db)):
    return register_user(db, user)

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db=Depends(get_db)
):

    class LoginData:
        email = form_data.username
        password = form_data.password

    return login_user(db, LoginData)