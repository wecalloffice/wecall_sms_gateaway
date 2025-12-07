"use client";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

type Role = "PLATFORM" | "RESELLER" | "CLIENT";

export default function MainLayout({
  children,
  role = "CLIENT",
}: {
  children: React.ReactNode;
  role?: Role;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar role={role} />

      <div className="flex flex-col flex-1">
        <Topbar />
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
