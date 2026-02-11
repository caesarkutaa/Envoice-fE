"use client";

import { useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
  Building2,
  MapPin,
  Phone,
  Upload,
  X,
  Loader2,
  Globe,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

interface BusinessProfile {
  name: string;
  location: string;
  contact: string;
  currency: string;
  countryCode: string; // ✅ NEW: Add countryCode
  logo?: string;
}

// ✅ NEW: Country code options
const COUNTRY_CODES = [
  { label: "🇳🇬 Nigeria (+234)", value: "+234" },
  { label: "🇺🇸 United States (+1)", value: "+1" },
  { label: "🇬🇧 United Kingdom (+44)", value: "+44" },
  { label: "🇨🇦 Canada (+1)", value: "+1" },
  { label: "🇦🇺 Australia (+61)", value: "+61" },
  { label: "🇿🇦 South Africa (+27)", value: "+27" },
  { label: "🇰🇪 Kenya (+254)", value: "+254" },
  { label: "🇬🇭 Ghana (+233)", value: "+233" },
  { label: "🇮🇳 India (+91)", value: "+91" },
  { label: "🇩🇪 Germany (+49)", value: "+49" },
  { label: "🇫🇷 France (+33)", value: "+33" },
  { label: "🇪🇸 Spain (+34)", value: "+34" },
  { label: "🇮🇹 Italy (+39)", value: "+39" },
  { label: "🇧🇷 Brazil (+55)", value: "+55" },
  { label: "🇲🇽 Mexico (+52)", value: "+52" },
  { label: "🇯🇵 Japan (+81)", value: "+81" },
  { label: "🇨🇳 China (+86)", value: "+86" },
  { label: "🇷🇺 Russia (+7)", value: "+7" },
  { label: "🇸🇬 Singapore (+65)", value: "+65" },
  { label: "🇦🇪 UAE (+971)", value: "+971" },
  { label: "🇸🇦 Saudi Arabia (+966)", value: "+966" },
  { label: "🇪🇬 Egypt (+20)", value: "+20" },
  { label: "🇲🇦 Morocco (+212)", value: "+212" },
  { label: "🇹🇷 Turkey (+90)", value: "+90" },
];

export default function BusinessProfilePage() {
  const { accessToken, clearAuth, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ✅ UPDATED: Add countryCode to form state
  const [form, setForm] = useState({
    name: "",
    location: "",
    contact: "",
    currency: "",
    countryCode: "+234", // Default to Nigeria
    logo: null as File | null,
  });

  useEffect(() => {
    if (!authLoading && accessToken) {
      fetchProfile();
    } else if (!authLoading && !accessToken) {
      console.log("No token after auth loading complete, redirecting to login");
      window.location.href = "/login";
    }
  }, [authLoading, accessToken]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${base_url}/business-profile/get`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.status === 401) {
        console.error("Token is invalid or expired. Redirecting to login...");
        clearAuth();
        window.location.href = "/login";
        return;
      }

      if (res.ok) {
        const data = await res.json();
        console.log("Fetched profile data:", data);
        
        // ✅ UPDATED: Set countryCode from API response
        setProfile(data);
        if (data) {
          setForm({
            name: data.name || "",
            location: data.location || "",
            contact: data.contact || "",
            currency: data.currency || "NGN",
            countryCode: data.countryCode || "+234", // Default fallback
            logo: null,
          });
        }
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, logo: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("location", form.location);
    formData.append("contact", form.contact);
    formData.append("currency", form.currency);
    formData.append("countryCode", form.countryCode); // ✅ NEW: Include countryCode
    if (form.logo) formData.append("file", form.logo);

    const url =
      editing && profile
        ? `${base_url}/business-profile/update`
        : `${base_url}/business-profile/create`;

    try {
      const res = await fetch(url, {
        method: editing && profile ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (res.ok) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        window.location.reload();
      } else {
        console.error("Failed to update profile");
        setSubmitting(false);
        alert("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitting(false);
      alert("An error occurred. Please try again.");
    }
  };

  const handleDelete = async () => {
    const res = await fetch(`${base_url}/business-profile/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (res.ok) {
      setProfile(null);
      setShowDeleteModal(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 font-semibold">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 sm:mb-8 animate-fade-in">
          <div className="bg-blue-900 p-3 rounded-2xl shadow-lg">
            <Building2 className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-blue-900 bg-clip-text text-transparent">
              Business Profile
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Manage your business information
            </p>
          </div>
        </div>

        {editing ? (
          // FORM SECTION
          <div className="bg-white/95 backdrop-blur-xl rounded-lg shadow-2xl border border-white/20 overflow-hidden animate-scale-in">
            <div className="bg-blue-900 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm p-2 sm:p-3 rounded-lg">
                    <Pencil className="text-white" size={24} />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {profile ? "Edit Profile" : "Create Profile"}
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setEditing(false);
                    setLogoPreview(null);
                  }}
                  disabled={submitting}
                  className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-4 sm:p-6 lg:p-8 space-y-5"
            >
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Business Logo
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                    {logoPreview || profile?.logo ? (
                      <img
                        src={logoPreview || profile?.logo}
                        alt="Logo preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Upload className="text-gray-400" size={32} />
                    )}
                  </div>
                  <div className="flex-1 w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={submitting}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className={`cursor-pointer inline-flex items-center gap-2 bg-blue-900 text-white px-4 py-2.5 rounded-lg hover:from-blue-400 hover:to-blue-700 transform transition-all duration-200 hover:scale-105 shadow-md font-medium text-sm ${
                        submitting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <Upload size={18} />
                      Choose Logo
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Name */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Business Name
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Building2 className="text-blue-600" size={20} />
                  </div>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    disabled={submitting}
                    placeholder="Enter your business name"
                    className="w-full border-2 border-gray-300 bg-white rounded-lg p-3 pl-11 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none text-gray-900 font-medium placeholder-gray-400 text-sm sm:text-base shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <MapPin className="text-green-600" size={20} />
                  </div>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    disabled={submitting}
                    placeholder="e.g., 123 Main St, Lagos, Nigeria"
                    className="w-full border-2 border-gray-300 bg-white rounded-lg p-3 pl-11 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none text-gray-900 font-medium placeholder-gray-400 text-sm sm:text-base shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  />
                </div>
              </div>

              {/* Country Code */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Country Code
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Globe className="text-indigo-600" size={20} />
                  </div>
                  <select
                    value={form.countryCode}
                    onChange={(e) =>
                      setForm({ ...form, countryCode: e.target.value })
                    }
                    disabled={submitting}
                    required
                    className="w-full border-2 border-gray-300 bg-white rounded-lg p-3 pl-11 pr-10 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none text-gray-900 font-medium text-sm sm:text-base shadow-sm disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
                  >
                    {COUNTRY_CODES.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Select your country for WhatsApp integration
                </p>
              </div>

              {/* Contact */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Contact Number
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Phone className="text-purple-600" size={20} />
                  </div>
                  <input
                    type="tel"
                    value={form.contact}
                    onChange={(e) =>
                      setForm({ ...form, contact: e.target.value })
                    }
                    disabled={submitting}
                    placeholder="e.g., 8012345678 (without country code)"
                    className="w-full border-2 border-gray-300 bg-white rounded-lg p-3 pl-11 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 outline-none text-gray-900 font-medium placeholder-gray-400 text-sm sm:text-base shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter phone number without country code (e.g., 8012345678)
                </p>
              </div>

              {/* Currency */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Business Currency
                </label>
                <div className="relative">
                  <select
                    value={form.currency}
                    onChange={(e) =>
                      setForm({ ...form, currency: e.target.value })
                    }
                    disabled={submitting}
                    required
                    className="w-full border-2 border-gray-300 bg-white rounded-lg p-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none text-gray-900 font-medium text-sm sm:text-base shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="" disabled>
                      Select currency
                    </option>
                    <option value="NGN">₦ Nigerian Naira (NGN)</option>
                    <option value="USD">$ US Dollar (USD)</option>
                    <option value="EUR">€ Euro (EUR)</option>
                    <option value="GBP">£ British Pound (GBP)</option>
                    <option value="CAD">C$ Canadian Dollar (CAD)</option>
                    <option value="AUD">A$ Australian Dollar (AUD)</option>
                    <option value="ZAR">R South African Rand (ZAR)</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transform transition-all duration-200 hover:scale-105 shadow-lg font-bold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      {profile ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{profile ? "Update Profile" : "Create Profile"}</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setLogoPreview(null);
                  }}
                  disabled={submitting}
                  className="flex-1 sm:flex-initial bg-gray-100 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-200 transform transition-all duration-200 hover:scale-105 font-bold shadow-sm border border-gray-300 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : profile ? (
          // PROFILE DISPLAY
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-scale-in">
            <div className="bg-blue-900 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  {profile.logo ? (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-xl shadow-lg overflow-hidden">
                      <img
                        src={profile.logo}
                        alt="Business Logo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Building2 className="text-white" size={40} />
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                      {profile.name}
                    </h2>
                    <p className="text-blue-100 text-sm">Business Profile</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setForm({
                        name: profile.name || "",
                        location: profile.location || "",
                        contact: profile.contact || "",
                        currency: profile.currency || "NGN",
                        countryCode: profile.countryCode || "+234",
                        logo: null,
                      });
                      setEditing(true);
                    }}
                    className="p-3 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transform transition-all duration-200 hover:scale-110 shadow-md"
                    title="Edit Profile"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="p-3 bg-red-500/90 backdrop-blur-sm text-white rounded-lg hover:bg-red-600 transform transition-all duration-200 hover:scale-110 shadow-md"
                    title="Delete Profile"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Location */}
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="bg-green-100 p-3 rounded-lg">
                  <MapPin className="text-green-600" size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-semibold uppercase mb-1">
                    Location
                  </p>
                  <p className="text-gray-900 font-semibold text-base sm:text-lg">
                    {profile.location}
                  </p>
                </div>
              </div>

              {/* Contact with Country Code */}
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Phone className="text-purple-600" size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-semibold uppercase mb-1">
                    Contact
                  </p>
                  <p className="text-gray-900 font-semibold text-base sm:text-lg">
                    {profile.countryCode} {profile.contact}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Country: {profile.countryCode}
                  </p>
                </div>
              </div>

              {/* Currency */}
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <svg
                    className="text-blue-600"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-semibold uppercase mb-1">
                    Currency
                  </p>
                  <p className="text-gray-900 font-semibold text-base sm:text-lg">
                    {profile.currency}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // NO PROFILE STATE
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center border border-gray-100 animate-scale-in">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 size={48} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No Business Profile
            </h3>
            <p className="text-gray-600 mb-6">
              Create your business profile to get started
            </p>
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-900 text-white px-8 py-3 rounded-lg hover:from-blue-300 hover:to-blue-700 transform transition-all duration-200 hover:scale-105 shadow-lg font-semibold inline-flex items-center gap-2"
            >
              <Building2 size={20} />
              Create Profile
            </button>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {showDeleteModal && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-lg animate-fade-in"
              onClick={() => setShowDeleteModal(false)}
            ></div>

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <div
                className="bg-white rounded-lg shadow-2xl w-full max-w-md transform transition-all duration-300 animate-scale-in pointer-events-auto border border-gray-100"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 sm:p-8">
                  <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trash2 className="text-red-600" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 text-center mb-3">
                    Delete Business Profile?
                  </h2>
                  <p className="text-gray-600 text-center mb-8">
                    This action cannot be undone. All profile information will
                    be permanently removed.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-lg hover:bg-gray-200 transform transition-all duration-200 hover:scale-105 font-bold shadow-sm border border-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg hover:from-red-600 hover:to-red-700 transform transition-all duration-200 hover:scale-105 shadow-md font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* LOADING OVERLAY */}
        {submitting && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md mx-4 animate-scale-in">
              <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {profile ? "Updating Profile..." : "Creating Profile..."}
              </h3>
              <p className="text-gray-600">
                Please wait while we save your changes
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}