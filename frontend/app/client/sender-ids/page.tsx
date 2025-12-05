'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tag, Plus, Check, X } from 'lucide-react';

export default function ClientSenderIdsPage() {
  const [senderIds, setSenderIds] = useState([
    { id: 1, name: 'RDB', status: 'approved', submittedDate: '2024-01-10', approvedDate: '2024-01-12' },
    { id: 2, name: 'INFO', status: 'approved', submittedDate: '2024-01-15', approvedDate: '2024-01-16' },
    { id: 3, name: 'ALERT', status: 'pending', submittedDate: '2024-01-20', approvedDate: null },
  ]);

  return (
    <MainLayout role="CLIENT_ADMIN" businessName="RDB" userName="RDB User">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sender IDs</h1>
            <p className="text-gray-600 mt-1">Manage your SMS sender identities</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Request Sender ID
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sender IDs</p>
                <p className="text-2xl font-bold text-gray-900">{senderIds.length}</p>
              </div>
              <Tag size={32} className="text-primary" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {senderIds.filter(s => s.status === 'approved').length}
                </p>
              </div>
              <Check size={32} className="text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {senderIds.filter(s => s.status === 'pending').length}
                </p>
              </div>
              <Tag size={32} className="text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Sender IDs Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Sender ID List</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sender ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approved Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {senderIds.map((sender) => (
                  <tr key={sender.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{sender.name}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        sender.status === 'approved' ? 'bg-green-100 text-green-800' :
                        sender.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {sender.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{sender.submittedDate}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{sender.approvedDate || '-'}</td>
                    <td className="px-6 py-4 text-sm">
                      {sender.status === 'approved' ? (
                        <button className="text-gray-600 hover:text-gray-800">View</button>
                      ) : (
                        <button className="text-red-600 hover:text-red-800">Cancel Request</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Sender ID Guidelines</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Sender IDs must be 3-11 characters long</li>
            <li>Only alphanumeric characters are allowed</li>
            <li>Approval typically takes 2-3 business days</li>
            <li>Ensure your brand name matches registration documents</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
}
