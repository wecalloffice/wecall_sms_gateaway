'use client';

import React, { useState } from 'react';
import { LogOut, User, ChevronDown, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TopbarProps {
  businessName?: string;
  userName?: string;
  role?: 'PLATFORM_ADMIN' | 'RESELLER_ADMIN' | 'CLIENT_ADMIN' | 'RESELLER' | 'CLIENT';
  onMenuClick?: () => void;
}

export default function Topbar({
  businessName = 'WeCall SMS',
  userName = 'User',
  role = 'RESELLER_ADMIN',
  onMenuClick,
}: TopbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    // Clear auth token from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    router.push('/login');
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    // Route to profile based on role
    if (role === 'PLATFORM_ADMIN') {
      router.push('/platform/profile');
    } else if (role === 'RESELLER_ADMIN' || role === 'RESELLER') {
      router.push('/reseller/profile');
    } else {
      router.push('/client/profile');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between">
      {/* Left side: Menu button (mobile) + Business name */}
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
        )}
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{businessName}</h2>
          <p className="text-xs text-gray-500 capitalize">
            {role?.replace('_', ' ').toLowerCase()}
          </p>
        </div>
      </div>

      {/* Right side: Avatar dropdown */}
      <div className="flex items-center gap-2">
        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-white">
              <User size={16} />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">{userName}</span>
            <ChevronDown size={16} className="text-gray-500" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-800">{userName}</p>
                <p className="text-xs text-gray-500">{businessName}</p>
              </div>

              <div className="p-2">
                <button
                  onClick={handleProfileClick}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <User size={16} />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
