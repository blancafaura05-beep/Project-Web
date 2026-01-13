import { apiFetch } from "./client";
import type { CartLine } from "../models/cart";

export type ValidateCartResponse = {
  valid_items: {
    product_id: number;
    title: string;
    unit_price_cents: number;
    quantity: number;
    subtotal_cents: number;
    currency: string;
  }[];
  invalid_items: { product_id: number; reason: string }[];
  total_cents: number;
  currency: string;
};

export function validateCart(items: CartLine[]) {
  return apiFetch<ValidateCartResponse>("/checkout/validate", {
    method: "POST",
    body: JSON.stringify({ items }),
  });
}
