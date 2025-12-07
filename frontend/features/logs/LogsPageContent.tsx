"use client";

import { useState, useEffect } from "react";
import { FileText, Activity, AlertCircle, Database, Download } from "lucide-react";
import LogsFilters from "@/components/LogsFilters";
import StatCard from "@/components/StatCard";
import LogsTable from "@/components/LogsTable";
import { mockObservability } from "@/mocks/adapters/mockObservability";

// Utility function for badge classes
const getBadgeClasses = (status: string) => {
  const baseClasses = "inline-block px-3 py-1 rounded-full text-sm font-medium";
  switch(status) {
    case 'success':
      return `${baseClasses} bg-green-100 text-green-800`;
    case 'error':
      return `${baseClasses} bg-red-100 text-red-800`;
    case 'pending':
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};

export default function LogsPageContent() {
  const [logs, setLogs] = useState<any[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
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
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = logs;
    if (filter !== 'all') filtered = filtered.filter(log => log.event_type === filter);
    if (searchTerm) filtered = filtered.filter(log =>
      log.user_sid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.event_type?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLogs(filtered);
  }, [filter, searchTerm, logs]);

  const exportLogs = () => {
    const csv = [
      ['ID','Type','User','IP','Timestamp'],
      ...filteredLogs.map(log => [
        log.id, log.event_type || 'N/A', log.user_sid || 'N/A', log.ip_address || 'N/A', log.timestamp || 'N/A'
      ])
    ].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
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

      <LogsFilters
        filter={filter}
        setFilter={setFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Total Events" value={logs.length} icon={<FileText size={32} className="text-primary" />} />
        <StatCard label="SMS Sent" value={logs.filter(l => l.event_type === 'sms_sent').length} icon={<Activity size={32} className="text-blue-600" />} />
        <StatCard label="API Requests" value={logs.filter(l => l.event_type === 'api_request').length} icon={<Database size={32} className="text-green-600" />} />
        <StatCard label="Errors" value={logs.filter(l => l.event_type === 'error').length} icon={<AlertCircle size={32} className="text-red-600" />} />
      </div>

      <LogsTable logs={logs} filteredLogs={filteredLogs} loading={loading} getBadgeClasses={getBadgeClasses} />
    </div>
  );
}

