"use client";

interface Sender {
  id: number;
  name: string;
  status: string;
  submittedDate: string;
  approvedDate: string | null;
}

interface Props {
  senderIds: Sender[];
  setSenderIds: (s: Sender[]) => void;
}

export function SenderIdsTable({ senderIds, setSenderIds }: Props) {
  const handleCancel = (id: number) => {
    setSenderIds(senderIds.filter(s => s.id !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Sender ID List</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Sender ID", "Status", "Submitted Date", "Approved Date", "Actions"].map(head => (
                <th key={head} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {senderIds.map(sender => (
              <tr key={sender.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{sender.name}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    sender.status === "approved" ? "bg-green-100 text-green-800" :
                    sender.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {sender.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{sender.submittedDate}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{sender.approvedDate || "-"}</td>
                <td className="px-6 py-4 text-sm">
                  {sender.status === "approved" ? (
                    <button className="text-gray-600 hover:text-gray-800">View</button>
                  ) : (
                    <button onClick={() => handleCancel(sender.id)} className="text-red-600 hover:text-red-800">Cancel Request</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
