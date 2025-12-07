'use client';

import { ReactNode } from 'react';

interface RoleBasedLayoutProps {
  title: string;
  subtitle: string;
  role: 'CLIENT' | 'RESELLER' | 'PLATFORM';
  children?: ReactNode;
  topSection?: ReactNode;
  bottomSection?: ReactNode;
}

/**
 * Role-based layout wrapper
 * Maintains consistent structure across all roles while supporting different features
 */
export function RoleBasedLayout({
  title,
  subtitle,
  role,
  children,
  topSection,
  bottomSection,
}: RoleBasedLayoutProps) {
  return (
    <div className="space-y-6">
      {/* Header - consistent across all roles */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-1">{subtitle}</p>
        <span className="inline-block text-xs font-semibold px-2 py-1 mt-2 bg-blue-100 text-blue-700 rounded">
          {role === 'CLIENT' ? 'Client' : role === 'RESELLER' ? 'Reseller' : 'Platform Admin'}
        </span>
      </div>

      {/* Top section - optional feature cards */}
      {topSection && <div>{topSection}</div>}

      {/* Main content - role-specific */}
      <div>{children}</div>

      {/* Bottom section - optional additional info */}
      {bottomSection && <div className="border-t pt-6">{bottomSection}</div>}
    </div>
  );
}
