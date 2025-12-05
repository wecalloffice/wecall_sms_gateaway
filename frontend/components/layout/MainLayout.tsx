'use client';

import React, { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface MainLayoutProps {
  children: ReactNode;
  role?: 'PLATFORM_ADMIN' | 'RESELLER_ADMIN' | 'CLIENT_ADMIN' | 'RESELLER' | 'CLIENT';
  businessName?: string;
  userName?: string;
}

export default function MainLayout({
  children,
  role = 'RESELLER_ADMIN',
  businessName = 'WeCall SMS',
  userName = 'User',
}: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - hidden on mobile by default, visible on desktop */}
      <div className="hidden md:block sticky top-0 h-screen z-40">
        <Sidebar role={role} />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden w-full">
        {/* Topbar */}
        <Topbar businessName={businessName} userName={userName} role={role} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar - shown only on mobile when toggled */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30">
          <div className="absolute left-0 top-0 h-screen z-40">
            <Sidebar role={role} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
