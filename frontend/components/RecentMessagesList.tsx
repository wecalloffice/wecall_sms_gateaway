"use client";

export default function RecentMessagesList({
  messages,
}: {
  messages: any[];
}) {
  return (
    <div className="bg-white rounded-lg p-6 border shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Recent Messages</h2>

      <div className="space-y-3">
        {messages.length > 0 ? (
          messages.map((msg, i) => (
            <div
              key={msg.sid || i}
              className="p-4 bg-gray-50 rounded-lg border flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-medium">{msg.to || "N/A"}</p>
                <p className="text-xs text-gray-500">
                  {msg.created_at
                    ? new Date(msg.created_at).toLocaleString()
                    : "N/A"}
                </p>
              </div>

              <span
                className={`px-3 py-1 text-xs rounded-full font-medium
                    ${
                      msg.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : msg.status === "pending" || msg.status === "queued"
                        ? "bg-yellow-100 text-yellow-800"
                        : msg.status === "failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
              >
                {msg.status}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No recent messages</p>
        )}
      </div>
    </div>
  );
}
