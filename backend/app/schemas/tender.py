from pydantic import BaseModel
from typing import Optional
from datetime import date

# ✅ Создание тендера
class TenderCreate(BaseModel):
    lot_number: str
    lot_link: str
    nmck: str
    deadline: Optional[date] = None
    auction_date: Optional[date] = None
    submitted: bool = False
    company_id: int

    class Config:
        from_attributes = True

# ✅ Обновление тендера
class TenderUpdate(BaseModel):
    lot_number: Optional[str] = None
    lot_link: Optional[str] = None
    nmck: Optional[str] = None
    deadline: Optional[date] = None
    auction_date: Optional[date] = None
    submitted: Optional[bool] = None
    company_id: Optional[int] = None

# ✅ Чтение данных о тендере
class TenderRead(BaseModel):
    id: int
    lot_number: str
    lot_link: str
    nmck: str
    deadline: Optional[date] = None
    auction_date: Optional[date] = None
    submitted: bool
    company_id: int

    class Config:
        from_attributes = True