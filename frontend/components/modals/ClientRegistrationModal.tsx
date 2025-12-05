"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle, X, ChevronDown } from "lucide-react";
import { COUNTRIES } from "@/lib/constants/registration";

interface ClientRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentUsername: string;
}

export function ClientRegistrationModal({ isOpen, onClose, parentUsername }: ClientRegistrationModalProps) {
  const [form, setForm] = useState({
    business_username: "",
    business_name: "",
    contact_person: "",
    contact_email: "",
    contact_phone: "",
    country: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    // Validation
    if (!form.business_username || !form.business_name || !form.contact_email || !form.password || !form.country) {
      setError("Please fill all required fields.");
      setLoading(false);
      return;
    }

    if (form.password !== form.password2) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.contact_email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    // Simulate registration
    setTimeout(() => {
      try {
        const existingAccounts = JSON.parse(localStorage.getItem("mockAccounts") || "[]");
        const accountExists = existingAccounts.some((acc: any) => acc.business_username === form.business_username);

        if (accountExists) {
          setError("Username already exists.");
          setLoading(false);
          return;
        }

        // Create client account under this reseller
        const newAccount = {
          ...form,
          created_at: new Date().toISOString(),
          account_sid: `AC_${form.business_username.toUpperCase()}`,
          business_type: "CLIENT",
          parent_reseller: parentUsername,
        };

        existingAccounts.push(newAccount);
        localStorage.setItem("mockAccounts", JSON.stringify(existingAccounts));

        setSuccess(true);
        setForm({
          business_username: "",
          business_name: "",
          contact_person: "",
          contact_email: "",
          contact_phone: "",
          country: "",
          password: "",
          password2: "",
        });

        setTimeout(() => {
          onClose();
        }, 2000);
      } catch (err) {
        setError((err as Error).message || "Registration failed.");
        setLoading(false);
      }
    }, 1500);
  };

  if (!isOpen) return null;

  const selectedCountry = COUNTRIES.find((c) => c.code === form.country);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Register Client</h2>
            <p className="text-xs text-gray-600 mt-1">Add a new client to your reseller account</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900">Client registered successfully!</p>
                <p className="text-xs text-green-700 mt-1">They can now login to their dashboard.</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Business Username */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Username <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., client1"
                  value={form.business_username}
                  onChange={(e) => handleChange("business_username", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {/* Business Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Business Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Company name"
                  value={form.business_name}
                  onChange={(e) => handleChange("business_name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {/* Contact Person */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Contact Person <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  value={form.contact_person}
                  onChange={(e) => handleChange("contact_person", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  placeholder="email@company.com"
                  value={form.contact_email}
                  onChange={(e) => handleChange("contact_email", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {/* Country */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Country <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <select
                    value={form.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                    required
                  >
                    <option value="">Select country</option>
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Phone
                </label>
                <div className="flex gap-2">
                  {selectedCountry && (
                    <div className="px-2 py-2 bg-gray-100 border border-gray-300 rounded-lg text-xs font-medium min-w-fit">
                      {selectedCountry.prefix}
                    </div>
                  )}
                  <input
                    type="tel"
                    placeholder="555-0123"
                    value={form.contact_phone}
                    onChange={(e) => handleChange("contact_phone", e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Password <span className="text-red-600">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Min 8 characters"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Confirm Password <span className="text-red-600">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Re-enter password"
                  value={form.password2}
                  onChange={(e) => handleChange("password2", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || success}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Registering..." : "Register Client"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
