'use client';

import { useState, useEffect } from 'react';
import { X, Copy, Eye, Upload } from 'lucide-react';
import { BRANDING_FIELDS, COLOR_PRESETS } from '@/lib/constants/branding';
import { mockBranding } from '@/mocks/adapters/mockBranding';

interface BrandingModalProps {
  isOpen: boolean;
  clientSid: string;
  clientName: string;
  onClose: () => void;
  onSave: () => void;
}

export function BrandingModal({
  isOpen,
  clientSid,
  clientName,
  onClose,
  onSave,
}: BrandingModalProps) {
  const [branding, setBranding] = useState({
    companyName: '',
    logoUrl: '',
    primaryColor: '#e91e63',
    secondaryColor: '#2196f3',
    accentColor: '#ff9800',
    supportEmail: '',
    supportPhone: '',
    websiteUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadBranding();
    }
  }, [isOpen, clientSid]);

  const loadBranding = async () => {
    try {
      const config = await mockBranding.getBrandingConfig(clientSid);
      setBranding({
        companyName: config.companyName,
        logoUrl: config.logoUrl,
        primaryColor: config.primaryColor,
        secondaryColor: config.secondaryColor,
        accentColor: config.accentColor,
        supportEmail: config.supportEmail,
        supportPhone: config.supportPhone,
        websiteUrl: config.websiteUrl,
      });
    } catch (error) {
      console.error('Failed to load branding:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await mockBranding.updateBrandingConfig(clientSid, branding);
      alert('Branding updated successfully!');
      onSave();
      onClose();
    } catch (error) {
      console.error('Failed to save branding:', error);
      alert('Failed to save branding');
    } finally {
      setLoading(false);
    }
  };

  const handleColorPreset = (preset: typeof COLOR_PRESETS[0]) => {
    setBranding((prev) => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
    }));
  };

  const handleChange = (field: string, value: string) => {
    setBranding((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const copyJsonConfig = () => {
    const config = JSON.stringify(branding, null, 2);
    navigator.clipboard.writeText(config);
    alert('Configuration copied to clipboard!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Brand Client Portal</h2>
            <p className="text-gray-600 text-sm mt-1">Customize branding for: {clientName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {previewMode ? (
            // Preview Section
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
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
                <h1 className="text-3xl font-bold">{branding.companyName}</h1>
                <p className="text-sm opacity-90">SMS Gateway Portal</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div
                  className="h-24 rounded-lg flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  Primary
                </div>
                <div
                  className="h-24 rounded-lg flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: branding.secondaryColor }}
                >
                  Secondary
                </div>
                <div
                  className="h-24 rounded-lg flex items-center justify-center text-gray-900 font-semibold"
                  style={{ backgroundColor: branding.accentColor }}
                >
                  Accent
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Support Info</h4>
                <p className="text-sm text-gray-600">
                  Email: {branding.supportEmail || 'Not set'}
                </p>
                <p className="text-sm text-gray-600">
                  Phone: {branding.supportPhone || 'Not set'}
                </p>
                <p className="text-sm text-gray-600">
                  Website: {branding.websiteUrl || 'Not set'}
                </p>
              </div>

              <button
                onClick={() => setPreviewMode(false)}
                className="w-full btn-secondary"
              >
                Back to Editor
              </button>
            </div>
          ) : (
            // Editor Section
            <div className="space-y-6">
              {/* Company Name & Logo */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Branding Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company/Brand Name
                  </label>
                  <input
                    type="text"
                    value={branding.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                    placeholder={BRANDING_FIELDS.companyName.placeholder}
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={branding.logoUrl}
                      onChange={(e) => handleChange('logoUrl', e.target.value)}
                      placeholder={BRANDING_FIELDS.logoUrl.placeholder}
                      className="input-field flex-1"
                    />
                    <button className="btn-secondary px-4">
                      <Upload size={18} />
                    </button>
                  </div>
                  {branding.logoUrl && (
                    <img
                      src={branding.logoUrl}
                      alt="Logo preview"
                      className="mt-2 h-8 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Color Presets */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Color Presets</h3>
                <div className="grid grid-cols-4 gap-2">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => handleColorPreset(preset)}
                      className="p-3 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors"
                      title={preset.name}
                    >
                      <div className="flex gap-1 mb-1">
                        <div
                          className="flex-1 h-4 rounded"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <div
                          className="flex-1 h-4 rounded"
                          style={{ backgroundColor: preset.secondary }}
                        />
                      </div>
                      <p className="text-xs font-medium text-gray-700">{preset.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Colors */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Custom Colors</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={branding.primaryColor}
                        onChange={(e) => handleChange('primaryColor', e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={branding.primaryColor}
                        onChange={(e) => handleChange('primaryColor', e.target.value)}
                        className="input-field flex-1 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secondary Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={branding.secondaryColor}
                        onChange={(e) => handleChange('secondaryColor', e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={branding.secondaryColor}
                        onChange={(e) => handleChange('secondaryColor', e.target.value)}
                        className="input-field flex-1 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Accent Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={branding.accentColor}
                        onChange={(e) => handleChange('accentColor', e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={branding.accentColor}
                        onChange={(e) => handleChange('accentColor', e.target.value)}
                        className="input-field flex-1 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Contact Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Support Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={branding.supportEmail}
                    onChange={(e) => handleChange('supportEmail', e.target.value)}
                    placeholder="support@company.com"
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Support Phone
                  </label>
                  <input
                    type="tel"
                    value={branding.supportPhone}
                    onChange={(e) => handleChange('supportPhone', e.target.value)}
                    placeholder="+250712345678"
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={branding.websiteUrl}
                    onChange={(e) => handleChange('websiteUrl', e.target.value)}
                    placeholder="https://company.com"
                    className="input-field w-full"
                  />
                </div>
              </div>

              {/* Config Export */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <button
                  onClick={copyJsonConfig}
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                >
                  <Copy size={18} />
                  Copy Configuration as JSON
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex gap-3">
          {!previewMode && (
            <button
              onClick={() => setPreviewMode(true)}
              className="btn-secondary flex items-center gap-2"
            >
              <Eye size={18} />
              Preview
            </button>
          )}
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          {!previewMode && (
            <button
              onClick={handleSave}
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'Saving...' : 'Save Branding'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
