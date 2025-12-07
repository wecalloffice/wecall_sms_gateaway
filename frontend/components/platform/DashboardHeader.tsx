'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  onAddClick?: () => void;
  showAddButton?: boolean;
}

export function DashboardHeader({
  title,
  subtitle,
  onAddClick,
  showAddButton = false,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {showAddButton && (
        <Button onClick={onAddClick} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New
        </Button>
      )}
    </div>
  );
}
