import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { Product } from "../models/product";
import { getProducts } from "../api/products";

export default function ProductCatalog() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = async (query?: string) => {
    setLoading(true);
    setErr(null);
    try {
      const data = await getProducts(query);
      setItems(data);
    } catch (e: any) {
      setErr(e.message ?? "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h1>Product catalog</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search..."
        />
        <button onClick={() => load(q)}>Search</button>
        <button onClick={() => { setQ(""); load(); }}>Clear</button>
      </div>

      {loading && <p>Loading...</p>}
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      {!loading && !err && items.length === 0 && <p>No products found</p>}

      <ul style={{ display: "grid", gap: 12, paddingLeft: 0, listStyle: "none" }}>
        {items.map((p) => (
          <li key={p.id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
            <h3 style={{ margin: 0 }}>{p.title}</h3>
            <p style={{ margin: "6px 0" }}>
              {p.price_cents / 100} {p.currency} · stock {p.stock}
            </p>
            <Link to={`/products/${p.id}`}>View</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
