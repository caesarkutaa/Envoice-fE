"use client";

import Link from "next/link";
import {
  FileText,
  Users,
  Target,
  Heart,
  Zap,
  Shield,
  Award,
  TrendingUp,
  Globe,
  Sparkles,
} from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: <Heart className="text-red-500" size={32} />,
      title: "Customer First",
      description: "We put our customers at the heart of everything we do. Your success is our success.",
    },
    {
      icon: <Zap className="text-yellow-500" size={32} />,
      title: "Innovation",
      description: "We constantly innovate to bring you the best invoicing experience possible.",
    },
    {
      icon: <Shield className="text-blue-500" size={32} />,
      title: "Security",
      description: "Your data security is our top priority. Bank-level encryption on all transactions.",
    },
    {
      icon: <Target className="text-green-500" size={32} />,
      title: "Simplicity",
      description: "We believe great software should be simple to use yet powerful in functionality.",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      bio: "15+ years in fintech, passionate about helping businesses grow.",
      gradient: "from-indigo-500 to-purple-600",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      bio: "Former Google engineer, building scalable solutions for millions.",
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Design",
      bio: "Award-winning designer creating beautiful user experiences.",
      gradient: "from-pink-500 to-rose-600",
    },
    {
      name: "David Kim",
      role: "VP of Customer Success",
      bio: "Dedicated to ensuring every customer achieves their goals.",
      gradient: "from-green-500 to-emerald-600",
    },
  ];

  const milestones = [
    { year: "2020", title: "Company Founded", description: "Envoice was born from a simple idea: make invoicing easy." },
    { year: "2021", title: "1,000 Users", description: "Reached our first thousand happy customers." },
    { year: "2022", title: "Series A Funding", description: "Raised $5M to expand our platform and team." },
    { year: "2023", title: "10,000 Users", description: "Processed over $1M in invoices monthly." },
    { year: "2024", title: "Global Expansion", description: "Launched in 50+ countries worldwide." },
    { year: "2025", title: "50,000 Users", description: "Helping businesses invoice smarter every day." },
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
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Sparkles size={16} />
            Our Story
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              About Envoice
            </span>
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            We're on a mission to simplify invoicing for businesses worldwide. 
            Founded in 2020, Envoice has helped over 50,000 businesses get paid faster 
            and manage their finances with confidence.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 lg:p-12 text-white shadow-2xl">
              <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Target className="text-white" size={32} />
              </div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-indigo-100 text-lg leading-relaxed">
                To empower businesses of all sizes with powerful, intuitive invoicing tools 
                that save time, reduce errors, and help them get paid faster. We believe 
                every business deserves access to professional financial management tools.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl p-8 lg:p-12 text-white shadow-2xl">
              <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Globe className="text-white" size={32} />
              </div>
              <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                To become the world's most trusted invoicing platform, helping millions of 
                businesses streamline their financial operations. We envision a future where 
                invoicing is effortless, secure, and accessible to everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Our Core Values
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transform transition-all duration-300 hover:-translate-y-2"
              >
                <div className="bg-gray-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Our Journey
              </span>
            </h2>
            <p className="text-xl text-gray-600">From startup to industry leader</p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className="flex gap-6 items-start group"
              >
                <div className="flex-shrink-0">
                  <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white w-20 h-20 rounded-full flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                    {milestone.year}
                  </div>
                </div>
                <div className="flex-1 bg-white p-6 rounded-xl shadow-lg border border-gray-200 group-hover:shadow-xl transition-shadow">
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Meet Our Team
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The brilliant minds behind Envoice
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transform transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`h-32 bg-gradient-to-r ${member.gradient}`}></div>
                <div className="p-6 -mt-12">
                  <div className="bg-white w-20 h-20 rounded-full mx-auto mb-4 shadow-lg flex items-center justify-center">
                    <Users className="text-gray-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-center mb-1 text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-indigo-600 text-center font-semibold mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm text-center leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Envoice by the Numbers</h2>
            <p className="text-indigo-200 text-lg">Growing every day</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "50K+", label: "Happy Customers" },
              { value: "100K+", label: "Invoices Created" },
              { value: "50+", label: "Countries" },
              { value: "99.9%", label: "Uptime" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-indigo-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Ready to Get Started?
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of businesses who trust Envoice
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transform transition-all duration-200 hover:scale-105 shadow-lg font-bold text-lg"
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="bg-white text-gray-900 px-8 py-4 rounded-xl hover:bg-gray-50 transform transition-all duration-200 hover:scale-105 shadow-lg font-bold text-lg border-2 border-gray-200"
            >
              Contact Sales
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