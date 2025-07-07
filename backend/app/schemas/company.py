from typing import Optional
from pydantic import BaseModel
from app.schemas.reference import ReferenceRead
from app.schemas.user import UserRead  # Если хочешь вернуть ФИО ответственного

class IndustryRead(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True

class RegionRead(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True

class CityRead(BaseModel):
    id: int
    name: str
    region_id: int

    class Config:
        orm_mode = True

class CompanyCreate(BaseModel):
    name: str
    industry_id: Optional[int]
    region_id: Optional[int]
    city_id: Optional[int]
    responsible_id: Optional[int]
    priority_id: Optional[int]  # ID из справочника Reference

class CompanyRead(BaseModel):
    id: int
    name: str
    industry: Optional[IndustryRead]
    region: Optional[RegionRead]
    city: Optional[CityRead]
    responsible: Optional[UserRead]  # или оставь str если тебе нужно только имя
    priority: Optional[ReferenceRead]

    class Config:
        orm_mode = True