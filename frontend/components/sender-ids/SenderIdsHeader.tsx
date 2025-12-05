"use client";

import { Plus } from "lucide-react";

export function SenderIdsHeader() {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Sender IDs</h1>
        <p className="text-gray-600 mt-1">Manage your SMS sender identities</p>
      </div>
      <button className="btn-primary flex items-center gap-2">
        <Plus size={20} />
        Request Sender ID
      </button>
    </div>
  );
}
