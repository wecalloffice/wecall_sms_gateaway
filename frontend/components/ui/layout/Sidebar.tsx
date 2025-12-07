

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Role = "PLATFORM" | "RESELLER" | "CLIENT";

interface MenuItem {
  label: string;
  href: string;
  roles: Role[];
}

// CLIENT menu items
const clientMenuConfig: MenuItem[] = [
  { label: "Dashboard", href: "/client/dashboard", roles: ["CLIENT"] },
  { label: "SMS", href: "/client/sms", roles: ["CLIENT"] },
  { label: "Logs", href: "/client/sms-logs", roles: ["CLIENT"] },
  { label: "Contacts", href: "/client/contacts", roles: ["CLIENT"] },
  { label: "Wallet", href: "/client/wallet", roles: ["CLIENT"] },
  { label: "Settings", href: "/client/settings", roles: ["CLIENT"] },
  { label: "Profile", href: "/client/profile", roles: ["CLIENT"] },
];

// RESELLER menu items
const resellerMenuConfig: MenuItem[] = [
  { label: "Dashboard", href: "/reseller/dashboard", roles: ["RESELLER"] },
  { label: "SMS", href: "/reseller/sms", roles: ["RESELLER"] },
  { label: "Logs", href: "/reseller/dlr", roles: ["RESELLER"] },
  { label: "Contacts", href: "/reseller/contacts", roles: ["RESELLER"] },
  { label: "Clients", href: "/reseller/clients", roles: ["RESELLER"] },
  { label: "Routing", href: "/reseller/routing", roles: ["RESELLER"] },
  { label: "Branding", href: "/reseller/branding", roles: ["RESELLER"] },
  { label: "Settings", href: "/reseller/settings", roles: ["RESELLER"] },
  { label: "Profile", href: "/reseller/profile", roles: ["RESELLER"] },
];

// PLATFORM menu items
const platformMenuConfig: MenuItem[] = [
  { label: "Dashboard", href: "/platform/dashboard", roles: ["PLATFORM"] },
  { label: "SMS", href: "/platform/sms", roles: ["PLATFORM"] },
  { label: "Logs", href: "/platform/logs", roles: ["PLATFORM"] },
  { label: "Users", href: "/platform/users", roles: ["PLATFORM"] },
  { label: "Resellers", href: "/platform/clients", roles: ["PLATFORM"] },
  { label: "Billing", href: "/platform/billing", roles: ["PLATFORM"] },
  { label: "Routing", href: "/platform/routing", roles: ["PLATFORM"] },
  { label: "DLR", href: "/platform/dlr", roles: ["PLATFORM"] },
  { label: "Security", href: "/platform/security", roles: ["PLATFORM"] },
  { label: "API", href: "/platform/api", roles: ["PLATFORM"] },
  { label: "Settings", href: "/platform/settings", roles: ["PLATFORM"] },
  { label: "Profile", href: "/platform/profile", roles: ["PLATFORM"] },
];

// Combine all configs
const menuConfig: MenuItem[] = [
  ...clientMenuConfig,
  ...resellerMenuConfig,
  ...platformMenuConfig,
];

export default function Sidebar({ role = "CLIENT" }: { role: Role }) {
  const pathname = usePathname();
  const allowedMenu = menuConfig.filter((item) => item.roles.includes(role));

  return (
    <aside className="w-64 bg-primary text-white h-screen p-5 sticky top-0">
      <h1 className="text-2xl font-bold mb-6">WeCall</h1>

      <nav className="space-y-2">
        {allowedMenu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-3 py-2 rounded-lg transition ${
              pathname.includes(item.href) ? "bg-gray-700 font-semibold" : "hover:bg-gray-800"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
