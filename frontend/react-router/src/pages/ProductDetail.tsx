import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import type { Product } from "../models/product";
import { getProduct } from "../api/products";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const productId = Number(id);
  const { addItem } = useCart();

  const [p, setP] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const data = await getProduct(productId);
        setP(data);
      } catch (e: any) {
        setErr(e.message ?? "Error");
      } finally {
        setLoading(false);
      }
    })();
  }, [productId]);

  if (loading) return <p>Loading…</p>;
  if (err) return <p style={{ color: "crimson" }}>{err}</p>;
  if (!p) return <p>Not found</p>;

  return (
    <div>
      <Link to="/">← Back</Link>
      <h1>{p.title}</h1>
      <p>{p.description}</p>
      <p>
        Price: {p.price_cents / 100} {p.currency} · Stock: {p.stock}
      </p>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
        />
        <button onClick={() => addItem(p.id, qty)}>Add to cart</button>
        <Link to="/cart">Go to cart</Link>
      </div>
    </div>
  );
}