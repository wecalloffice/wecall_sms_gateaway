"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";

import { SenderIdsHeader } from "@/components/sender-ids/SenderIdsHeader";
import { SenderIdsStats } from "@/components/sender-ids/SenderIdsStats";
import { SenderIdsTable } from "@/components/sender-ids/SenderIdsTable";
import { SenderIdsGuidelines } from "@/components/sender-ids/SenderIdsGuidelines";

export default function ClientSenderIdsPage() {
  const [senderIds, setSenderIds] = useState([
    { id: 1, name: 'RDB', status: 'approved', submittedDate: '2024-01-10', approvedDate: '2024-01-12' },
    { id: 2, name: 'INFO', status: 'approved', submittedDate: '2024-01-15', approvedDate: '2024-01-16' },
    { id: 3, name: 'ALERT', status: 'pending', submittedDate: '2024-01-20', approvedDate: null },
  ]);

  return (
    <MainLayout role="CLIENT_ADMIN" businessName="RDB" userName="RDB User">
      <div className="space-y-6">
        <SenderIdsHeader />
        <SenderIdsStats senderIds={senderIds} />
        <SenderIdsTable senderIds={senderIds} setSenderIds={setSenderIds} />
        <SenderIdsGuidelines />
      </div>
    </MainLayout>
  );
}
