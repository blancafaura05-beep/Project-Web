import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useCart } from "../context/CartContext";
import { getProduct } from "../api/products";
import type { Product } from "../models/product";
import { validateCart } from "../api/checkout";

export default function Cart() {
  const { items, setQuantity, removeItem } = useCart();
  const nav = useNavigate();

  const [products, setProducts] = useState<Record<number, Product>>({});
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const map: Record<number, Product> = {};
      for (const it of items) {
        try {
          map[it.product_id] = await getProduct(it.product_id);
        } catch {}
      }
      setProducts(map);
    })();
  }, [items]);

  const total = items.reduce((acc, it) => {
    const p = products[it.product_id];
    if (!p) return acc;
    return acc + p.price_cents * it.quantity;
  }, 0);

  const onValidate = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await validateCart(items);
      sessionStorage.setItem("checkout_preview", JSON.stringify(res));
      nav("/checkout");
    } catch (e: any) {
      setErr(e.message ?? "Error");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div>
        <h1>Cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/">Go shopping</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Cart</h1>
      {err && <p style={{ color: "crimson" }}>{err}</p>}

      <ul style={{ paddingLeft: 0, listStyle: "none", display: "grid", gap: 10 }}>
        {items.map((it) => {
          const p = products[it.product_id];
          return (
            <li key={it.product_id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
              <strong>{p?.title ?? `Product #${it.product_id}`}</strong>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6 }}>
                <button onClick={() => setQuantity(it.product_id, it.quantity - 1)}>-</button>
                <input
                  type="number"
                  min={1}
                  value={it.quantity}
                  onChange={(e) => setQuantity(it.product_id, Number(e.target.value))}
                />
                <button onClick={() => setQuantity(it.product_id, it.quantity + 1)}>+</button>
                <button onClick={() => removeItem(it.product_id)}>Remove</button>
              </div>
              <div style={{ marginTop: 6, opacity: 0.8 }}>
                Subtotal: {p ? (p.price_cents * it.quantity) / 100 : "…"}
              </div>
            </li>
          );
        })}
      </ul>

      <h3>Total: {total / 100}</h3>

      <button onClick={onValidate} disabled={loading}>
        {loading ? "Validating..." : "Validate / Preview checkout"}
      </button>
    </div>
  );
}