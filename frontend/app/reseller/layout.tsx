"use client";

import MainLayout from "@/components/ui/layout/MainLayout";

export default function ResellerLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout role="RESELLER">{children}</MainLayout>;
}
