"use client";

import { useState } from "react";
import { Key, Shield, RefreshCw } from "lucide-react";
import StatCard from "@/components/StatCard";
import DashboardHeader from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import ApiKeyTable from "@/components/ApiKeyTable";
import ApiDocSection from "@/components/ApiDocSection";

export default function ApiPageContent() {
  const [apiKeys] = useState([
    {
      id: "ak_1",
      name: "Production Key",
      key: "wc_prod_abc123***********",
      created: "2024-01-15",
      lastUsed: "2024-01-20",
      status: "active",
    },
    {
      id: "ak_2",
      name: "Development Key",
      key: "wc_dev_xyz789***********",
      created: "2024-01-10",
      lastUsed: "2024-01-19",
      status: "active",
    },
  ]);

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="API & Integrations"
        subtitle="Manage API keys and webhooks"
        action={
          <Button>
            <Key size={20} />
            Generate New Key
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<Key />} label="Active API Keys" value={apiKeys.length} />
        <StatCard icon={<RefreshCw />} label="API Requests Today" value="15,420" />
        <StatCard icon={<Shield />} label="Webhook Endpoints" value="3" />
      </div>

      <ApiKeyTable apiKeys={apiKeys} />
      <ApiDocSection />
    </div>
  );
}
