import type { LoginPayload, RegisterPayload } from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1";

/**
 * Helper to safely parse JSON responses
 */
function safeJson(res: Response) {
  return res.text().then((t) => {
    try {
      return t ? JSON.parse(t) : {};
    } catch (e) {
      return { raw: t };
    }
  });
}

/**
 * Robust login with multiple payload shape attempts
 */
export async function login(payload: LoginPayload) {
  const variants = [
    { username: payload.business_username, password: payload.password },
    { business_username: payload.business_username, password: payload.password },
    { email: payload.business_username, password: payload.password },
  ];

  let lastError: any = null;

  for (const bodyObj of variants) {
    try {
      const res = await fetch(`${API_BASE}/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(bodyObj),
      });

      const json = await safeJson(res);

      if (res.ok) {
        return json;
      }

      lastError = { status: res.status, body: json };
    } catch (error) {
      lastError = { network: error };
    }
  }

  if (lastError) {
    throw new Error(
      lastError.body?.detail ||
        JSON.stringify(lastError.body) ||
        "Login failed"
    );
  }

  throw new Error("Login failed");
}

/**
 * Register a new business
 */
export async function registerBusiness(payload: RegisterPayload) {
  const res = await fetch(`${API_BASE}/business/self-register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.detail || "Registration failed");
  }

  return res.json();
}