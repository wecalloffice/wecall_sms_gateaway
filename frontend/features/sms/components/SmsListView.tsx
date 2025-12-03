import { SmsMessage } from "../types";

export default function SmsListView({ data }: { data: SmsMessage[] }) {
  return (
    <table className="w-full border-collapse bg-white shadow rounded-xl overflow-hidden">
      <thead className="bg-gray-100 text-left text-sm">
        <tr>
          <th className="p-3">To</th>
          <th className="p-3">Message</th>
          <th className="p-3">Status</th>
          <th className="p-3">Gateway</th>
          <th className="p-3">Price</th>
        </tr>
      </thead>

      <tbody>
        {data.map((sms) => (
          <tr key={sms.id} className="border-t hover:bg-gray-50">
            <td className="p-3">{sms.to}</td>
            <td className="p-3 max-w-xs line-clamp-1">{sms.message}</td>
            <td className="p-3 capitalize">{sms.status}</td>
            <td className="p-3">{sms.gateway}</td>
            <td className="p-3">{sms.price} RWF</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
