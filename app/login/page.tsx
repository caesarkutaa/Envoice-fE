"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  FileText,
  CheckCircle,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Shield,
  ArrowRight
} from "lucide-react";

const base_url = process.env.NEXT_PUBLIC_API_URL

// Define schema for login form
const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user?: {
    id: string;
    email: string;
    username?: string;
  };
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const { setAuth } = useAuth();

  const onSubmit = async (data: LoginFormData) => {
    try {
      // Validate with zod
      loginSchema.parse(data);

      setErrorMessage("");

      // Connect to your API endpoint
      const response = await fetch(`${base_url}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Invalid email or password");
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Login failed");
        }
      }

      // Parse the successful response
      const authData: AuthResponse = await response.json();

      // Store tokens in auth context (memory)
      setAuth(authData.accessToken, authData.refreshToken, authData.user);

      // Success - redirect to dashboard
      router.push("/dashboard/home");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <div className="hidden lg:block space-y-8 animate-fade-in">
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
                Welcome Back to{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Envoice
                </span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Sign in to manage your invoices, track payments, and grow your business with ease.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {[
                { icon: <TrendingUp className="text-green-600" size={20} />, text: "Track your revenue in real-time" },
                { icon: <Shield className="text-blue-600" size={20} />, text: "Bank-level security for your data" },
                { icon: <Sparkles className="text-purple-600" size={20} />, text: "Professional invoices in seconds" },
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="bg-gray-50 p-2 rounded-lg">
                    {feature.icon}
                  </div>
                  <span className="text-gray-700 font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "10K+", label: "Users" },
                { value: "50K+", label: "Invoices" },
                { value: "99.9%", label: "Uptime" },
              ].map((stat, index) => (
                <div key={index} className="text-center p-4 bg-white rounded-xl shadow-md border border-gray-100">
                  <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="animate-scale-in">
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
                  Welcome Back
                </h2>
                <p className="text-gray-600">Sign in to continue to your account</p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-fade-in">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="text-red-800 font-semibold">Login Failed</p>
                      <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                      })}
                      placeholder="Enter your password"
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

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                    />
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                      Remember me
                    </span>
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
                  >
                    Forgot password?
                  </Link>
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
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn size={20} />
                      Sign In
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

              {/* Sign Up Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors inline-flex items-center gap-1"
                  >
                    Sign up for free
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