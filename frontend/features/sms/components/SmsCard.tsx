import { SmsMessage } from "../types";

export default function SmsCard({ sms }: { sms: SmsMessage }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition dark:bg-slate-800 dark:text-gray-100">
      <div className="text-sm text-gray-500 dark:text-gray-400">{sms.to}</div>
      <p className="font-semibold mt-1 line-clamp-2 text-gray-800 dark:text-gray-200">From: {sms.from}</p>

      <div className="flex justify-between items-center mt-4 text-xs text-gray-500 dark:text-gray-400">
        <span className="capitalize">{sms.status}</span>
        <span>{sms.price || 0} {sms.currency || 'RWF'}</span>
      </div>
    </div>
  );
}
