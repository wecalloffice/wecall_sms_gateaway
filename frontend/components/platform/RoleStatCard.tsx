'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';

interface RoleStatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
  unit?: string;
  change?: string;
  role: 'CLIENT' | 'RESELLER' | 'PLATFORM';
}

/**
 * Stat card that adapts styling based on user role
 */
export function RoleStatCard({
  title,
  value,
  icon,
  color,
  unit,
  change,
  role,
}: RoleStatCardProps) {
  const roleStyles = {
    CLIENT: 'bg-blue-50 border-blue-200',
    RESELLER: 'bg-purple-50 border-purple-200',
    PLATFORM: 'bg-gray-50 border-gray-200',
  };

  return (
    <Card className={`${roleStyles[role]} border-2`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          <span>{title}</span>
          <span className={color}>{icon}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {unit && <p className="text-xs text-gray-500">{unit}</p>}
        {change && <p className="text-xs text-green-600 mt-1">↑ {change}</p>}
      </CardContent>
    </Card>
  );
}
