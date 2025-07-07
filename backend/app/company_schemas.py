from pydantic import BaseModel
from typing import Optional

class CompanyCreate(BaseModel):
    name: str
    inn: str
    kpp: Optional[str] = None
    ogrn: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None

    model_config = {"from_attributes": True}

class CompanyRead(BaseModel):
    id: int
    name: str
    inn: str
    kpp: Optional[str] = None
    ogrn: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None

    model_config = {"from_attributes": True}