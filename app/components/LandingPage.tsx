"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Users,
  TrendingUp,
  Zap,
  Shield,
  Globe,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  BarChart3,
  Clock,
  DollarSign,
} from "lucide-react";

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <FileText className="text-indigo-600" size={32} />,
      title: "Smart Invoicing",
      description: "Create professional invoices in seconds with our intuitive interface and automated calculations.",
      gradient: "from-indigo-500 to-purple-600",
    },
    {
      icon: <Users className="text-blue-600" size={32} />,
      title: "Client Management",
      description: "Organize and track all your clients in one place with detailed contact information and history.",
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      icon: <TrendingUp className="text-green-600" size={32} />,
      title: "Analytics Dashboard",
      description: "Visualize your revenue, track payments, and monitor business growth with powerful analytics.",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      icon: <Zap className="text-yellow-600" size={32} />,
      title: "Lightning Fast",
      description: "Built for speed and efficiency. Create, send, and manage invoices faster than ever before.",
      gradient: "from-yellow-500 to-orange-600",
    },
    {
      icon: <Shield className="text-red-600" size={32} />,
      title: "Secure & Reliable",
      description: "Bank-level encryption and security. Your data is safe and backed up automatically.",
      gradient: "from-red-500 to-pink-600",
    },
    {
      icon: <Globe className="text-purple-600" size={32} />,
      title: "Access Anywhere",
      description: "Cloud-based platform accessible from any device. Work from anywhere, anytime.",
      gradient: "from-purple-500 to-fuchsia-600",
    },
  ];

  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "50K+", label: "Invoices Created" },
    { value: "99.9%", label: "Uptime" },
    { value: "$5M+", label: "Processed" },
  ];

  const benefits = [
    "Unlimited invoices and clients",
    "Real-time payment tracking",
    "Automated reminders",
    "Multiple payment methods",
    "Detailed financial reports",
    "Export to PDF and Excel",
    "Custom branding options",
    "Priority customer support",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-lg shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-xl shadow-lg">
                <FileText className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Envoice
                </h1>
                <p className="text-xs text-gray-500">Invoicing Made Simple</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
              >
                Features
              </a>
              <a
                href="#benefits"
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
              >
                Benefits
              </a>
              <a
                href="/about"
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
              >
                About
              </a>
              <Link
                href="/login"
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transform transition-all duration-200 hover:scale-105 shadow-lg font-semibold"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg animate-fade-in">
            <div className="px-4 py-6 space-y-4">
              <a
                href="#features"
                className="block text-gray-700 hover:text-indigo-600 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#benefits"
                className="block text-gray-700 hover:text-indigo-600 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Benefits
              </a>
              <a
                href="/about"
                className="block text-gray-700 hover:text-indigo-600 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
              <Link
                href="/login"
                className="block text-gray-700 hover:text-indigo-600 font-medium py-2"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transform transition-all duration-200 shadow-lg font-semibold text-center"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 -z-10"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl -z-10 animate-pulse delay-1000"></div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold">
                <Sparkles size={16} />
                #1 Invoicing Platform
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Invoice Smarter,
                </span>
                <br />
                <span className="text-gray-900">Get Paid Faster</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                The all-in-one invoicing solution for freelancers, small businesses, and enterprises. 
                Create professional invoices, track payments, and grow your business with ease.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transform transition-all duration-200 hover:scale-105 shadow-2xl font-bold text-lg flex items-center justify-center gap-2"
                >
                  Start Free 
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
                <Link
                  href="/login"
                  className="bg-white text-gray-900 px-8 py-4 rounded-xl hover:bg-gray-50 transform transition-all duration-200 hover:scale-105 shadow-lg font-bold text-lg border-2 border-gray-200 flex items-center justify-center gap-2"
                >
                  Sign In
                </Link>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={20} />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={20} />
                  Free trial
                </div>
              </div>
            </div>

            {/* Right Content - Mockup */}
            <div className="relative animate-fade-in-up delay-200">
              <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-300">
                {/* Mock Invoice */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold">INVOICE</h3>
                      <p className="text-indigo-200 text-sm">#INV-2025-001</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <p className="text-xs">Status</p>
                      <p className="font-bold">PAID</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {/* From/To */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">FROM</p>
                      <p className="font-semibold">Your Business</p>
                      <p className="text-sm text-gray-600">your@email.com</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">TO</p>
                      <p className="font-semibold">Client Name</p>
                      <p className="text-sm text-gray-600">client@email.com</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="space-y-2">
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="flex justify-between text-sm">
                          <span className="text-gray-600">Service Item {item}</span>
                          <span className="font-semibold">${(item * 250).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t-2 border-gray-200 pt-4 flex justify-between items-center">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      $1,500.00
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-lg border border-gray-200 animate-float">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <CheckCircle className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Payment Received</p>
                    <p className="font-bold text-green-600">$1,500.00</p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-lg border border-gray-200 animate-float delay-500">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <TrendingUp className="text-indigo-600" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">This Month</p>
                    <p className="font-bold text-indigo-600">+47% Growth</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-indigo-200 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your invoicing workflow efficiently and professionally
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`bg-gradient-to-r ${feature.gradient} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <div className="bg-white/20 backdrop-blur-sm w-full h-full rounded-xl flex items-center justify-center">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Benefits List */}
            <div className="animate-fade-in-up">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Why Choose Envoice?
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of businesses who trust Envoice for their invoicing needs
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - CTA Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 lg:p-12 text-white shadow-2xl animate-fade-in-up delay-300">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                  <Sparkles size={16} />
                  Limited Time Offer
                </div>

                <h3 className="text-3xl lg:text-4xl font-bold">
                  Start Free Today
                </h3>

                <p className="text-indigo-100 text-lg">
                  Get free access to all premium features. No credit card required. Cancel anytime.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                      <Clock className="text-white" size={20} />
                    </div>
                    <span>Setup in under 5 minutes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                      <DollarSign className="text-white" size={20} />
                    </div>
                    <span>No hidden fees or charges</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                      <BarChart3 className="text-white" size={20} />
                    </div>
                    <span>Full access to all features</span>
                  </div>
                </div>

                <Link
                  href="/signup"
                  className="block w-full bg-white text-indigo-600 px-8 py-4 rounded-xl hover:bg-gray-50 transform transition-all duration-200 hover:scale-105 shadow-lg font-bold text-lg text-center"
                >
                  Get Started Free →
                </Link>

                <p className="text-sm text-indigo-200 text-center">
                  Already have an account?{" "}
                  <Link href="/login" className="text-white font-semibold underline">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-xl">
                  <FileText className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Envoice</h3>
                  <p className="text-sm text-gray-400">Invoicing Made Simple</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                The modern invoicing solution for businesses of all sizes. 
                Create, send, and track professional invoices in minutes.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#benefits" className="hover:text-white transition-colors">Benefits</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 Envoice. All rights reserved. Made with ❤️ for businesses worldwide.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in {
          animation: fade-in-up 0.5s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .delay-200 {
          animation-delay: 200ms;
        }

        .delay-300 {
          animation-delay: 300ms;
        }

        .delay-500 {
          animation-delay: 500ms;
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
}