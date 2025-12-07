"use client";

import { TableHead, TableCell } from "./ui/table";

export default function LogsTable({ logs, filteredLogs, loading, getBadgeClasses }: any) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-gray-200 dark:border-slate-700 transition-colors">
      <div className="p-6 border-b border-gray-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">System Events</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600 transition-colors">
            <tr>
              <TableHead>Timestamp</TableHead>
              <TableHead>Event Type</TableHead>
              <TableHead>User</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Details</TableHead>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No logs found
                </td>
              </tr>
            ) : (
              filteredLogs.map((log: any) => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <TableCell>{log.timestamp ? new Date(log.timestamp).toLocaleString() : '—'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${getBadgeClasses(log.event_type)}`}>
                      {log.event_type?.replace(/_/g, ' ') ?? 'Unknown'}
                    </span>
                  </TableCell>
                  <TableCell>{log.user_sid || 'System'}</TableCell>
                  <TableCell>{log.ip_address || '—'}</TableCell>
                  <TableCell>{log.event_data ? JSON.stringify(log.event_data).slice(0, 50) + '...' : '—'}</TableCell>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
