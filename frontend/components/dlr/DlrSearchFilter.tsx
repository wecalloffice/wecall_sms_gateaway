"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function DlrSearchFilter({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}: any) {
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex gap-3 flex-col md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <Input
          placeholder="Search by phone, sender, or message ID..."
          value={searchTerm}
          onChange={(e: any) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="input-field"
      >
        <option value="all">All Status</option>
        <option value="delivered">Delivered</option>
        <option value="sent">Sent</option>
        <option value="queued">Queued</option>
        <option value="failed">Failed</option>
      </select>
    </div>
  );
}
