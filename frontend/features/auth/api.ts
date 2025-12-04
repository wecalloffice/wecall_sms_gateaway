

// import type { LoginPayload, RegisterPayload } from "./types";

// const API_BASE =
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


export async function login(payload: LoginPayload) {
  const res = await fetch(`${API_BASE}/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: payload.business_username, // FIXED
      password: payload.password,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.detail || "Login failed");
  }

  return res.json();
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
