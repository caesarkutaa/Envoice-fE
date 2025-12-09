"use client";

import Link from "next/link";
import { FileText, Shield, Lock, Eye, Database, Users, Globe, CheckCircle } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      icon: <Database className="text-indigo-600" size={24} />,
      title: "Information We Collect",
      content: [
        "Account information (name, email, password)",
        "Business information (company name, address, tax ID)",
        "Invoice data (client details, transactions, amounts)",
        "Usage data (features used, login times, device information)",
        "Payment information (processed securely through third-party providers)",
      ],
    },
    {
      icon: <Eye className="text-blue-600" size={24} />,
      title: "How We Use Your Information",
      content: [
        "To provide and maintain our invoicing services",
        "To process your transactions and send notifications",
        "To improve our platform and develop new features",
        "To communicate with you about updates and support",
        "To ensure security and prevent fraud",
        "To comply with legal obligations",
      ],
    },
    {
      icon: <Lock className="text-green-600" size={24} />,
      title: "Data Security",
      content: [
        "Bank-level 256-bit SSL encryption for all data transmission",
        "Encrypted data storage with regular security audits",
        "Two-factor authentication (2FA) available",
        "Regular security updates and vulnerability testing",
        "SOC 2 Type II compliance",
        "24/7 security monitoring and threat detection",
      ],
    },
    {
      icon: <Users className="text-purple-600" size={24} />,
      title: "Data Sharing",
      content: [
        "We never sell your personal information to third parties",
        "Data is shared only with service providers necessary for operations",
        "Payment processors receive only necessary transaction data",
        "Cloud hosting providers store encrypted data",
        "We may share data when required by law",
      ],
    },
    {
      icon: <Globe className="text-cyan-600" size={24} />,
      title: "Your Rights",
      content: [
        "Access your personal data at any time",
        "Request correction of inaccurate information",
        "Delete your account and associated data",
        "Export your data in a portable format",
        "Opt-out of marketing communications",
        "Object to automated decision-making",
      ],
    },
    {
      icon: <Shield className="text-red-600" size={24} />,
      title: "Data Retention",
      content: [
        "Active account data is retained as long as your account is active",
        "Invoice data is retained for 7 years for tax compliance",
        "Deleted account data is permanently removed within 90 days",
        "Backup data is retained for disaster recovery (30 days)",
        "You can request immediate data deletion",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-lg shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-xl shadow-lg">
                <FileText className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Envoice
                </h1>
              </div>
            </Link>

            <Link
              href="/"
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 -z-10"></div>

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Shield size={16} />
            Privacy Policy
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Your Privacy Matters
            </span>
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-6">
            At Envoice, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information.
          </p>

          <p className="text-sm text-gray-500">
            Last updated: December 8, 2025
          </p>
        </div>
      </section>

      {/* Key Points */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6 text-white text-center">
            <div>
              <Lock className="mx-auto mb-3" size={32} />
              <h3 className="font-bold mb-1">Encrypted</h3>
              <p className="text-sm text-indigo-200">256-bit SSL</p>
            </div>
            <div>
              <Shield className="mx-auto mb-3" size={32} />
              <h3 className="font-bold mb-1">SOC 2 Certified</h3>
              <p className="text-sm text-indigo-200">Type II Compliant</p>
            </div>
            <div>
              <Eye className="mx-auto mb-3" size={32} />
              <h3 className="font-bold mb-1">Transparent</h3>
              <p className="text-sm text-indigo-200">Clear policies</p>
            </div>
            <div>
              <CheckCircle className="mx-auto mb-3" size={32} />
              <h3 className="font-bold mb-1">GDPR Ready</h3>
              <p className="text-sm text-indigo-200">EU compliant</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {sections.map((section, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-gray-50 p-3 rounded-xl flex-shrink-0">
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {section.title}
                    </h2>
                    <ul className="space-y-3">
                      {section.content.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={18} />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Sections */}
          <div className="mt-12 space-y-8">
            <div className="bg-gray-50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to enhance your experience. Essential cookies are required for the platform to function. Analytics cookies help us understand how you use our service. You can control cookie preferences in your browser settings.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We use Google Analytics for anonymous usage statistics and do not share this data with third parties for marketing purposes.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">International Transfers</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Your data may be processed in countries outside your residence. We ensure appropriate safeguards are in place, including Standard Contractual Clauses approved by the European Commission.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Envoice is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will delete it immediately.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may update this privacy policy from time to time. We will notify you of any material changes by email or through a notice on our platform. Continued use of Envoice after changes constitutes acceptance of the updated policy.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="mt-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Questions About Privacy?</h2>
            <p className="text-indigo-100 mb-6">
              If you have questions or concerns about our privacy practices, please don't hesitate to contact us.
            </p>
            <div className="space-y-2 text-indigo-100">
              <p>Email: privacy@Envoice.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Business St, Suite 100, New York, NY 10001</p>
            </div>
            <Link
              href="/contact"
              className="inline-block mt-6 bg-white text-indigo-600 px-6 py-3 rounded-xl hover:bg-gray-50 transform transition-all duration-200 hover:scale-105 shadow-lg font-bold"
            >
              Contact Us →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-xl">
              <FileText className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold">Envoice</h3>
          </div>
          <p className="text-gray-400 mb-4">© 2025 Envoice. All rights reserved.</p>
          <div className="flex justify-center gap-6 text-sm">
            <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
              Contact
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}