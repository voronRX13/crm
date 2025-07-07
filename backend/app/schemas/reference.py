from pydantic import BaseModel

class ReferenceCreate(BaseModel):
    category: str
    value: str

class ReferenceUpdate(BaseModel):
    value: str

class ReferenceRead(BaseModel):
    id: int
    category: str
    value: str

    class Config:
        from_attributes = True