"use client";

import { Lock } from "lucide-react";

export function SecurityPanel() {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Lock size={20} />
        Security
      </h3>
      <button className="w-full btn-secondary mb-2">Change Password</button>
      <button className="w-full btn-secondary">Enable 2FA</button>
    </div>
  );
}
