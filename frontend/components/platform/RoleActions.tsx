'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RoleAction {
  label: string;
  href: string;
  icon?: string;
}

interface RoleActionsProps {
  role: 'CLIENT' | 'RESELLER' | 'PLATFORM';
}

/**
 * Role-based quick actions
 * CLIENT: Basic SMS, Contacts, Wallet
 * RESELLER: Clients, Reports, Routing, Billing, Branding
 * PLATFORM: All administrative functions
 */
export function RoleActions({ role }: RoleActionsProps) {
  const actions: Record<string, RoleAction[]> = {
    CLIENT: [
      { label: 'Send SMS', href: '/client/sms' },
      { label: 'View Contacts', href: '/client/contacts' },
      { label: 'Wallet', href: '/client/wallet' },
      { label: 'Security', href: '/client/security' },
    ],
    RESELLER: [
      { label: 'Manage Clients', href: '/reseller/clients' },
      { label: 'View Reports', href: '/reseller/billing' },
      { label: 'SMS Routing', href: '/reseller/routing' },
      { label: 'Branding', href: '/reseller/branding' },
      { label: 'Contacts', href: '/reseller/contacts' },
      { label: 'Settings', href: '/reseller/settings' },
    ],
    PLATFORM: [
      { label: 'All Users', href: '/platform/users' },
      { label: 'Resellers', href: '/platform/clients' },
      { label: 'Billing Reports', href: '/platform/billing' },
      { label: 'SMS Routes', href: '/platform/routing' },
      { label: 'Observability', href: '/platform/logs' },
      { label: 'System Settings', href: '/platform/settings' },
      { label: 'API Management', href: '/platform/api' },
      { label: 'Security', href: '/platform/security' },
    ],
  };

  const roleStyles = {
    CLIENT: 'bg-blue-50 border-blue-200',
    RESELLER: 'bg-purple-50 border-purple-200',
    PLATFORM: 'bg-gray-50 border-gray-200',
  };

  return (
    <Card className={`${roleStyles[role]} border-2`}>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions[role].map((action) => (
            <a key={action.label} href={action.href}>
              <Button variant="outline" className="w-full text-xs h-9">
                {action.label}
              </Button>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
