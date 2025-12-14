"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, Users, Mail, Phone, MapPin, FileText, ArrowLeft, CheckCircle, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";


const base_url = process.env.NEXT_PUBLIC_API_URL

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function ClientPage() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newlyCreatedClient, setNewlyCreatedClient] = useState<Client | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (accessToken) {
      fetchClients();
    }
  }, [accessToken]);

  const fetchClients = async () => {
    try {
      const res = await fetch(`${base_url}/clients`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.ok) {
        const data = await res.json();
        setClients(data);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`${base_url}/clients/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const newClient = await res.json();
      await fetchClients();
      setNewlyCreatedClient(newClient);
      setShowAddModal(false);
      setShowSuccessModal(true);
      setForm({ name: "", email: "", phone: "", address: "" });
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`${base_url}/clients/delete/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (res.ok) {
      setClients(clients.filter((c) => c.id !== id));
      setShowDeleteModal(null);
    }
  };

  const navigateToInvoice = (clientId: string) => {
    // Navigate with client ID as query parameter
    router.push(`/dashboard/invoices/create?clientId=${clientId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 font-semibold">Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg">
              <Users className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Clients
              </h1>
              <p className="text-gray-600 text-sm mt-1">{clients.length} total clients</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex-1 sm:flex-initial bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transform transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center gap-2 font-semibold"
            >
              <Plus size={20} />
              <span>Add Client</span>
            </button>
          </div>
        </div>

        {/* Clients Grid */}
        {clients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client, idx) => (
              <div
                key={client.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-2 border border-gray-100 overflow-hidden"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm p-2 rounded-lg">
                      <Users className="text-white" size={24} />
                    </div>
                    <button
                      onClick={() => setShowDeleteModal(client.id)}
                      className="p-2 bg-red-500 bg-opacity-90 backdrop-blur-sm text-white rounded-lg hover:bg-red-600 transform transition-all duration-200 hover:scale-110 shadow-md"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <h2 className="text-2xl font-bold text-white">{client.name}</h2>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Mail className="text-blue-600" size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-semibold uppercase">Email</p>
                      <p className="text-gray-800 font-medium break-all">{client.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Phone className="text-green-600" size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-semibold uppercase">Phone</p>
                      <p className="text-gray-800 font-medium">{client.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <MapPin className="text-purple-600" size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-semibold uppercase">Address</p>
                      <p className="text-gray-800 font-medium">{client.address}</p>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-5 pb-5">
                  <button
                    onClick={() => navigateToInvoice(client.id)}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 transform transition-all duration-200 hover:scale-105 shadow-md font-semibold flex items-center justify-center gap-2"
                  >
                    <FileText size={18} />
                    Create Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <Users size={64} className="mx-auto mb-6 text-gray-300" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Clients Yet</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first client</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transform transition-all duration-200 hover:scale-105 shadow-lg font-semibold inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Add Your First Client
            </button>
          </div>
        )}

        {/* Add Client Modal */}
        {showAddModal && (
          <>
            {/* Blurred Background Overlay */}
            <div 
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-lg animate-fade-in"
              onClick={() => setShowAddModal(false)}
            ></div>
            
            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 pointer-events-none">
              <div 
                className="bg-white/95 backdrop-blur-xl rounded-lg shadow-2xl w-full max-w-2xl transform transition-all duration-300 animate-scale-in pointer-events-auto border border-white/20"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 sm:p-6 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="bg-white/20 backdrop-blur-sm p-2 sm:p-3 rounded-md">
                        <Plus className="text-white" size={20} />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white">Add New Client</h2>
                    </div>
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-md hover:bg-white/30 transition-all"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                <div className="p-4 sm:p-6 lg:p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full border-2 border-gray-300 bg-white rounded-md p-3 sm:p-3.5 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none text-gray-900 font-medium placeholder-gray-400 text-sm sm:text-base shadow-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full border-2 border-gray-300 bg-white rounded-md p-3 sm:p-3.5 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none text-gray-900 font-medium placeholder-gray-400 text-sm sm:text-base shadow-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-2">Phone Number</label>
                      <input
                        type="text"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                        className="w-full border-2 border-gray-300 bg-white rounded-md p-3 sm:p-3.5 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none text-gray-900 font-medium placeholder-gray-400 text-sm sm:text-base shadow-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-2">Address</label>
                      <textarea
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        placeholder="123 Main Street, City, State, ZIP"
                        rows={3}
                        className="w-full border-2 border-gray-300 bg-white rounded-md p-3 sm:p-3.5 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none resize-none text-gray-900 font-medium placeholder-gray-400 text-sm sm:text-base shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8">
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="w-full sm:w-auto sm:flex-1 bg-gray-100 text-gray-800 py-3 sm:py-3.5 px-6 rounded-md hover:bg-gray-200 transform transition-all duration-200 hover:scale-105 font-bold shadow-sm border border-gray-300 text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="w-full sm:w-auto sm:flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 sm:py-3.5 px-6 rounded-md hover:from-green-600 hover:to-emerald-700 transform transition-all duration-200 hover:scale-105 shadow-lg font-bold text-sm sm:text-base"
                    >
                      Add Client
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Success Modal */}
        {showSuccessModal && newlyCreatedClient && (
          <>
            {/* Blurred Background */}
            <div 
              className="fixed inset-0 z-40 backdrop-blur-md bg-black bg-opacity-30 animate-fade-in"
              onClick={() => setShowSuccessModal(false)}
            ></div>
            
            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 animate-scale-in pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8 text-center">
                  <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                    <CheckCircle className="text-green-600" size={48} />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-3">Client Added!</h2>
                  <p className="text-gray-600 mb-6">
                    <strong>{newlyCreatedClient.name}</strong> has been successfully added to your clients.
                  </p>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 text-left">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="text-blue-600" size={16} />
                        <span className="text-sm text-gray-700">{newlyCreatedClient.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="text-green-600" size={16} />
                        <span className="text-sm text-gray-700">{newlyCreatedClient.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="text-purple-600" size={16} />
                        <span className="text-sm text-gray-700">{newlyCreatedClient.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setShowSuccessModal(false);
                        navigateToInvoice(newlyCreatedClient.id);
                      }}
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 transform transition-all duration-200 hover:scale-105 shadow-lg font-semibold flex items-center justify-center gap-2"
                    >
                      <FileText size={20} />
                      Create Invoice for {newlyCreatedClient.name}
                    </button>
                    <button
                      onClick={() => setShowSuccessModal(false)}
                      className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transform transition-all duration-200 hover:scale-105 font-semibold flex items-center justify-center gap-2"
                    >
                      <ArrowLeft size={20} />
                      Back to Client List
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <>
            {/* Blurred Background */}
            <div 
              className="fixed inset-0 z-40 backdrop-blur-md bg-black bg-opacity-30 animate-fade-in"
              onClick={() => setShowDeleteModal(null)}
            ></div>
            
            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 animate-scale-in pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8">
                  <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trash2 className="text-red-600" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 text-center mb-3">Delete Client?</h2>
                  <p className="text-gray-600 text-center mb-8">
                    Are you sure you want to delete this client? This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteModal(null)}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transform transition-all duration-200 hover:scale-105 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(showDeleteModal)}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl hover:from-red-600 hover:to-red-700 transform transition-all duration-200 hover:scale-105 shadow-md font-semibold"
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
          }
          to {
            opacity: 1;
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
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}


