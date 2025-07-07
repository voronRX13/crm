from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import pandas as pd
from app import models
from app.database import get_db

router = APIRouter(
    prefix="/api/regions",
    tags=["regions"],
)

@router.post("/import", status_code=201)
async def import_regions(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    try:
        filename = file.filename.lower()
        if filename.endswith(".csv"):
            df = pd.read_csv(file.file, sep=None, engine="python")  # autodetect separator
        elif filename.endswith(".xlsx"):
            df = pd.read_excel(file.file)
        else:
            raise HTTPException(status_code=400, detail="Поддерживаются только .csv или .xlsx файлы")

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Не удалось прочитать файл: {e}")

    for _, row in df.iterrows():
        region_name = str(row.get("Область")).strip()
        city_name = str(row.get("Город")).strip()
        if not region_name or not city_name or region_name == "nan" or city_name == "nan":
            continue

        # Найти или создать регион
        result = await db.execute(select(models.Region).where(models.Region.name == region_name))
        region = result.scalars().first()
        if not region:
            region = models.Region(name=region_name)
            db.add(region)
            await db.commit()
            await db.refresh(region)

        # Создать город
        new_city = models.City(name=city_name, region_id=region.id)
        db.add(new_city)

    await db.commit()
    return {"detail": "Импорт завершён успешно"}