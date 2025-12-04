
// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";

// export default function Sidebar() {
//   const pathname = usePathname();

//   // Reusable sidebar menu config
//   const menu = [
//     { label: "Dashboard", href: "/dashboard", icon: "📊" },
//     { label: "SMS", href: "/sms", icon: "💬" },
//     { label: "Resellers", href: "/resellers", icon: "🏷️" },
//     { label: "Clients", href: "/clients", icon: "👥" },
//     { label: "Reports", href: "/reports", icon: "📈" },
//     { label: "Billing", href: "/billing", icon: "💵" },
//     { label: "Settings", href: "/settings", icon: "⚙️" },
//     { label: "Audits", href: "/audits", icon: "📝" },
//   ];

//   return (
//     <aside className="w-64 bg-primary text-white h-screen p-5 flex flex-col">
//       {/* Brand */}
//       <h1 className="text-2xl font-bold mb-10">WeCall</h1>

//       {/* Navigation */}
//       <nav className="space-y-2 flex-1">
//         {menu.map((item) => {
//           const isActive = pathname.startsWith(item.href);

//           return (
//             <Link
//               key={item.href}
//               href={item.href}
//               className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition 
//                 ${isActive ? "bg-gray-800 font-semibold" : "hover:bg-gray-700"}
//               `}
//             >
//               <span>{item.icon}</span>
//               {item.label}
//             </Link>
//           );
//         })}
//       </nav>
//     </aside>
//   );
// }


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
  { label: "Resellers", href: "/resellers", roles: ["admin"] },
  { label: "Clients", href: "/clients", roles: ["admin", "reseller"] },
  { label: "Reports", href: "/reports", roles: ["admin", "reseller"] },
  { label: "Billing", href: "/billing", roles: ["admin", "reseller", "client"] },
  { label: "Settings", href: "/settings", roles: ["admin", "reseller", "client"] },
  { label: "Audits", href: "/audits", roles: ["admin"] },
];

export default function Sidebar({ role = "admin" }: { role: Role }) {
  const pathname = usePathname();

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
