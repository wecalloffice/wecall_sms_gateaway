'use client';

import { Search } from 'lucide-react';

interface Props {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export default function BrandingSearchBar({ searchTerm, setSearchTerm }: Props) {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
      <div className="flex items-center gap-2">
        <Search size={20} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search clients by name or username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field flex-1 border-0"
        />
      </div>
    </div>
  );
}
