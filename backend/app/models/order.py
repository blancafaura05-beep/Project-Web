from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional

from sqlmodel import SQLModel, Field

from .order_item import OrderItemPublic


class Order(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    status: str = Field(default="pending")
    total_cents: int
    currency: str = Field(default="USD")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class OrderPublic(SQLModel):
    id: int
    status: str
    total_cents: int
    currency: str
    created_at: datetime
    items: list[OrderItemPublic]


class OrderCreateItem(SQLModel):
    product_id: int
    quantity: int


class OrderCreate(SQLModel):
    items: list[OrderCreateItem]
