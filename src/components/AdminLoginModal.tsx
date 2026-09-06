import { useState, useEffect, useRef } from "react";
import {
  Mail,
  X,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { sendEmailOTP, verifyEmailOTP } from "@/lib/seed-admin";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const [email, setEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  // 6-digit OTP state
  const [step, setStep] = useState<"email" | "otp">("email");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // OTP cooldown timer
  useEffect(() => {
    if (otpCountdown <= 0) return;
    const timer = setInterval(() => {
      setOtpCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [otpCountdown]);

  // Focus first OTP input when reaching OTP step
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  if (!isOpen) return null;

  const REGISTERED_ADMIN_EMAIL = "choudharyvikas2008@gmail.com";

  // STEP 1: Request 6-Digit Email OTP via Supabase Auth
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setResult({ success: false, message: "Please enter your email address." });
      return;
    }

    if (cleanEmail !== REGISTERED_ADMIN_EMAIL) {
      setResult({
        success: false,
        message: "Only the registered admin email can access this portal.",
      });
      return;
    }

    setLoading(true);
    const res = await sendEmailOTP(cleanEmail);
    setLoading(false);

    if (res.success) {
      setStep("otp");
      setOtpDigits(["", "", "", "", "", ""]);
      setOtpCountdown(60);
      toast.info("🔐 Verification code sent!", {
        description: `OTP sent to ${cleanEmail}. Please check your email inbox and spam folder.`,
        duration: 8000,
      });
    } else {
      setResult({
        success: false,
        message: res.message || "Failed to send verification code.",
      });
    }
  };

  // Resend OTP handler with cooldown
  const handleResendOtp = async () => {
    if (otpCountdown > 0) return;
    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail !== REGISTERED_ADMIN_EMAIL) {
      setResult({
        success: false,
        message: "Only the registered admin email can access this portal.",
      });
      return;
    }

    setOtpLoading(true);
    const res = await sendEmailOTP(cleanEmail);
    setOtpLoading(false);

    if (res.success) {
      setOtpCountdown(60);
      toast.info("🔐 Code Resent!", {
        description: `A new 6-digit OTP code has been sent to ${cleanEmail}.`,
      });
    } else {
      setResult({
        success: false,
        message: res.message || "Failed to resend verification code.",
      });
    }
  };

  const handleOtpInput = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, "").slice(-1);
    const updated = [...otpDigits];
    updated[index] = cleanVal;
    setOtpDigits(updated);

    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasteData.length === 6) {
      const updated = pasteData.split("");
      setOtpDigits(updated);
      inputRefs.current[5]?.focus();
    }
  };

  // STEP 2: Verify 6-digit token with Supabase Auth verifyOtp
  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = otpDigits.join("");

    if (token.length < 6) {
      setResult({ success: false, message: "Please enter the full 6-digit verification code." });
      return;
    }

    setOtpLoading(true);
    setResult(null);

    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail !== REGISTERED_ADMIN_EMAIL) {
      setOtpLoading(false);
      setResult({
        success: false,
        message: "Only the registered admin email can access this portal.",
      });
      return;
    }

    const res = await verifyEmailOTP(cleanEmail, token);
    setOtpLoading(false);

    if (res.success && res.user) {
      const sessionData = {
        id: res.user.id,
        email: cleanEmail,
        role: "Super Admin",
        name: "Vikas Choudhary",
        loginTime: new Date().toISOString(),
      };

      if (rememberMe) {
        localStorage.setItem("yc_employee_session", JSON.stringify(sessionData));
        sessionStorage.removeItem("yc_employee_session");
      } else {
        sessionStorage.setItem("yc_employee_session", JSON.stringify(sessionData));
        localStorage.removeItem("yc_employee_session");
      }

      toast.success("✅ Verification Successful!", {
        description: "Redirecting to Admin Dashboard...",
      });

      onClose();

      setTimeout(() => {
        window.location.href = "/admin-dashboard";
      }, 300);
    } else {
      setResult({
        success: false,
        message: "Invalid or expired verification code.",
      });
    }
  };

  const resetModalState = () => {
    setStep("email");
    setOtpDigits(["", "", "", "", "", ""]);
    setResult(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 transition-all animate-in fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="employee-login-title"
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-card border border-gold/30 p-7 shadow-2xl transition-all max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold/40 hover:text-foreground"
          aria-label="Close admin login modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold border border-gold/30 shadow-md">
            <ShieldCheck className="h-7 w-7 text-gold" />
          </div>
          <h3
            id="employee-login-title"
            className="text-xl font-bold mt-4 text-foreground tracking-tight"
          >
            Yours-Clinic Admin Login
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Supabase Email OTP Authentication
          </p>
        </div>

        {/* STEP 1: Email Form */}
        {step === "email" && (
          <form onSubmit={handleEmailSubmit} className="mt-5 flex flex-col gap-4">
            <div>
              <label className="block text-[0.7rem] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Registered Admin Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="choudharyvikas2008@gmail.com"
                  className="w-full rounded-xl border border-border bg-background/60 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-border bg-background text-gold focus:ring-gold accent-amber-500 cursor-pointer"
                />
                <span className="font-medium text-[0.75rem]">Keep me signed in</span>
              </label>
            </div>

            {result && (
              <div
                className={`rounded-xl p-3 text-center text-xs font-medium border ${
                  result.success
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    : "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                }`}
              >
                {result.message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="press focus-gold mt-2 w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md transition-all hover:opacity-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending Verification Code...
                </span>
              ) : (
                <>
                  <span>Send 6-Digit OTP Code</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: 6-Digit OTP Verification Form */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtpSubmit} className="mt-5 flex flex-col gap-4">
            <div className="rounded-2xl bg-gold/10 border border-gold/30 p-4 text-center">
              <Sparkles className="mx-auto h-6 w-6 text-gold mb-1" />
              <h4 className="text-sm font-bold text-foreground">
                6-Digit Verification Code Sent
              </h4>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed bg-background/60 rounded-xl p-3 border border-border/50">
                🔐 A 6-digit verification code has been sent to{" "}
                <span className="font-bold text-gold">{email.trim().toLowerCase()}</span>.
                Please check your email inbox and spam folder.
              </p>
            </div>

            <div>
              <label className="block text-[0.7rem] font-bold uppercase tracking-wider text-muted-foreground mb-2 text-center">
                Enter 6-Digit Verification Code
              </label>
              <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpInput(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-11 h-13 text-center text-xl font-bold rounded-xl border border-border bg-background/80 text-foreground focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/50 shadow-inner"
                  />
                ))}
              </div>
            </div>

            {result && (
              <div
                className={`rounded-xl p-3 text-center text-xs font-medium border ${
                  result.success
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    : "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                }`}
              >
                {result.message}
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <button
                type="button"
                onClick={resetModalState}
                className="text-xs hover:text-foreground transition-colors underline"
              >
                Change Email
              </button>
              <button
                type="button"
                disabled={otpCountdown > 0 || otpLoading}
                onClick={handleResendOtp}
                className="text-xs text-gold font-semibold hover:underline disabled:opacity-50 flex items-center gap-1"
              >
                <RefreshCw className={`h-3 w-3 ${otpLoading ? "animate-spin" : ""}`} />
                <span>
                  {otpCountdown > 0 ? `Resend Code in ${otpCountdown}s` : "Resend Code"}
                </span>
              </button>
            </div>

            <button
              type="submit"
              disabled={otpLoading || otpDigits.join("").length < 6}
              className="press focus-gold w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:opacity-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {otpLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying Code...
                </span>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Verify Code & Access Dashboard</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
