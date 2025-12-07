"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { mockSms } from "@/mocks/adapters/mockSms";

import { SmsStats } from "@/components/sms/SmsStats";
import { SmsFilters } from "@/components/sms/SmsFilters";
import { SmsLogsTable } from "@/components/sms/SmsLogsTable";

export default function ClientSmsLogsPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await mockSms.list({ business_sid: "AC_CLIENT_001" });
        setMessages(data);
        setFilteredMessages(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching SMS logs:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = messages;

    if (statusFilter !== "all") {
      filtered = filtered.filter((m: any) => m.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter((m: any) =>
        m.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMessages(filtered);
  }, [searchTerm, statusFilter, messages]);

  return (
    <MainLayout role="CLIENT_ADMIN" businessName="RDB" userName="RDB User">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">SMS Logs</h1>
            <p className="text-gray-600 mt-1">View and track all sent messages</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            Export CSV
          </button>
        </div>

        <SmsFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        <SmsStats messages={filteredMessages} />

        <SmsLogsTable messages={filteredMessages} loading={loading} />
      </div>
    </MainLayout>
  );
}
