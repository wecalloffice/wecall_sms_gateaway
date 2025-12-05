'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Key, Shield, Copy, Eye, EyeOff } from 'lucide-react';

export default function ClientApiPage() {
  const [showKey, setShowKey] = useState(false);
  const [apiKey] = useState('wc_prod_abc123def456ghi789jkl012mno345');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    alert('API key copied to clipboard!');
  };

  return (
    <MainLayout role="CLIENT_ADMIN" businessName="RDB" userName="RDB User">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">API Integration</h1>
            <p className="text-gray-600 mt-1">API keys and integration documentation</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Key size={20} />
            Generate New Key
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active API Keys</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
              <Key size={32} className="text-primary" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">API Requests Today</p>
                <p className="text-2xl font-bold text-gray-900">3,245</p>
              </div>
              <Shield size={32} className="text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">99.8%</p>
              </div>
              <Shield size={32} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* API Key */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your API Key</h2>
          <div className="bg-gray-50 border border-gray-200 rounded p-4 flex items-center gap-3">
            <code className="flex-1 text-sm font-mono">
              {showKey ? apiKey : '•'.repeat(apiKey.length)}
            </code>
            <button
              onClick={() => setShowKey(!showKey)}
              className="text-gray-600 hover:text-gray-800"
            >
              {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <button
              onClick={copyToClipboard}
              className="text-primary hover:text-primary-dark"
            >
              <Copy size={20} />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Keep your API key secure. Never share it publicly or commit it to version control.
          </p>
        </div>

        {/* API Documentation */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Start Guide</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">1. Send SMS</h3>
              <div className="bg-gray-900 text-gray-100 rounded p-4 overflow-x-auto">
                <pre className="text-sm">
{`curl -X POST https://api.wecall.com/v1/sms/send \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+250712345678",
    "from": "RDB",
    "body": "Hello from RDB!"
  }'`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">2. Check Message Status</h3>
              <div className="bg-gray-900 text-gray-100 rounded p-4 overflow-x-auto">
                <pre className="text-sm">
{`curl -X GET https://api.wecall.com/v1/sms/MESSAGE_SID \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">3. List Messages</h3>
              <div className="bg-gray-900 text-gray-100 rounded p-4 overflow-x-auto">
                <pre className="text-sm">
{`curl -X GET https://api.wecall.com/v1/sms/list?limit=10 \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
