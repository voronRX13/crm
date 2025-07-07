from pydantic import BaseModel

class RegionRead(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

class RegionCreate(BaseModel):
    name: str