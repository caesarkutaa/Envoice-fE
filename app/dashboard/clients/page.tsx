"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { Pencil, Trash2 } from "lucide-react";

const base_url = "http://localhost:4567";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export default function ClientPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Client | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${base_url}/clients`, {
        headers: { Authorization: `Bearer ${token}` },
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
    const token = localStorage.getItem("accessToken");

    const url = editing
      ? `${base_url}/clients/update/${editing.id}`
      : `${base_url}/clients/create`;

    const res = await fetch(url, {
      method: editing ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      await fetchClients();
      setEditing(null);
      setForm({ name: "", email: "", phone: "" });
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${base_url}/clients/delete/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setClients(clients.filter((c) => c.id !== id));
      setShowDeleteModal(null);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="p-6 text-gray-900">Loading...</div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Clients</h1>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow-md space-y-4 mb-8"
          >
            <div>
              <label className="block font-medium mb-1 text-gray-900">
                Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded p-2 text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-gray-900">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border rounded p-2 text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-gray-900">
                Phone
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border rounded p-2 text-gray-900"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                {editing ? "Update Client" : "Add Client"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setForm({ name: "", email: "", phone: "" });
                  }}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* CLIENTS LIST */}
          {clients.length > 0 ? (
            <div className="space-y-4">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="bg-white p-6 rounded shadow-md flex justify-between items-center"
                >
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {client.name}
                    </h2>
                    <p className="text-gray-900">
                      <strong>Email:</strong> {client.email}
                    </p>
                    <p className="text-gray-900">
                      <strong>Phone:</strong> {client.phone}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditing(client);
                        setForm({
                          name: client.name,
                          email: client.email,
                          phone: client.phone,
                        });
                      }}
                      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(client.id)}
                      className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-900">No clients found.</p>
          )}

          {/* DELETE CONFIRMATION MODAL */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Delete Client
                </h2>
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete this client? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteModal(null)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(showDeleteModal)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
