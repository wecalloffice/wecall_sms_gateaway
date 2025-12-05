'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Send, MessageSquare, Loader, CheckCircle, AlertCircle, Clock, Filter } from 'lucide-react';
import { mockSms } from '@/mocks/adapters/mockSms';

interface Message {
  sid: string;
  from: string;
  to: string;
  message: string;
  status: string;
  price: number;
  created_at: string;
  sms_parts: number;
  business_sid?: string;
  reseller_sid?: string;
}

export default function PlatformSmsPage() {
  const [formData, setFormData] = useState({
    to: '',
    from: 'SMS_GATEWAY',
    message: '',
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    sent: 0,
    delivered: 0,
    failed: 0,
    queued: 0,
    total_cost: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sendingBulk, setSendingBulk] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterBusiness, setFilterBusiness] = useState('all');

  // Fetch messages and stats on mount
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = messages;
    if (filterStatus !== 'all') {
      filtered = filtered.filter(m => m.status === filterStatus);
    }
    if (filterBusiness !== 'all') {
      filtered = filtered.filter(m => m.business_sid === filterBusiness);
    }
    setFilteredMessages(filtered);
  }, [messages, filterStatus, filterBusiness]);

  const fetchMessages = async () => {
    try {
      const data = await mockSms.list();
      setMessages(data);
      const statsData = await mockSms.getStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  const handleSend = async () => {
    if (!formData.to.trim() || !formData.message.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    setSendingBulk(false);

    try {
      const recipientCount = formData.to.split(',').filter(r => r.trim()).length;
      
      if (recipientCount > 1) {
        setSendingBulk(true);
        await mockSms.sendBulk({
          business_sid: 'AC_PLATFORM_ADMIN',
          reseller_sid: 'AC_PLATFORM_ADMIN',
          to: formData.to,
          from: formData.from,
          message: formData.message,
          price: 0.015,
          gateway: 'jasmin-primary',
        });
      } else {
        await mockSms.send({
          business_sid: 'AC_PLATFORM_ADMIN',
          reseller_sid: 'AC_PLATFORM_ADMIN',
          to: formData.to,
          from: formData.from,
          message: formData.message,
          price: 0.015,
          gateway: 'jasmin-primary',
        });
      }

      setFormData({ to: '', from: 'SMS_GATEWAY', message: '' });
      await fetchMessages();
    } catch (err) {
      setError('Failed to send SMS. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
      setSendingBulk(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'sent':
        return <CheckCircle size={16} className="text-blue-600" />;
      case 'failed':
        return <AlertCircle size={16} className="text-red-600" />;
      case 'queued':
        return <Clock size={16} className="text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      delivered: 'bg-green-100 text-green-800',
      sent: 'bg-blue-100 text-blue-800',
      failed: 'bg-red-100 text-red-800',
      queued: 'bg-yellow-100 text-yellow-800',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const uniqueBusinesses = [...new Set(messages.map(m => m.business_sid))];

  return (
    <MainLayout role="PLATFORM_ADMIN" businessName="WeCall SMS" userName="Admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Platform SMS Gateway</h1>
            <p className="text-gray-600 mt-1">Send and monitor SMS across all clients</p>
          </div>
        </div>

        {/* Send SMS Form */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare size={24} className="text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Compose Message</h2>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {sendingBulk && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-700 text-sm">
                📤 Sending bulk SMS to {formData.to.split(',').filter(r => r.trim()).length} recipients...
              </p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Phone Number
              </label>
              <input
                type="text"
                placeholder="+250712345678 or +250712345678, +250722345678"
                value={formData.to}
                onChange={(e) => setFormData({...formData, to: e.target.value})}
                className="input-field w-full"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.to.split(',').filter(r => r.trim()).length > 1
                  ? `✓ Bulk mode: ${formData.to.split(',').filter(r => r.trim()).length} recipients`
                  : 'For multiple recipients, separate with commas'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sender ID
              </label>
              <select
                value={formData.from}
                onChange={(e) => setFormData({...formData, from: e.target.value})}
                className="input-field w-full"
                disabled={loading}
              >
                <option value="SMS_GATEWAY">SMS_GATEWAY</option>
                <option value="WECALL">WECALL</option>
                <option value="SUPPORT">SUPPORT</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                rows={6}
                placeholder="Type your message here..."
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="input-field w-full resize-none"
                disabled={loading}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{formData.message.length} characters</span>
                <span>{Math.ceil(formData.message.length / 160) || 0} SMS</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                onClick={handleSend} 
                disabled={loading}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader size={20} className="animate-spin" /> : <Send size={20} />}
                {loading ? 'Sending...' : 'Send SMS'}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <p className="text-xs text-gray-500 uppercase font-semibold">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <p className="text-xs text-gray-500 uppercase font-semibold">Queued</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.queued}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <p className="text-xs text-gray-500 uppercase font-semibold">Sent</p>
            <p className="text-2xl font-bold text-blue-600">{stats.sent}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <p className="text-xs text-gray-500 uppercase font-semibold">Delivered</p>
            <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <p className="text-xs text-gray-500 uppercase font-semibold">Cost</p>
            <p className="text-2xl font-bold text-gray-900">${stats.total_cost.toFixed(2)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Filter size={18} className="text-gray-600" />
            <div className="flex gap-4 flex-wrap">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field py-2 px-3"
              >
                <option value="all">All Status</option>
                <option value="queued">Queued</option>
                <option value="sent">Sent</option>
                <option value="delivered">Delivered</option>
                <option value="failed">Failed</option>
              </select>
              <select
                value={filterBusiness}
                onChange={(e) => setFilterBusiness(e.target.value)}
                className="input-field py-2 px-3"
              >
                <option value="all">All Businesses</option>
                {uniqueBusinesses.map(bid => (
                  <option key={bid} value={bid}>{bid}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Message History */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              All Messages ({filteredMessages.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">To</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">From</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Business</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No messages found
                    </td>
                  </tr>
                ) : (
                  filteredMessages.map((msg) => (
                    <tr key={msg.sid} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{msg.to}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{msg.from}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{msg.message}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{msg.business_sid}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(msg.status)}
                          <span className={`px-2 py-1 text-xs rounded font-medium ${getStatusBadge(msg.status)}`}>
                            {msg.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">${msg.price.toFixed(3)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </td>
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
