"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Mail, CheckCircle, RefreshCw, AlertCircle, 
  Loader2, ShieldCheck, ArrowRight, ExternalLink
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function EmailConfirmationContent() {
  const { setAuth } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  // We only strictly need the token for your backend
  const token = searchParams.get("token"); 
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  
  const [timeLeft, setTimeLeft] = useState(60);
  const [resending, setResending] = useState(false);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for resend button
  useEffect(() => {
    if (timeLeft > 0 && !canResend) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft, canResend]);

  // ✅ Auto-verify based on token
  useEffect(() => {
    if (token) {
      handleVerifyEmail(token);
    } else {
      setVerifyError("No verification token found in the URL.");
    }
  }, [token]);

 const handleVerifyEmail = async (verificationToken: string) => {
  setIsVerifying(true);
  setVerifyError("");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/confirm-email?token=${verificationToken}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (response.ok) {
      // ✅ 3. USE YOUR CONTEXT HERE
      // This saves to cookies and updates your global app state automatically
      setAuth(data.accessToken, data.refreshToken, data.user || null);
      
      setVerifySuccess(true);
      
      setTimeout(() => {
        router.push("/dashboard"); 
      }, 3000);
    } else {
      setVerifyError(data.message || "Verification failed.");
    }
  } catch (error) {
    setVerifyError("Server connection failed.");
  } finally {
    setIsVerifying(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden relative">
          
          {/* Blue Accent Header */}
          <div className={`p-10 text-center transition-colors duration-700 ${verifySuccess ? 'bg-blue-600' : 'bg-slate-900'}`}>
            <div className="relative mb-6 flex justify-center">
               <div className="w-20 h-20 bg-white/10 rounded-2xl backdrop-blur-md flex items-center justify-center border border-white/20">
                {isVerifying ? (
                  <Loader2 className="text-white w-10 h-10 animate-spin" />
                ) : verifySuccess ? (
                  <ShieldCheck className="text-white w-10 h-10 animate-pulse" />
                ) : (
                  <Mail className="text-white w-10 h-10" />
                )}
              </div>
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">
              {isVerifying ? "Verifying..." : verifySuccess ? "Verified!" : "Verification"}
            </h1>
            <p className="text-blue-100 text-sm">
              {verifySuccess ? "Access granted. Entering dashboard..." : "Processing your secure access link"}
            </p>
          </div>

          <div className="p-8">
            {/* Success View */}
            {verifySuccess && (
              <div className="text-center space-y-4 animate-in fade-in zoom-in duration-500">
                <div className="bg-blue-50 text-blue-700 p-4 rounded-2xl text-sm font-medium border border-blue-100">
                  Your email is confirmed and your session is active.
                </div>
                <button 
                  onClick={() => router.push("/dashboard")}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                >
                  Continue to Dashboard <ArrowRight size={18} />
                </button>
              </div>
            )}

            {/* Error View */}
            {verifyError && !verifySuccess && (
              <div className="animate-in slide-in-from-top-4 duration-500">
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3 mb-6">
                  <AlertCircle className="text-red-600 w-5 h-5 mt-0.5" />
                  <div>
                    <p className="font-bold text-red-900 text-sm">Action Required</p>
                    <p className="text-xs text-red-700">{verifyError}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    disabled={!canResend || resending}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {resending ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
                    {canResend ? "Request New Link" : `Retry in ${timeLeft}s`}
                  </button>
                  <button 
                    onClick={() => router.push("/login")}
                    className="w-full py-4 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all"
                  >
                    Return to Login
                  </button>
                </div>
              </div>
            )}

            {/* Loading / Idle View */}
            {!verifySuccess && !verifyError && (
              <div className="text-center py-10">
                <Loader2 className="mx-auto text-blue-600 animate-spin mb-4" size={32} />
                <p className="text-slate-500 text-sm italic">Communicating with security server...</p>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-center mt-8 text-slate-400 text-xs flex items-center justify-center gap-1">
          Secure Verification powered by Envoice <ShieldCheck size={12} />
        </p>
      </div>
    </div>
  );
}

export default function EmailConfirmation() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen bg-slate-50"><Loader2 className="animate-spin text-blue-600" /></div>}>
      <EmailConfirmationContent />
    </Suspense>
  );
}