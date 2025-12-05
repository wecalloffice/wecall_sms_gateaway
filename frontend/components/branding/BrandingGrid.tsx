'use client';

import ClientBrandCard from './ClientBrandCard';
import { Client, BrandingInfo } from '@/types/branding';

interface Props {
  clients: Client[];
  brandingConfigs: Map<string, BrandingInfo>;
  loading: boolean;
  onCustomize: (client: Client) => void;
  onPreview: (sid: string) => void;
}

export default function BrandingGrid({
  clients,
  brandingConfigs,
  loading,
  onCustomize,
  onPreview
}: Props) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading clients...</p>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
        <p className="text-gray-600">No clients found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clients.map((client) => (
        <ClientBrandCard
          key={client.sid}
          client={client}
          branding={brandingConfigs.get(client.sid)}
          onCustomize={onCustomize}
          onPreview={onPreview}
        />
      ))}
    </div>
  );
}
