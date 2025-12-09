"use client";

import Link from "next/link";
import { FileText, Scale, Shield, AlertCircle, CheckCircle, XCircle, Info } from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      icon: <CheckCircle className="text-green-600" size={24} />,
      title: "Acceptance of Terms",
      content: `By accessing and using Envoice ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our Service.`,
    },
    {
      icon: <Info className="text-blue-600" size={24} />,
      title: "Service Description",
      content: `Envoice provides cloud-based invoicing and financial management software. We reserve the right to modify, suspend, or discontinue any part of the Service at any time with reasonable notice.`,
    },
    {
      icon: <Shield className="text-indigo-600" size={24} />,
      title: "User Accounts",
      content: `You are responsible for maintaining the confidentiality of your account credentials. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.`,
    },
    {
      icon: <AlertCircle className="text-red-600" size={24} />,
      title: "Prohibited Uses",
      content: `You may not use Envoice for any illegal purposes, to transmit harmful code, to violate any laws, to infringe on intellectual property rights, or to harass or harm others. We reserve the right to terminate accounts that violate these terms.`,
    },
  ];

  const usageRules = [
    "You must be at least 18 years old to use this service",
    "Provide accurate and complete registration information",
    "Maintain the security of your account credentials",
    "Notify us of any unauthorized account access",
    "Use the service only for lawful business purposes",
    "Not attempt to reverse engineer or hack the platform",
    "Not share your account with unauthorized users",
    "Not use the service to send spam or malicious content",
  ];

  const subscriptionTerms = [
    {
      title: "Free Trial",
      points: [
        "free trial available for new users",
        "No credit card required for trial",
        "Full access to all features during trial",
        "Trial automatically ends after 14 days",
      ],
    },
    {
      title: "Paid Subscriptions",
      points: [
        "Monthly and annual billing options available",
        "Automatic renewal unless cancelled",
        "Prices subject to change with 30-day notice",
        "Refunds available within first 7 days",
      ],
    },
    {
      title: "Cancellation",
      points: [
        "Cancel anytime from account settings",
        "Access continues until end of billing period",
        "No refunds for partial months",
        "Data retained for 90 days after cancellation",
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
            <Scale size={16} />
            Terms of Service
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Terms of Service
            </span>
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-6">
            Please read these terms carefully before using Envoice. By using our service, you agree to these terms.
          </p>

          <p className="text-sm text-gray-500">
            Last updated: December 8, 2025
          </p>
        </div>
      </section>

      {/* Main Sections */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {sections.map((section, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-gray-50 p-3 rounded-xl flex-shrink-0">
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {section.title}
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Usage Rules */}
          <div className="mt-12 bg-gray-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">User Responsibilities</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {usageRules.map((rule, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={18} />
                  <span className="text-gray-700">{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subscription Terms */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Subscription & Billing
              </span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {subscriptionTerms.map((term, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{term.title}</h3>
                  <ul className="space-y-3">
                    {term.points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <div className="bg-indigo-100 p-1 rounded mt-0.5">
                          <CheckCircle className="text-indigo-600" size={12} />
                        </div>
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Terms */}
          <div className="mt-12 space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                All content, features, and functionality of Envoice are owned by us and are protected by international copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or reverse engineer any part of our service.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Your invoice data and content remain your property. We claim no ownership rights over your content. However, by using our service, you grant us a license to host, store, and display your content as necessary to provide the service.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Envoice is provided "as is" without warranties of any kind. We do not guarantee that the service will be uninterrupted, secure, or error-free. To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our total liability for any claims arising out of or relating to these terms or your use of Envoice shall not exceed the amount paid by you in the 12 months preceding the claim.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Indemnification</h2>
              <p className="text-gray-700 leading-relaxed">
                You agree to indemnify and hold harmless Envoice, its affiliates, and their respective officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising out of your use of the service, your violation of these terms, or your violation of any rights of another.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to suspend or terminate your account at any time for violation of these terms, fraudulent activity, or any reason we deem necessary to protect our service or other users.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Upon termination, your right to use the service will immediately cease. We will retain your data for 90 days after termination, after which it will be permanently deleted unless required by law to retain it longer.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These terms shall be governed by and construed in accordance with the laws of the State of New York, United States, without regard to its conflict of law provisions. Any disputes arising from these terms or your use of Envoice shall be resolved in the state or federal courts located in New York County, New York.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to modify these terms at any time. We will provide notice of material changes via email or through the service. Your continued use of Envoice after such modifications constitutes your acceptance of the updated terms.
              </p>
              <p className="text-gray-700 leading-relaxed">
                If you do not agree to the modified terms, you must stop using the service and may cancel your account.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Severability</h2>
              <p className="text-gray-700 leading-relaxed">
                If any provision of these terms is found to be invalid or unenforceable, the remaining provisions will continue to be valid and enforceable to the fullest extent permitted by law.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="mt-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Questions About These Terms?</h2>
            <p className="text-indigo-100 mb-6">
              If you have any questions or concerns about our Terms of Service, please contact our legal team.
            </p>
            <div className="space-y-2 text-indigo-100">
              <p>Email: legal@Envoice.com</p>
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