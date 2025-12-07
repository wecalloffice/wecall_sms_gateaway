'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

interface Message {
  sid: string;
  business_sid: string;
  from: string;
  to: string;
  status: string;
  created_at: string;
}

interface RecentMessagesListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function RecentMessagesList({ messages = [], isLoading }: RecentMessagesListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Recent Messages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : messages.length === 0 ? (
            <p className="text-sm text-gray-500">No messages yet</p>
          ) : (
            messages.slice(0, 5).map((msg) => (
              <div key={msg.sid} className="flex items-center justify-between text-sm border-b pb-2 last:border-b-0">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {getStatusIcon(msg.status)}
                  <div className="min-w-0">
                    <p className="font-medium truncate">{msg.from}</p>
                    <p className="text-xs text-gray-500">{msg.to}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                  msg.status === 'delivered' ? 'bg-green-100 text-green-700' :
                  msg.status === 'failed' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {msg.status}
                </span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
