"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Mail, 
  CheckCircle, 
  RefreshCw, 
  ArrowLeft, 
  Clock,
  AlertCircle,
  Sparkles,
  Shield,
  Inbox
} from "lucide-react";

// ✅ Separate component that uses useSearchParams
function EmailConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState(false);
  const [canResend, setCanResend] = useState(false);

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      router.push("/signup");
    }
  }, [email, router]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleResendEmail = async () => {
    setResending(true);
    setResendError(false);
    setResendSuccess(false);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/resend-confirmation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setResendSuccess(true);
        setTimeLeft(300);
        setCanResend(false);
        setTimeout(() => setResendSuccess(false), 5000);
      } else {
        setResendError(true);
        setTimeout(() => setResendError(false), 5000);
      }
    } catch (error) {
      console.error("Resend error:", error);
      setResendError(true);
      setTimeout(() => setResendError(false), 5000);
    } finally {
      setResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!email) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-[95%] sm:max-w-md md:max-w-lg lg:max-w-xl">
        
        {/* Back Button */}
        <button
          onClick={() => router.push("/login")}
          className="inline-flex items-center gap-1.5 sm:gap-2 text-blue-900 hover:text-blue-500 font-semibold mb-4 sm:mb-6 transition-all hover:gap-2 sm:hover:gap-3 text-sm sm:text-base group"
        >
          <ArrowLeft size={18} className="sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1" />
          <span>Back to Login</span>
        </button>

        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-scale-in">
          
          {/* Header with Gradient */}
          <div className="bg-blue-900 p-6 sm:p-8 md:p-10 text-center relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full -ml-12 -mb-12 blur-2xl"></div>
            
            {/* Icon */}
            <div className="relative mb-4 sm:mb-6">
              <div className="bg-white/20 backdrop-blur-sm w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce-in">
                <div className="bg-white/30 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center">
                  <Mail className="text-white w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                </div>
              </div>
              <div className="absolute -top-2 -right-2 sm:top-0 sm:right-0">
                <Sparkles className="text-yellow-300 w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">
              Check Your Email
            </h1>
            <p className="text-purple-100 text-sm sm:text-base md:text-lg">
              We've sent you a verification link
            </p>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 md:p-8 lg:p-10">
            
            {/* Email Display */}
            <div className="bg-gradient-to-r from-purple-50 to-fuchsia-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 mb-6 sm:mb-8 border-2 border-purple-100 animate-fade-in">
              <p className="text-xs sm:text-sm text-gray-600 mb-2 font-semibold uppercase tracking-wide">
                Confirmation sent to:
              </p>
              <div className="flex items-center gap-2 sm:gap-3">
                <Inbox className="text-purple-600 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <p className="text-base sm:text-lg md:text-xl font-bold text-blue-900 break-all">
                  {email}
                </p>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 mb-6 sm:mb-8 border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-3 sm:mb-4 text-base sm:text-lg flex items-center gap-2">
                <CheckCircle className="text-green-600 w-4 h-4 sm:w-5 sm:h-5" />
                What to do next:
              </h3>
              <ol className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="bg-blue-900 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 mt-0.5">1</span>
                  <span>Open your email inbox</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="bg-blue-900 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 mt-0.5">2</span>
                  <span>Click the verification link</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="bg-blue-900 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 mt-0.5">3</span>
                  <span>Your account will be activated</span>
                </li>
              </ol>

              <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-gray-200">
                <p className="text-xs sm:text-sm text-gray-600 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>Can't find the email? Check your spam or junk folder</span>
                </p>
              </div>
            </div>

            {/* Timer */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 border-2 border-amber-200 animate-fade-in">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="bg-white p-2 sm:p-2.5 rounded-lg shadow-sm flex-shrink-0">
                    <Clock className="text-amber-600 w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 font-semibold">Link expires in:</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-amber-600">
                      {formatTime(timeLeft)}
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {timeLeft < 60 && (
                    <span className="text-xs sm:text-sm text-red-600 font-semibold animate-pulse">
                      Hurry!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Success Message */}
            {resendSuccess && (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 flex items-start gap-3 animate-slide-in">
                <CheckCircle className="text-green-600 w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-green-800 mb-1 text-sm sm:text-base">Email sent successfully!</p>
                  <p className="text-xs sm:text-sm text-green-700">Check your inbox for the new verification link.</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {resendError && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 flex items-start gap-3 animate-slide-in">
                <AlertCircle className="text-red-600 w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-red-800 mb-1 text-sm sm:text-base">Failed to resend email</p>
                  <p className="text-xs sm:text-sm text-red-700">Please try again or contact support.</p>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="space-y-3 sm:space-y-4">
              <button
                onClick={handleResendEmail}
                disabled={resending || !canResend}
                className="w-full bg-blue-900 text-white py-3 sm:py-3.5 md:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg font-bold hover:bg-blue-800 transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center gap-2 sm:gap-3"
              >
                {resending ? (
                  <>
                    <RefreshCw className="animate-spin w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Sending...</span>
                  </>
                ) : !canResend ? (
                  <>
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Resend in {formatTime(timeLeft)}</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Resend Email</span>
                  </>
                )}
              </button>

              <button
                onClick={() => router.push("/login")}
                className="w-full bg-white text-gray-800 py-3 sm:py-3.5 md:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg font-bold hover:bg-gray-50 transform transition-all duration-200 hover:scale-105 border-2 border-gray-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 sm:gap-3"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Back to Login</span>
              </button>
            </div>

            {/* Help Section */}
            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <Shield className="text-purple-600 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <p className="text-xs sm:text-sm text-gray-600 text-center">
                  Need help?{" "}
                  <a 
                    href="mailto:support@yourapp.com" 
                    className="text-purple-600 hover:text-purple-700 font-semibold hover:underline"
                  >
                    Contact Support
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center border border-purple-100 shadow-sm">
            <Shield className="text-purple-600 w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" />
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Secure</p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">End-to-end encryption</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center border border-purple-100 shadow-sm">
            <Clock className="text-purple-600 w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" />
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Fast</p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Instant delivery</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center border border-purple-100 shadow-sm">
            <CheckCircle className="text-purple-600 w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" />
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Reliable</p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">99.9% uptime</p>
          </div>
        </div>
      </div>

      <style jsx>{`
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

        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

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

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.4s ease-out;
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

// ✅ Main component with Suspense wrapper
export default function EmailConfirmation() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-700 font-medium">Loading...</p>
          </div>
        </div>
      }
    >
      <EmailConfirmationContent />
    </Suspense>
  );
}