"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function QuickActions() {
  const router = useRouter();

  const actions = [
    { label: "Send SMS", url: "/client/sms" },
    { label: "View SMS Logs", url: "/client/sms-logs" },
    { label: "Top Up Account", url: "/client/wallet" },
    { label: "Manage Staff", url: "/client/settings" },
  ];

  return (
    <div className="bg-white rounded-lg p-6 border shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

      <div className="space-y-2">
        {actions.map((action) => (
          <Button
            key={action.url}
            className="w-full justify-start py-3"
            onClick={() => router.push(action.url)}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
