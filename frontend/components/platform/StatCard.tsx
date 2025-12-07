'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: number;
  color?: string;
}

export function StatCard({ title, value, unit, icon, trend, color = 'text-blue-600' }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        {icon && <div className={color}>{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
          {unit && <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>}
        </div>
        {trend && (
          <div className={`flex items-center text-xs mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
