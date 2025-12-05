"use client";

import { CheckCircle, XCircle, Clock } from "lucide-react";

export function DlrTable({ loading, filteredMessages }: any) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered": return <CheckCircle size={16} className="text-green-600" />;
      case "failed": return <XCircle size={16} className="text-red-600" />;
      case "queued":
      case "sent": return <Clock size={16} className="text-yellow-600" />;
      default: return null;
    }
  };

  const getBadge = (status: string) => {
    const map: any = {
      delivered: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      queued: "bg-yellow-100 text-yellow-800",
      sent: "bg-blue-100 text-blue-800",
    };
    return map[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 mt-6">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Delivery Status ({filteredMessages.length})
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Date</th>
              <th className="px-6 py-3">To</th>
              <th className="px-6 py-3">From</th>
              <th className="px-6 py-3">Message</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Parts</th>
              <th className="px-6 py-3">Message ID</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  Loading delivery reports...
                </td>
              </tr>
            ) : filteredMessages.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No reports found
                </td>
              </tr>
            ) : (
              filteredMessages.map((msg: any) => (
                <tr key={msg.sid} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(msg.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">{msg.to}</td>
                  <td className="px-6 py-4">{msg.from}</td>
                  <td className="px-6 py-4 max-w-xs truncate">{msg.message}</td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(msg.status)}
                      <span className={`px-2 py-1 text-xs rounded ${getBadge(msg.status)}`}>
                        {msg.status}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">{msg.sms_parts}</td>

                  <td className="px-6 py-4 text-xs font-mono truncate" title={msg.sid}>
                    {msg.sid.substring(0, 12)}...
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
