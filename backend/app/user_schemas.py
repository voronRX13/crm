from pydantic import BaseModel
from typing import Optional
from datetime import date

class UserCreate(BaseModel):
    username: str
    password: str
    account_type: str
    first_name: Optional[str] = None
    name: Optional[str] = None
    birth_date: Optional[date] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    status: Optional[str] = None

    model_config = {"from_attributes": True}

class UserUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    account_type: Optional[str] = None
    is_active: Optional[bool] = None

class UserRead(BaseModel):
    id: int
    username: str
    first_name: Optional[str] = None
    name: Optional[str] = None
    birth_date: Optional[date] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    account_type: str
    status: Optional[str] = None
    is_active: bool

    model_config = {"from_attributes": True}

class UserLogin(BaseModel):
    username: str
    password: str