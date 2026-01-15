# Full-Stack E-Commerce Application

## Project overview

This project is a small full-stack e-commerce application built with **FastAPI** for the backend and **React + TypeScript** for the frontend.

The application allows users to:
- Browse a product catalog
- Search products by text
- Add products to a shopping cart
- Register and log in
- Validate the cart before checkout
- Place orders with stock deduction
- View their order history

The goal of the project is to practice building a complete web application with a backend API and a frontend SPA that communicate correctly with each other.

## Development process (starting from the Heroes example)

This project was developed starting from one of the example projects provided on the PDU platform, specifically the **Heroes** example.

That example was used only as a **starting point and reference structure**. From there, the project was **modified step by step** until it matched the requirements of the assignment.

Main changes made from the original example:
- The original Heroes domain was replaced with an e-commerce domain (products, users, orders).
- New database models were created: `User`, `Product`, `Order`, and `OrderItem`.
- JWT authentication was implemented for user login and protected routes.
- Shopping cart validation and checkout logic were added.
- Order creation now updates product stock.
- A complete React + TypeScript frontend was built to consume the backend API.

All features required by the assignment were implemented by adapting and extending the original example.

## Design / architecture decisions

- **Order vs OrderItem (database modelling):**  
  Orders are split into two tables: `Order` (the order “header” with user, total, status, date) and `OrderItem` (the order “lines” with product, quantity, and unit price).  
  This models the real e-commerce case where one order can contain multiple products, and it also lets each line store its own quantity and the price snapshot at purchase time.

- **Checkout validates but does not deduct stock:**  
  The endpoint `/checkout/validate` only checks if the cart is buyable (product exists, quantity is valid, enough stock) and computes totals. It does **not** modify the database.  
  Stock is deducted only when the order is actually created in `POST /orders`, so the “real purchase” happens in one place.

- **Checkout response explains what failed and why:**  
  Instead of returning only “ok / not ok”, checkout returns two lists: `valid_items` and `invalid_items`.  
  Each invalid item includes a clear `reason` (e.g. product not found, quantity must be > 0, not enough stock). 
  In this way the user can see exactly what needs to be fixed.

- **Products can be created/updated without admin:**  
  The assignment does not require the optional admin dashboard. For simplicity, product creation/update endpoints are not restricted to admins.  
  A future improvement would be adding an `is_admin` flag and protecting those endpoints so only admins can manage products.

- **Password length limits (basic security validation):**  
  During registration, passwords must have a minimum length (e.g. at least 6 characters).  
  On the backend hashing function, very long passwords are rejected (e.g. > 256 characters) to avoid extreme inputs and keep password processing reasonable.

## Run the project locally

### Backend
-cd backend

-pip install -r requirements.txt

-uvicorn app.main:app --reload

### Frontend
-cd frontend/react-router

-npm install

-npm run dev


## Live Demo

- **Frontend:**  
  https://project-web-frontend-olive.vercel.app

- **Backend API:**  
  https://project-web-backend-6fnl.onrender.com

- **API Documentation:**  
  https://project-web-backend-6fnl.onrender.com/docs

**Note:**  
The project uses SQLite in the production deployment.  
Product data may reset after a redeploy.  
Products can be recreated via the `/docs` endpoint.


## Example of user to loging that is already registered
Email: user1@test.com
password: password123
