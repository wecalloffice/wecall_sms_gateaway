"use client";

import React from "react";
import { Search } from "lucide-react";

interface SearchBoxProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
}

export default function SearchBox({
  placeholder = "Search...",
  onSearch,
}: SearchBoxProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 text-gray-400" size={18} />
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onSearch?.(e.target.value)}
        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
      />
    </div>
  );
}
