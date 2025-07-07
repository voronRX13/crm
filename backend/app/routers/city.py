from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.database import get_db
from app import models
from app.schemas.city import CityCreate, CityRead

router = APIRouter(
    prefix="/api/city",
    tags=["city"],
)

@router.post("", response_model=CityRead, status_code=status.HTTP_201_CREATED)
async def create_city(data: CityCreate, db: AsyncSession = Depends(get_db)):
    region = await db.get(models.Region, data.region_id)
    if not region:
        raise HTTPException(status_code=404, detail="Регион не найден")

    new_city = models.City(name=data.name, region_id=data.region_id)
    db.add(new_city)
    await db.commit()
    await db.refresh(new_city)

    result = await db.execute(
        select(models.City).options(selectinload(models.City.region)).where(models.City.id == new_city.id)
    )
    city_with_region = result.scalar_one()
    return city_with_region

@router.get("", response_model=list[CityRead])
async def list_cities(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(models.City).options(selectinload(models.City.region))
    )
    return result.scalars().all()

@router.put("/{city_id}", response_model=CityRead)
async def update_city(city_id: int, data: CityCreate, db: AsyncSession = Depends(get_db)):
    city = await db.get(models.City, city_id)
    if not city:
        raise HTTPException(status_code=404, detail="Город не найден")
    city.name = data.name
    city.region_id = data.region_id
    await db.commit()
    await db.refresh(city)

    result = await db.execute(
        select(models.City).options(selectinload(models.City.region)).where(models.City.id == city.id)
    )
    city_with_region = result.scalar_one()
    return city_with_region

@router.delete("/{city_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_city(city_id: int, db: AsyncSession = Depends(get_db)):
    city = await db.get(models.City, city_id)
    if not city:
        raise HTTPException(status_code=404, detail="Город не найден")
    await db.delete(city)
    await db.commit()