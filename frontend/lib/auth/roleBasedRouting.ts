/**
 * Role-based routing utilities
 */

export type UserRole = 'PLATFORM_ADMIN' | 'RESELLER_ADMIN' | 'CLIENT_ADMIN';

const ROLE_ROUTES: Record<UserRole, string> = {
  PLATFORM_ADMIN: '/platform/dashboard',
  RESELLER_ADMIN: '/reseller/dashboard',
  CLIENT_ADMIN: '/client/dashboard',
};

/**
 * Get the appropriate dashboard route for a user role
 */
export const getRoleBasedRoute = (role: string): string => {
  return ROLE_ROUTES[role as UserRole] || '/';
};

/**
 * Get the navigation items for a specific role
 */
export const getRoleNavItems = (role: string) => {
  const navItems = {
    PLATFORM_ADMIN: [
      { label: 'Dashboard', href: '/platform/dashboard' },
      { label: 'Resellers', href: '/platform/resellers' },
      { label: 'Clients', href: '/platform/clients' },
      { label: 'Billing', href: '/platform/billing' },
      { label: 'Logs', href: '/platform/logs' },
    ],
    RESELLER_ADMIN: [
      { label: 'Dashboard', href: '/reseller/dashboard' },
      { label: 'Clients', href: '/reseller/clients' },
      { label: 'SMS', href: '/reseller/sms' },
      { label: 'Wallet', href: '/reseller/wallet' },
      { label: 'Billing', href: '/reseller/billing' },
    ],
    CLIENT_ADMIN: [
      { label: 'Dashboard', href: '/client/dashboard' },
      { label: 'Send SMS', href: '/client/sms' },
      { label: 'SMS Logs', href: '/client/sms-logs' },
      { label: 'Wallet', href: '/client/wallet' },
      { label: 'Settings', href: '/client/settings' },
    ],
  };

  return navItems[role as UserRole] || [];
};

/**
 * Check if a user has a specific role
 */
export const hasRole = (userRole: string, requiredRole: UserRole): boolean => {
  return userRole === requiredRole;
};

/**
 * Check if a user has any of the specified roles
 */
export const hasAnyRole = (userRole: string, roles: UserRole[]): boolean => {
  return roles.includes(userRole as UserRole);
};

/**
 * Get role display name
 */
export const getRoleDisplayName = (role: string): string => {
  const names: Record<UserRole, string> = {
    PLATFORM_ADMIN: 'Platform Administrator',
    RESELLER_ADMIN: 'Reseller',
    CLIENT_ADMIN: 'Client',
  };

  return names[role as UserRole] || 'User';
};

/**
 * Get role badge color
 */
export const getRoleBadgeColor = (role: string) => {
  const colors = {
    PLATFORM_ADMIN: { bg: 'bg-red-100', text: 'text-red-800' },
    RESELLER_ADMIN: { bg: 'bg-blue-100', text: 'text-blue-800' },
    CLIENT_ADMIN: { bg: 'bg-green-100', text: 'text-green-800' },
  };

  return colors[role as UserRole] || { bg: 'bg-gray-100', text: 'text-gray-800' };
};
