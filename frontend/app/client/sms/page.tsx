"use client";

import { useState } from "react";
import SendSmsForm from "@/features/sms/components/SendSmsForm";
import SmsList from "@/features/sms/components/SmsList";
import AccountBalanceCard from "@/components/ui/AccountBalanceCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Send } from "lucide-react";

export default function SmsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SMS Management</h1>
        <p className="text-gray-600">Send and manage your SMS messages</p>
      </div>

      {/* Account Balance - Full Width on Mobile, Right Side on Desktop */}
      <div className="w-full lg:max-w-md lg:ml-auto">
        <AccountBalanceCard />
      </div>

      <Tabs defaultValue="send" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="send" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Send SMS
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            SMS History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <SendSmsForm />
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <SmsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
