'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import {
  LayoutDashboard,
  Building2,
  Users,
  Route,
  Wallet,
  FileText,
  MessageSquare,
  BarChart3,
  Palette,
} from 'lucide-react';

interface SidebarProps {
  role?: 'PLATFORM_ADMIN' | 'RESELLER_ADMIN' | 'CLIENT_ADMIN' | 'RESELLER' | 'CLIENT';
  onClose?: () => void;
}

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export default function Sidebar({ role = 'RESELLER_ADMIN', onClose }: SidebarProps) {
  const pathname = usePathname();

  // Define menu items based on role
  const getMenuItems = (): MenuItem[] => {
    switch (role) {
      case 'PLATFORM_ADMIN':
        return [
          {
            label: 'Dashboard',
            href: '/platform/dashboard',
            icon: <LayoutDashboard size={20} />,
          },
          {
            label: 'User Management',
            href: '/platform/users',
            icon: <Users size={20} />,
          },
          {
            label: 'Resellers',
            href: '/platform/resellers',
            icon: <Building2 size={20} />,
          },
          {
            label: 'Clients',
            href: '/platform/clients',
            icon: <Users size={20} />,
          },
          {
            label: 'Billing & Wallet',
            href: '/platform/billing',
            icon: <Wallet size={20} />,
          },
          {
            label: 'SMS & Traffic',
            href: '/platform/sms',
            icon: <MessageSquare size={20} />,
          },
          {
            label: 'API & Developer',
            href: '/platform/api',
            icon: <FileText size={20} />,
          },
          {
            label: 'Routing & Gateways',
            href: '/platform/routing',
            icon: <Route size={20} />,
          },
          {
            label: 'DLR & Logs',
            href: '/platform/dlr',
            icon: <FileText size={20} />,
          },
          {
            label: 'System Logs',
            href: '/platform/logs',
            icon: <FileText size={20} />,
          },
          {
            label: 'Security',
            href: '/platform/security',
            icon: <FileText size={20} />,
          },
          {
            label: 'Settings',
            href: '/platform/settings',
            icon: <FileText size={20} />,
          },
        ];

      case 'RESELLER_ADMIN':
        return [
          {
            label: 'Dashboard',
            href: '/reseller/dashboard',
            icon: <LayoutDashboard size={20} />,
          },
          {
            label: 'Clients',
            href: '/reseller/clients',
            icon: <Users size={20} />,
          },
          {
            label: 'Wallet & Billing',
            href: '/reseller/wallet',
            icon: <Wallet size={20} />,
          },
          {
            label: 'SMS & Campaigns',
            href: '/reseller/sms',
            icon: <MessageSquare size={20} />,
          },
          {
            label: 'Routing',
            href: '/reseller/routing',
            icon: <Route size={20} />,
          },
          {
            label: 'DLR & Logs',
            href: '/reseller/dlr',
            icon: <FileText size={20} />,
          },
          {
            label: 'Contacts',
            href: '/reseller/contacts',
            icon: <Users size={20} />,
          },
          {
            label: 'Brand Management',
            href: '/reseller/branding',
            icon: <Palette size={20} />,
          },
          {
            label: 'Security',
            href: '/reseller/security',
            icon: <FileText size={20} />,
          },
          {
            label: 'Settings',
            href: '/reseller/settings',
            icon: <FileText size={20} />,
          },
        ];

      case 'CLIENT_ADMIN':
        return [
          {
            label: 'Dashboard',
            href: '/client/dashboard',
            icon: <LayoutDashboard size={20} />,
          },
          {
            label: 'SMS',
            href: '/client/sms',
            icon: <MessageSquare size={20} />,
          },
          {
            label: 'SMS Logs',
            href: '/client/sms/logs',
            icon: <FileText size={20} />,
          },
          {
            label: 'Contacts',
            href: '/client/contacts',
            icon: <Users size={20} />,
          },
          {
            label: 'Sender IDs',
            href: '/client/sender-ids',
            icon: <FileText size={20} />,
          },
          {
            label: 'Wallet & Billing',
            href: '/client/wallet',
            icon: <Wallet size={20} />,
          },
          {
            label: 'API & Integrations',
            href: '/client/api',
            icon: <FileText size={20} />,
          },
          {
            label: 'Security',
            href: '/client/security',
            icon: <FileText size={20} />,
          },
          {
            label: 'Settings',
            href: '/client/settings',
            icon: <FileText size={20} />,
          },
        ];

      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen relative">
      {/* Close button for mobile */}
      {onClose && (
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg z-50"
        >
          <X size={24} />
        </button>
      )}

      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
          WeCall SMS
        </h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'nav-link-active bg-primary-light bg-opacity-10'
                  : 'nav-link hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
        <p>© 2025 WeCall SMS</p>
      </div>
    </aside>
  );
}
