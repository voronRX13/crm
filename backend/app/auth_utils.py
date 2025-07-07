from datetime import datetime, timedelta
from typing import Optional

from passlib.context import CryptContext
from jose import jwt

# 🔑 Для хеширования паролей
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 🔐 Секретный ключ для токенов (лучше вынести в .env на проде)
SECRET_KEY = "your-very-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 день

# ✅ Хеширование пароля
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# ✅ Проверка пароля
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# ✅ Создание JWT-токена
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# ✅ Проверка JWT-токена (например, для тестов или отдельной проверки)
def decode_access_token(token: str) -> dict:
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])