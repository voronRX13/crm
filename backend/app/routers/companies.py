from fastapi import APIRouter, Depends, HTTPException, status 
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app import models 
from app.schemas import company as schemas
from typing import List

router = APIRouter(
    prefix="/api/companies",
    tags=["companies"],
)

# ✅ Создание компании
@router.post("", response_model=schemas.CompanyRead, status_code=status.HTTP_201_CREATED)
async def create_company(data: schemas.CompanyCreate, db: AsyncSession = Depends(get_db)):
    new_company = models.Company(**data.dict())
    db.add(new_company)
    await db.commit()
    await db.refresh(new_company)
    return new_company

# ✅ Получение всех компаний
@router.get("", response_model=List[schemas.CompanyRead])
async def list_companies(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Company))
    return result.scalars().all()

# ✅ Получение одной компании по ID
@router.get("/{company_id}", response_model=schemas.CompanyRead)
async def get_company(company_id: int, db: AsyncSession = Depends(get_db)):
    company = await db.get(models.Company, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Компания не найдена")
    return company

# ✅ Обновление компании
@router.put("/{company_id}", response_model=schemas.CompanyRead)
async def update_company(company_id: int, data: schemas.CompanyCreate, db: AsyncSession = Depends(get_db)):
    company = await db.get(models.Company, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Компания не найдена")
    for key, value in data.dict(exclude_unset=True).items():
        setattr(company, key, value)
    await db.commit()
    await db.refresh(company)
    return company

# ✅ Удаление компании
@router.delete("/{company_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_company(company_id: int, db: AsyncSession = Depends(get_db)):
    company = await db.get(models.Company, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Компания не найдена")
    await db.delete(company)
    await db.commit()

# ✅ Получение списка сфер деятельности для формы
@router.get("/industries", response_model=List[schemas.IndustryRead])
async def get_industries(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Industry))
    return result.scalars().all()

# ✅ Получение списка областей для формы
@router.get("/regions", response_model=List[schemas.RegionRead])
async def get_regions(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Region))
    return result.scalars().all()

# ✅ Получение городов по области
@router.get("/regions/{region_id}/cities", response_model=List[schemas.CityRead])
async def get_cities_by_region(region_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(models.City).where(models.City.region_id == region_id)
    )
    return result.scalars().all()