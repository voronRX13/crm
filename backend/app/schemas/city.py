from pydantic import BaseModel
from typing import Optional
from app.schemas.region import RegionRead

class CityCreate(BaseModel):
    name: str
    region_id: int

class CityRead(BaseModel):
    id: int
    name: str
    region: Optional[RegionRead]  # ✅ вложенный регион для фронта

    class Config:
        from_attributes = True