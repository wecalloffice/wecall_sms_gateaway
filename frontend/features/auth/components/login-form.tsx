

// "use client";

// import { useState } from "react";
// import { useLogin } from "../hooks";
// import type { LoginPayload } from "../types";

// export function LoginForm() {
//   const loginMutation = useLogin();
//   const [form, setForm] = useState<LoginPayload>({
//     business_username: "",
//     password: "",
//   });
//   const [error, setError] = useState<string | null>(null);

//   function update<K extends keyof LoginPayload>(key: K, value: LoginPayload[K]) {
//     setError(null);
//     setForm((prev) => ({ ...prev, [key]: value }));
//   }

//   function onSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setError(null);

//     if (!form.business_username || !form.password) {
//       setError("Please enter your business username and password.");
//       return;
//     }

//     loginMutation.mutate(form, {
//       onError: (err) => {
//         setError((err as Error).message);
//       },
//     });
//   }

//   return (
//     <form
//       onSubmit={onSubmit}
//       className="space-y-5 p-6 border rounded-xl max-w-md mx-auto mt-20 bg-white"
//     >
//       <h2 className="text-3xl font-bold text-center text-black">Login</h2>

//       <div className="space-y-2">
//         <label className="text-black font-medium">
//           Business username
//         </label>
//         <input
//           className="w-full p-3 border rounded-md"
//           value={form.business_username}
//           onChange={(e) => update("business_username", e.target.value)}
//         />
//       </div>

//       <div className="space-y-2">
//         <label className="text-black font-medium">
//           Password
//         </label>
//         <input
//           type="password"
//           className="w-full p-3 border rounded-md"
//           value={form.password}
//           onChange={(e) => update("password", e.target.value)}
//         />
//       </div>

//       {error && (
//         <p className="text-red-600 text-center text-sm">{error}</p>
//       )}

//       {loginMutation.isError && !error && (
//         <p className="text-red-600 text-center text-sm">
//           {(loginMutation.error as Error)?.message || "Login failed"}
//         </p>
//       )}

//       <button type="submit" className="btn-primary w-full">
//         Sign in
//       </button>
//     </form>
//   );
// }

"use client";

import { useState } from "react";
import { useLogin } from "../hooks";
import type { LoginPayload } from "../types";

export function LoginForm() {
  const loginMutation = useLogin();

  const [form, setForm] = useState<LoginPayload>({
    business_username: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof LoginPayload>(key: K, value: LoginPayload[K]) {
    setError(null);
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.business_username || !form.password) {
      setError("Business username and password are required");
      return;
    }

    // This calls the fixed API function
    loginMutation.mutate(form, {
      onError: (err) => {
        setError((err as Error).message);
      },
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 p-6 border rounded-xl max-w-md mx-auto mt-20 bg-white"
    >
      <h2 className="text-3xl font-bold text-center text-black">Login</h2>

      <div className="space-y-2">
        <label className="text-black font-medium">Business Username</label>
        <input
          className="w-full p-3 border rounded-md"
          value={form.business_username}
          onChange={(e) => update("business_username", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-black font-medium">Password</label>
        <input
          type="password"
          className="w-full p-3 border rounded-md"
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
        />
      </div>

      {error && <p className="text-red-600 text-center text-sm">{error}</p>}
      {loginMutation.isError && !error && (
        <p className="text-red-600 text-center text-sm">
          {(loginMutation.error as Error)?.message || "Login failed"}
        </p>
      )}

      <button type="submit" className="btn-primary w-full">
        Sign in
      </button>
    </form>
  );
}
