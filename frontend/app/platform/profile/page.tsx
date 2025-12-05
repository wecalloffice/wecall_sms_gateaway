'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Lock,
  Copy,
  Check,
  Shield,
  Users,
  Building2,
  BarChart3,
  Server,
} from 'lucide-react';
import { mockProfile } from '@/mocks/adapters/mockProfile';

export default function PlatformProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    contact_person: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileData = await mockProfile.getProfile('PLATFORM_ADMIN');
      const statsData = await mockProfile.getAccountStats('AC_PLATFORM_001');
      setProfile(profileData);
      setStats(statsData);
      setFormData({
        contact_person: profileData.contact_person || '',
        phone: profileData.phone || '',
        email: profileData.email || '',
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const updated = await mockProfile.updateProfile('AC_PLATFORM_001', formData);
      setProfile(updated);
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile');
    }
  };

  const copyToClipboard = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (loading) {
    return (
      <MainLayout role="PLATFORM_ADMIN" businessName="WeCall SMS" userName="Platform Admin">
        <div className="text-center py-12">Loading profile...</div>
      </MainLayout>
    );
  }

  if (!profile) {
    return (
      <MainLayout role="PLATFORM_ADMIN" businessName="WeCall SMS" userName="Platform Admin">
        <div className="text-center py-12">Profile not found</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout role="PLATFORM_ADMIN" businessName="WeCall SMS" userName="Platform Admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Platform Administration</h1>
            <p className="text-gray-600 mt-1">System administrator profile and platform statistics</p>
          </div>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="btn-primary"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Platform Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total Clients */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Total Clients</h3>
              <Users size={24} className="text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{stats?.active_clients}</p>
            <p className="text-sm text-gray-600 mt-2">Active accounts</p>
          </div>

          {/* Total Resellers */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Total Resellers</h3>
              <Building2 size={24} className="text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">{stats?.active_sub_resellers}</p>
            <p className="text-sm text-gray-600 mt-2">Reseller accounts</p>
          </div>

          {/* Total SMS Sent */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Total SMS Sent</h3>
              <BarChart3 size={24} className="text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-600">{(stats?.total_sms_sent / 1000000).toFixed(2)}M</p>
            <p className="text-sm text-gray-600 mt-2">All time</p>
          </div>

          {/* Platform Revenue */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Total Revenue</h3>
              <Server size={24} className="text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-orange-600">${(stats?.total_cost / 1000).toFixed(1)}K</p>
            <p className="text-sm text-gray-600 mt-2">Platform revenue</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Profile Details */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow border border-gray-200 p-6 space-y-6">
            {/* Platform Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Information</h2>
            </div>

            {editMode ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={formData.contact_person}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field w-full"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveProfile}
                    className="btn-primary flex-1"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600">Platform Name</p>
                    <p className="text-lg font-semibold text-gray-900">{profile.business_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Administrator</p>
                    <p className="text-lg font-semibold text-gray-900">@{profile.business_username}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex items-center justify-between py-3 hover:bg-gray-50 px-2 rounded">
                    <div className="flex items-center gap-3">
                      <Mail size={18} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Admin Email</p>
                        <p className="font-medium text-gray-900">{profile.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(profile.email, 'email')}
                      className="p-2 hover:bg-gray-100 rounded transition-colors"
                    >
                      {copiedField === 'email' ? (
                        <Check size={18} className="text-green-600" />
                      ) : (
                        <Copy size={18} className="text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3 hover:bg-gray-50 px-2 rounded">
                    <div className="flex items-center gap-3">
                      <Phone size={18} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Emergency Phone</p>
                        <p className="font-medium text-gray-900">{profile.phone}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(profile.phone, 'phone')}
                      className="p-2 hover:bg-gray-100 rounded transition-colors"
                    >
                      {copiedField === 'phone' ? (
                        <Check size={18} className="text-green-600" />
                      ) : (
                        <Copy size={18} className="text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3 hover:bg-gray-50 px-2 rounded">
                    <div className="flex items-center gap-3">
                      <User size={18} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Administrator Name</p>
                        <p className="font-medium text-gray-900">{profile.contact_person || 'Not set'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 hover:bg-gray-50 px-2 rounded">
                    <div className="flex items-center gap-3">
                      <MapPin size={18} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Base Location</p>
                        <p className="font-medium text-gray-900">{profile.country}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 hover:bg-gray-50 px-2 rounded">
                    <div className="flex items-center gap-3">
                      <Calendar size={18} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Launched</p>
                        <p className="font-medium text-gray-900">{new Date(profile.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: System Admin Controls */}
          <div className="space-y-4">
            {/* System Security */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield size={20} />
                System Security
              </h3>
              <button className="w-full btn-secondary mb-2 text-sm py-2">Change Admin Password</button>
              <button className="w-full btn-secondary mb-2 text-sm py-2">Enable 2FA</button>
              <button className="w-full btn-secondary text-sm py-2">System Audit Log</button>
            </div>

            {/* Platform Settings */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Platform Management</h3>
              <div className="space-y-2">
                <button className="w-full btn-secondary text-sm py-2">SMS Gateways</button>
                <button className="w-full btn-secondary text-sm py-2">Users & Roles</button>
                <button className="w-full btn-secondary text-sm py-2">System Config</button>
              </div>
            </div>

            {/* Platform ID */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Platform ID</h3>
              <div className="bg-gray-50 p-3 rounded flex items-center justify-between gap-2">
                <code className="text-xs font-mono text-gray-600">{profile.sid}</code>
                <button
                  onClick={() => copyToClipboard(profile.sid, 'sid')}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  {copiedField === 'sid' ? (
                    <Check size={16} className="text-green-600" />
                  ) : (
                    <Copy size={16} className="text-gray-400" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Internal system identifier</p>
            </div>

            {/* Status Badge */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <p className="text-sm text-green-700 font-medium">✓ Platform is operational</p>
              <p className="text-xs text-green-600 mt-1">All systems active</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
