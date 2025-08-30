"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { Pencil, Trash2, Plus, X } from "lucide-react";

const base_url = "http://localhost:4567";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  isPercentageDiscount?: boolean;
  amount?: number;
}

interface Invoice {
  id: string;
  clientId: string;
  issueDate: string;
  dueDate: string;
  notes?: string;
  discountType?: string;
  discountValue?: number;
  taxRate?: number;
  taxName?: string;
  totalAmount: number;
  items: InvoiceItem[];
  client?: {
    id: string;
    name: string;
    email?: string;
  };
}

export default function InvoicePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);

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
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${base_url}/invoices`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setInvoices(data);
      }
    } catch (err) {
      console.error("Error fetching invoices:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    const url = editingInvoice
      ? `${base_url}/invoices/update/${editingInvoice.id}`
      : `${base_url}/invoices/create`;

    const res = await fetch(url, {
      method: editingInvoice ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      await fetchInvoices();
      resetForm();
    }
  };

  const handleDelete = async () => {
    if (!invoiceToDelete) return;
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${base_url}/invoices/delete/${invoiceToDelete}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setInvoices(invoices.filter((inv) => inv.id !== invoiceToDelete));
      setShowDeleteModal(false);
      setInvoiceToDelete(null);
    }
  };

  const resetForm = () => {
    setEditingInvoice(null);
    setForm({
      clientId: "",
      issueDate: "",
      dueDate: "",
      notes: "",
      discountType: "",
      discountValue: 0,
      taxRate: 0,
      taxName: "",
      items: [],
    });
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
      <ProtectedRoute>
        <div className="p-6 text-gray-900">Loading invoices...</div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Invoices</h1>

          {/* FORM SECTION */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow-md space-y-4 mb-8"
          >
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Client ID"
                value={form.clientId}
                onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                className="w-full border rounded p-2"
                required
              />
              <input
                type="date"
                value={form.issueDate}
                onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                className="w-full border rounded p-2"
                required
              />
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full border rounded p-2"
                required
              />
              <input
                type="text"
                placeholder="Tax Name"
                value={form.taxName}
                onChange={(e) => setForm({ ...form, taxName: e.target.value })}
                className="w-full border rounded p-2"
              />
              <input
                type="number"
                placeholder="Tax Rate (%)"
                value={form.taxRate}
                onChange={(e) => setForm({ ...form, taxRate: +e.target.value })}
                className="w-full border rounded p-2"
              />
              <select
                value={form.discountType}
                onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                className="w-full border rounded p-2"
              >
                <option value="">No Discount</option>
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED">Fixed</option>
              </select>
              <input
                type="number"
                placeholder="Discount Value"
                value={form.discountValue}
                onChange={(e) => setForm({ ...form, discountValue: +e.target.value })}
                className="w-full border rounded p-2"
              />
            </div>
            <textarea
              placeholder="Notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full border rounded p-2"
            />

            {/* ITEMS SECTION */}
            <div>
              <h2 className="font-bold mb-2">Invoice Items</h2>
              {form.items.map((item, i) => (
                <div key={i} className="grid grid-cols-6 gap-2 mb-2 items-center">
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateItem(i, "description", e.target.value)}
                    className="border rounded p-2 col-span-2"
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateItem(i, "quantity", +e.target.value)}
                    className="border rounded p-2"
                  />
                  <input
                    type="number"
                    placeholder="Unit Price"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(i, "unitPrice", +e.target.value)}
                    className="border rounded p-2"
                  />
                  <input
                    type="number"
                    placeholder="Discount"
                    value={item.discount || 0}
                    onChange={(e) => updateItem(i, "discount", +e.target.value)}
                    className="border rounded p-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    className="p-2 bg-red-500 text-white rounded"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addItem}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
              >
                <Plus size={16} className="inline mr-2" /> Add Item
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                {editingInvoice ? "Update Invoice" : "Create Invoice"}
              </button>
              {editingInvoice && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* LIST OF INVOICES */}
          <div className="space-y-4">
            {invoices.map((inv) => (
              <div key={inv.id} className="bg-white p-6 rounded shadow-md">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-bold">
                    Invoice #{inv.id.slice(0, 6)} - {inv.client?.name || "Client"}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingInvoice(inv);
                        setForm({
                          clientId: inv.clientId,
                          issueDate: inv.issueDate.split("T")[0],
                          dueDate: inv.dueDate.split("T")[0],
                          notes: inv.notes || "",
                          discountType: inv.discountType || "",
                          discountValue: inv.discountValue || 0,
                          taxRate: inv.taxRate || 0,
                          taxName: inv.taxName || "",
                          items: inv.items || [],
                        });
                      }}
                      className="p-2 bg-blue-500 text-white rounded"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setInvoiceToDelete(inv.id);
                        setShowDeleteModal(true);
                      }}
                      className="p-2 bg-red-500 text-white rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p>Issue Date: {new Date(inv.issueDate).toLocaleDateString()}</p>
                <p>Due Date: {new Date(inv.dueDate).toLocaleDateString()}</p>
                <p>Total: ${inv.totalAmount.toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* DELETE MODAL */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-lg font-bold mb-4">Delete Invoice</h2>
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete this invoice? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
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
