import type { LoginPayload, RegisterPayload } from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1";

async function safeJson(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch (e) {
    return { raw: text };
  }
}

/**
 * Login against backend auth endpoint.
 * Backend expects { username, password } where username == business_username.
 */
export async function login(payload: LoginPayload) {
  const body = {
    username: payload.business_username,
    password: payload.password,
  };

  const res = await fetch(`${API_BASE}/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const json = await safeJson(res);

  if (res.ok) return json;

  const message =
    json?.detail ||
    json?.username ||
    json?.password ||
    json?.error ||
    "Login failed";
  throw new Error(typeof message === "string" ? message : JSON.stringify(message));
}

export async function registerBusiness(payload: RegisterPayload) {
  const res = await fetch(`${API_BASE}/business/self-register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await safeJson(res);
  if (res.ok) return json;

  throw new Error(json?.detail || "Registration failed");
}