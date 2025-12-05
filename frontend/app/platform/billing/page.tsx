"use client";

import { useState } from "react";
import MainLayout from "@/components/ui/layout/MainLayout";
import { ClientBillingDashboard, AdminBillingDashboard, ResellerBillingDashboard } from "@/features/billing";
import { Card } from "@/components/ui/card";

type UserRole = "client" | "reseller" | "admin";

export default function PlatformBillingPage() {
  const [userRole, setUserRole] = useState<UserRole>("client");
  const businessSid = "AC_CLIENT_2001"; // Mock business SID

  return (
    <MainLayout>
      {/* Role Selector */}
      <Card className="mb-6 p-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">Switch View</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "client" as const, label: "Client Dashboard", icon: "👤" },
              { id: "reseller" as const, label: "Reseller Dashboard", icon: "🏪" },
              { id: "admin" as const, label: "Admin Dashboard", icon: "⚙️" },
            ].map((role) => (
              <button
                key={role.id}
                onClick={() => setUserRole(role.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
                  userRole === role.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>{role.icon}</span>
                {role.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Dashboard Content */}
      <div className="space-y-6">
        {userRole === "client" && <ClientBillingDashboard businessSid={businessSid} />}
        {userRole === "reseller" && <ResellerBillingDashboard businessSid={businessSid} />}
        {userRole === "admin" && <AdminBillingDashboard businessSid={businessSid} />}
      </div>
    </MainLayout>
  );
}
