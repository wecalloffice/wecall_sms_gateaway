'use client';

import { useState, useEffect } from 'react';
import BrandingHeader from '@/components/branding/BrandingHeader';
import BrandingSearchBar from '@/components/branding/BrandingSearchBar';
import BrandingGrid from '@/components/branding/BrandingGrid';
import BrandingPreview from '@/components/branding/BrandingPreview';
import { BrandingModal } from '@/components/modals/BrandingModal';
import { mockAccounts } from '@/mocks/adapters/mockAccounts';
import { mockBranding } from '@/mocks/adapters/mockBranding';
import { Client, BrandingInfo } from '@/types/branding';

export default function BrandingManagementPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [brandingConfigs, setBrandingConfigs] = useState(new Map<string, BrandingInfo>());
  const [filtered, setFiltered] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [previewSid, setPreviewSid] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const resellers = await mockAccounts.getResellers();
    const list = resellers.flatMap((r: any) => r.clients || []).map((c: any) => ({ ...c, sid: c.account_sid }));
    setClients(list);
    setFiltered(list);

    const map = new Map();
    for (const c of list) {
      const b = await mockBranding.getBrandingConfig(c.sid);
      map.set(c.sid, b);
    }
    setBrandingConfigs(map);

    setLoading(false);
  };

  useEffect(() => {
    const f = clients.filter(
      (c) =>
        (c.business_name?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
        (c.business_username?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
    );
    setFiltered(f);
  }, [searchTerm, clients]);

  return (
    <div className="space-y-6">
      <BrandingHeader />

      <BrandingSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <BrandingGrid
        clients={filtered}
        brandingConfigs={brandingConfigs}
        loading={loading}
        onCustomize={(client) => setSelectedClient(client)}
        onPreview={(sid) => setPreviewSid(sid)}
      />

      {selectedClient && (
        <BrandingModal
          isOpen
          clientSid={selectedClient.sid}
          clientName={selectedClient?.business_name ?? 'Unknown'}
          onClose={() => setSelectedClient(null)}
          onSave={() => loadData()}
        />
      )}

      {previewSid && (
        <BrandingPreview clientSid={previewSid} onClose={() => setPreviewSid(null)} />
      )}
    </div>
  );
}

