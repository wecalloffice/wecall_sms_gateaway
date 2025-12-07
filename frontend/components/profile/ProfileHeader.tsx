"use client";

interface Props {
  profile: any;
  editMode: boolean;
  setEditMode: (v: boolean) => void;
}

export function ProfileHeader({ profile, editMode, setEditMode }: Props) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your account information and settings</p>
      </div>
      {!editMode && (
        <button onClick={() => setEditMode(true)} className="btn-primary">
          Edit Profile
        </button>
      )}
    </div>
  );
}
