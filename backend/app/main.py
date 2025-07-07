from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.routers import users, companies, tenders, auth, references, region, city
from app.routers import imports

app = FastAPI(
    title="RC Group CRM API",
    version="1.0.0",
    description="Backend для CRM системы РК ГРУПП с модулями пользователей, компаний и закупок",
)

# ✅ Подключаем CORS для фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Фронтенд на Vite
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔌 Подключаем все рутеры
app.include_router(users.router)
app.include_router(companies.router)
app.include_router(tenders.router)
app.include_router(auth.router)
app.include_router(references.router)
app.include_router(region.router)
app.include_router(city.router)
app.include_router(imports.router)

# 📍 Тестовый корневой эндпоинт
@app.get("/", tags=["utils"])
async def root():
    return {"message": "CRM API is up and running!"}

# ✅ Healthcheck эндпоинт для проверки работоспособности
@app.get("/ping", tags=["utils"])
async def ping():
    return {"status": "ok"}

# 🔧 Создание таблиц при старте приложения
@app.on_event("startup")
async def on_startup():
    print("🚀 Starting up CRM API...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ База данных и таблицы инициализированы!")

# ✅ Логирование всех запросов для удобства отладки
@app.middleware("http")
async def log_requests(request: Request, call_next):
    response = await call_next(request)
    print(f"👉 {request.method} {request.url} -> {response.status_code}")
    return response