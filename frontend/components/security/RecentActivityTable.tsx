"use client";

export function RecentActivityTable() {
  const data = [
    { action: "Login", ip: "192.168.1.100", timestamp: "2024-01-20 10:30:00", status: "Success" },
    { action: "API Key Generated", ip: "192.168.1.100", timestamp: "2024-01-19 15:20:00", status: "Success" },
  ];

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Security Activity</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Action", "IP Address", "Timestamp", "Status"].map((head) => (
                <th key={head} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.action}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{row.ip}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{row.timestamp}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 text-xs rounded-full ${row.status === "Success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
