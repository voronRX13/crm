from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app import auth_utils
from app.models import User
from app.schemas.user import UserLogin

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"],
)

@router.post("/login")
async def login(user_credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    user = await db.scalar(
        select(User).where(User.username == user_credentials.username)
    )
    if not user or not auth_utils.verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")
    
    token = auth_utils.create_access_token(data={"sub": user.username})
    return {"access_token": token}