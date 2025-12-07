"use client";

import MainLayout from "@/components/ui/layout/MainLayout";

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout role="PLATFORM">{children}</MainLayout>;
}
