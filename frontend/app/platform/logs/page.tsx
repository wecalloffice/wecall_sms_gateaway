"use client";

import MainLayout from "@/components/layout/MainLayout";
import LogsPageContent from "@/features/logs/LogsPageContent";

export default function LogsPage() {
  return (
    <MainLayout role="PLATFORM_ADMIN" businessName="WeCall Platform" userName="Admin User">
      <LogsPageContent />
    </MainLayout>
  );
}
