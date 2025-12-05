"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

interface MenuItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  title?: string;
  menu: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ title = "Dashboard", menu }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* MOBILE TOGGLE BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden p-2 m-2 bg-gray-200 rounded-md"
      >
        <Menu size={24} />
      </button>

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg border-r z-40 transform 
        ${open ? "translate-x-0" : "-translate-x-full"} 
        transition-transform duration-300 lg:translate-x-0`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">{title}</h2>

          <button onClick={() => setOpen(false)} className="lg:hidden">
            <X size={22} />
          </button>
        </div>

        {/* MENU ITEMS */}
        <nav className="mt-4 flex flex-col gap-1 px-4">
          {menu.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 transition"
            >
              {item.icon && <span>{item.icon}</span>}
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* BACKDROP FOR MOBILE */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/30 lg:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;
