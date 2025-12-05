import { SmsMessage } from "../types";

export default function SmsListView({ data }: { data: SmsMessage[] }) {
  return (
    <table className="w-full border-collapse bg-white shadow rounded-xl overflow-hidden dark:bg-slate-800">
      <thead className="bg-gray-100 text-left text-sm dark:bg-slate-700">
        <tr>
          <th className="p-3 dark:text-gray-300">To</th>
          <th className="p-3 dark:text-gray-300">From</th>
          <th className="p-3 dark:text-gray-300">Status</th>
          <th className="p-3 dark:text-gray-300">Gateway</th>
          <th className="p-3 dark:text-gray-300">Price</th>
        </tr>
      </thead>

      <tbody>
        {data.map((sms) => (
          <tr key={sms.sid} className="border-t hover:bg-gray-50 dark:hover:bg-slate-700 dark:text-gray-300">
            <td className="p-3">{sms.to}</td>
            <td className="p-3 max-w-xs line-clamp-1">{sms.from}</td>
            <td className="p-3 capitalize">{sms.status}</td>
            <td className="p-3">{sms.gateway || 'N/A'}</td>
            <td className="p-3">{sms.price || 0} {sms.currency || 'RWF'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
