'use client';

import { Eye, Palette } from 'lucide-react';
import { BrandingInfo, Client } from '@/types/branding';

interface Props {
  client: Client;
  branding?: BrandingInfo | null;
  onCustomize: (client: Client) => void;
  onPreview: (sid: string) => void;
}

export default function ClientBrandCard({ client, branding, onCustomize, onPreview }: Props) {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Gradient Branding Preview */}
      <div
        className="h-24"
        style={{
          backgroundImage: `linear-gradient(135deg, ${
            branding?.primaryColor || '#e91e63'
          } 0%, ${branding?.secondaryColor || '#2196f3'} 100%)`
        }}
      />

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">{client.business_name}</h3>
          <p className="text-sm text-gray-600">@{client.business_username}</p>
          <p className="text-xs text-gray-500 mt-1">{client.email}</p>
        </div>

        {/* Branding Info */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">Branding:</p>
          <p className="text-xs text-gray-600 mb-1">
            Brand: {branding?.companyName || 'Default'}
          </p>

          <div className="flex gap-2">
            <div
              className="w-6 h-6 rounded border border-gray-300"
              style={{ backgroundColor: branding?.primaryColor || '#e91e63' }}
            />
            <div
              className="w-6 h-6 rounded border border-gray-300"
              style={{ backgroundColor: branding?.secondaryColor || '#2196f3' }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onCustomize(client)}
            className="btn-primary flex-1 flex items-center justify-center gap-2 py-2"
          >
            <Palette size={16} />
            Customize
          </button>

          <button
            onClick={() => onPreview(client.sid)}
            className="btn-secondary flex items-center justify-center gap-2 py-2 px-3"
          >
            <Eye size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
