from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.database import Base

# ✅ Модель пользователя
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    account_type = Column(String, nullable=False, default="user")
    first_name = Column(String, nullable=True)
    name = Column(String, nullable=True)
    birth_date = Column(Date, nullable=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    department = Column(String, nullable=True)
    position = Column(String, nullable=True)
    status = Column(String, nullable=True, default="active")
    is_active = Column(Boolean, default=True)

# ✅ Модель отрасли (сфера деятельности)
class Industry(Base):
    __tablename__ = "industries"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)

# ✅ Модель региона
class Region(Base):
    __tablename__ = "regions"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    cities = relationship("City", back_populates="region", cascade="all, delete")

# ✅ Модель города
class City(Base):
    __tablename__ = "cities"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    region_id = Column(Integer, ForeignKey("regions.id"), nullable=False)
    region = relationship("Region", back_populates="cities")

# ✅ Модель компании
class Company(Base):
    __tablename__ = "companies"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    industry_id = Column(Integer, ForeignKey("industries.id"), nullable=True)
    region_id = Column(Integer, ForeignKey("regions.id"), nullable=True)
    city_id = Column(Integer, ForeignKey("cities.id"), nullable=True)
    responsible_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    priority_id = Column(Integer, ForeignKey("references.id"), nullable=True)  # приоритет через универсальный Reference

    industry = relationship("Industry")
    region = relationship("Region")
    city = relationship("City")
    responsible = relationship("User")
    priority = relationship("Reference")

# ✅ Модель тендера
class Tender(Base):
    __tablename__ = "tenders"
    id = Column(Integer, primary_key=True, index=True)
    lot_number = Column(String, nullable=False)
    lot_link = Column(String, nullable=False)
    nmck = Column(Float, nullable=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    company = relationship("Company")

# ✅ Универсальный справочник (например: priority)
class Reference(Base):
    __tablename__ = "references"
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, nullable=False, index=True)
    value = Column(String, nullable=False)