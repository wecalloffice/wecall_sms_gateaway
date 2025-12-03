"use client";

import { useState } from "react";
import { useLogin } from "../hooks";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [business_username, setBusinessUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useLogin();
  const router = useRouter();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    loginMutation.mutate({ business_username, email, password });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 p-6 border rounded-xl max-w-md mx-auto mt-20">
      <h2 className="text-3xl font-bold text-center text-black">Sign In</h2>

      <div className="space-y-2">
        <label className="text-black font-medium">Business Username</label>
        <input
          className="w-full p-3 border rounded-md"
          placeholder="kcb / rdb / etc"
          value={business_username}
          onChange={(e) => setBusinessUsername(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-black font-medium">Email</label>
        <input
          className="w-full p-3 border rounded-md"
          placeholder="you@business.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-black font-medium">Password</label>
        <input
          type="password"
          className="w-full p-3 border rounded-md"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="flex justify-between items-center">
        <button type="submit" className="btn-primary w-full">Login</button>
      </div>

      <div className="text-center mt-2">
        <button
          type="button"
          className="text-sm text-blue-600 hover:underline"
          onClick={() => router.push("/forgot-password")}
        >
          Forgot Password?
        </button>
      </div>

      {loginMutation.isError && (
        <p className="text-red-600 text-center mt-2">Invalid login credentials</p>
      )}
    </form>
  );
}
