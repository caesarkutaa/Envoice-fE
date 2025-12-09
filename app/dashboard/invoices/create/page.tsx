"use client";

import { useEffect, useState } from "react";
import { Plus, X, ArrowLeft } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";

const base_url = "http://localhost:4567";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  isPercentageDiscount?: boolean;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function CreateInvoicePage() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [client, setClient] = useState<Client | null>(null);
  const [form, setForm] = useState({
    clientId: "",
    issueDate: "",
    dueDate: "",
    notes: "",
    discountType: "",
    discountValue: 0,
    taxRate: 0,
    taxName: "",
    items: [] as InvoiceItem[],
  });

  useEffect(() => {
    // Get client ID from URL query parameter
    const clientId = searchParams.get('clientId');
    
    
    
    if (clientId) {
      setForm(prev => ({ ...prev, clientId }));
      fetchClientData(clientId);
    } else {
      // If no client ID, redirect back to clients page
     
      router.push('/dashboard/clients');
    }
  }, [searchParams, router]);

  const fetchClientData = async (clientId: string) => {
    try {
      // Fetch all clients and find the matching one
      const res = await fetch(`${base_url}/clients`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      if (res.ok) {
        const clientsData = await res.json();
        const foundClient = clientsData.find((c: Client) => c.id === clientId);
        
        if (foundClient) {
          setClient(foundClient);
        } else {
          console.error('Client not found in list');
        }
      }
    } catch (error) {
      console.error("Error fetching client:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that we have at least one item
    if (form.items.length === 0) {
      alert("Please add at least one item to the invoice");
      return;
    }

    setSubmitting(true);

    // Log what we're sending to debug
    console.log("Submitting invoice data:", JSON.stringify(form, null, 2));

    try {
      const res = await fetch(`${base_url}/invoices/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        // Redirect to invoices list after successful creation
        router.push('/dashboard/invoices');
      } else {
        // Log the error response
        const errorData = await res.json().catch(() => ({}));
        console.error("Error response:", errorData);
        alert(`Failed to create invoice: ${errorData.message || res.statusText}`);
      }
    } catch (error) {
      console.error("Request failed:", error);
      alert("Failed to create invoice. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [
        ...form.items,
        { description: "", quantity: 1, unitPrice: 0, discount: 0, isPercentageDiscount: true },
      ],
    });
  };

  const updateItem = (index: number, key: keyof InvoiceItem, value: any) => {
    const updatedItems = [...form.items];
    (updatedItems[index] as any)[key] = value;
    setForm({ ...form, items: updatedItems });
  };

  const removeItem = (index: number) => {
    setForm({
      ...form,
      items: form.items.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-700 font-medium">Loading invoice form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 sm:mb-8 animate-fade-in">
          <button
            onClick={() => router.back()}
            className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Create Invoice
            </h1>
            <p className="text-gray-600 text-sm mt-1">Fill in the details to create a new invoice</p>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-xl border border-gray-100">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="relative sm:col-span-2">
                <label className="block text-sm font-semibold text-indigo-700 mb-1">Client</label>
                <div className="w-full border-2 border-indigo-300 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-2 sm:p-3 font-medium text-gray-800 text-sm sm:text-base">
                  {client ? (
                    <div>
                      <p className="font-bold text-indigo-900">{client.name}</p>
                      <p className="text-xs text-gray-600 mt-1">{client.email} • {client.phone}</p>
                    </div>
                  ) : (
                    <p className="text-indigo-400">Loading client information...</p>
                  )}
                </div>
              </div>
              <div className="relative">
                <label className="block text-sm font-semibold text-blue-700 mb-1">Issue Date</label>
                <input
                  type="date"
                  value={form.issueDate}
                  onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                  className="w-full border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-2 sm:p-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:bg-white transition-all duration-200 outline-none font-medium text-gray-800 text-sm sm:text-base"
                  required
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-semibold text-purple-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full border-2 border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-2 sm:p-3 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:bg-white transition-all duration-200 outline-none font-medium text-gray-800 text-sm sm:text-base"
                  required
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-semibold text-emerald-700 mb-1">Tax Name</label>
                <input
                  type="text"
                  placeholder="e.g., VAT, Sales Tax"
                  value={form.taxName}
                  onChange={(e) => setForm({ ...form, taxName: e.target.value })}
                  className="w-full border-2 border-emerald-300 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-2 sm:p-3 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200 focus:bg-white transition-all duration-200 outline-none font-medium text-gray-800 placeholder-emerald-400 text-sm sm:text-base"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-semibold text-green-700 mb-1">Tax Rate (%)</label>
                <input
                  type="text"
                  placeholder="e.g., 7.5"
                  value={form.taxRate}
                  onChange={(e) => setForm({ ...form, taxRate: +e.target.value })}
                  className="w-full border-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2 sm:p-3 focus:border-green-500 focus:ring-4 focus:ring-green-200 focus:bg-white transition-all duration-200 outline-none font-medium text-gray-800 placeholder-green-400 text-sm sm:text-base"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-semibold text-amber-700 mb-1">Discount Type</label>
                <select
                  value={form.discountType}
                  onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                  className="w-full border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-2 sm:p-3 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 focus:bg-white transition-all duration-200 outline-none font-medium text-gray-800 appearance-none cursor-pointer text-sm sm:text-base"
                >
                  <option value="">No Discount</option>
                  <option value="PERCENTAGE">Percentage Discount</option>
                  <option value="FIXED">Fixed Amount Discount</option>
                </select>
              </div>
              <div className="relative sm:col-span-2">
                <label className="block text-sm font-semibold text-rose-700 mb-1">Discount Value</label>
                <input
                  type="text"
                  placeholder="e.g., 10 or 500"
                  value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: +e.target.value })}
                  className="w-full border-2 border-rose-300 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-2 sm:p-3 focus:border-rose-500 focus:ring-4 focus:ring-rose-200 focus:bg-white transition-all duration-200 outline-none font-medium text-gray-800 placeholder-rose-400 text-sm sm:text-base"
                />
              </div>
            </div>
            
            <div className="relative mb-6">
              <label className="block text-sm font-semibold text-violet-700 mb-1">Notes</label>
              <textarea
                placeholder="Add any additional notes or terms..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full border-2 border-violet-300 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-2 sm:p-3 focus:border-violet-500 focus:ring-4 focus:ring-violet-200 focus:bg-white transition-all duration-200 outline-none font-medium text-gray-800 placeholder-violet-400 text-sm sm:text-base"
                rows={3}
              />
            </div>

            {/* ITEMS SECTION */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-4 text-base sm:text-lg">Invoice Items</h3>
              <div className="space-y-3">
                {form.items.map((item, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-3 sm:p-4 rounded-xl border-2 border-indigo-200"
                  >
                    {/* Mobile Layout */}
                    <div className="grid grid-cols-1 gap-3 sm:hidden">
                      <div>
                        <label className="block text-xs font-semibold text-blue-700 mb-1">Description</label>
                        <input
                          type="text"
                          placeholder="Item description"
                          value={item.description}
                          onChange={(e) => updateItem(i, "description", e.target.value)}
                          className="w-full border-2 border-blue-300 bg-white rounded-lg p-2 focus:border-blue-500 focus:ring-3 focus:ring-blue-200 transition-all duration-200 outline-none font-medium text-gray-800 placeholder-blue-400 text-sm"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-xs font-semibold text-green-700 mb-1">Qty</label>
                          <input
                            type="text"
                            placeholder="Qty"
                            value={item.quantity}
                            onChange={(e) => updateItem(i, "quantity", +e.target.value)}
                            className="w-full border-2 border-green-300 bg-white rounded-lg p-2 focus:border-green-500 focus:ring-3 focus:ring-green-200 transition-all duration-200 outline-none font-medium text-gray-800 placeholder-green-400 text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-amber-700 mb-1">Price</label>
                          <input
                            type="text"
                            placeholder="Price"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(i, "unitPrice", +e.target.value)}
                            className="w-full border-2 border-amber-300 bg-white rounded-lg p-2 focus:border-amber-500 focus:ring-3 focus:ring-amber-200 transition-all duration-200 outline-none font-medium text-gray-800 placeholder-amber-400 text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-purple-700 mb-1">Disc</label>
                          <input
                            type="number"
                            placeholder="Disc."
                            value={item.discount || 0}
                            onChange={(e) => updateItem(i, "discount", +e.target.value)}
                            className="w-full border-2 border-purple-300 bg-white rounded-lg p-2 focus:border-purple-500 focus:ring-3 focus:ring-purple-200 transition-all duration-200 outline-none font-medium text-gray-800 placeholder-purple-400 text-sm"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(i)}
                        className="w-full p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transform transition-all duration-200 hover:scale-105 shadow-md text-sm"
                      >
                        Remove Item
                      </button>
                    </div>

                    {/* Desktop/Tablet Layout */}
                    <div className="hidden sm:grid sm:grid-cols-6 gap-3 items-end">
                      <div className="col-span-2">
                        <label className="block text-xs font-semibold text-blue-700 mb-1">Description</label>
                        <input
                          type="text"
                          placeholder="Item description"
                          value={item.description}
                          onChange={(e) => updateItem(i, "description", e.target.value)}
                          className="w-full border-2 border-blue-300 bg-white rounded-lg p-2 focus:border-blue-500 focus:ring-3 focus:ring-blue-200 transition-all duration-200 outline-none font-medium text-gray-800 placeholder-blue-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-green-700 mb-1">Quantity</label>
                        <input
                          type="text"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => updateItem(i, "quantity", +e.target.value)}
                          className="w-full border-2 border-green-300 bg-white rounded-lg p-2 focus:border-green-500 focus:ring-3 focus:ring-green-200 transition-all duration-200 outline-none font-medium text-gray-800 placeholder-green-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-amber-700 mb-1">Unit Price</label>
                        <input
                          type="text"
                          placeholder="Price"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(i, "unitPrice", +e.target.value)}
                          className="w-full border-2 border-amber-300 bg-white rounded-lg p-2 focus:border-amber-500 focus:ring-3 focus:ring-amber-200 transition-all duration-200 outline-none font-medium text-gray-800 placeholder-amber-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-purple-700 mb-1">Discount</label>
                        <input
                          type="text"
                          placeholder="Disc."
                          value={item.discount || 0}
                          onChange={(e) => updateItem(i, "discount", +e.target.value)}
                          className="w-full border-2 border-purple-300 bg-white rounded-lg p-2 focus:border-purple-500 focus:ring-3 focus:ring-purple-200 transition-all duration-200 outline-none font-medium text-gray-800 placeholder-purple-400"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(i)}
                        className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transform transition-all duration-200 hover:scale-105 shadow-md h-10"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addItem}
                className="mt-4 w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transform transition-all duration-200 hover:scale-105 shadow-md flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Plus size={18} /> Add Item
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:from-green-600 hover:to-green-700 transform transition-all duration-200 hover:scale-105 shadow-md font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Invoice...
                  </>
                ) : (
                  'Create Invoice'
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                disabled={submitting}
                className="w-full sm:w-auto bg-gradient-to-r from-gray-400 to-gray-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:from-gray-500 hover:to-gray-600 transform transition-all duration-200 hover:scale-105 shadow-md font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
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

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}