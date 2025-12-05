"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, CheckCircle, Mail, Building2, Lock, Phone, MapPin, ChevronDown } from "lucide-react";
import { COUNTRIES, RESELLER_ACCOUNT_TYPES, BUSINESS_INDUSTRIES, COMPANY_SIZES } from "@/lib/constants/registration";
import type { RegisterPayload } from "../types";

const initialForm: RegisterPayload = {
  business_username: "",
  business_name: "",
  business_type: "CLIENT",
  contact_person: "",
  contact_email: "",
  contact_phone: "",
  country: "",
  password: "",
  password2: "",
};

const initialResellerFields = {
  company_size: "",
  industry: "",
  account_type: "BASIC",
  tax_id: "",
  company_registration: "",
};

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterPayload>(initialForm);
  const [resellerFields, setResellerFields] = useState(initialResellerFields);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [canBeReseller, setCanBeReseller] = useState(false);

  function update<K extends keyof RegisterPayload>(key: K, value: RegisterPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateResellerFields(key: string, value: string) {
    setResellerFields((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    if (form.password !== form.password2) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!form.business_username || !form.business_name || !form.contact_email || !form.password || !form.country) {
      setError("Please fill all required fields.");
      setLoading(false);
      return;
    }

    if (form.business_type === "RESELLER" && (!resellerFields.company_size || !resellerFields.industry || !resellerFields.account_type)) {
      setError("Please complete all reseller-specific fields.");
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
        // Check for existing account
        const existingAccounts = JSON.parse(localStorage.getItem("mockAccounts") || "[]");
        const accountExists = existingAccounts.some(
          (acc: any) => acc.business_username === form.business_username
        );

        if (accountExists) {
          setError("Username already exists. Please choose a different username.");
          setLoading(false);
          return;
        }

        // Create new account with reseller fields if applicable
        const newAccount = {
          ...form,
          created_at: new Date().toISOString(),
          account_sid: `AC_${form.business_username.toUpperCase()}`,
          ...(form.business_type === "RESELLER" && {
            reseller_details: {
              ...resellerFields,
              sub_clients: [],
              created_date: new Date().toISOString(),
            },
          }),
        };

        existingAccounts.push(newAccount);
        localStorage.setItem("mockAccounts", JSON.stringify(existingAccounts));

        setSuccess(true);
        setForm(initialForm);
        setResellerFields(initialResellerFields);

        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } catch (err) {
        setError((err as Error).message || "Registration failed. Please try again.");
        setLoading(false);
      }
    }, 1500);
  }

  const selectedCountry = COUNTRIES.find((c) => c.code === form.country);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
      <div className="w-full max-w-4xl">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Create Your Account
            </h1>
            <p className="text-gray-600 text-sm mt-2">
              Join WeCall SMS - Choose your account type
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900">Registration successful!</p>
                <p className="text-xs text-green-700 mt-1">Redirecting to login...</p>
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

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Account Type Selection */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-100 transition-colors"
                style={{ backgroundColor: form.business_type === "CLIENT" ? "#f3f4f6" : "transparent" }}>
                <input
                  type="radio"
                  name="business_type"
                  value="CLIENT"
                  checked={form.business_type === "CLIENT"}
                  onChange={(e) => {
                    update("business_type", e.target.value as any);
                    setCanBeReseller(false);
                  }}
                  className="w-4 h-4"
                />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Client</p>
                  <p className="text-xs text-gray-600">Send SMS directly</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-100 transition-colors"
                style={{ backgroundColor: form.business_type === "RESELLER" ? "#f3f4f6" : "transparent" }}>
                <input
                  type="radio"
                  name="business_type"
                  value="RESELLER"
                  checked={form.business_type === "RESELLER"}
                  onChange={(e) => {
                    update("business_type", e.target.value as any);
                    setCanBeReseller(true);
                  }}
                  className="w-4 h-4"
                />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Reseller</p>
                  <p className="text-xs text-gray-600">Manage sub-clients</p>
                </div>
              </label>
            </div>

            {/* Basic Business Information */}
            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Business Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Business Username */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Building2 size={16} />
                    Business Username <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., mycompany"
                    value={form.business_username}
                    onChange={(e) => update("business_username", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500">Used for login (unique)</p>
                </div>

                {/* Business Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Building2 size={16} />
                    Business Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., My Company Ltd"
                    value={form.business_name}
                    onChange={(e) => update("business_name", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Person */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Contact Person <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., John Doe"
                    value={form.contact_person}
                    onChange={(e) => update("contact_person", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                {/* Contact Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Mail size={16} />
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="contact@company.com"
                    value={form.contact_email}
                    onChange={(e) => update("contact_email", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin size={16} />
                    Country <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={form.country}
                      onChange={(e) => update("country", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                      required
                    >
                      <option value="">Select a country</option>
                      {COUNTRIES.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name} ({country.prefix})
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Phone size={16} />
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    {selectedCountry && (
                      <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 min-w-fit">
                        {selectedCountry.prefix}
                      </div>
                    )}
                    <input
                      type="tel"
                      placeholder="555-0123"
                      value={form.contact_phone}
                      onChange={(e) => update("contact_phone", e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Number without country code</p>
                </div>
              </div>
            </div>

            {/* Reseller-Specific Fields */}
            {form.business_type === "RESELLER" && (
              <div className="border-t pt-6 bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Reseller Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Reseller Account Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Account Type <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={resellerFields.account_type}
                        onChange={(e) => updateResellerFields("account_type", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                        required
                      >
                        {RESELLER_ACCOUNT_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label} - {type.description}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Company Size */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Company Size <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={resellerFields.company_size}
                        onChange={(e) => updateResellerFields("company_size", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                        required
                      >
                        <option value="">Select company size</option>
                        {COMPANY_SIZES.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Industry */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Industry <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={resellerFields.industry}
                        onChange={(e) => updateResellerFields("industry", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                        required
                      >
                        <option value="">Select industry</option>
                        {BUSINESS_INDUSTRIES.map((ind) => (
                          <option key={ind} value={ind}>
                            {ind}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Tax ID */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Tax ID / VAT Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., VAT123456789"
                      value={resellerFields.tax_id}
                      onChange={(e) => updateResellerFields("tax_id", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {/* Company Registration */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Company Registration Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., CR123456"
                      value={resellerFields.company_registration}
                      onChange={(e) => updateResellerFields("company_registration", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Password Section */}
            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Security</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Lock size={16} />
                    Password <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Min 8 characters"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500">Use letters, numbers, and symbols</p>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Lock size={16} />
                    Confirm Password <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Re-enter password"
                    value={form.password2}
                    onChange={(e) => update("password2", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed text-base font-semibold py-3"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Sign In
            </Link>
          </p>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-8">
            © 2025 WeCall SMS. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
