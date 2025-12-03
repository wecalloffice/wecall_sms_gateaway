"use client";

import MainLayout from "@/components/ui/layout/MainLayout";
import SendSmsForm from "@/features/sms/components/SendSmsForm";
import SmsList from "@/features/sms/components/SmsList";

export default function SmsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">SMS Management</h1>
        
        {/* Send SMS Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Send SMS</h2>
          <SendSmsForm />
        </div>

        {/* SMS History */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">SMS History</h2>
          <SmsList />
        </div>
      </div>
    </MainLayout>
  );
}
