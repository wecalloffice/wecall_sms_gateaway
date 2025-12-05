"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { label: "Dashboard", href: "/platform/dashboard" },
    { label: "Resellers", href: "/platform/resellers" },
    { label: "Clients", href: "/platform/clients" },
    { label: "Billing", href: "/platform/billing" },  // <-- ADD THIS
  ];

  return (
    <aside className="w-64 bg-primary text-white h-full p-4">
      <h1 className="text-xl font-bold mb-6">WeCall</h1>

      <nav className="space-y-2">
        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-3 py-2 rounded ${
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
