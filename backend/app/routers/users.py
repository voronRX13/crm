from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app import models, auth_utils
from app.schemas.user import UserCreate, UserUpdate, UserRead

router = APIRouter(
    prefix="/api/users",
    tags=["users"],
)

# ✅ Создать пользователя через POST /api/users
@router.post("", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def create_user(data: UserCreate, db: AsyncSession = Depends(get_db)):
    existing_user = await db.scalar(
        select(models.User).where(models.User.username == data.username)
    )
    if existing_user:
        raise HTTPException(status_code=400, detail="Пользователь с таким именем уже существует")

    hashed_password = auth_utils.hash_password(data.password)

    new_user = models.User(
        username=data.username,
        hashed_password=hashed_password,
        account_type=data.account_type,
        first_name=data.first_name,
        name=data.name,
        birth_date=data.birth_date,
        phone=data.phone,
        email=data.email,
        department=data.department,
        position=data.position,
        status=data.status,
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

# ✅ Получить всех пользователей
@router.get("", response_model=list[UserRead])
async def list_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.User))
    return result.scalars().all()

# ✅ Получить одного пользователя
@router.get("/{user_id}", response_model=UserRead)
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    user = await db.get(models.User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    return user

# ✅ Обновить пользователя
@router.put("/{user_id}", response_model=UserRead)
async def update_user(user_id: int, data: UserUpdate, db: AsyncSession = Depends(get_db)):
    print(f"Пришёл запрос на обновление user_id={user_id}, data={data.dict(exclude_unset=True)}")
    user = await db.get(models.User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    for key, value in data.dict(exclude_unset=True).items():
        if key == "password" and value:
            setattr(user, "hashed_password", auth_utils.hash_password(value))
        else:
            setattr(user, key, value)
    await db.commit()
    await db.refresh(user)
    return user

# ✅ Удалить пользователя
@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int, db: AsyncSession = Depends(get_db)):
    user = await db.get(models.User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    await db.delete(user)
    await db.commit()