"use client";

import { Search } from "lucide-react";

export function ContactsSearch({ value, onChange, onSearch, contacts }: any) {
  const handleSearch = (v: string) => {
    onChange(v);
    const result = contacts.filter((c: any) =>
      c.name.toLowerCase().includes(v.toLowerCase()) ||
      c.email.toLowerCase().includes(v.toLowerCase()) ||
      c.phone.includes(v)
    );
    onSearch(result);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

        <input
          value={value}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search contacts..."
          className="w-full pl-10 border rounded-md p-2"
        />
      </div>
    </div>
  );
}
