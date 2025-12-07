"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface Props {
  profile: any;
}

export function AccountIDCard({ profile }: Props) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Account ID</h3>
      <div className="bg-gray-50 p-3 rounded flex items-center justify-between gap-2">
        <code className="text-xs font-mono text-gray-600">{profile.sid}</code>
        <button
          onClick={() => copyToClipboard(profile.sid, "sid")}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
        >
          {copiedField === "sid" ? <Check size={16} className="text-green-600" /> : <Copy size={16} className="text-gray-400" />}
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">Use this ID for API integration</p>
    </div>
  );
}
