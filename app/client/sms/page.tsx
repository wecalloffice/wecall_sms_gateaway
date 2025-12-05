'use client';

import MainLayout from '@/components/layout/MainLayout';

export default function Page() {
  return (
    <MainLayout role="CLIENT_ADMIN" businessName="Rwanda Development Board" userName="Alice Mukamana">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SMS</h1>
          <p className="text-gray-600 mt-1">Send SMS messages</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <p className="text-gray-600">Content for SMS page</p>
        </div>
      </div>
    </MainLayout>
  );
}
