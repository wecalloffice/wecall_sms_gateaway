'use client';

import { useState } from 'react';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileForm from '@/components/profile/ProfileForm';
import ProfileSettings from '@/components/profile/ProfileSettings';

interface ProfileManagementPageProps {
  role: 'CLIENT' | 'RESELLER' | 'PLATFORM';
}

export default function ProfileManagementPage({ role }: ProfileManagementPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock user data - in real app, fetch from API
  const [profileData, setProfileData] = useState({
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Acme Corp',
  });

  const handleSaveProfile = async (data: any) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfileData(data);
      console.log('Profile updated:', data);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <ProfileHeader role={role} userName={profileData.fullName} />

      <ProfileForm
        fullName={profileData.fullName}
        email={profileData.email}
        phone={profileData.phone}
        company={profileData.company}
        onSave={handleSaveProfile}
        isLoading={isLoading}
      />

      <ProfileSettings />
    </div>
  );
}
