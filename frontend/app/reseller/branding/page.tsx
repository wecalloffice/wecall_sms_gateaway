'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Palette, Search, Edit, Eye } from 'lucide-react';
import { mockAccounts } from '@/mocks/adapters/mockAccounts';
import { mockBranding } from '@/mocks/adapters/mockBranding';
import { BrandingModal } from '@/components/modals/BrandingModal';

interface Client {
  sid: string;
  business_username: string;
  business_name: string;
  email: string;
}

interface BrandingInfo {
  client_sid: string;
  companyName: string;
  primaryColor: string;
  secondaryColor: string;
}

export default function BrandingManagementPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [brandingConfigs, setBrandingConfigs] = useState<Map<string, BrandingInfo>>(new Map());
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isBrandingModalOpen, setIsBrandingModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [previewClientSid, setPreviewClientSid] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const allClients = await mockAccounts.listClients();
      setClients(allClients);
      setFilteredClients(allClients);

      // Fetch branding for all clients
      const configs = new Map<string, BrandingInfo>();
      for (const client of allClients) {
        try {
          const branding = await mockBranding.getBrandingConfig(client.sid);
          configs.set(client.sid, {
            client_sid: client.sid,
            companyName: branding.companyName,
            primaryColor: branding.primaryColor,
            secondaryColor: branding.secondaryColor,
          });
        } catch (error) {
          console.error(`Failed to fetch branding for ${client.sid}:`, error);
        }
      }
      setBrandingConfigs(configs);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = clients.filter(
      (client) =>
        (client.business_name?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
        (client.business_username?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  const openBrandingModal = (client: Client) => {
    setSelectedClient(client);
    setIsBrandingModalOpen(true);
  };

  const handleBrandingSaved = () => {
    fetchClients();
  };

  return (
    <MainLayout role="RESELLER_ADMIN" businessName="Acme Reseller" userName="Reseller Admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Brand Management</h1>
            <p className="text-gray-600 mt-1">Customize client portal branding</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search clients by name or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field flex-1 border-0"
            />
          </div>
        </div>

        {/* Clients Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading clients...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
            <Palette size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">No clients found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => {
              const branding = brandingConfigs.get(client.sid);
              return (
                <div
                  key={client.sid}
                  className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Color Preview */}
                  <div className="h-24 flex bg-gradient-to-r" 
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${branding?.primaryColor || '#e91e63'} 0%, ${branding?.secondaryColor || '#2196f3'} 100%)`
                    }}
                  />

                  {/* Content */}
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
                          title="Primary Color"
                        />
                        <div
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{ backgroundColor: branding?.secondaryColor || '#2196f3' }}
                          title="Secondary Color"
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => openBrandingModal(client)}
                        className="btn-primary flex-1 flex items-center justify-center gap-2 py-2"
                      >
                        <Palette size={16} />
                        Customize
                      </button>
                      <button
                        onClick={() => setPreviewClientSid(client.sid)}
                        className="btn-secondary flex items-center justify-center gap-2 py-2 px-3"
                        title="Preview branding"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Branding Modal */}
        {selectedClient && (
          <BrandingModal
            isOpen={isBrandingModalOpen}
            clientSid={selectedClient.sid}
            clientName={selectedClient.business_name}
            onClose={() => {
              setIsBrandingModalOpen(false);
              setSelectedClient(null);
            }}
            onSave={handleBrandingSaved}
          />
        )}

        {/* Preview Section */}
        {previewClientSid && (
          <PreviewSection
            clientSid={previewClientSid}
            onClose={() => setPreviewClientSid(null)}
          />
        )}
      </div>
    </MainLayout>
  );
}

function PreviewSection({
  clientSid,
  onClose,
}: {
  clientSid: string;
  onClose: () => void;
}) {
  const [branding, setBranding] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBranding = async () => {
      try {
        const config = await mockBranding.getBrandingConfig(clientSid);
        setBranding(config);
      } catch (error) {
        console.error('Failed to load branding:', error);
      } finally {
        setLoading(false);
      }
    };
    loadBranding();
  }, [clientSid]);

  if (loading) {
    return <div className="text-center py-8">Loading preview...</div>;
  }

  if (!branding) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
        <button onClick={onClose} className="btn-secondary px-3 py-1 text-sm">
          Close
        </button>
      </div>

      <div
        className="rounded-lg p-8 text-white space-y-4"
        style={{ backgroundColor: branding.primaryColor }}
      >
        {branding.logoUrl && (
          <img
            src={branding.logoUrl}
            alt="Logo"
            className="h-12 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        <div>
          <h1 className="text-3xl font-bold">{branding.companyName}</h1>
          <p className="text-sm opacity-90">SMS Gateway Portal</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div
          className="h-24 rounded-lg flex items-center justify-center text-white font-semibold text-center"
          style={{ backgroundColor: branding.primaryColor }}
        >
          Primary<br/>
          <span className="text-xs font-normal">{branding.primaryColor}</span>
        </div>
        <div
          className="h-24 rounded-lg flex items-center justify-center text-white font-semibold text-center"
          style={{ backgroundColor: branding.secondaryColor }}
        >
          Secondary<br/>
          <span className="text-xs font-normal">{branding.secondaryColor}</span>
        </div>
        <div
          className="h-24 rounded-lg flex items-center justify-center text-gray-900 font-semibold text-center"
          style={{ backgroundColor: branding.accentColor }}
        >
          Accent<br/>
          <span className="text-xs font-normal">{branding.accentColor}</span>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-600 uppercase font-semibold">Support Email</p>
          <p className="text-sm text-gray-900 font-medium">{branding.supportEmail}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 uppercase font-semibold">Support Phone</p>
          <p className="text-sm text-gray-900 font-medium">{branding.supportPhone}</p>
        </div>
        <div className="col-span-2">
          <p className="text-xs text-gray-600 uppercase font-semibold">Website</p>
          <a
            href={branding.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            {branding.websiteUrl}
          </a>
        </div>
      </div>
    </div>
  );
}
