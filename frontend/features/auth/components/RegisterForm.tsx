"use client";

import { useState } from "react";
import { useRegisterBusiness } from "../hooks";

export function RegisterForm() {
  const registerMutation = useRegisterBusiness();

  const [form, setForm] = useState({
    business_username: "",
    business_name: "",
    business_type: "CLIENT",
    contact_person: "",
    contact_email: "",
    contact_phone: "",
    country: "",
    password: "",
  });

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    registerMutation.mutate(form);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 p-6 border rounded-xl max-w-md mx-auto mt-20">
      <h2 className="text-3xl font-bold text-center text-black">Create an Account</h2>

      {Object.keys(form).map((key) => {
        if (key === "business_type") return null;
        return (
          <div key={key} className="space-y-2">
            <label className="text-black font-medium capitalize">{key.replace("_", " ")}</label>
            <input
              className="w-full p-3 border rounded-md"
              value={(form as any)[key]}
              onChange={(e) => update(key, e.target.value)}
            />
          </div>
        );
      })}

      <button className="btn-primary w-full">Create Account</button>

      {registerMutation.isError && (
        <p className="text-red-600 text-center">Registration failed</p>
      )}
    </form>
  );
}
