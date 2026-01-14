from fastapi import APIRouter, HTTPException
from sqlmodel import SQLModel
from app.dependencies import SessionDep
from app.models.product import Product

router = APIRouter(prefix="/checkout", tags=["checkout"])

class CartItem(SQLModel):
    product_id: int
    quantity: int


class ValidateCartRequest(SQLModel):
    items: list[CartItem]


class ValidItem(SQLModel):
    product_id: int
    title: str
    unit_price_cents: int
    quantity: int
    subtotal_cents: int
    currency: str 


class InvalidItem(SQLModel):
    product_id: int
    reason: str


class ValidateCartResponse(SQLModel):
    valid_items: list[ValidItem]
    invalid_items: list[InvalidItem]
    total_cents: int
    currency: str


@router.post("/validate", response_model=ValidateCartResponse)
def validate_cart(payload: ValidateCartRequest, session: SessionDep):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    valid_items: list[ValidItem] = []
    invalid_items: list[InvalidItem] = []
    total = 0
    currency = "USD"

    for item in payload.items:
        if item.quantity <= 0:
            invalid_items.append(
                InvalidItem(product_id=item.product_id, reason="Quantity must be > 0")
            )
            continue

        product = session.get(Product, item.product_id)
        if not product:
            invalid_items.append(
                InvalidItem(product_id=item.product_id, reason="Product not found")
            )
            continue

        if product.stock < item.quantity:
            invalid_items.append(
                InvalidItem(
                    product_id=item.product_id,
                    reason=f"Not enough stock (available {product.stock})",
                )
            )
            continue

        subtotal = product.price_cents * item.quantity
        total += subtotal

        valid_items.append(
            ValidItem(
                product_id=product.id,
                title=product.title,
                unit_price_cents=product.price_cents,
                quantity=item.quantity,
                subtotal_cents=subtotal,
                currency=currency, 
            )
        )

    return ValidateCartResponse(
        valid_items=valid_items,
        invalid_items=invalid_items,
        total_cents=total,
        currency=currency,
    )
