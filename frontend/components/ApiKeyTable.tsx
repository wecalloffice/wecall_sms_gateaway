"use client";

import { Copy } from "lucide-react";

export default function ApiKeyTable({ apiKeys }: { apiKeys: any[] }) {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">API Keys</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">API Key</th>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Created</th>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Last Used</th>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {apiKeys.map((key) => (
              <tr key={key.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{key.name}</td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-100 px-2 py-1 rounded">{key.key}</code>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Copy size={16} />
                    </button>
                  </div>
                </td>

                <td className="px-6 py-4">{key.created}</td>
                <td className="px-6 py-4">{key.lastUsed}</td>

                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    {key.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <button className="text-red-600 hover:text-red-800">Revoke</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
