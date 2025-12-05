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
  Eye,
  EyeOff,
  Copy,
  Check,
  Shield,
} from 'lucide-react';
import { mockProfile } from '@/mocks/adapters/mockProfile';

export default function ClientProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      const profileData = await mockProfile.getProfile('CLIENT_ADMIN');
      const statsData = await mockProfile.getAccountStats('AC_CLIENT_001');
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
      const updated = await mockProfile.updateProfile('AC_CLIENT_001', formData);
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
      <MainLayout role="CLIENT_ADMIN" businessName="RDB" userName="RDB User">
        <div className="text-center py-12">Loading profile...</div>
      </MainLayout>
    );
  }

  if (!profile) {
    return (
      <MainLayout role="CLIENT_ADMIN" businessName="RDB" userName="RDB User">
        <div className="text-center py-12">Profile not found</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout role="CLIENT_ADMIN" businessName="RDB" userName="RDB User">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-1">Manage your account information and settings</p>
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

        {/* Profile Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Account Status */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Account Status</h3>
              <Shield size={24} className="text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600 capitalize">{profile.account_status}</p>
            <p className="text-sm text-gray-600 mt-2">Member since {new Date(profile.created_at).toLocaleDateString()}</p>
          </div>

          {/* Total SMS Sent */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Total SMS Sent</h3>
            <p className="text-2xl font-bold text-blue-600">{stats?.total_sms_sent.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mt-2">Total cost: ${stats?.total_cost.toFixed(2)}</p>
          </div>

          {/* Account Balance */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Account Balance</h3>
            <p className="text-2xl font-bold text-green-600">${stats?.account_balance.toFixed(2)}</p>
            <button className="btn-primary w-full mt-2 py-2">Top Up Balance</button>
          </div>
        </div>

        {/* Main Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Account Details */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow border border-gray-200 p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Business Name</p>
                    <p className="text-lg font-semibold text-gray-900">{profile.business_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Username</p>
                    <p className="text-lg font-semibold text-gray-900">@{profile.business_username}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between py-3 hover:bg-gray-50 px-2 rounded">
                    <div className="flex items-center gap-3">
                      <Mail size={18} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Email Address</p>
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
                        <p className="text-sm text-gray-600">Phone Number</p>
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
                        <p className="text-sm text-gray-600">Contact Person</p>
                        <p className="font-medium text-gray-900">{profile.contact_person || 'Not set'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 hover:bg-gray-50 px-2 rounded">
                    <div className="flex items-center gap-3">
                      <MapPin size={18} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Country</p>
                        <p className="font-medium text-gray-900">{profile.country}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 hover:bg-gray-50 px-2 rounded">
                    <div className="flex items-center gap-3">
                      <Calendar size={18} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Member Since</p>
                        <p className="font-medium text-gray-900">{new Date(profile.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Quick Actions */}
          <div className="space-y-4">
            {/* Change Password */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Lock size={20} />
                Security
              </h3>
              <button className="w-full btn-secondary mb-2">Change Password</button>
              <button className="w-full btn-secondary">Enable 2FA</button>
            </div>

            {/* Account ID */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Account ID</h3>
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
              <p className="text-xs text-gray-500 mt-2">Use this ID for API integration</p>
            </div>

            {/* Account Status Badge */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <p className="text-sm text-green-700 font-medium">✓ Account is active</p>
              <p className="text-xs text-green-600 mt-1">All services are available</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
