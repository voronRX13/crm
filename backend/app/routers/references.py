from fastapi import APIRouter, UploadFile, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app import models
from app.schemas.reference import ReferenceCreate, ReferenceRead, ReferenceUpdate
import openpyxl
import io

router = APIRouter(prefix="/api/references", tags=["references"])

# ✅ Получить значения справочника по категории
@router.get("/{category}", response_model=list[ReferenceRead])
async def get_references(category: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(models.Reference).where(models.Reference.category == category)
    )
    return result.scalars().all()

# ✅ Добавить новое значение в справочник
@router.post("", response_model=ReferenceRead, status_code=status.HTTP_201_CREATED)
async def create_reference(data: ReferenceCreate, db: AsyncSession = Depends(get_db)):
    new_ref = models.Reference(category=data.category, value=data.value)
    db.add(new_ref)
    await db.commit()
    await db.refresh(new_ref)
    return new_ref

# ✅ Обновить значение справочника
@router.put("/{reference_id}", response_model=ReferenceRead)
async def update_reference(reference_id: int, data: ReferenceUpdate, db: AsyncSession = Depends(get_db)):
    ref = await db.get(models.Reference, reference_id)
    if not ref:
        raise HTTPException(status_code=404, detail="Элемент не найден")
    ref.value = data.value
    await db.commit()
    await db.refresh(ref)
    return ref

# ✅ Удалить значение справочника
@router.delete("/{reference_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_reference(reference_id: int, db: AsyncSession = Depends(get_db)):
    ref = await db.get(models.Reference, reference_id)
    if not ref:
        raise HTTPException(status_code=404, detail="Элемент не найден")
    await db.delete(ref)
    await db.commit()

# ✅ Импорт значений справочника из Excel
@router.post("/import/{category}", status_code=status.HTTP_201_CREATED)
async def import_references_from_excel(category: str, file: UploadFile, db: AsyncSession = Depends(get_db)):
    if not file.filename.endswith((".xlsx", ".xls")):
        raise HTTPException(status_code=400, detail="Файл должен быть в формате .xlsx или .xls")

    try:
        content = await file.read()
        workbook = openpyxl.load_workbook(io.BytesIO(content))
        sheet = workbook.active

        processed_count = 0

        for idx, row in enumerate(sheet.iter_rows(min_row=2, values_only=True), start=2):
            value = row[0]

            print(f"[Строка {idx}] Значение: '{value}'")

            if not value:
                print(f"[Строка {idx}] Пропущена: пустое значение")
                continue

            # Проверяем, есть ли уже такое значение в этой категории
            existing = await db.execute(
                select(models.Reference).where(
                    models.Reference.category == category.strip(),
                    models.Reference.value == value.strip()
                )
            )
            if existing.scalar_one_or_none():
                print(f"[Строка {idx}] Уже существует")
                continue

            new_ref = models.Reference(category=category.strip(), value=value.strip())
            db.add(new_ref)
            processed_count += 1

        await db.commit()
        return {"detail": f"Импорт завершен. Добавлено значений: {processed_count}"}

    except Exception as e:
        print(f"Ошибка при импорте справочника: {e}")
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Ошибка при обработке файла: {str(e)}")