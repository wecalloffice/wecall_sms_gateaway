'use client';

interface ProfileFormProps {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  onSave: (data: any) => void;
  isLoading?: boolean;
}

export default function ProfileForm({
  fullName,
  email,
  phone,
  company,
  onSave,
  isLoading = false,
}: ProfileFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSave({
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      company: formData.get('company'),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow border border-gray-200 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            name="fullName"
            defaultValue={fullName}
            className="input-field w-full"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            defaultValue={email}
            className="input-field w-full"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            name="phone"
            defaultValue={phone}
            className="input-field w-full"
            placeholder="+1 (555) 000-0000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
          <input
            type="text"
            name="company"
            defaultValue={company}
            className="input-field w-full"
            placeholder="Your Company"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-pink-700 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
