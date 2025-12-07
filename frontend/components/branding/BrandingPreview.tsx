'use client';

import { useEffect, useState } from 'react';
import { mockBranding } from '@/mocks/adapters/mockBranding';

interface Props {
  clientSid: string;
  onClose: () => void;
}

export default function BrandingPreview({ clientSid, onClose }: Props) {
  const [branding, setBranding] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBrand = async () => {
      setBranding(await mockBranding.getBrandingConfig(clientSid));
      setLoading(false);
    };
    loadBrand();
  }, [clientSid]);

  if (loading) return <p className="py-8 text-center">Loading preview…</p>;

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
        <button onClick={onClose} className="btn-secondary px-3 py-1 text-sm">Close</button>
      </div>

      <div
        className="rounded-lg p-8 text-white space-y-4"
        style={{ backgroundColor: branding.primaryColor }}
      >
        {branding.logoUrl && (
          <img src={branding.logoUrl} className="h-12 object-contain" />
        )}

        <div>
          <h1 className="text-3xl font-bold">{branding.companyName}</h1>
          <p className="text-sm opacity-90">SMS Gateway Portal</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[ 
          { label: 'Primary', color: branding.primaryColor },
          { label: 'Secondary', color: branding.secondaryColor },
          { label: 'Accent', color: branding.accentColor }
        ].map((c) => (
          <div
            key={c.label}
            className="h-24 rounded-lg flex items-center justify-center text-white font-semibold text-center"
            style={{ backgroundColor: c.color }}
          >
            {c.label}<br />
            <span className="text-xs font-normal">{c.color}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
