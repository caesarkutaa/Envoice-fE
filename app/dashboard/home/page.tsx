"use client";

import { useEffect, useState } from "react";
import { 
  TrendingUp, 
  FileText, 
  Users, 
  DollarSign, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const base_url = process.env.NEXT_PUBLIC_API_URL

interface DashboardStats {
  totalInvoices: number;
  pendingInvoices: number;
  paidInvoices: number;
  overdueInvoices: number;
  totalClients: number;
  totalRevenue: number;
  pendingRevenue: number;
  paidRevenue: number;
  recentInvoices: Array<{
    id: string;
    clientName: string;
    amount: number;
    status: string;
    dueDate: string;
  }>;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  gradient: string;
  iconBg: string;
}

function StatCard({ title, value, icon, trend, trendLabel, gradient, iconBg }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:scale-105 animate-fade-in">
      <div className={`h-2 ${gradient}`}></div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`${iconBg} p-3 rounded-xl`}>
            {icon}
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 text-sm font-semibold ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {trendLabel && (
          <p className="text-xs text-gray-500 mt-2">{trendLabel}</p>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { accessToken, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalInvoices: 0,
    pendingInvoices: 0,
    paidInvoices: 0,
    overdueInvoices: 0,
    totalClients: 0,
    totalRevenue: 0,
    pendingRevenue: 0,
    paidRevenue: 0,
    recentInvoices: [],
  });

  useEffect(() => {
    if (!authLoading && accessToken) {
      fetchDashboardData();
    }
  }, [authLoading, accessToken]);

  const fetchDashboardData = async () => {
    try {
      // Fetch invoices
      const invoicesRes = await fetch(`${base_url}/invoices`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Fetch clients
      const clientsRes = await fetch(`${base_url}/clients`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (invoicesRes.ok && clientsRes.ok) {
        const invoices = await invoicesRes.json();
        const clients = await clientsRes.json();

        // Calculate statistics
        const now = new Date();
        
        const pending = invoices.filter((inv: any) => inv.status === 'PENDING' || inv.status === 'pending');
        const paid = invoices.filter((inv: any) => inv.status === 'PAID' || inv.status === 'paid');
        const overdue = invoices.filter((inv: any) => {
          const dueDate = new Date(inv.dueDate);
          return dueDate < now && (inv.status === 'PENDING' || inv.status === 'pending');
        });

        const totalRevenue = invoices.reduce((sum: number, inv: any) => sum + (inv.totalAmount || 0), 0);
        const paidRevenue = paid.reduce((sum: number, inv: any) => sum + (inv.totalAmount || 0), 0);
        const pendingRevenue = pending.reduce((sum: number, inv: any) => sum + (inv.totalAmount || 0), 0);

        // Get recent invoices (last 5)
        const recentInvoices = invoices
          .sort((a: any, b: any) => new Date(b.createdAt || b.issueDate).getTime() - new Date(a.createdAt || a.issueDate).getTime())
          .slice(0, 5)
          .map((inv: any) => ({
            id: inv.id,
            clientName: inv.client?.name || 'Unknown Client',
            amount: inv.totalAmount || 0,
            status: inv.status || 'pending',
            dueDate: inv.dueDate,
          }));

        setStats({
          totalInvoices: invoices.length,
          pendingInvoices: pending.length,
          paidInvoices: paid.length,
          overdueInvoices: overdue.length,
          totalClients: clients.length,
          totalRevenue,
          pendingRevenue,
          paidRevenue,
          recentInvoices,
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4 sm:mb-6"></div>
          <p className="text-lg sm:text-xl text-gray-700 font-semibold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const completionRate = stats.totalInvoices > 0 
    ? Math.round((stats.paidInvoices / stats.totalInvoices) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2.5 sm:p-3 rounded-xl shadow-lg">
              <BarChart3 className="text-white" size={24} />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid - Responsive 1-2-4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Total Invoices */}
          <StatCard
            title="Total Invoices"
            value={stats.totalInvoices}
            icon={<FileText className="text-indigo-600" size={20} />}
            gradient="bg-gradient-to-r from-indigo-500 to-indigo-600"
            iconBg="bg-indigo-50"
            trendLabel="All time"
          />

          {/* Paid Invoices */}
          <StatCard
            title="Paid Invoices"
            value={stats.paidInvoices}
            icon={<CheckCircle className="text-green-600" size={20} />}
            trend={completionRate}
            trendLabel={`${completionRate}% completion rate`}
            gradient="bg-gradient-to-r from-green-500 to-green-600"
            iconBg="bg-green-50"
          />

          {/* Pending Invoices */}
          <StatCard
            title="Pending Invoices"
            value={stats.pendingInvoices}
            icon={<Clock className="text-amber-600" size={20} />}
            gradient="bg-gradient-to-r from-amber-500 to-amber-600"
            iconBg="bg-amber-50"
            trendLabel="Awaiting payment"
          />

          {/* Overdue Invoices */}
          <StatCard
            title="Overdue Invoices"
            value={stats.overdueInvoices}
            icon={<AlertCircle className="text-red-600" size={20} />}
            gradient="bg-gradient-to-r from-red-500 to-red-600"
            iconBg="bg-red-50"
            trendLabel="Requires attention"
          />
        </div>

        {/* Revenue and Clients Row - Responsive 1-2-3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Total Revenue */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 transform transition-all duration-300 hover:shadow-xl hover:scale-105 animate-fade-in">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-2.5 sm:p-3 rounded-xl">
                <DollarSign className="text-purple-600" size={20} />
              </div>
            </div>
            <h3 className="text-gray-600 text-xs sm:text-sm font-medium mb-1">Total Revenue</h3>
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ${stats.totalRevenue.toFixed(2)}
            </p>
            <div className="mt-3 sm:mt-4 space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Paid</span>
                <span className="font-semibold text-green-600">${stats.paidRevenue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Pending</span>
                <span className="font-semibold text-amber-600">${stats.pendingRevenue.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Total Clients */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 transform transition-all duration-300 hover:shadow-xl hover:scale-105 animate-fade-in">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-2.5 sm:p-3 rounded-xl">
                <Users className="text-blue-600" size={20} />
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Active</p>
                <p className="text-base sm:text-lg font-bold text-blue-600">{stats.totalClients}</p>
              </div>
            </div>
            <h3 className="text-gray-600 text-xs sm:text-sm font-medium mb-1">Total Clients</h3>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalClients}</p>
            <p className="text-xs text-gray-500 mt-2">Registered clients</p>
          </div>

          {/* Completion Rate */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 text-white transform transition-all duration-300 hover:shadow-xl hover:scale-105 animate-fade-in md:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-2.5 sm:p-3 rounded-xl">
                <TrendingUp className="text-white" size={20} />
              </div>
            </div>
            <h3 className="text-white/80 text-xs sm:text-sm font-medium mb-1">Completion Rate</h3>
            <p className="text-3xl sm:text-4xl font-bold">{completionRate}%</p>
            <div className="mt-3 sm:mt-4">
              <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-white h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
              <p className="text-xs text-white/80 mt-2">
                {stats.paidInvoices} of {stats.totalInvoices} invoices paid
              </p>
            </div>
          </div>
        </div>

        {/* Recent Invoices - Mobile Optimized */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <Calendar className="text-white" size={20} />
              <h2 className="text-lg sm:text-xl font-bold text-white">Recent Invoices</h2>
            </div>
          </div>

          {stats.recentInvoices.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <FileText size={40} className="mx-auto mb-4 text-gray-300 sm:w-12 sm:h-12" />
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">No Invoices Yet</h3>
              <p className="text-sm sm:text-base text-gray-600">Create your first invoice to get started</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Invoice ID
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stats.recentInvoices.map((invoice, index) => {
                      const isOverdue = new Date(invoice.dueDate) < new Date() && 
                                       (invoice.status === 'PENDING' || invoice.status === 'pending');
                      const isPaid = invoice.status === 'PAID' || invoice.status === 'paid';
                      
                      return (
                        <tr 
                          key={invoice.id}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{invoice.id.slice(0, 8)}
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {invoice.clientName}
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            ${invoice.amount.toFixed(2)}
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(invoice.dueDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <span className={`
                              inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
                              ${isPaid ? 'bg-green-100 text-green-700' : 
                                isOverdue ? 'bg-red-100 text-red-700' : 
                                'bg-amber-100 text-amber-700'}
                            `}>
                              {isPaid ? <CheckCircle size={12} /> : 
                               isOverdue ? <XCircle size={12} /> : 
                               <Clock size={12} />}
                              {isPaid ? 'Paid' : isOverdue ? 'Overdue' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-gray-200">
                {stats.recentInvoices.map((invoice, index) => {
                  const isOverdue = new Date(invoice.dueDate) < new Date() && 
                                   (invoice.status === 'PENDING' || invoice.status === 'pending');
                  const isPaid = invoice.status === 'PAID' || invoice.status === 'paid';
                  
                  return (
                    <div key={invoice.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 mb-1">
                            #{invoice.id.slice(0, 8)}
                          </p>
                          <p className="text-sm text-gray-700">{invoice.clientName}</p>
                        </div>
                        <span className={`
                          inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap
                          ${isPaid ? 'bg-green-100 text-green-700' : 
                            isOverdue ? 'bg-red-100 text-red-700' : 
                            'bg-amber-100 text-amber-700'}
                        `}>
                          {isPaid ? <CheckCircle size={12} /> : 
                           isOverdue ? <XCircle size={12} /> : 
                           <Clock size={12} />}
                          {isPaid ? 'Paid' : isOverdue ? 'Overdue' : 'Pending'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Amount</p>
                          <p className="font-bold text-gray-900">${invoice.amount.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500 text-xs mb-1">Due Date</p>
                          <p className="text-gray-700">
                            {new Date(invoice.dueDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Quick Actions - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
          <a
            href="/dashboard/invoices/create"
            className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 flex items-center justify-between"
          >
            <div className="flex-1 pr-4">
              <h3 className="text-base sm:text-lg font-bold mb-1">Create New Invoice</h3>
              <p className="text-white/80 text-xs sm:text-sm">Start a new invoice for your clients</p>
            </div>
            <ArrowUpRight className="text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform flex-shrink-0" size={20} />
          </a>

          <a
            href="/dashboard/clients"
            className="group bg-white border-2 border-indigo-200 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 flex items-center justify-between"
          >
            <div className="flex-1 pr-4">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">Manage Clients</h3>
              <p className="text-gray-600 text-xs sm:text-sm">View and manage your client list</p>
            </div>
            <ArrowUpRight className="text-indigo-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform flex-shrink-0" size={20} />
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
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