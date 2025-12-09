"use client";

import { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, Upload, Save, Edit2, X, CheckCircle, Globe, Camera } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const base_url = process.env.NEXT_PUBLIC_API_URL

interface UserProfile {
  _id?: string;
  id?: string;
  email: string;
  username?: string;
  mobile?: string;
  first_name?: string;
  last_name?: string;
  imageUrl?: string;
  gender?: string;
  country?: string;
  lastLogin?: string | Date;
  emailVerified: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export default function ProfilePage() {
  const { accessToken, clearAuth, isLoading: authLoading } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const [form, setForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    mobile: "",
    gender: "",
    country: "",
    imageFile: null as File | null,
  });

  useEffect(() => {
    // Wait for AuthContext to finish loading before fetching
    if (!authLoading && accessToken) {
      fetchUserProfile();
    } else if (!authLoading && !accessToken) {
      // Auth finished loading but no token found
      console.log("No token after auth loading complete, redirecting to login");
      window.location.href = '/login';
    }
  }, [authLoading, accessToken]);

  const fetchUserProfile = async () => {
    try {
      console.log("Fetching user profile with token:", accessToken ? "Token exists" : "No token");
      
      if (!accessToken) {
        console.error("No access token available");
        setLoading(false);
        return;
      }

      const res = await fetch(`${base_url}/users/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log(`/users/me response status: ${res.status}`);

      if (res.status === 401) {
        console.error("Token is invalid or expired. Redirecting to login...");
        // Clear invalid auth and redirect to login
        clearAuth();
        window.location.href = '/login';
        return;
      }

      if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error:", errorText);
        throw new Error("Failed to fetch user");
      }

      const json = await res.json();
      
      
      // Handle different response structures
      const userData = json.data || json.user || json;
   
      
      // Map all fields directly without converting undefined values
      const userProfile: UserProfile = {
        _id: userData._id,
        id: userData._id || userData.id,
        email: userData.email,
        username: userData.username,
        mobile: userData.mobile,
        first_name: userData.first_name,
        last_name: userData.last_name,
        imageUrl: userData.imageUrl,
        gender: userData.gender,
        country: userData.country,
        lastLogin: userData.lastLogin,
        emailVerified: userData.emailVerified === true, // Strict boolean check
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      };
    
      setUser(userProfile);
      
      // Initialize form with current user data
      setForm({
        username: userData.username || "",
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        mobile: userData.mobile || "",
        gender: userData.gender || "",
        country: userData.country || "",
        imageFile: null,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, imageFile: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage("");

    try {
      // Try different endpoint patterns your backend might use
      const endpoints = [
        `${base_url}/users/profile/update`,
        `${base_url}/users/me/update`,
        `${base_url}/users/${user?._id}`,
        `${base_url}/users/update`,
      ];

      let success = false;
      let lastError = null;

      // Try JSON body first
      const jsonBody = {
        username: form.username,
        first_name: form.first_name,
        last_name: form.last_name,
        mobile: form.mobile,
        gender: form.gender,
        country: form.country,
      };

      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          
          const res = await fetch(endpoint, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(jsonBody),
          });

          console.log(`Response status: ${res.status}`);

          if (res.ok) {
            success = true;
            
            // Handle image upload separately if needed
            if (form.imageFile) {
              const formData = new FormData();
              formData.append("image", form.imageFile);
              
              const imageEndpoint = `${base_url}/users/upload-image`;
              await fetch(imageEndpoint, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
                body: formData,
              });
            }
            
            await fetchUserProfile();
            setEditing(false);
            setImagePreview(null);
            setSuccessMessage("Profile updated successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
            break;
          } else {
            const errorData = await res.json().catch(() => ({ message: res.statusText }));
            lastError = errorData.message || `Failed with status ${res.status}`;
          }
        } catch (err: any) {
          console.error(`Error with ${endpoint}:`, err);
          lastError = err.message;
        }
      }

      if (!success) {
        throw new Error(lastError || "All update endpoints failed. Please check your backend API documentation.");
      }
    } catch (error: any) {
      console.error("Update error:", error);
      setErrorMessage(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4 sm:mb-6"></div>
          <p className="text-lg sm:text-xl text-gray-700 font-semibold">
            {authLoading ? 'Restoring session...' : 'Loading profile...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 sm:mb-6 bg-green-50 border-l-4 border-green-500 p-3 sm:p-4 rounded-lg shadow-md animate-fade-in">
            <div className="flex items-center gap-2 sm:gap-3">
              <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
              <p className="text-sm sm:text-base text-green-800 font-semibold">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 sm:mb-6 bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 rounded-lg shadow-md animate-fade-in">
            <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-start gap-2 sm:gap-3 flex-1">
                <X className="text-red-500 flex-shrink-0 mt-0.5 sm:mt-0" size={20} />
                <div>
                  <p className="text-sm sm:text-base text-red-800 font-semibold">{errorMessage}</p>
                  <p className="text-xs sm:text-sm text-red-600 mt-1">Please check the console for more details.</p>
                </div>
              </div>
              <button
                onClick={() => setErrorMessage("")}
                className="text-red-500 hover:text-red-700 flex-shrink-0"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6 lg:mb-8 animate-fade-in">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-gradient-to-r from-purple-600 to-fuchsia-600 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg">
              <User className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                My Profile
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm mt-0.5 sm:mt-1">Manage your account information</p>
            </div>
          </div>
          
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="self-start sm:self-auto bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:from-purple-600 hover:to-fuchsia-700 transform transition-all duration-200 hover:scale-105 shadow-md font-semibold flex items-center gap-2 text-sm sm:text-base whitespace-nowrap"
            >
              <Edit2 size={16} />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Profile Picture Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 text-center animate-scale-in">
              <div className="relative inline-block mb-3 sm:mb-4">
                <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-purple-200 shadow-lg mx-auto">
                  {imagePreview || user?.imageUrl ? (
                    <img
                      src={imagePreview || user?.imageUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-200 to-fuchsia-200 flex items-center justify-center">
                      <User className="text-purple-600" size={48} />
                    </div>
                  )}
                </div>
                {editing && (
                  <label
                    htmlFor="profile-image"
                    className="absolute bottom-0 right-0 bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white p-2.5 sm:p-3 rounded-full cursor-pointer hover:from-purple-600 hover:to-fuchsia-700 transform transition-all duration-200 hover:scale-110 shadow-lg"
                  >
                    <Camera size={16} />
                    <input
                      type="file"
                      id="profile-image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
                {user?.first_name && user?.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : user?.username || "User"}
              </h2>
              <p className="text-sm sm:text-base text-purple-600 font-medium mb-3 sm:mb-4">@{user?.username || "username"}</p>
              
              {/* Status Badge */}
              <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                {user?.emailVerified === true ? (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1">
                    <CheckCircle size={12} />
                    Verified
                  </span>
                ) : (
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                    Not Verified
                  </span>
                )}
              </div>

              {/* Member Since */}
              <div className="border-t border-gray-200 pt-3 sm:pt-4">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Member Since</p>
                <p className="text-sm sm:text-base text-gray-700 font-medium">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>

              {user?.lastLogin && (
                <div className="border-t border-gray-200 pt-3 sm:pt-4 mt-3 sm:mt-4">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Last Login</p>
                  <p className="text-sm sm:text-base text-gray-700 font-medium">
                    {new Date(user.lastLogin).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Profile Information Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-scale-in">
              <div className="bg-gradient-to-r from-purple-600 to-fuchsia-600 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Profile Information</h2>
              </div>

              {editing ? (
                // EDIT FORM
                <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {/* First Name */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1.5 sm:mb-2">First Name</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <User className="text-purple-600" size={16} />
                        </div>
                        <input
                          type="text"
                          value={form.first_name}
                          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                          placeholder="Enter first name"
                          className="w-full border-2 border-gray-300 bg-white rounded-lg p-2.5 sm:p-3 pl-9 sm:pl-10 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 outline-none text-gray-900 font-medium placeholder-gray-400 text-sm"
                        />
                      </div>
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1.5 sm:mb-2">Last Name</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <User className="text-purple-600" size={16} />
                        </div>
                        <input
                          type="text"
                          value={form.last_name}
                          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                          placeholder="Enter last name"
                          className="w-full border-2 border-gray-300 bg-white rounded-lg p-2.5 sm:p-3 pl-9 sm:pl-10 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 outline-none text-gray-900 font-medium placeholder-gray-400 text-sm"
                        />
                      </div>
                    </div>

                    {/* Username */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1.5 sm:mb-2">Username</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                          @
                        </div>
                        <input
                          type="text"
                          value={form.username}
                          onChange={(e) => setForm({ ...form, username: e.target.value })}
                          placeholder="username"
                          className="w-full border-2 border-gray-300 bg-white rounded-lg p-2.5 sm:p-3 pl-8 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 outline-none text-gray-900 font-medium placeholder-gray-400 text-sm"
                        />
                      </div>
                    </div>

                    {/* Mobile */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1.5 sm:mb-2">Mobile</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <Phone className="text-green-600" size={16} />
                        </div>
                        <input
                          type="tel"
                          value={form.mobile}
                          onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                          placeholder="+1 (555) 123-4567"
                          className="w-full border-2 border-gray-300 bg-white rounded-lg p-2.5 sm:p-3 pl-9 sm:pl-10 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none text-gray-900 font-medium placeholder-gray-400 text-sm"
                        />
                      </div>
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1.5 sm:mb-2">Gender</label>
                      <select
                        value={form.gender}
                        onChange={(e) => setForm({ ...form, gender: e.target.value })}
                        className="w-full border-2 border-gray-300 bg-white rounded-lg p-2.5 sm:p-3 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all duration-200 outline-none text-gray-900 font-medium text-sm"
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1.5 sm:mb-2">Country</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <Globe className="text-blue-600" size={16} />
                        </div>
                        <input
                          type="text"
                          value={form.country}
                          onChange={(e) => setForm({ ...form, country: e.target.value })}
                          placeholder="e.g., United States"
                          className="w-full border-2 border-gray-300 bg-white rounded-lg p-2.5 sm:p-3 pl-9 sm:pl-10 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none text-gray-900 font-medium placeholder-gray-400 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-3 sm:pt-4 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2.5 sm:py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transform transition-all duration-200 hover:scale-105 shadow-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setImagePreview(null);
                        // Reset form to original values
                        setForm({
                          username: user?.username || "",
                          first_name: user?.first_name || "",
                          last_name: user?.last_name || "",
                          mobile: user?.mobile || "",
                          gender: user?.gender || "",
                          country: user?.country || "",
                          imageFile: null,
                        });
                      }}
                      disabled={saving}
                      className="flex-1 sm:flex-initial bg-gray-100 text-gray-800 py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-gray-200 transform transition-all duration-200 hover:scale-105 font-bold shadow-sm border border-gray-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                // VIEW MODE
                <div className="p-4 sm:p-6 lg:p-8 space-y-3 sm:space-y-4">
                  {/* Email */}
                  <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <div className="bg-blue-100 p-2.5 sm:p-3 rounded-lg flex-shrink-0">
                      <Mail className="text-blue-600" size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Email</p>
                      <p className="text-sm sm:text-base text-gray-900 font-semibold break-all">{user?.email}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  {user?.mobile && (
                    <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <div className="bg-green-100 p-2.5 sm:p-3 rounded-lg flex-shrink-0">
                        <Phone className="text-green-600" size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Mobile</p>
                        <p className="text-sm sm:text-base text-gray-900 font-semibold">{user.mobile}</p>
                      </div>
                    </div>
                  )}

                  {/* Personal Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {user?.gender && (
                      <div className="p-3 sm:p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-200">
                        <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Gender</p>
                        <p className="text-sm sm:text-base text-gray-900 font-semibold">{user.gender}</p>
                      </div>
                    )}

                    {user?.country && (
                      <div className="p-3 sm:p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                        <div className="flex items-center gap-2">
                          <Globe className="text-indigo-600 flex-shrink-0" size={16} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Country</p>
                            <p className="text-sm sm:text-base text-gray-900 font-semibold truncate">{user.country}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Empty State */}
                  {!user?.mobile && !user?.gender && !user?.country && (
                    <div className="text-center py-6 sm:py-8">
                      <p className="text-sm sm:text-base text-gray-500 mb-3 sm:mb-4 px-4">Complete your profile to get the most out of your account</p>
                      <button
                        onClick={() => setEditing(true)}
                        className="bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:from-purple-600 hover:to-fuchsia-700 transform transition-all duration-200 hover:scale-105 shadow-md font-semibold text-sm sm:text-base"
                      >
                        Complete Profile
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
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