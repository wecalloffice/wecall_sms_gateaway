"use client";

import { useState } from "react";
import { Mail, Phone, User, MapPin, Calendar } from "lucide-react";

interface Props {
  profile: any;
  editMode: boolean;
  formData: any;
  setFormData: (v: any) => void;
  onSave: () => void;
}

export function ProfileEditForm({ profile, editMode, formData, setFormData, onSave }: Props) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (editMode) {
    return (
      <div className="lg:col-span-2 bg-white rounded-lg shadow border border-gray-200 p-6 space-y-4">
        {["contact_person", "email", "phone"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.replace("_", " ").toUpperCase()}</label>
            <input
              type="text"
              value={formData[field]}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              className="input-field w-full"
            />
          </div>
        ))}
        <div className="flex gap-3 pt-4">
          <button onClick={onSave} className="btn-primary flex-1">Save Changes</button>
          <button onClick={() => setFormData({ ...formData })} className="btn-secondary flex-1">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 bg-white rounded-lg shadow border border-gray-200 p-6 space-y-4">
      {[
        { icon: Mail, label: "Email", value: profile.email },
        { icon: Phone, label: "Phone", value: profile.phone },
        { icon: User, label: "Contact Person", value: profile.contact_person },
        { icon: MapPin, label: "Country", value: profile.country },
        { icon: Calendar, label: "Member Since", value: new Date(profile.created_at).toLocaleDateString() },
      ].map((row) => (
        <div key={row.label} className="flex items-center gap-3 py-3 hover:bg-gray-50 px-2 rounded">
          <row.icon className="text-gray-400" size={18} />
          <div>
            <p className="text-sm text-gray-600">{row.label}</p>
            <p className="font-medium text-gray-900">{row.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
