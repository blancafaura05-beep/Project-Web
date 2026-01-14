from fastapi import APIRouter, HTTPException
from sqlmodel import select
from app.dependencies import SessionDep, CurrentUser
from app.models.order import Order, OrderCreate, OrderPublic
from app.models.order_item import OrderItem, OrderItemPublic
from app.models.product import Product

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("", response_model=OrderPublic)
def create_order(payload: OrderCreate, session: SessionDep, user: CurrentUser):
    if not payload.items:
        raise HTTPException(status_code=400, detail="No items")

    try:
        total = 0
        currency = "USD" 
        order_items: list[OrderItem] = []
        products_to_update: list[Product] = []

        
        for it in payload.items:
            if it.quantity <= 0:
                raise HTTPException(status_code=400, detail="Quantity must be > 0")

            product = session.get(Product, it.product_id)
            if not product:
                raise HTTPException(
                    status_code=400, detail=f"Product {it.product_id} not found"
                )

            if product.stock < it.quantity:
                raise HTTPException(
                    status_code=400, detail=f"Not enough stock for {product.title}"
                )

            total += product.price_cents * it.quantity

            
            product.stock -= it.quantity
            products_to_update.append(product)

            
            order_items.append(
                OrderItem(
                    product_id=product.id,
                    unit_price_cents=product.price_cents,
                    quantity=it.quantity,
                )
            )


        order = Order(user_id=user.id, total_cents=total, currency=currency)
        session.add(order)

        
        session.flush()

        
        for oi in order_items:
            oi.order_id = order.id
            session.add(oi)

        for p in products_to_update:
            session.add(p)

        session.commit()

        session.refresh(order)

        items_db = session.exec(
            select(OrderItem).where(OrderItem.order_id == order.id)
        ).all()

        return OrderPublic(
            id=order.id,
            status=order.status,
            total_cents=order.total_cents,
            currency=order.currency,
            created_at=order.created_at,
            items=[
                OrderItemPublic(
                    id=i.id,
                    product_id=i.product_id,
                    unit_price_cents=i.unit_price_cents,
                    quantity=i.quantity,
                )
                for i in items_db
            ],
        )

    except HTTPException:
        session.rollback()
        raise
    except Exception:
        session.rollback()
        raise HTTPException(status_code=500, detail="Could not create order")


@router.get("", response_model=list[OrderPublic])
def my_orders(session: SessionDep, user: CurrentUser):
    orders = session.exec(
        select(Order).where(Order.user_id == user.id).order_by(Order.id.desc())
    ).all()

    result: list[OrderPublic] = []
    for o in orders:
        items = session.exec(select(OrderItem).where(OrderItem.order_id == o.id)).all()
        result.append(
            OrderPublic(
                id=o.id,
                status=o.status,
                total_cents=o.total_cents,
                currency=o.currency,
                created_at=o.created_at,
                items=[
                    OrderItemPublic(
                        id=i.id,
                        product_id=i.product_id,
                        unit_price_cents=i.unit_price_cents,
                        quantity=i.quantity,
                    )
                    for i in items
                ],
            )
        )
    return result
