import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { getMyOrders } from "../api/orders";
import type { Order } from "../models/order";

export default function OrdersHistory() {
  const { isLogged } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!isLogged) return;

    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (e: any) {
        setErr(e.message ?? "Error");
      } finally {
        setLoading(false);
      }
    })();
  }, [isLogged]);

  if (!isLogged) {
    return (
      <div style={{ display: "grid", gap: 8 }}>
        <h1>My orders</h1>
        <p>
          Please <Link to="/login">login</Link> to view your orders.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h1>My orders</h1>

      {loading && <p>Loading…</p>}
      {err && <p style={{ color: "crimson" }}>{err}</p>}

      {!loading && !err && orders.length === 0 && <p>No orders yet.</p>}

      <ul style={{ display: "grid", gap: 12, paddingLeft: 18 }}>
        {orders.map((o) => (
          <li key={o.id}>
            <div>
              <strong>Order #{o.id}</strong> — {(o.total_cents / 100).toFixed(2)}{" "}
              {o.currency} — {o.status}
            </div>

            <ul style={{ paddingLeft: 18 }}>
              {o.items.map((i) => (
                <li key={i.id}>
                  product #{i.product_id} × {i.quantity} @{" "}
                  {(i.unit_price_cents / 100).toFixed(2)}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}