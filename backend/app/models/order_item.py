from typing import Optional
from sqlmodel import SQLModel, Field


class OrderItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="order.id", index=True)
    product_id: int = Field(foreign_key="product.id", index=True)

    unit_price_cents: int
    quantity: int

class OrderItemPublic(SQLModel):
    id: int
    product_id: int
    unit_price_cents: int
    quantity: int
