from fastapi import APIRouter, UploadFile, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app import models
import openpyxl
import io

router = APIRouter(
    prefix="/api/regions",
    tags=["regions"],
)

# ✅ Получить список всех регионов
@router.get("", status_code=200)
async def get_regions(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Region))
    regions = result.scalars().all()
    return [{"id": region.id, "name": region.name} for region in regions]

# ✅ Добавить новый регион
@router.post("", status_code=201)
async def create_region(data: dict, db: AsyncSession = Depends(get_db)):
    name = data.get("name")
    if not name:
        raise HTTPException(status_code=400, detail="Не указано имя региона")
    new_region = models.Region(name=name.strip())
    db.add(new_region)
    await db.commit()
    await db.refresh(new_region)
    return {"id": new_region.id, "name": new_region.name}

# ✅ Импорт регионов и городов из Excel
@router.post("/import", status_code=201)
async def import_regions_and_cities(file: UploadFile, db: AsyncSession = Depends(get_db)):
    if not file.filename.endswith((".xlsx", ".xls")):
        raise HTTPException(status_code=400, detail="Файл должен быть в формате .xlsx или .xls")

    try:
        content = await file.read()
        workbook = openpyxl.load_workbook(io.BytesIO(content))
        sheet = workbook.active

        processed_count = 0

        for idx, row in enumerate(sheet.iter_rows(min_row=2, values_only=True), start=2):
            region_name, city_name = row

            print(f"[Строка {idx}] Регион: '{region_name}', Город: '{city_name}'")

            if not region_name or not city_name:
                print(f"[Строка {idx}] Пропущена: пустая область или город")
                continue

            region_result = await db.execute(select(models.Region).where(models.Region.name == region_name.strip()))
            region = region_result.scalar_one_or_none()

            if not region:
                region = models.Region(name=region_name.strip())
                db.add(region)
                await db.flush()

            city_result = await db.execute(
                select(models.City).where(
                    models.City.name == city_name.strip(),
                    models.City.region_id == region.id
                )
            )
            city = city_result.scalar_one_or_none()

            if not city:
                new_city = models.City(name=city_name.strip(), region_id=region.id)
                db.add(new_city)

            processed_count += 1

        await db.commit()
        return {"detail": f"Импорт завершен. Добавлено или обновлено строк: {processed_count}"}

    except Exception as e:
        print(f"Ошибка при импорте: {e}")
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Ошибка при обработке файла: {str(e)}")

# ✅ Удалить регион по ID
@router.delete("/{region_id}", status_code=204)
async def delete_region(region_id: int, db: AsyncSession = Depends(get_db)):
    region = await db.get(models.Region, region_id)
    if not region:
        raise HTTPException(status_code=404, detail="Регион не найден")
    await db.delete(region)
    await db.commit()

# ✅ Обновить регион по ID
@router.put("/{region_id}", status_code=200)
async def update_region(region_id: int, data: dict, db: AsyncSession = Depends(get_db)):
    region = await db.get(models.Region, region_id)
    if not region:
        raise HTTPException(status_code=404, detail="Регион не найден")

    name = data.get("name")
    if not name:
        raise HTTPException(status_code=400, detail="Не указано имя региона")

    region.name = name.strip()
    await db.commit()
    await db.refresh(region)
    return {"id": region.id, "name": region.name}

# ✅ Получить список городов для выбранного региона
@router.get("/{region_id}/cities", status_code=200)
async def get_cities_by_region(region_id: int, db: AsyncSession = Depends(get_db)):
    region = await db.get(models.Region, region_id)
    if not region:
        raise HTTPException(status_code=404, detail="Регион не найден")

    result = await db.execute(select(models.City).where(models.City.region_id == region_id))
    cities = result.scalars().all()
    return [{"id": city.id, "name": city.name, "region_id": city.region_id} for city in cities]