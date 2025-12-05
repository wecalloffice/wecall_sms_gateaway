"use client";

import { useEffect, useState } from "react";
import { mockSms } from "@/mocks/adapters/mockSms";
import { DlrHeader } from "@/components/dlr/DlrHeader";
import { DlrSearchFilter } from "@/components/dlr/DlrSearchFilter";
import { DlrStats } from "@/components/dlr/DlrStats";
import { DlrTable } from "@/components/dlr/DlrTable";

export function ResellerDlrPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [stats, setStats] = useState({
    total: 0,
    delivered: 0,
    failed: 0,
    queued: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await mockSms.list({ business_sid: "AC_RESELLER_1001" });

      setMessages(data);
      setFilteredMessages(data);

      setStats({
        total: data.length,
        delivered: data.filter((m: any) => m.status === "delivered").length,
        failed: data.filter((m: any) => m.status === "failed").length,
        queued: data.filter((m: any) => ["queued", "sent"].includes(m.status)).length,
      });

      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = messages;

    if (statusFilter !== "all")
      filtered = filtered.filter((m: any) => m.status === statusFilter);

    if (searchTerm)
      filtered = filtered.filter((m: any) =>
        `${m.to}${m.from}${m.sid}`.toLowerCase().includes(searchTerm.toLowerCase())
      );

    setFilteredMessages(filtered);
  }, [searchTerm, statusFilter, messages]);

  return (
    <div className="space-y-6">
      <DlrHeader />

      <DlrSearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <DlrStats stats={stats} />

      <DlrTable loading={loading} filteredMessages={filteredMessages} />
    </div>
  );
}
