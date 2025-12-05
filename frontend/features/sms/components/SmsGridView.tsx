import SmsCard from "./SmsCard";
import { SmsMessage } from "../types";

export default function SmsGridView({ data }: { data: SmsMessage[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {data.map((sms) => (
        <SmsCard key={sms.sid} sms={sms} />
      ))}
    </div>
  );
}
