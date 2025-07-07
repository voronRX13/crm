from pydantic import BaseModel
from typing import Optional
from datetime import date

class TenderCreate(BaseModel):
    title: str
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    amount: Optional[float] = None
    company_id: int

    model_config = {"from_attributes": True}

class TenderRead(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    amount: Optional[float] = None
    company_id: int

    model_config = {"from_attributes": True}