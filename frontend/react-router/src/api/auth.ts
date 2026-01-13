import { apiFetch, setToken } from "./client";
import type { User } from "../models/user";

export async function register(email: string, password: string) {
  return apiFetch<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function login(email: string, password: string) {
  const data = await apiFetch<{ access_token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(data.access_token);
  return data;
}

export function me() {
  return apiFetch<User>("/auth/me");
}

export function logout() {
  setToken(null);
}
