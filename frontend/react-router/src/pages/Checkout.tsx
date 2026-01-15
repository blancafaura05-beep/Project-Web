import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { createOrder } from "../api/orders";
import type { ValidateCartResponse } from "../api/checkout";

export default function Checkout() {
  const nav = useNavigate();
  const { isLogged } = useAuth();
  const { clear } = useCart();
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const preview: ValidateCartResponse | null = useMemo(() => {
    const raw = sessionStorage.getItem("checkout_preview");
    return raw ? (JSON.parse(raw) as ValidateCartResponse) : null;
  }, []);

  if (!preview) {
    return (
      <div>
        <h1>Checkout</h1>
        <p>No checkout preview found. Go to the cart and validate first.</p>
        <Link to="/cart">Go to cart</Link>
      </div>
    );
  }

  const hasInvalid = (preview.invalid_items?.length ?? 0) > 0;
  const hasValid = (preview.valid_items?.length ?? 0) > 0;

  const validItemsForOrder =
    preview.valid_items.map((v) => ({
      product_id: v.product_id,
      quantity: v.quantity,
    })) ?? [];

  const onConfirm = async () => {
    setLoading(true);
    setErr(null);
    try {
      await createOrder(validItemsForOrder);
      clear();
      sessionStorage.removeItem("checkout_preview");
      nav("/orders");
    } catch (e: any) {
      setErr(e.message ?? "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Checkout</h1>
      {err && <p style={{ color: "crimson" }}>{err}</p>}

      <h3>Valid items</h3>
      <ul>
        {preview.valid_items.map((v) => (
          <li key={v.product_id}>
            {v.title} x{v.quantity} — {v.subtotal_cents / 100} {v.currency}
          </li>
        ))}
      </ul>

      {hasInvalid && (
        <>
          <h3>Invalid items</h3>
          <ul>
            {preview.invalid_items.map((i) => (
              <li key={i.product_id}>
                #{i.product_id}: {i.reason}
              </li>
            ))}
          </ul>

          <p style={{ color: "crimson" }}>
            Fix the invalid items in your cart before confirming the order.
          </p>
        </>
      )}

      <h2>
        Total: {preview.total_cents / 100} {preview.currency}
      </h2>

      {!isLogged ? (
        <p>
          You must <Link to="/login">login</Link> to confirm the order.
        </p>
      ) : (
        <button
          onClick={onConfirm}
          disabled={loading || hasInvalid || !hasValid}
          title={
            hasInvalid
              ? "You have invalid items in your cart"
              : !hasValid
              ? "No valid items to order"
              : undefined
          }
        >
          {loading ? "Placing order..." : "Confirm order"}
        </button>
      )}
    </div>
  );
}