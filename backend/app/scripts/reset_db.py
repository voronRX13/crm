import os
import asyncio
from app.database import engine
from app import models

DB_FILE = "./app.db"

async def reset_database():
    # Удаляем старый файл базы данных
    if os.path.exists(DB_FILE):
        print("Удаляю старую базу данных...")
        os.remove(DB_FILE)

    # Создаём новые таблицы
    print("Создаю новые таблицы...")
    async with engine.begin() as conn:
        await conn.run_sync(models.Base.metadata.create_all)
    print("База данных успешно создана!")

if __name__ == "__main__":
    asyncio.run(reset_database())