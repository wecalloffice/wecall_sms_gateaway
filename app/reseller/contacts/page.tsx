'use client';

import MainLayout from '@/components/layout/MainLayout';

export default function Page() {
  return (
    <MainLayout role="RESELLER_ADMIN" businessName="KCB Bank" userName="John Kariuki">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600 mt-1">Manage contacts</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <p className="text-gray-600">Content for Contacts page</p>
        </div>
      </div>
    </MainLayout>
  );
}
