

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// 1. Define allowed roles
type Role = "admin" | "reseller" | "client";

// 2. Define the menu item structure
interface MenuItem {
  label: string;
  href: string;
  roles: Role[]; // permissions
}

// 3. Unified menu list with permissions
const menuConfig: MenuItem[] = [
  { label: "Dashboard", href: "/dashboard", roles: ["admin", "reseller", "client"] },
  { label: "SMS", href: "/sms", roles: ["admin", "reseller", "client"] },
  { label: "Contacts", href: "/contacts", roles: ["admin", "reseller", "client"] },
  { label: "Groups", href: "/groups", roles: ["admin", "reseller", "client"] },
  { label: "Resellers", href: "/resellers", roles: ["admin"] },
  { label: "Clients", href: "/clients", roles: ["admin", "reseller"] },
  { label: "Reports", href: "/reports", roles: ["admin", "reseller"] },
  { label: "Billing", href: "/billing", roles: ["admin", "reseller", "client"] },
  { label: "Settings", href: "/settings", roles: ["admin", "reseller", "client"] },
  { label: "Audits", href: "/audits", roles: ["admin"] },
];

export default function Sidebar({ role = "admin" }: { role: Role }) {
  const pathname = usePathname();

  const menu = [
    { label: "Dashboard", href: "/platform/dashboard" },
    { label: "Resellers", href: "/platform/resellers" },
    { label: "Clients", href: "/platform/clients" },
    { label: "Billing", href: "/platform/billing" },  // <-- ADD THIS
  ];
  // 4. Filter menu by permissions
  const allowedMenu = menuConfig.filter((item) => item.roles.includes(role));

  return (
    <aside className="w-64 bg-primary text-white h-screen p-5">
      <h1 className="text-2xl font-bold mb-6">WeCall</h1>

      <nav className="space-y-2">
        {allowedMenu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-3 py-2 rounded-lg transition ${
              pathname === item.href ? "bg-gray-700" : "hover:bg-gray-800"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
