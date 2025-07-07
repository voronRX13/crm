from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app import models
from app.schemas.tender import TenderCreate, TenderUpdate, TenderRead

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/users/login")

router = APIRouter(
    prefix="/api/tenders",
    tags=["tenders"],
    dependencies=[Depends(oauth2_scheme)]
)

@router.post("", response_model=TenderRead, status_code=status.HTTP_201_CREATED)
async def create_tender(data: TenderCreate, db: AsyncSession = Depends(get_db)):
    company = await db.get(models.Company, data.company_id)
    if not company:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Company not found")
    new = models.Tender(**data.dict())
    db.add(new)
    await db.commit()
    await db.refresh(new)
    return new

@router.get("", response_model=list[TenderRead])
async def list_tenders(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(models.Tender))
    return res.scalars().all()

@router.get("/{tender_id}", response_model=TenderRead)
async def get_tender(tender_id: int, db: AsyncSession = Depends(get_db)):
    tender = await db.get(models.Tender, tender_id)
    if not tender:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Tender not found")
    return tender

@router.put("/{tender_id}", response_model=TenderRead)
async def update_tender(tender_id: int, data: TenderUpdate, db: AsyncSession = Depends(get_db)):
    tender = await db.get(models.Tender, tender_id)
    if not tender:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Tender not found")
    for key, value in data.dict(exclude_unset=True).items():
        setattr(tender, key, value)
    await db.commit()
    await db.refresh(tender)
    return tender

@router.delete("/{tender_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tender(tender_id: int, db: AsyncSession = Depends(get_db)):
    tender = await db.get(models.Tender, tender_id)
    if not tender:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Tender not found")
    await db.delete(tender)
    await db.commit()