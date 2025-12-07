'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, Settings, BarChart3 } from 'lucide-react';

const actions = [
  { icon: Users, label: 'Manage Clients', href: '/platform/clients' },
  { icon: FileText, label: 'View Reports', href: '/platform/reports' },
  { icon: Settings, label: 'Routing Config', href: '/platform/routing' },
  { icon: BarChart3, label: 'Analytics', href: '/platform/analytics' },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-3"
              asChild
            >
              <a href={action.href}>
                <action.icon className="w-4 h-4" />
                <span className="text-xs">{action.label}</span>
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
