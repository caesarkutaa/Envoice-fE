"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Building2, MapPin, Phone, Upload, X, CheckCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const base_url = "http://localhost:4567";

interface BusinessProfile {
  name: string;
  location: string;
  contact: string;
  logo?: string;
}

export default function BusinessProfilePage() {
  const { accessToken, clearAuth, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    location: "",
    contact: "",
    logo: null as File | null,
  });

useEffect(() => {
    // Wait for AuthContext to finish loading before fetching
    if (!authLoading && accessToken) {
      fetchProfile();
    } else if (!authLoading && !accessToken) {
      // Auth finished loading but no token found
      console.log("No token after auth loading complete, redirecting to login");
      window.location.href = '/login';
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
        // Clear invalid auth and redirect to login
        clearAuth();
        window.location.href = '/login';
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setProfile(data);
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
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("location", form.location);
    formData.append("contact", form.contact);
    if (form.logo) formData.append("file", form.logo);

    const url =
      editing && profile
        ? `${base_url}/business-profile/update`
        : `${base_url}/business-profile/create`;

    const res = await fetch(url, {
      method: editing && profile ? "PUT" : "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (res.ok) {
      await fetchProfile();
      setEditing(false);
      setForm({ name: "", location: "", contact: "", logo: null });
      setLogoPreview(null);
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
            {authLoading ? 'Restoring session...' : 'Loading profile...'}
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
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg">
            <Building2 className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Business Profile
            </h1>
            <p className="text-gray-600 text-sm mt-1">Manage your business information</p>
          </div>
        </div>

        {editing ? (
          // FORM SECTION
          <div className="bg-white/95 backdrop-blur-xl rounded-lg shadow-2xl border border-white/20 overflow-hidden animate-scale-in">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-6">
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
                  className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8 space-y-5">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Business Logo</label>
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
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="cursor-pointer inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2.5 rounded-lg hover:from-blue-600 hover:to-indigo-700 transform transition-all duration-200 hover:scale-105 shadow-md font-medium text-sm"
                    >
                      <Upload size={18} />
                      Choose Logo
                    </label>
                    <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              </div>

              {/* Business Name */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Business Name</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Building2 className="text-blue-600" size={20} />
                  </div>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your business name"
                    className="w-full border-2 border-gray-300 bg-white rounded-lg p-3 pl-11 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none text-gray-900 font-medium placeholder-gray-400 text-sm sm:text-base shadow-sm"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Location</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <MapPin className="text-green-600" size={20} />
                  </div>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g., 123 Main St, New York, NY"
                    className="w-full border-2 border-gray-300 bg-white rounded-lg p-3 pl-11 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none text-gray-900 font-medium placeholder-gray-400 text-sm sm:text-base shadow-sm"
                    required
                  />
                </div>
              </div>

              {/* Contact */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Contact</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Phone className="text-purple-600" size={20} />
                  </div>
                  <input
                    type="text"
                    value={form.contact}
                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                    placeholder="e.g., +1 (555) 123-4567"
                    className="w-full border-2 border-gray-300 bg-white rounded-lg p-3 pl-11 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 outline-none text-gray-900 font-medium placeholder-gray-400 text-sm sm:text-base shadow-sm"
                    required
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transform transition-all duration-200 hover:scale-105 shadow-lg font-bold text-sm sm:text-base"
                >
                  {profile ? "Update Profile" : "Create Profile"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setLogoPreview(null);
                  }}
                  className="flex-1 sm:flex-initial bg-gray-100 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-200 transform transition-all duration-200 hover:scale-105 font-bold shadow-sm border border-gray-300 text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : profile ? (
          // PROFILE DISPLAY
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-scale-in">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 sm:p-8">
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
                  <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Location</p>
                  <p className="text-gray-900 font-semibold text-base sm:text-lg">
                    {profile.location}
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Phone className="text-purple-600" size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Contact</p>
                  <p className="text-gray-900 font-semibold text-base sm:text-lg">
                    {profile.contact}
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
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Business Profile</h3>
            <p className="text-gray-600 mb-6">
              Create your business profile to get started
            </p>
            <button
              onClick={() => setEditing(true)}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transform transition-all duration-200 hover:scale-105 shadow-lg font-semibold inline-flex items-center gap-2"
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
                    This action cannot be undone. All profile information will be permanently removed.
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