'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { CheckCircle, AlertCircle, Clock, MessageSquare, Search, Download, FileText } from 'lucide-react';
import { mockSms } from '@/mocks/adapters/mockSms';

export default function ClientSmsLogsPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    delivered: 0,
    failed: 0,
    queued: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await mockSms.list({ business_sid: 'AC_CLIENT_001' });
        setMessages(data);
        setFilteredMessages(data);
        
        // Calculate stats
        setStats({
          total: data.length,
          delivered: data.filter((m: any) => m.status === 'delivered').length,
          failed: data.filter((m: any) => m.status === 'failed').length,
          queued: data.filter((m: any) => m.status === 'queued' || m.status === 'sent').length,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching SMS logs:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = messages;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((m: any) => m.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((m: any) =>
        m.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMessages(filtered);
  }, [searchTerm, statusFilter, messages]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'failed':
        return <AlertCircle size={16} className="text-red-600" />;
      case 'queued':
      case 'sent':
        return <Clock size={16} className="text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      delivered: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      queued: 'bg-yellow-100 text-yellow-800',
      sent: 'bg-blue-100 text-blue-800',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  return (
    <MainLayout role="CLIENT_ADMIN" businessName="RDB" userName="RDB User">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">SMS Logs</h1>
            <p className="text-gray-600 mt-1">View and track all sent messages</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Download size={20} />
            Export CSV
          </button>
        </div>

        {/* Search & Filter */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex gap-3 flex-col md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by phone, sender, or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-full pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Status</option>
            <option value="delivered">Delivered</option>
            <option value="sent">Sent</option>
            <option value="queued">Queued</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sent</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <MessageSquare size={32} className="text-primary" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
              </div>
              <CheckCircle size={32} className="text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              </div>
              <AlertCircle size={32} className="text-red-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.queued}</p>
              </div>
              <Clock size={32} className="text-yellow-600" />
            </div>
          </div>
        </div>

        {/* SMS Logs Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Message History ({filteredMessages.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Date/Time</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">To</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">From</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Parts</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">Loading messages...</td>
                  </tr>
                ) : filteredMessages.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">No messages found</td>
                  </tr>
                ) : (
                  filteredMessages.map((msg) => (
                    <tr key={msg.sid} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(msg.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{msg.to}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{msg.from}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {msg.message}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(msg.status)}
                          <span className={`px-2 py-1 text-xs rounded font-medium ${getStatusBadge(msg.status)}`}>
                            {msg.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{msg.sms_parts}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">${msg.price.toFixed(3)}</td>
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
