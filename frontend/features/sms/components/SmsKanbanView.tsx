"use client";

import SmsCard from "./SmsCard";
import { SmsMessage } from "../types";

const columns = ["pending", "sent", "failed", "delivered"] as const;

export default function SmsKanbanView({ data }: { data: SmsMessage[] }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {columns.map((col) => (
        <div key={col} className="bg-gray-50 p-4 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold capitalize mb-3">{col}</h3>

          <div className="space-y-3">
            {data
              .filter((sms) => sms.status === col)
              .map((sms) => (
                <SmsCard key={sms.sid} sms={sms} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
