"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { mockProfile } from "@/mocks/adapters/mockProfile";

import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfileEditForm } from "@/components/profile/ProfileEditForm";
import { SecurityPanel } from "@/components/profile/SecurityPanel";
import { AccountIDCard } from "@/components/profile/AccountIDCard";

export default function ClientProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    contact_person: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileData = await mockProfile.getProfile("CLIENT_ADMIN");
      const statsData = await mockProfile.getAccountStats("AC_CLIENT_001");
      setProfile(profileData);
      setStats(statsData);
      setFormData({
        contact_person: profileData.contact_person || "",
        phone: profileData.phone || "",
        email: profileData.email || "",
      });
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const updated = await mockProfile.updateProfile("AC_CLIENT_001", formData);
      setProfile(updated);
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile");
    }
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
        <ProfileHeader
          profile={profile}
          editMode={editMode}
          setEditMode={setEditMode}
        />

        <ProfileStats profile={profile} stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ProfileEditForm
            profile={profile}
            editMode={editMode}
            formData={formData}
            setFormData={setFormData}
            onSave={handleSaveProfile}
          />
          <div className="space-y-4">
            <SecurityPanel />
            <AccountIDCard profile={profile} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
