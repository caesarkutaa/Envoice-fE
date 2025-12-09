"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  FileText, 
  Users, 
  Briefcase, 
  Settings, 
  Menu, 
  X, 
  LogOut,
  User,
  ChevronRight
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { name: "Dashboard", href: "/dashboard/home", icon: Home },
  { name: "Invoices", href: "/dashboard/invoices", icon: FileText },
  { name: "Clients", href: "/dashboard/clients", icon: Users },
  { name: "Business Profile", href: "/dashboard/business", icon: Briefcase },
  { name: "Profile", href: "/dashboard", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { clearAuth, user } = useAuth();

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/login';
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen
          w-72 bg-white shadow-2xl
          flex flex-col z-40
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-90"></div>
          <div className="relative p-6 text-center">
            <div className="bg-white/20 backdrop-blur-lg inline-block p-3 rounded-2xl mb-3">
              <FileText className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide">
              Envoice
            </h1>
            <p className="text-white/80 text-sm mt-1">Manage with ease</p>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="px-4 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user.username || user.email}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {navLinks.map((link, index) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              
              return (
                <li
                  key={link.name}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="animate-slide-in"
                >
                  <Link
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={`
                      group flex items-center justify-between p-3 rounded-lg
                      transition-all duration-200 
                      ${active 
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105' 
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:scale-105'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon 
                        className={`
                          transition-transform duration-200
                          ${active ? 'scale-110' : 'group-hover:scale-110'}
                        `}
                        size={20} 
                      />
                      <span className="font-medium">{link.name}</span>
                    </div>
                    {active && (
                      <ChevronRight size={18} className="animate-pulse" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 p-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transform transition-all duration-200 hover:scale-105 shadow-md font-medium group"
          >
            <LogOut size={20} className="group-hover:rotate-12 transition-transform duration-200" />
            <span>Logout</span>
          </button>
        </div>

        
        
      </aside>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
          opacity: 0;
        }

        /* Custom scrollbar */
        nav::-webkit-scrollbar {
          width: 6px;
        }

        nav::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        nav::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #6366f1, #a855f7);
          border-radius: 10px;
        }

        nav::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #4f46e5, #9333ea);
        }
      `}</style>
    </>
  );
}