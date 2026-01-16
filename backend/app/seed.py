from sqlmodel import Session, select
from .db import engine
from .models.product import Product  # si tu modelo está en app/models/product.py


def seed_products():
    with Session(engine) as session:
        if session.exec(select(Product)).first():
            print("Products already exist, skipping seed")
            return

        products = [
            Product(
                title="Basic White T-Shirt",
                slug="basic-white-tshirt",
                description="Classic white cotton t-shirt for everyday wear",
                price_cents=1999,
                currency="USD",
                stock=25,
            ),
            Product(
                title="Black Oversized T-Shirt",
                slug="black-oversized-tshirt",
                description="Oversized black t-shirt with a relaxed fit",
                price_cents=2299,
                currency="USD",
                stock=18,
            ),
            Product(
                title="Blue Denim Jeans",
                slug="blue-denim-jeans",
                description="Regular fit blue denim jeans",
                price_cents=4999,
                currency="USD",
                stock=15,
            ),
            Product(
                title="Slim Fit Black Jeans",
                slug="slim-fit-black-jeans",
                description="Slim fit black jeans with stretch fabric",
                price_cents=5499,
                currency="USD",
                stock=12,
            ),
            Product(
                title="Grey Hoodie",
                slug="grey-hoodie",
                description="Warm grey hoodie with front pocket",
                price_cents=3999,
                currency="USD",
                stock=20,
            ),
            Product(
                title="Black Zip Hoodie",
                slug="black-zip-hoodie",
                description="Black hoodie with zipper and adjustable hood",
                price_cents=4299,
                currency="USD",
                stock=14,
            ),
            Product(
                title="White Oxford Shirt",
                slug="white-oxford-shirt",
                description="Formal white oxford shirt with button-down collar",
                price_cents=3799,
                currency="USD",
                stock=8,
            ),
            Product(
                title="Black Bomber Jacket",
                slug="black-bomber-jacket",
                description="Classic black bomber jacket with ribbed cuffs",
                price_cents=7999,
                currency="USD",
                stock=6,
            ),
            Product(
                title="Casual White Sneakers",
                slug="casual-white-sneakers",
                description="Minimalist white sneakers for everyday outfits",
                price_cents=8499,
                currency="USD",
                stock=11,
            ),
            Product(
                title="Leather Belt",
                slug="leather-belt",
                description="Genuine leather belt in black color",
                price_cents=2499,
                currency="USD",
                stock=22,
            ),
            Product(
                title="Wool Scarf",
                slug="wool-scarf",
                description="Soft wool scarf to keep warm in winter",
                price_cents=2999,
                currency="USD",
                stock=13,
            ),
        ]

        session.add_all(products)
        session.commit()
        print(f"Database seeded with {len(products)} products")
