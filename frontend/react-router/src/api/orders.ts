import { apiFetch } from "./client";
import type { CartLine } from "../models/cart";
import type { Order } from "../models/order";

export function createOrder(items: CartLine[]) {
  return apiFetch<Order>("/orders", {
    method: "POST",
    body: JSON.stringify({ items }),
  });
}

export function getMyOrders() {
  return apiFetch<Order[]>("/orders");
}
