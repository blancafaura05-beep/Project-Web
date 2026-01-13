import { apiFetch } from "./client";
import type { Product } from "../models/product";

export function getProducts(q?: string) {
  const qs = q ? `?q=${encodeURIComponent(q)}` : "";
  return apiFetch<Product[]>(`/products${qs}`);
}

export function getProduct(id: number) {
  return apiFetch<Product>(`/products/${id}`);
}
