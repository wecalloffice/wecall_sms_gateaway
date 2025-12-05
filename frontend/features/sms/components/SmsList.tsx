"use client";
import { useSmsLogs } from "../hooks";
import { SmsMessage } from "../types";

export default function SmsList() {
  const { data: messages, isLoading } = useSmsLogs();

  if (isLoading) return <p>Loading SMS logs...</p>;

  return (
    <table className="table-auto w-full border">
      <thead>
        <tr>
          <th className="px-4 py-2">To</th>
          <th className="px-4 py-2">From</th>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Time</th>
          <th className="px-4 py-2">Gateway</th>
          <th className="px-4 py-2">Price</th>
        </tr>
      </thead>
      <tbody>
        {messages?.map((msg: SmsMessage) => (
          <tr key={msg.sid} className="border-t">
            <td className="px-4 py-2">{msg.to}</td>
            <td className="px-4 py-2">{msg.from}</td>
            <td className="px-4 py-2">
              <span className={`px-2 py-1 rounded text-xs ${
                msg.status === 'delivered' ? 'bg-green-100 text-green-800' :
                msg.status === 'failed' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {msg.status}
              </span>
            </td>
            <td className="px-4 py-2">{new Date(msg.delivered_at || msg.created_at).toLocaleString()}</td>
            <td className="px-4 py-2">{msg.gateway}</td>
            <td className="px-4 py-2">${msg.price?.toFixed(3)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
