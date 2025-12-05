"use client";

import { Search } from "lucide-react";

export default function LogsFilters({
  filter,
  setFilter,
  searchTerm,
  setSearchTerm,
  dateFilter,
  setDateFilter,
}: any) {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow border border-gray-200 dark:border-slate-700 space-y-4 transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-full pl-10"
            />
          </div>
        </div>

        {/* Event Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Event Type</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field w-full">
            <option value="all">All Types</option>
            <option value="user_login">User Login</option>
            <option value="sms_sent">SMS Sent</option>
            <option value="dlr_received">DLR Received</option>
            <option value="api_request">API Request</option>
          </select>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Range</label>
          <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="input-field w-full">
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>

      </div>
    </div>
  );
}
