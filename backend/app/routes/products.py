from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Query
from sqlmodel import select

from app.dependencies import SessionDep
from ..models.product import Product, ProductCreate, ProductPublic, ProductUpdate

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=list[ProductPublic])
def list_products(
    session: SessionDep,
    q: str | None = Query(default=None, description="Search by title/description"),
    offset: int = 0,
    limit: int = Query(default=50, le=100),
):
    stmt = select(Product)

    if q:
        like = f"%{q}%"
        stmt = stmt.where((Product.title.ilike(like)) | (Product.description.ilike(like)))

    stmt = stmt.offset(offset).limit(limit)
    return session.exec(stmt).all()


@router.get("/{product_id}", response_model=ProductPublic)
def get_product(product_id: int, session: SessionDep):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("", response_model=ProductPublic)
def create_product(payload: ProductCreate, session: SessionDep):
    existing = session.exec(select(Product).where(Product.slug == payload.slug)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")

    product = Product(**payload.model_dump())
    session.add(product)
    session.commit()
    session.refresh(product)
    return product


@router.patch("/{product_id}", response_model=ProductPublic)
def update_product(product_id: int, payload: ProductUpdate, session: SessionDep):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    data = payload.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(product, k, v)

    product.updated_at = datetime.now(timezone.utc)

    session.add(product)
    session.commit()
    session.refresh(product)
    return product
