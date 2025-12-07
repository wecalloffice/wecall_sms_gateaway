"use client";

import MainLayout from "@/components/ui/layout/MainLayout";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
