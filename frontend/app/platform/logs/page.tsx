'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { FileText, Activity, AlertCircle, Database, Search, Download, Filter } from 'lucide-react';
import { mockObservability } from '@/mocks/adapters/mockObservability';

type LogEvent = {
  id: string;
  timestamp?: string;
  event_type?: string;
  user_sid?: string;
  ip_address?: string;
  event_data?: any;
};

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const events = await mockObservability.listEvents();
        const mappedLogs = events.slice(0, 50).map((e: any, i: number) => ({ ...e, id: e.sid || `log_${i}` }));
        setLogs(mappedLogs);
        setFilteredLogs(mappedLogs);
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = logs;

    // Filter by type
    if (filter !== 'all') {
      filtered = filtered.filter(log => log.event_type === filter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.user_sid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ip_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.event_type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
  }, [filter, searchTerm, logs]);

  const exportLogs = () => {
    const csv = [
      ['ID', 'Type', 'User', 'IP', 'Timestamp'],
      ...filteredLogs.map(log => [
        log.id,
        log.event_type || 'N/A',
        log.user_sid || 'N/A',
        log.ip_address || 'N/A',
        log.timestamp || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Clean badge color logic
  const getBadgeClasses = (type?: string) => {
    switch (type) {
      case 'user_login':
        return 'bg-blue-100 text-blue-800';
      case 'sms_sent':
        return 'bg-green-100 text-green-800';
      case 'dlr_received':
        return 'bg-purple-100 text-purple-800';
      case 'api_request':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <MainLayout role="PLATFORM_ADMIN" businessName="WeCall Platform" userName="Admin User">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">System Logs</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">View all system events and activities</p>
          </div>
          <button onClick={exportLogs} className="btn-primary flex items-center gap-2">
            <Download size={20} />
            Export
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow border border-gray-200 dark:border-slate-700 space-y-4 transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-gray-200 dark:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Events</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{logs.length}</p>
              </div>
              <FileText size={32} className="text-primary" />
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-gray-200 dark:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Filtered Results</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredLogs.length}</p>
              </div>
              <Activity size={32} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-gray-200 dark:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">API Requests</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">1,247</p>
              </div>
              <Database size={32} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-gray-200 dark:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Errors</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">23</p>
              </div>
              <AlertCircle size={32} className="text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Logs</h1>
            <p className="text-gray-600 mt-1">Monitor system activity and events</p>
          </div>

          <select
            className="input-field"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Events</option>
            <option value="user_login">User Logins</option>
            <option value="sms_sent">SMS Sent</option>
            <option value="dlr_received">DLR Received</option>
            <option value="api_request">API Requests</option>
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard title="Total Events" value={logs.length} icon={<FileText size={32} className="text-primary" />} />
          <StatsCard title="SMS Sent" value={logs.filter(l => l.event_type === 'sms_sent').length} icon={<Activity size={32} className="text-blue-600" />} />
          <StatsCard title="API Requests" value={logs.filter(l => l.event_type === 'api_request').length} icon={<Database size={32} className="text-green-600" />} />
          <StatsCard title="Errors" value={0} icon={<AlertCircle size={32} className="text-red-600" />} />
        </div>

        {/* Logs Table */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-gray-200 dark:border-slate-700 transition-colors">
          <div className="p-6 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">System Events</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600 transition-colors">
                <tr>
                  <TH>Timestamp</TH>
                  <TH>Event Type</TH>
                  <TH>User</TH>
                  <TH>IP Address</TH>
                  <TH>Details</TH>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">Loading...</td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No logs found</td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">

                      {/* Timestamp */}
                      <TD>
                        {log.timestamp
                          ? new Date(log.timestamp).toLocaleString()
                          : '—'}
                      </TD>

                      {/* Event Type */}
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 text-xs rounded-full ${getBadgeClasses(log.event_type)}`}>
                          {log.event_type?.replace(/_/g, ' ') ?? 'Unknown'}
                        </span>
                      </td>

                      {/* User */}
                      <TD>{log.user_sid || 'System'}</TD>

                      {/* IP */}
                      <TD>{log.ip_address || '—'}</TD>

                      {/* Details */}
                      <TD>
                        {log.event_data
                          ? JSON.stringify(log.event_data).slice(0, 50) + '...'
                          : '—'}
                      </TD>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

/* Utility table components for cleaner markup */
const TH = ({ children }: any) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase transition-colors">{children}</th>
);

const TD = ({ children }: any) => (
  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 transition-colors">{children}</td>
);

/* Stats card component */
const StatsCard = ({ title, value, icon }: any) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-gray-200 dark:border-slate-700 transition-colors">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
      {icon}
    </div>
  </div>
);
