from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field

class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    slug: str = Field(index=True, unique=True)
    description: str
    price_cents: int
    currency: str = Field(default="USD")
    stock: int = Field(default=0)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProductPublic(SQLModel):
    id: int
    title: str
    slug: str
    description: str
    price_cents: int
    currency: str
    stock: int
    created_at: datetime
    updated_at: datetime

class ProductCreate(SQLModel):
    title: str
    slug: str
    description: str
    price_cents: int
    currency: str = "USD"
    stock: int = 0

class ProductUpdate(SQLModel):
    title: str | None = None
    slug: str | None = None
    description: str | None = None
    price_cents: int | None = None
    currency: str | None = None
    stock: int | None = None