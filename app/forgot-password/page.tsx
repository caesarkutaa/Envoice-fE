'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Mail, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  SendHorizontal
} from 'lucide-react';

const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

type ForgotPasswordInput = {
  email: string;
};

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>();

  const onSubmit = async (data: ForgotPasswordInput) => {
    setStatus('idle');
    setErrorMessage('');

    try {
      const res = await fetch(`${base_url}/auth/request-reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Unable to process request');
      }

      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-900 p-2.5 rounded-xl">
              <FileText className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-blue-900 tracking-tight">Envoice</h1>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-8 sm:p-10">
            {status === 'success' ? (
              <div className="text-center animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="text-green-600" size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">Check your email</h2>
                <p className="text-slate-600 mb-8 text-sm leading-relaxed">
                  We've sent a password reset link to your email address. Please follow the instructions to reset your password.
                </p>
                <Link 
                  href="/login"
                  className="w-full inline-flex items-center justify-center py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
                >
                  Back to Login
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2 font-display">Forgot Password?</h2>
                  <p className="text-slate-500 text-sm">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>

                {status === 'error' && (
                  <div className="mb-6 bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="text-red-600 shrink-0" size={20} />
                    <p className="text-red-700 text-xs font-medium">{errorMessage}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 ml-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                          }
                        })}
                        placeholder="name@company.com"
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm font-medium"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-600 text-xs mt-2 ml-1 font-medium">{errors.email.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10 transition-all disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <SendHorizontal size={18} />
                        Send Reset Link
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <Link 
                    href="/login" 
                    className="flex items-center justify-center gap-2 text-slate-500 hover:text-blue-900 text-sm font-semibold transition-colors"
                  >
                    <ArrowLeft size={16} />
                    Back to Login
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}