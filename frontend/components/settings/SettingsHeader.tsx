"use client";

interface Props {
  onSave: () => void;
}

export function SettingsHeader({ onSave }: Props) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Configure your account preferences</p>
      </div>
      <button onClick={onSave} className="btn-primary">
        Save Changes
      </button>
    </div>
  );
}

