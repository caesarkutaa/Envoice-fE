"use client";

import { useEffect, useState } from "react";
import { Trash2, FileText, Eye, CheckCircle, Clock, AlertCircle, Check, Download, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

const base_url = process.env.NEXT_PUBLIC_API_URL;

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
  status?: string;
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

export default function InvoiceListPage() {
  const { accessToken, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);
  const [markingPaid, setMarkingPaid] = useState<string | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState<string | null>(null); // ✅ Track PDF download
  const [expandedInvoice, setExpandedInvoice] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!authLoading && accessToken) {
      fetchInvoices();
    }
  }, [authLoading, accessToken]);

  const fetchInvoices = async () => {
    try {
      const res = await fetch(`${base_url}/invoices`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        // ✅ Sort by date - NEWEST FIRST (most recent to oldest)
        const sortedData = data.sort((a: Invoice, b: Invoice) => 
          new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
        );
        setInvoices(sortedData);
      }
    } catch (err) {
      console.error("Error fetching invoices:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!invoiceToDelete) return;
    const res = await fetch(`${base_url}/invoices/delete/${invoiceToDelete}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (res.ok) {
      setInvoices(invoices.filter((inv) => inv.id !== invoiceToDelete));
      setShowDeleteModal(false);
      setInvoiceToDelete(null);
    }
  };

  const handleMarkAsPaid = async (invoiceId: string) => {
    setMarkingPaid(invoiceId);
    
    try {
      const endpoints = [
        { url: `${base_url}/invoices/update/${invoiceId}`, method: 'PATCH' },
      ];

      let success = false;

      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint.url, {
            method: endpoint.method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ status: "PAID" }),
          });

          if (res.ok) {
            success = true;
            setInvoices(invoices.map(inv => 
              inv.id === invoiceId 
                ? { ...inv, status: "PAID" }
                : inv
            ));
            break;
          }
        } catch (err) {
          console.error(`Error with ${endpoint.method} ${endpoint.url}:`, err);
        }
      }

      if (!success) {
        console.error("Failed to mark invoice as paid");
      }
    } catch (error) {
      console.error("Error marking invoice as paid:", error);
    } finally {
      setMarkingPaid(null);
    }
  };

  // ✅ DOWNLOAD PDF WITH BUSINESS COPY WATERMARK
  const handleDownloadPdf = async (invoiceId: string) => {
    setDownloadingPdf(invoiceId);
    
    try {
      const res = await fetch(`${base_url}/invoices/${invoiceId}/pdf`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Get invoice number for filename
        const invoice = invoices.find(inv => inv.id === invoiceId);
        const invoiceNumber = invoice?.id?.slice(0, 8) || 'invoice';
        link.download = `BUSINESS-COPY-${invoiceNumber}.pdf`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Failed to download PDF');
        alert('Failed to download PDF. Please try again.');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setDownloadingPdf(null);
    }
  };

  const toggleExpandInvoice = (invoiceId: string) => {
    setExpandedInvoice(expandedInvoice === invoiceId ? null : invoiceId);
  };

  const getInvoiceStatus = (invoice: Invoice) => {
    if (invoice.status) {
      const status = invoice.status.toUpperCase();
      if (status === 'PAID') return 'paid';
      if (status === 'PENDING') {
        const dueDate = new Date(invoice.dueDate);
        const now = new Date();
        if (dueDate < now) return 'overdue';
        return 'pending';
      }
    }
    
    const dueDate = new Date(invoice.dueDate);
    const now = new Date();
    if (dueDate < now) return 'overdue';
    return 'pending';
  };

  const filteredInvoices = invoices.filter((inv) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = (
      inv.id.toLowerCase().includes(searchLower) ||
      inv.client?.name?.toLowerCase().includes(searchLower) ||
      inv.client?.email?.toLowerCase().includes(searchLower) ||
      inv.totalAmount.toString().includes(searchLower)
    );

    if (!matchesSearch) return false;

    if (statusFilter === "all") return true;
    const invoiceStatus = getInvoiceStatus(inv);
    return invoiceStatus === statusFilter;
  });

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-700 font-medium">Loading invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 sm:p-3 rounded-xl shadow-lg">
              <FileText className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Invoices
              </h1>
              <p className="text-gray-600 text-sm mt-1">{filteredInvoices.length} total invoices • Newest first</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search invoices by ID, client name, email, or amount..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-2 border-gray-300 bg-white rounded-lg p-3 sm:p-4 pl-12 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all duration-200 outline-none text-gray-800 font-medium placeholder-gray-400 text-sm sm:text-base shadow-sm"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Status Filter Buttons */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => setStatusFilter("all")}
              className={`
                px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-105
                ${statusFilter === "all"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                  : "bg-white text-gray-700 border-2 border-gray-300 hover:border-indigo-300"
                }
              `}
            >
              All Invoices
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                statusFilter === "all" ? "bg-white/20" : "bg-gray-200"
              }`}>
                {invoices.length}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter("paid")}
              className={`
                px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-105
                ${statusFilter === "paid"
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md"
                  : "bg-white text-gray-700 border-2 border-gray-300 hover:border-green-300"
                }
              `}
            >
              Paid
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                statusFilter === "paid" ? "bg-white/20" : "bg-gray-200"
              }`}>
                {invoices.filter(inv => getInvoiceStatus(inv) === 'paid').length}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter("pending")}
              className={`
                px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-105
                ${statusFilter === "pending"
                  ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md"
                  : "bg-white text-gray-700 border-2 border-gray-300 hover:border-amber-300"
                }
              `}
            >
              Pending
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                statusFilter === "pending" ? "bg-white/20" : "bg-gray-200"
              }`}>
                {invoices.filter(inv => getInvoiceStatus(inv) === 'pending').length}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter("overdue")}
              className={`
                px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-105
                ${statusFilter === "overdue"
                  ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md"
                  : "bg-white text-gray-700 border-2 border-gray-300 hover:border-red-300"
                }
              `}
            >
              Overdue
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                statusFilter === "overdue" ? "bg-white/20" : "bg-gray-200"
              }`}>
                {invoices.filter(inv => getInvoiceStatus(inv) === 'overdue').length}
              </span>
            </button>
          </div>
        </div>

        {/* Invoice List */}
        <div className="space-y-4">
          {filteredInvoices.length === 0 ? (
            <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-lg text-center border border-gray-100">
              <FileText size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {searchQuery || statusFilter !== "all" ? 'No Invoices Found' : 'No Invoices Yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || statusFilter !== "all"
                  ? 'Try adjusting your search terms or filters' 
                  : 'Create invoices from your client pages'}
              </p>
              {(searchQuery || statusFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-600 hover:to-purple-700 transform transition-all duration-200 hover:scale-105 shadow-lg font-semibold"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            paginatedInvoices.map((inv, idx) => {
              const status = getInvoiceStatus(inv);
              
              return (
                <div
                  key={inv.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 transform transition-all duration-300 hover:shadow-xl overflow-hidden"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {/* Invoice Header */}
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                            Invoice #{inv.id.slice(0, 8)}
                          </h2>
                          {/* Status Badge */}
                          <span className={`
                            inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold
                            ${status === 'paid' ? 'bg-green-100 text-green-700' :
                              status === 'overdue' ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700'}
                          `}>
                            {status === 'paid' ? <CheckCircle size={12} /> :
                             status === 'overdue' ? <AlertCircle size={12} /> :
                             <Clock size={12} />}
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </div>
                        <p className="text-indigo-600 font-medium text-sm sm:text-base mb-1">
                          {inv.client?.name || "Client"}
                        </p>
                        {inv.client?.email && (
                          <p className="text-gray-500 text-sm">{inv.client.email}</p>
                        )}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {/* ✅ DOWNLOAD PDF BUTTON */}
                        <button
                          onClick={() => handleDownloadPdf(inv.id)}
                          disabled={downloadingPdf === inv.id}
                          className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transform transition-all duration-200 hover:scale-110 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative group"
                          title="Download PDF (Business Copy)"
                        >
                          {downloadingPdf === inv.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Download size={16} />
                          )}
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Download PDF
                          </span>
                        </button>

                        {/* Mark as Paid Button */}
                        {status !== 'paid' && (
                          <button
                            onClick={() => handleMarkAsPaid(inv.id)}
                            disabled={markingPaid === inv.id}
                            className="p-2 sm:p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transform transition-all duration-200 hover:scale-110 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative group"
                            title="Mark as Paid"
                          >
                            {markingPaid === inv.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Check size={16} />
                            )}
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              Mark as Paid
                            </span>
                          </button>
                        )}
                        
                        <button
                          onClick={() => toggleExpandInvoice(inv.id)}
                          className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transform transition-all duration-200 hover:scale-110 shadow-md relative group"
                          title="View Details"
                        >
                          <Eye size={16} />
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            View Details
                          </span>
                        </button>
                        
                        <button
                          onClick={() => {
                            setInvoiceToDelete(inv.id);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 sm:p-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transform transition-all duration-200 hover:scale-110 shadow-md relative group"
                          title="Delete Invoice"
                        >
                          <Trash2 size={16} />
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Delete
                          </span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Issue Date</p>
                        <p className="font-semibold text-gray-800">
                          {new Date(inv.issueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Due Date</p>
                        <p className={`font-semibold ${
                          status === 'overdue' ? 'text-red-600' : 'text-gray-800'
                        }`}>
                          {new Date(inv.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Total Amount</p>
                        <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          ${inv.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedInvoice === inv.id && (
                    <div className="border-t border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-4 sm:p-6 animate-fade-in">
                      {/* Invoice Items */}
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-3">Invoice Items</h3>
                        <div className="space-y-2">
                          {inv.items && inv.items.length > 0 ? (
                            inv.items.map((item, i) => (
                              <div
                                key={i}
                                className="bg-white p-3 sm:p-4 rounded-xl border border-indigo-200 shadow-sm"
                              >
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4">
                                  <div className="sm:col-span-2">
                                    <p className="text-xs text-gray-500 mb-1">Description</p>
                                    <p className="font-semibold text-gray-800">{item.description}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 mb-1">Quantity</p>
                                    <p className="font-semibold text-gray-800">{item.quantity}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 mb-1">Unit Price</p>
                                    <p className="font-semibold text-gray-800">${item.unitPrice.toFixed(2)}</p>
                                  </div>
                                </div>
                                {item.discount && item.discount > 0 && (
                                  <div className="mt-2 pt-2 border-t border-gray-200">
                                    <p className="text-xs text-gray-500">
                                      Discount: {item.isPercentageDiscount ? `${item.discount}%` : `$${item.discount}`}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm">No items</p>
                          )}
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        {inv.taxName && inv.taxRate && (
                          <div className="bg-white p-3 rounded-xl border border-emerald-200">
                            <p className="text-xs text-gray-500 mb-1">Tax</p>
                            <p className="font-semibold text-gray-800">
                              {inv.taxName}: {inv.taxRate}%
                            </p>
                          </div>
                        )}
                        {inv.discountType && inv.discountValue && (
                          <div className="bg-white p-3 rounded-xl border border-amber-200">
                            <p className="text-xs text-gray-500 mb-1">Discount</p>
                            <p className="font-semibold text-gray-800">
                              {inv.discountType === "PERCENTAGE" 
                                ? `${inv.discountValue}%` 
                                : `$${inv.discountValue}`}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Notes */}
                      {inv.notes && (
                        <div className="bg-white p-3 rounded-xl border border-violet-200">
                          <p className="text-xs text-gray-500 mb-1">Notes</p>
                          <p className="text-gray-800">{inv.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {filteredInvoices.length > 0 && totalPages > 1 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-md">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredInvoices.length)} of {filteredInvoices.length} invoices
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transform transition-all duration-200 hover:scale-105 shadow-md font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg font-medium text-sm transition-all duration-200 ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span key={page} className="px-2 text-gray-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transform transition-all duration-200 hover:scale-105 shadow-md font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* DELETE MODAL */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in p-4">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 animate-scale-in border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-2 sm:p-3 rounded-full">
                  <Trash2 className="text-red-600" size={20} />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Delete Invoice</h2>
              </div>
              <p className="text-gray-600 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                Are you sure you want to delete this invoice? This action cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transform transition-all duration-200 hover:scale-105 font-medium text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transform transition-all duration-200 hover:scale-105 shadow-md font-medium text-sm sm:text-base"
                >
                  Delete
                </button>
              </div>
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