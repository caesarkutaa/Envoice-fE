"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  UserPlus,
  FileText,
  AlertCircle,
  Sparkles,
  Shield,
  Check,
} from "lucide-react";

const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password is too short - must be at least 8 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: SignupFormData) => {
    setErrorMessage("");
    try {
      const res = await fetch(`${base_url}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setErrorMessage(errorData.message || "Registration failed");
        return;
      }

      router.push(`/email-confirmation?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 text-gray-900">
      <div className="w-full max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* FORM */}
          <div>
            <Link href="/" className="lg:hidden flex items-center gap-3 mb-6">
              <div className="bg-blue-900 p-2.5 rounded-xl">
                <FileText className="text-white" size={32} />
              </div>
              <h1 className="text-3xl font-bold text-blue-900">Envoice</h1>
            </Link>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  Create Account
                </h2>
                <p className="text-gray-600">Start your free trial today</p>
              </div>

              {errorMessage && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                  <div className="flex gap-3">
                    <AlertCircle className="text-red-600" size={20} />
                    <div>
                      <p className="text-red-800 font-semibold">Error</p>
                      <p className="text-red-700 text-sm">{errorMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Username */}
                <div>
                  <input
                    {...register("username")}
                    placeholder="Username"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-900 focus:ring-4 focus:ring-blue-100 outline-none text-gray-900 bg-white"
                  />
                  {errors.username && <p className="text-red-600 text-xs mt-1 ml-1">{errors.username.message}</p>}
                </div>

                {/* Email */}
                <div>
                  <input
                    {...register("email")}
                    placeholder="Email"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-900 focus:ring-4 focus:ring-blue-100 outline-none text-gray-900 bg-white"
                  />
                  {errors.email && <p className="text-red-600 text-xs mt-1 ml-1">{errors.email.message}</p>}
                </div>

                {/* Password */}
                <div className="relative">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="Password (min. 8 characters)"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-900 focus:ring-4 focus:ring-blue-100 outline-none text-gray-900 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-600 text-xs mt-1 ml-1">{errors.password.message}</p>}
                </div>

                {/* Submit */}
                <button
                  disabled={isSubmitting}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:bg-gray-400"
                >
                  <UserPlus size={18} />
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              <p className="mt-8 text-center text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-900 font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="hidden lg:block space-y-8">
            <div className="flex items-center gap-3">
              <div className="bg-blue-900 p-3 rounded-xl">
                <FileText className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-blue-900">Envoice</h1>
                <p className="text-gray-600">Invoicing Made Simple</p>
              </div>
            </div>

            <h2 className="text-4xl font-bold text-gray-900 leading-tight">
              Start Managing Your Invoices Today
            </h2>

            <div className="space-y-4">
              <div className="flex gap-4 bg-white p-5 rounded-xl border border-gray-200">
                <Sparkles className="text-blue-900" />
                <div>
                  <h3 className="font-bold text-gray-800">Free Trial</h3>
                  <p className="text-gray-600 text-sm">
                    No credit card required
                  </p>
                </div>
              </div>

              <div className="flex gap-4 bg-white p-5 rounded-xl border border-gray-200">
                <Shield className="text-blue-900" />
                <div>
                  <h3 className="font-bold text-gray-800">Secure & Reliable</h3>
                  <p className="text-gray-600 text-sm">Bank-grade security</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-900 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="text-xl font-bold mb-4">What's Included</h3>
              <div className="space-y-3">
                {["Unlimited invoices", "PDF exports", "Payment tracking"].map(
                  (item) => (
                    <div key={item} className="flex gap-3 items-center">
                      <Check size={16} className="text-blue-200" />
                      {item}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}