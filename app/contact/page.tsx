"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Send,
  CheckCircle,
  Clock,
  Headphones,
  Globe,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  
  

  const contactMethods = [
    {
      icon: <Mail className="text-indigo-600" size={28} />,
      title: "Email Us",
      description: "Our team will respond within 24 hours",
      contact: "support@Envoice.com",
      link: "mailto:support@Envoice.com",
      gradient: "from-indigo-500 to-purple-600",
    },
    {
      icon: <Phone className="text-green-600" size={28} />,
      title: "Call Us",
      description: "Mon-Fri from 9am to 6pm EST",
      contact: "+1 (555) 123-4567",
      link: "tel:+15551234567",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      icon: <MapPin className="text-red-600" size={28} />,
      title: "Visit Us",
      description: "Come say hello at our office",
      contact: "123 Business St, Suite 100, New York, NY 10001",
      link: "#",
      gradient: "from-red-500 to-pink-600",
    },
    {
      icon: <MessageSquare className="text-blue-600" size={28} />,
      title: "Live Chat",
      description: "Chat with our support team",
      contact: "Available 24/7",
      link: "#",
      gradient: "from-blue-500 to-cyan-600",
    },
  ];

  const supportHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM EST" },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM EST" },
    { day: "Sunday", hours: "Closed" },
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

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 -z-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Get in Touch
            </span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <a
                key={index}
                href={method.link}
                className="group bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transform transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`bg-gradient-to-r ${method.gradient} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <div className="bg-white/20 backdrop-blur-sm w-full h-full rounded-xl flex items-center justify-center">
                    {method.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">{method.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                <p className="text-sm font-semibold text-indigo-600">{method.contact}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
  
            

            <div className="space-y-4 flex  gap-12 flex-col">
              {/* Support Hours */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-indigo-100 p-3 rounded-xl">
                    <Clock className="text-indigo-600" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Support Hours</h3>
                </div>
                <div className="space-y-3">
                  {supportHours.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="font-semibold text-gray-700">{schedule.day}</span>
                      <span className="text-gray-600">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Support */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                    <Headphones className="text-white" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold">Need Quick Support?</h3>
                </div>
                <p className="text-indigo-100 mb-6">
                  Check out our Help Center for instant answers to common questions.
                </p>
                <Link
                  href="#"
                  className="block w-full bg-white text-indigo-600 px-6 py-3 rounded-xl hover:bg-gray-50 transform transition-all duration-200 hover:scale-105 shadow-lg font-bold text-center"
                >
                  Visit Help Center →
                </Link>
              </div>

              {/* Enterprise */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <Globe className="text-green-600" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Enterprise Solutions</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Looking for a custom plan for your organization? Our sales team is here to help.
                </p>
                <Link
                  href="#"
                  className="text-indigo-600 font-semibold hover:text-indigo-700 flex items-center gap-2"
                >
                  Contact Sales <span>→</span>
                </Link>
              </div>
            </div>
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