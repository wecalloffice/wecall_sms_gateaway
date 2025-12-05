// <<<<<<< HEAD
// "use server";

// import axios from "@/lib/axiosInstance";

// export async function getWallet(businessId: string) {
//   const res = await axios.get(`/billing/wallet/${businessId}`);
//   return res.data;
// }

// export async function getTransactions(businessId: string) {
//   const res = await axios.get(`/billing/transactions/${businessId}`);
//   return res.data;
// }

// export async function topUpWallet(businessId: string, amount: number) {
//   const res = await axios.post(`/billing/topup`, {
//     businessId,
//     amount,
//   });
//   return res.data;
// }

// import type { LoginPayload, RegisterPayload } from "./types";

// const API_BASE=
//   process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1";

// export async function login(payload: LoginPayload) {
//   const res = await fetch(`${API_BASE}/auth/login/`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       username: payload.business_username, // backend expects "username"
//       password: payload.password,
//     }),
//   });

//   if (!res.ok) {
//     const errorBody = await res.json().catch(() => ({}));
//     throw new Error(errorBody.detail || "Login failed");
//   }

//   return res.json();
// }

// export async function registerBusiness(payload: RegisterPayload) {
//   const res = await fetch(`${API_BASE}/business/self-register/`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(payload),
//   });

//   if (!res.ok) {
//     const errorBody = await res.json().catch(() => ({}));
//     throw new Error(errorBody.detail || "Registration failed");
//   }

//   return res.json();
// }




import type { LoginPayload, RegisterPayload } from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1";


// api.ts (updated login)


function safeJson(res: Response) {
  // helper to read JSON safely (if any)
  return res.text().then((t) => {
    try {
      return t ? JSON.parse(t) : {};
    } catch (e) {
      return { raw: t };
    }
  });
}

/**
 * Robust login: try multiple common payload shapes and surface server errors.
 */
// export async function login(payload: LoginPayload) {
//   const variants = [
//     { business_username: payload.business_username, password: payload.password },
//     { username: payload.business_username, password: payload.password },
//     { email: payload.business_username, password: payload.password },
//     // last-resort: include both username and business_username
//     {
//       business_username: payload.business_username,
//       username: payload.business_username,
//       password: payload.password,
//     },
//   ];

//   let lastError: any = null;

//   for (const bodyObj of variants) {
//     try {
//       console.log("LOGIN ATTEMPT — payload:", bodyObj);

//       const res = await fetch(`${API_BASE}/auth/login/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//         body: JSON.stringify(bodyObj),
//       });

//       const parsed = await safeJson(res);
//       console.log("LOGIN RESPONSE status:", res.status, "body:", parsed);

//       if (res.ok) {
//         return parsed; // success — return server JSON
//       }

//       // store last error details for throwing after variants exhausted
//       lastError = { status: res.status, body: parsed };

//       // If it's a 400, try the next variant. For non-400 errors you might break early.
//       if (res.status >= 500) {
//         // server error — no point trying other payload shapes
//         break;
//       }
//     } catch (err) {
//       // network / parsing error — save and try next variant
//       console.error("Network / fetch error during login attempt:", err);
//       lastError = { networkError: (err as Error).message || err };
//     }
//   }

//   // No variant succeeded — craft a helpful error
//   if (lastError) {
//     // Prefer server-provided message fields if present
//     const serverMsg =
//       (lastError.body && (lastError.body.detail || lastError.body.non_field_errors || lastError.body.error)) ||
//       lastError.body ||
//       JSON.stringify(lastError);

//     throw new Error(
//       `Login failed (${lastError.status ?? "network"}). Server response: ${JSON.stringify(
//         serverMsg
//       )}`
//     );
//   } else {
//     throw new Error("Login failed: unknown error");
//   }
// }
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
        return json; // 🚀 STOP on first success
      }

      // Save last error but continue trying other payload shapes
      lastError = { status: res.status, body: json };
    } catch (error) {
      lastError = { network: error };
    }
  }

  // If no variant succeeded
  if (lastError) {
    throw new Error(
      lastError.body?.detail ||
        JSON.stringify(lastError.body) ||
        "Login failed"
    );
  }

  throw new Error("Login failed");
}



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