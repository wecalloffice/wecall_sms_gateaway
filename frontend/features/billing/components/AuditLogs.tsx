"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

interface AuditLog {
  id: string;
  action: string;
  businessId: string;
  actor?: string;
  details: Record<string, any>;
  createdAt: string;
}

interface AuditLogsProps {
  businessId?: string;
}

const ACTION_COLORS: Record<string, string> = {
  WALLET_CREATED: "bg-blue-100 text-blue-800",
  TOP_UP: "bg-green-100 text-green-800",
  SMS_DEBIT: "bg-red-100 text-red-800",
  PRICING_UPDATED: "bg-purple-100 text-purple-800",
  WALLET_ADJUSTED: "bg-yellow-100 text-yellow-800",
};

export default function AuditLogs({ businessId }: AuditLogsProps) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState<string>("ALL");

  useEffect(() => {
    async function loadLogs() {
      try {
        const url = new URL("/api/billing/audit", window.location.origin);
        if (businessId) url.searchParams.set("businessId", businessId);
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to load audit logs");
        const data = await res.json();
        setLogs(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, [businessId]);

  const filteredLogs = actionFilter === "ALL" ? logs : logs.filter((l) => l.action === actionFilter);

  const uniqueActions = Array.from(new Set(logs.map((l) => l.action)));

  if (loading) return <p className="text-gray-600">Loading audit logs...</p>;

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Audit Log</h2>

      {/* Action Filter */}
      <div className="mb-6 flex gap-2">
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="border rounded px-3 py-1 text-sm"
        >
          <option value="ALL">All Actions</option>
          {uniqueActions.map((action) => (
            <option key={action} value={action}>
              {action}
            </option>
          ))}
        </select>
      </div>

      {/* Logs List */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <p className="text-center text-gray-500 py-6">No audit logs found</p>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="border rounded p-4 hover:bg-gray-50 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        ACTION_COLORS[log.action] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {log.action}
                    </span>
                    {log.actor && (
                      <span className="text-xs text-gray-600">by {log.actor}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                  {Object.keys(log.details).length > 0 && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-blue-600 hover:underline">
                        Details
                      </summary>
                      <pre className="mt-2 bg-gray-100 p-2 rounded overflow-auto text-xs">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t text-xs text-gray-600">
        <p>Showing {filteredLogs.length} of {logs.length} audit logs</p>
      </div>
    </Card>
  );
}
