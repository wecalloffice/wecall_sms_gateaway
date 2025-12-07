'use client';

interface Props {
  role: 'CLIENT' | 'RESELLER' | 'PLATFORM';
  userName?: string;
}

export default function ProfileHeader({ role, userName = 'User' }: Props) {
  const roleLabels = {
    CLIENT: 'Client Profile',
    RESELLER: 'Reseller Profile',
    PLATFORM: 'Platform Admin Profile',
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">{roleLabels[role]}</h1>
      <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
    </div>
  );
}
