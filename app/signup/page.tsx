"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  FileText,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Shield,
  Zap,
  ArrowRight,
  Check
} from "lucide-react";

const base_url = process.env.NEXT_PUBLIC_API_URL

// Define schema based on your UserSignUpDto
const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>();

  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: SignupFormData) => {
    try {
      if (!agreedToTerms) {
        setErrorMessage("Please agree to the Terms of Service and Privacy Policy");
        return;
      }

      // Validate with zod
      signupSchema.parse(data);

      setErrorMessage("");

      // Connect to your API endpoint
      const response = await fetch(`${base_url}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("Email or username already taken");
        } else if (response.status === 403) {
          throw new Error("Credentials already taken");
        } else {
          throw new Error(result.message || "Registration failed");
        }
      }

      // Success - redirect to confirmation page with email
      router.push(`/email-confirmation?email=${encodeURIComponent(data.email)}`);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const errors = error.errors
          .map((e) => `${e.path}: ${e.message}`)
          .join(", ");
        setErrorMessage(`Validation error: ${errors}`);
      } else {
        setErrorMessage(error.message || "An error occurred");
      }
    }
  };

  const passwordRequirements = [
    { met: false, text: "At least 6 characters" },
    { met: false, text: "Contains a number" },
    { met: false, text: "Contains uppercase letter" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Form */}
          <div className="order-2 lg:order-1 animate-scale-in">
            {/* Mobile Logo */}
            <Link href="/" className="lg:hidden flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2.5 rounded-xl shadow-lg">
                <FileText className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Envoice
                </h1>
              </div>
            </Link>

            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-6 sm:p-8 lg:p-10">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Create Account
                </h2>
                <p className="text-gray-600">Start your 14-day free trial today</p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-fade-in">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="text-red-800 font-semibold">Registration Failed</p>
                      <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Username */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <User className="text-gray-400" size={18} />
                    </div>
                    <input
                      type="text"
                      {...register("username", {
                        required: "Username is required",
                        minLength: {
                          value: 3,
                          message: "Username must be at least 3 characters"
                        }
                      })}
                      placeholder="johndoe"
                      className="w-full pl-12 pr-4 py-3 sm:py-3.5 border-2 border-gray-300 rounded-xl text-gray-900 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none placeholder-gray-400 text-sm sm:text-base"
                    />
                  </div>
                  {errors.username && (
                    <p className="text-red-600 text-sm font-medium mt-2 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.username.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <Mail className="text-gray-400" size={18} />
                    </div>
                    <input
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: "Invalid email address",
                        },
                      })}
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-3 sm:py-3.5 border-2 border-gray-300 rounded-xl text-gray-900 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none placeholder-gray-400 text-sm sm:text-base"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-600 text-sm font-medium mt-2 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <Lock className="text-gray-400" size={18} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters long",
                        },
                      })}
                      placeholder="Create a strong password"
                      className="w-full pl-12 pr-12 py-3 sm:py-3.5 border-2 border-gray-300 rounded-xl text-gray-900 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none placeholder-gray-400 text-sm sm:text-base"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-600 text-sm font-medium mt-2 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Terms Checkbox */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="w-4 h-4 mt-1 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer flex-shrink-0"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                      I agree to the{" "}
                      <Link href="/terms" className="text-indigo-600 font-semibold hover:text-indigo-700">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-indigo-600 font-semibold hover:text-indigo-700">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 sm:py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transform transition-all duration-200 hover:scale-105 shadow-lg font-bold text-base sm:text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating account...
                    </>
                  ) : (
                    <>
                      <UserPlus size={20} />
                      Create Account
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  
                </div>
              </form>

              {/* Login Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors inline-flex items-center gap-1"
                  >
                    Sign in
                    <ArrowRight size={16} />
                  </Link>
                </p>
              </div>
            </div>

            {/* Footer Links */}
            <div className="mt-6 text-center text-sm text-gray-600">
              <Link href="/privacy" className="hover:text-indigo-600 transition-colors">
                Privacy Policy
              </Link>
              <span className="mx-3">•</span>
              <Link href="/terms" className="hover:text-indigo-600 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Right Side - Benefits */}
          <div className="order-1 lg:order-2 hidden lg:block space-y-8 animate-fade-in">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 mb-8">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                <FileText className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Envoice
                </h1>
                <p className="text-sm text-gray-600">Invoicing Made Simple</p>
              </div>
            </Link>

            {/* Hero Content */}
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Start Managing Your{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Invoices Today
                </span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Join thousands of businesses who trust Envoice to streamline their invoicing and get paid faster.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              {[
                {
                  icon: <Sparkles className="text-purple-600" size={20} />,
                  title: "Free Trial",
                  description: "Full access to all features. No credit card required.",
                },
                {
                  icon: <Zap className="text-yellow-600" size={20} />,
                  title: "Quick Setup",
                  description: "Create your first invoice in under 5 minutes.",
                },
                {
                  icon: <Shield className="text-blue-600" size={20} />,
                  title: "Secure & Compliant",
                  description: "Bank-level encryption and SOC 2 certified.",
                },
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="bg-gray-50 p-3 rounded-lg flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{benefit.title}</h3>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* What's Included */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">What's Included</h3>
              <div className="space-y-3">
                {[
                  "Unlimited invoices and clients",
                  "Professional invoice templates",
                  "Payment tracking & reminders",
                  "Detailed analytics dashboard",
                  "Export to PDF & Excel",
                  "Priority customer support",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm p-1 rounded-full">
                      <Check size={14} className="text-white" />
                    </div>
                    <span className="text-white/90">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full flex items-center justify-center">
                  <User className="text-indigo-600" size={24} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Sarah Johnson</p>
                  <p className="text-sm text-gray-600">Freelance Designer</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Envoice has transformed how I manage my business. I get paid 40% faster and save hours every week!"
              </p>
            </div>
          </div>
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

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.4s ease-out;
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
}