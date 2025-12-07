"use client";

import React from "react";
import DashboardHeader from "@/components/DashboardHeader";
import MetricBlock from "@/components/MetricBlock";
import MessageFeed from "@/components/MessageFeed";
import ActionPanel from "@/components/ActionPanel";

import { Users, MessageSquare, Inbox } from "lucide-react";

export default function UserDashboardScreen() {
  const mockMessages = [
    { id: "1", sender: "John", message: "Hello!", timestamp: "1 hr ago" },
    { id: "2", sender: "Maria", message: "Update sent.", timestamp: "3 hrs ago" },
  ];

  return (
    <>
      <DashboardHeader
        title="User Dashboard"
        subtitle="Overview of your SMS activity"
      />

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <MetricBlock icon={Users} title="Contacts" value="1,240" trend={5} />
        <MetricBlock icon={MessageSquare} title="Sent SMS" value="12,430" trend={12} />
        <MetricBlock icon={Inbox} title="Incoming" value="940" trend={-3} />
      </div>

      {/* Quick Actions */}
      <ActionPanel />

      {/* Recent Messages */}
      <div className="mt-6">
        <MessageFeed messages={mockMessages} />
      </div>
    </>
  );
}
