"use client";

export default function RoutingTable({ routes }: { routes: any[] }) {
  const successBadge = (rate: number) =>
    rate >= 98 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Routing Rules</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Name", "Prefix", "Gateway", "Priority", "Success Rate", "Status", "Actions"]
                .map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {h}
                  </th>
                ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {routes.map((route) => (
              <tr key={route.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{route.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{route.prefix}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{route.gateway}</td>
                <td className="px-6 py-4 text-sm">{route.priority}</td>

                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${successBadge(route.successRate)}`}>
                    {route.successRate}%
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    {route.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm">
                  <button className="text-primary hover:underline mr-3">Edit</button>
                  <button className="text-red-600 hover:underline">Disable</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
