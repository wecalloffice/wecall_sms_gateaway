"use client";

import React, { useState, useEffect } from 'react';
import { SmsLogsTable } from '@/features/sms/components/SmsLogsTable';
import { SmsLogsStats } from '@/features/sms/components/SmsLogsStats';
import { SmsLog, SmsLogStats } from '@/features/sms/types/logs';
import { useSmsStore } from '@/stores/smsStore';

// Helper function to convert store logs to display logs
const convertStoreLogs = (storeLogs: any[]): SmsLog[] => {
  return storeLogs.map(log => ({
    id: log.sid,
    messageId: log.sid,
    to: log.to,
    from: log.from,
    message: log.message,
    status: log.status as any,
    createdAt: new Date(log.created_at),
    deliveredAt: log.delivered_at ? new Date(log.delivered_at) : undefined,
    failureReason: log.error_code || undefined,
    cost: log.price,
    country: log.gateway,
    credits: 1,
  }));
};

// Fallback mock data if store is empty
const mockLogs: SmsLog[] = [
  {
    id: '1',
    messageId: 'msg_7x9k2p',
    to: '+250788123456',
    from: 'WeCall',
    message: 'Your OTP code is 123456. Valid for 10 minutes.',
    status: 'delivered',
    createdAt: new Date('2025-12-05T10:30:00'),
    deliveredAt: new Date('2025-12-05T10:30:05'),
    cost: 0.0245,
    country: 'Rwanda',
    carrier: 'MTN',
    credits: 1,
  },
  {
    id: '2',
    messageId: 'msg_5m3n8q',
    to: '+250789987654',
    from: 'WeCall',
    message: 'Your order #12345 has been shipped and will arrive in 2-3 days.',
    status: 'delivered',
    createdAt: new Date('2025-12-05T09:15:00'),
    deliveredAt: new Date('2025-12-05T09:15:03'),
    cost: 0.0245,
    country: 'Rwanda',
    carrier: 'Airtel',
    credits: 1,
  },
  {
    id: '3',
    messageId: 'msg_2w8r6t',
    to: '+1234567890',
    from: 'WeCall',
    message: 'Welcome to our service! Thanks for signing up.',
    status: 'failed',
    createdAt: new Date('2025-12-05T08:45:00'),
    cost: 0.0,
    country: 'USA',
    failureReason: 'Invalid number',
    credits: 0,
  },
  {
    id: '4',
    messageId: 'msg_9k4j7n',
    to: '+250781234567',
    from: 'WeCall',
    message: 'Your payment of $50.00 has been received. Thank you!',
    status: 'sent',
    createdAt: new Date('2025-12-05T08:20:00'),
    cost: 0.0245,
    country: 'Rwanda',
    carrier: 'MTN',
    credits: 1,
  },
  {
    id: '5',
    messageId: 'msg_1h5g3p',
    to: '+250782345678',
    from: 'WeCall',
    message: 'Reminder: Your appointment is tomorrow at 2:00 PM.',
    status: 'pending',
    createdAt: new Date('2025-12-05T07:00:00'),
    cost: 0.0245,
    country: 'Rwanda',
    credits: 1,
  },
  {
    id: '6',
    messageId: 'msg_6y2k9m',
    to: '+250783456789',
    from: 'WeCall',
    message: 'Flash Sale! 50% off all items. Shop now at www.example.com',
    status: 'delivered',
    createdAt: new Date('2025-12-04T18:30:00'),
    deliveredAt: new Date('2025-12-04T18:30:04'),
    cost: 0.0245,
    country: 'Rwanda',
    carrier: 'Airtel',
    credits: 1,
  },
  {
    id: '7',
    messageId: 'msg_3p7m5k',
    to: '+250784567890',
    from: 'WeCall',
    message: 'Your password has been successfully reset. If you did not request this, contact support.',
    status: 'delivered',
    createdAt: new Date('2025-12-04T16:15:00'),
    deliveredAt: new Date('2025-12-04T16:15:02'),
    cost: 0.0245,
    country: 'Rwanda',
    carrier: 'MTN',
    credits: 1,
  },
  {
    id: '8',
    messageId: 'msg_8t4n2w',
    to: '+250785678901',
    from: 'WeCall',
    message: 'Account verification code: 789012',
    status: 'queued',
    createdAt: new Date('2025-12-04T15:00:00'),
    cost: 0.0245,
    country: 'Rwanda',
    credits: 1,
  },
];

const mockStats: SmsLogStats = {
  total: 8,
  sent: 1,
  delivered: 5,
  failed: 1,
  pending: 1,
  totalCost: 0.1715,
  deliveryRate: 71.4,
};

export default function SmsLogsPage() {
  const storeLogs = useSmsStore((state) => state.smsLogs);
  const getSmsLogs = useSmsStore((state) => state.getSmsLogs);
  
  const [logs, setLogs] = useState<SmsLog[]>([]);
  const [stats, setStats] = useState<SmsLogStats>(mockStats);
  const [isLoading, setIsLoading] = useState(false);

  // Load logs from store or use mock data
  useEffect(() => {
    const storeSmsLogs = getSmsLogs();
    if (storeSmsLogs && storeSmsLogs.length > 0) {
      const convertedLogs = convertStoreLogs(storeSmsLogs);
      setLogs(convertedLogs);
      
      // Calculate stats from real data
      const delivered = convertedLogs.filter(l => l.status === 'delivered').length;
      const failed = convertedLogs.filter(l => l.status === 'failed').length;
      const pending = convertedLogs.filter(l => l.status === 'pending').length;
      const sent = convertedLogs.filter(l => l.status === 'sent').length;
      const totalCost = convertedLogs.reduce((sum, l) => sum + (l.cost || 0), 0);
      
      setStats({
        total: convertedLogs.length,
        sent,
        delivered,
        failed,
        pending,
        totalCost,
        deliveryRate: convertedLogs.length > 0 ? (delivered / convertedLogs.length) * 100 : 0,
      });
    } else {
      // Use mock data
      setLogs(mockLogs);
      setStats(mockStats);
    }
  }, [storeLogs, getSmsLogs]);

  const handleRefresh = () => {
    setIsLoading(true);
    // Reload from store
    const storeSmsLogs = getSmsLogs();
    if (storeSmsLogs && storeSmsLogs.length > 0) {
      const convertedLogs = convertStoreLogs(storeSmsLogs);
      setLogs(convertedLogs);
      
      // Recalculate stats
      const delivered = convertedLogs.filter(l => l.status === 'delivered').length;
      const failed = convertedLogs.filter(l => l.status === 'failed').length;
      const pending = convertedLogs.filter(l => l.status === 'pending').length;
      const sent = convertedLogs.filter(l => l.status === 'sent').length;
      const totalCost = convertedLogs.reduce((sum, l) => sum + (l.cost || 0), 0);
      
      setStats({
        total: convertedLogs.length,
        sent,
        delivered,
        failed,
        pending,
        totalCost,
        deliveryRate: convertedLogs.length > 0 ? (delivered / convertedLogs.length) * 100 : 0,
      });
    }
    setIsLoading(false);
  };

  const handleExport = () => {
    // Export logs to CSV
    const headers = ['Message ID', 'To', 'From', 'Message', 'Status', 'Date', 'Cost'];
    const csvData = logs.map(log => [
      log.messageId,
      log.to,
      log.from,
      log.message.replace(/,/g, ';'),
      log.status,
      log.createdAt.toISOString(),
      log.cost || 0,
    ]);
    
    const csv = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sms-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SMS Logs</h1>
        <p className="text-gray-600">Track and monitor all your SMS messages</p>
      </div>

      <SmsLogsStats stats={stats} />
      
        <SmsLogsTable 
          logs={logs} 
          isLoading={isLoading}
          onRefresh={handleRefresh}
          onExport={handleExport}
        />
    </div>
  );
}