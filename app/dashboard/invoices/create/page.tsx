"use client";

import { useEffect, useState } from "react";
import { Plus, X, ArrowLeft, Check, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import TemplateSelector from "../../../components/TemplateSelector";

const base_url = process.env.NEXT_PUBLIC_API_URL;

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
  
  // ✅ Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const [form, setForm] = useState({
    clientId: "",
    issueDate: "",
    dueDate: "",
    notes: "",
    discountType: "",
    discountValue: 0,
    taxRate: 0,
    taxName: "",
    template: "MODERN",
    items: [] as InvoiceItem[],
  });

  useEffect(() => {
    const clientId = searchParams.get("clientId");

    if (clientId) {
      setForm((prev) => ({ ...prev, clientId }));
      fetchClientData(clientId);
    } else {
      router.push("/dashboard/clients");
    }
  }, [searchParams, router]);

  const fetchClientData = async (clientId: string) => {
    try {
      const res = await fetch(`${base_url}/clients`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.ok) {
        const clientsData = await res.json();
        const foundClient = clientsData.find((c: Client) => c.id === clientId);

        if (foundClient) {
          setClient(foundClient);
        } else {
          console.error("Client not found in list");
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

    if (form.items.length === 0) {
      setErrorMessage("Please add at least one item to the invoice");
      setShowErrorModal(true);
      return;
    }

    setSubmitting(true);

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
        setSubmitting(false);
        setShowSuccessModal(true);
        // Redirect after 2 seconds
        setTimeout(() => {
          router.push("/dashboard/invoices");
        }, 2000);
      } else {
        const errorData = await res.json().catch(() => ({}));
        setErrorMessage(errorData.message || res.statusText || "Failed to create invoice");
        setShowErrorModal(true);
      }
    } catch (error: any) {
      console.error("Request failed:", error);
      setErrorMessage(error.message || "Failed to create invoice. Please try again.");
      setShowErrorModal(true);
    } finally {
      setSubmitting(false);
    }
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [
        ...form.items,
        {
          description: "",
          quantity: 1,
          unitPrice: 0,
          discount: 0,
          isPercentageDiscount: true,
        },
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
          <p className="text-lg text-gray-700 font-medium">
            Loading invoice form...
          </p>
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
            <p className="text-gray-600 text-sm mt-1">
              Fill in the details to create a new invoice
            </p>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-xl border border-gray-100">
          <form onSubmit={handleSubmit}>
            {/* Template Selector */}
            <div className="mb-8 pb-8 border-b-2 border-gray-200">
              <TemplateSelector
                value={form.template}
                onChange={(template) => setForm({ ...form, template })}
              />
            </div>

            {/* Client Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="relative sm:col-span-2">
                <label className="block text-sm font-semibold text-indigo-700 mb-1">
                  Client
                </label>
                <div className="w-full border-2 border-indigo-300 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-2 sm:p-3 font-medium text-gray-800 text-sm sm:text-base">
                  {client ? (
                    <div>
                      <p className="font-bold text-indigo-900">{client.name}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {client.email} • {client.phone}
                      </p>
                    </div>
                  ) : (
                    <p className="text-indigo-400">Loading client information...</p>
                  )}
                </div>
              </div>

              {/* Issue Date */}
              <div className="relative">
                <label className="block text-sm font-semibold text-blue-700 mb-1">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={form.issueDate}
                  onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                  className="w-full border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-2 sm:p-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:bg-white transition-all duration-200 outline-none font-medium text-gray-800 text-sm sm:text-base"
                  required
                />
              </div>

              {/* Due Date */}
              <div className="relative">
                <label className="block text-sm font-semibold text-purple-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full border-2 border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-2 sm:p-3 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:bg-white transition-all duration-200 outline-none font-medium text-gray-800 text-sm sm:text-base"
                  required
                />
              </div>

              {/* Tax Name */}
              <div className="relative">
                <label className="block text-sm font-semibold text-emerald-700 mb-1">
                  Tax Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., VAT, Sales Tax"
                  value={form.taxName}
                  onChange={(e) => setForm({ ...form, taxName: e.target.value })}
                  className="w-full border-2 border-emerald-300 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-2 sm:p-3 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200 focus:bg-white transition-all duration-200 outline-none font-medium text-gray-800 placeholder-emerald-400 text-sm sm:text-base"
                />
              </div>

              {/* Tax Rate */}
              <div className="relative">
                <label className="block text-sm font-semibold text-green-700 mb-1">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 7.5"
                  value={form.taxRate}
                  onChange={(e) => setForm({ ...form, taxRate: +e.target.value })}
                  className="w-full border-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2 sm:p-3 focus:border-green-500 focus:ring-4 focus:ring-green-200 focus:bg-white transition-all duration-200 outline-none font-medium text-gray-800 placeholder-green-400 text-sm sm:text-base"
                />
              </div>

              {/* Discount Type */}
              <div className="relative">
                <label className="block text-sm font-semibold text-amber-700 mb-1">
                  Discount Type
                </label>
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

              {/* Discount Value */}
              <div className="relative sm:col-span-2">
                <label className="block text-sm font-semibold text-rose-700 mb-1">
                  Discount Value
                </label>
                <input
                  type="number"
                  placeholder="e.g., 10 or 500"
                  value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: +e.target.value })}
                  className="w-full border-2 border-rose-300 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-2 sm:p-3 focus:border-rose-500 focus:ring-4 focus:ring-rose-200 focus:bg-white transition-all duration-200 outline-none font-medium text-gray-800 placeholder-rose-400 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="relative mb-6">
              <label className="block text-sm font-semibold text-violet-700 mb-1">
                Notes
              </label>
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
              <h3 className="font-bold text-gray-800 mb-4 text-base sm:text-lg">
                Invoice Items
              </h3>
              <div className="space-y-3">
                {form.items.map((item, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-3 sm:p-4 rounded-xl border-2 border-indigo-200"
                  >
                    {/* Mobile Layout */}
                    <div className="grid grid-cols-1 gap-3 sm:hidden">
                      <div>
                        <label className="block text-xs font-semibold text-blue-700 mb-1">
                          Description
                        </label>
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
                          <label className="block text-xs font-semibold text-green-700 mb-1">
                            Qty
                          </label>
                          <input
                            type="number"
                            placeholder="Qty"
                            value={item.quantity}
                            onChange={(e) => updateItem(i, "quantity", +e.target.value)}
                            className="w-full border-2 border-green-300 bg-white rounded-lg p-2 focus:border-green-500 focus:ring-3 focus:ring-green-200 transition-all duration-200 outline-none font-medium text-gray-800 placeholder-green-400 text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-amber-700 mb-1">
                            Price
                          </label>
                          <input
                            type="number"
                            placeholder="Price"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(i, "unitPrice", +e.target.value)}
                            className="w-full border-2 border-amber-300 bg-white rounded-lg p-2 focus:border-amber-500 focus:ring-3 focus:ring-amber-200 transition-all duration-200 outline-none font-medium text-gray-800 placeholder-amber-400 text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-purple-700 mb-1">
                            Disc
                          </label>
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
                        <label className="block text-xs font-semibold text-blue-700 mb-1">
                          Description
                        </label>
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
                        <label className="block text-xs font-semibold text-green-700 mb-1">
                          Quantity
                        </label>
                        <input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => updateItem(i, "quantity", +e.target.value)}
                          className="w-full border-2 border-green-300 bg-white rounded-lg p-2 focus:border-green-500 focus:ring-3 focus:ring-green-200 transition-all duration-200 outline-none font-medium text-gray-800 placeholder-green-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-amber-700 mb-1">
                          Unit Price
                        </label>
                        <input
                          type="number"
                          placeholder="Price"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(i, "unitPrice", +e.target.value)}
                          className="w-full border-2 border-amber-300 bg-white rounded-lg p-2 focus:border-amber-500 focus:ring-3 focus:ring-amber-200 transition-all duration-200 outline-none font-medium text-gray-800 placeholder-amber-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-purple-700 mb-1">
                          Discount
                        </label>
                        <input
                          type="number"
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

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:from-green-600 hover:to-green-700 transform transition-all duration-200 hover:scale-105 shadow-md font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Creating Invoice...
                  </>
                ) : (
                  "Create Invoice"
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

      {/* ✅ SUCCESS MODAL */}
      {showSuccessModal && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform animate-scale-in">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Invoice Created Successfully!
                </h3>
                <p className="text-gray-600 mb-4">
                  Your invoice with <span className="font-semibold text-purple-600">{form.template}</span> template has been created.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Loader2 className="animate-spin" size={16} />
                  <span>Redirecting to invoices...</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ✅ ERROR MODAL */}
      {showErrorModal && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform animate-scale-in">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Oops! Something went wrong
                </h3>
                <p className="text-gray-600 mb-6">{errorMessage}</p>
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-red-700 transform transition-all duration-200 hover:scale-105 shadow-md font-semibold"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </>
      )}

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
            transform: scale(0.9);
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