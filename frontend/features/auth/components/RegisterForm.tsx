// "use client";

// import { useState } from "react";
// import { useRegisterBusiness } from "../hooks";

// export function RegisterForm() {
//   const registerMutation = useRegisterBusiness();

//   const [form, setForm] = useState({
//     business_username: "",
//     business_name: "",
//     business_type: "CLIENT",
//     contact_person: "",
//     contact_email: "",
//     contact_phone: "",
//     country: "",
//     password: "",
//   });

//   function update(key: string, value: string) {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   }

//   function onSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     registerMutation.mutate(form);
//   }

//   return (
//     <form onSubmit={onSubmit} className="space-y-5 p-6 border rounded-xl max-w-md mx-auto mt-20">
//       <h2 className="text-3xl font-bold text-center text-black">Create an Account</h2>

//       {Object.keys(form).map((key) => {
//         if (key === "business_type") return null;
//         return (
//           <div key={key} className="space-y-2">
//             <label className="text-black font-medium capitalize">{key.replace("_", " ")}</label>
//             <input
//               className="w-full p-3 border rounded-md"
//               value={(form as any)[key]}
//               onChange={(e) => update(key, e.target.value)}
//             />
//           </div>
//         );
//       })}

//       <button className="btn-primary w-full">Create Account</button>

//       {registerMutation.isError && (
//         <p className="text-red-600 text-center">Registration failed</p>
//       )}
//     </form>
//   );
// }
"use client";

import { useState } from "react";
import { useRegisterBusiness } from "../hooks";
import type { RegisterPayload } from "../types";

const initialForm: RegisterPayload = {
  business_username: "",
  business_name: "",
  business_type: "CLIENT",
  contact_person: "",
  contact_email: "",
  contact_phone: "",
  country: "",
  password: "",
  password2: "",
};

export function RegisterForm() {
  const registerMutation = useRegisterBusiness();
  const [form, setForm] = useState<RegisterPayload>(initialForm);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof RegisterPayload>(key: K, value: RegisterPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.password !== form.password2) {
      setError("Passwords do not match.");
      return;
    }

    // Optional: validate required fields quickly
    if (!form.business_username || !form.business_name || !form.contact_email) {
      setError("Please fill all required fields.");
      return;
    }

    registerMutation.mutate(form, {
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
      <h2 className="text-3xl font-bold text-center text-black">
        Create an Account
      </h2>

      {/* Business Username */}
      <div className="space-y-2">
        <label className="text-black font-medium">
          Business username
        </label>
        <input
          className="w-full p-3 border rounded-md"
          value={form.business_username}
          onChange={(e) => update("business_username", e.target.value)}
        />
      </div>

      {/* Business Name */}
      <div className="space-y-2">
        <label className="text-black font-medium">
          Business name
        </label>
        <input
          className="w-full p-3 border rounded-md"
          value={form.business_name}
          onChange={(e) => update("business_name", e.target.value)}
        />
      </div>

      {/* Business Type (simple select for now) */}
      <div className="space-y-2">
        <label className="text-black font-medium">
          Business type
        </label>
        <select
          className="w-full p-3 border rounded-md"
          value={form.business_type ?? ""}
          onChange={(e) => update("business_type", e.target.value || null)}
        >
          <option value="CLIENT">Client</option>
          <option value="RESELLER">Reseller</option>
          <option value="PARTNER">Partner</option>
        </select>
      </div>

      {/* Contact person */}
      <div className="space-y-2">
        <label className="text-black font-medium">
          Contact person
        </label>
        <input
          className="w-full p-3 border rounded-md"
          value={form.contact_person}
          onChange={(e) => update("contact_person", e.target.value)}
        />
      </div>

      {/* Contact email */}
      <div className="space-y-2">
        <label className="text-black font-medium">
          Contact email
        </label>
        <input
          type="email"
          className="w-full p-3 border rounded-md"
          value={form.contact_email}
          onChange={(e) => update("contact_email", e.target.value)}
        />
      </div>

      {/* Contact phone */}
      <div className="space-y-2">
        <label className="text-black font-medium">
          Contact phone
        </label>
        <input
          className="w-full p-3 border rounded-md"
          value={form.contact_phone}
          onChange={(e) => update("contact_phone", e.target.value)}
        />
      </div>

      {/* Country */}
      <div className="space-y-2">
        <label className="text-black font-medium">
          Country
        </label>
        <input
          className="w-full p-3 border rounded-md"
          value={form.country}
          onChange={(e) => update("country", e.target.value)}
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label className="text-black font-medium">
          Password
        </label>
        <input
          type="password"
          className="w-full p-3 border rounded-md"
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
        />
      </div>

      {/* Password2 (confirm) */}
      <div className="space-y-2">
        <label className="text-black font-medium">
          Confirm password
        </label>
        <input
          type="password"
          className="w-full p-3 border rounded-md"
          value={form.password2}
          onChange={(e) => update("password2", e.target.value)}
        />
      </div>

      {error && (
        <p className="text-red-600 text-center text-sm">{error}</p>
      )}

      {registerMutation.isError && !error && (
        <p className="text-red-600 text-center text-sm">
          {(registerMutation.error as Error)?.message || "Registration failed"}
        </p>
      )}

      <button type="submit" className="btn-primary w-full">
        Create Account
      </button>
    </form>
  );
}
