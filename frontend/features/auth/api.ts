import { LoginPayload, RegisterPayload } from "@/features/auth/types";

const BASE_URL = "http://localhost:8000/api"; // update if needed

export async function login(payload: LoginPayload) {
  const res = await fetch(`${BASE_URL}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  return res.json();
}

export async function registerBusiness(payload: RegisterPayload) {
  const res = await fetch(`${BASE_URL}/business/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Registration failed");
  }

  return res.json();
}
