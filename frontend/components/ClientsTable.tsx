"use client";

import { Edit, Trash2 } from "lucide-react";

interface ClientsTableProps {
  loading: boolean;
  clients: any[];
  onEdit: (client: any) => void;
  onDelete: (sid: string, name: string) => void;
}

export default function ClientsTable({ loading, clients, onEdit, onDelete }: ClientsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Client List ({clients.length})
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Client Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">Loading...</td>
              </tr>
            ) : clients.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">No clients found</td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr key={client.account_sid} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{client.name}</td>
                  <td className="px-6 py-4">{client.business_username}</td>
                  <td className="px-6 py-4">{client.email || "-"}</td>
                  <td className="px-6 py-4">-</td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        client.status === "active"
                          ? "bg-green-100 text-green-800"
                          : client.status === "suspended"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {client.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => onEdit(client)}
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      <Edit size={16} /> Edit
                    </button>

                    <button
                      onClick={() => onDelete(client.account_sid, client.name)}
                      className="text-red-600 hover:underline flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
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
