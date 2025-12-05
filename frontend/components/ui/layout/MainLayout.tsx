"use client";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar role="admin" />

      <div className="flex flex-col flex-1">
        <Topbar />
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
