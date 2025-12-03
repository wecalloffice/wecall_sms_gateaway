import { SmsMessage } from "../types";

export default function SmsCard({ sms }: { sms: SmsMessage }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
      <div className="text-sm text-gray-500">{sms.to}</div>
      <p className="font-semibold mt-1 line-clamp-2">{sms.message}</p>

      <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
        <span className="capitalize">{sms.status}</span>
        <span>{sms.price} RWF</span>
      </div>
    </div>
  );
}
