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
  AlertCircle,
  Sparkles,
  TrendingUp,
  Shield,
  ArrowRight,
} from "lucide-react";

const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

// Schema
const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

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
      loginSchema.parse(data);
      setErrorMessage("");

      const response = await fetch(`${base_url}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Invalid email or password");
        }
        throw new Error("Login failed");
      }

      const authData = await response.json();
      setAuth(authData.accessToken, authData.refreshToken, authData.user);
      router.push("/dashboard/home");
    } catch (error: any) {
      setErrorMessage(error.message || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gray-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">

          {/* LEFT – BRANDING */}
          <div className="hidden lg:block space-y-8 animate-fade-in">
            <Link href="/" className="flex items-center gap-3">
              <div className="bg-blue-900 p-3 rounded-2xl shadow-lg">
                <FileText className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-blue-900">Envoice</h1>
                <p className="text-sm text-gray-600">Invoicing Made Simple</p>
              </div>
            </Link>

            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                Welcome back to Envoice
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Sign in to manage your invoices, track payments, and grow your business.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: <TrendingUp className="text-blue-700" size={20} />,
                  text: "Track revenue in real-time",
                },
                {
                  icon: <Shield className="text-slate-700" size={20} />,
                  text: "Secure & compliant platform",
                },
                {
                  icon: <Sparkles className="text-blue-600" size={20} />,
                  text: "Professional invoices in seconds",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-md border border-gray-100"
                >
                  <div className="bg-gray-50 p-2 rounded-lg">{item.icon}</div>
                  <span className="text-gray-700 font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT – LOGIN FORM */}
          <div className="animate-scale-in">
            {/* Mobile Logo */}
            <Link href="/" className="lg:hidden flex items-center gap-3 mb-6">
              <div className="bg-blue-900 p-2.5 rounded-xl shadow-lg">
                <FileText className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold text-blue-900">Envoice</h1>
            </Link>

            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-6 sm:p-8 lg:p-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
                  Sign In
                </h2>
                <p className="text-gray-600">Access your account</p>
              </div>

              {errorMessage && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-fade-in">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-red-500 mt-0.5" size={20} />
                    <p className="text-red-700 text-sm">{errorMessage}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      {...register("email")}
                      className="w-full pl-12 pr-4 py-3 sm:py-3.5 border-2 border-gray-300 rounded-xl text-gray-900 bg-white focus:border-slate-800 focus:ring-4 focus:ring-slate-100 outline-none placeholder-gray-600"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...register("password")}
                      className="w-full pl-12 pr-12 py-3 sm:py-3.5 border-2 border-gray-300 rounded-xl text-gray-900 bg-white focus:border-slate-800 focus:ring-4 focus:ring-slate-100 outline-none placeholder-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between text-sm">

                  <Link href="/forgot-password" className="text-slate-800 font-semibold hover:text-slate-900">
                    Forgot password?
                  </Link>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-900 text-white py-3.5 sm:py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg font-bold flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Signing in..." : <>
                    <LogIn size={18} />
                    Sign In
                  </>}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Don’t have an account?{" "}
                  <Link href="/signup" className="text-slate-800 font-bold hover:text-slate-900 inline-flex items-center gap-1">
                    Sign up
                    <ArrowRight size={16} />
                  </Link>
                </p>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-gray-600">
              <Link href="/privacy" className="hover:text-slate-800">Privacy Policy</Link>
              <span className="mx-3">•</span>
              <Link href="/terms" className="hover:text-slate-800">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
