import { useState, useEffect } from "react";
import {
  Lock,
  User,
  Mail,
  Phone,
  Eye,
  EyeOff,
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Database,
  KeyRound,
  Send,
  Loader2,
} from "lucide-react";
import {
  authenticateAdmin,
  isSupabaseConfigured,
  type AdminLoginMethod,
  type AdminAuthResult,
} from "@/lib/supabase";
import { sendPhoneOTP, verifyPhoneOTP, seedAdmin } from "@/lib/seed-admin";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const [method, setMethod] = useState<AdminLoginMethod>("email");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AdminAuthResult | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<
    AdminAuthResult["user"] | null
  >(null);

  // OTP state
  const [otpMode, setOtpMode] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);

  // Seed admin on first load (runs once)
  const [seeded, setSeeded] = useState(false);
  useEffect(() => {
    if (isOpen && !seeded && isSupabaseConfigured()) {
      seedAdmin().then(() => setSeeded(true));
    }
  }, [isOpen, seeded]);

  // OTP countdown timer
  useEffect(() => {
    if (otpCountdown <= 0) return;
    const timer = setInterval(() => {
      setOtpCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [otpCountdown]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    const authRes = await authenticateAdmin(method, identifier, password);
    setLoading(false);
    setResult(authRes);
    if (authRes.success && authRes.user) {
      setLoggedInUser(authRes.user);
    }
  };

  const handleSendOTP = async () => {
    if (!identifier.trim()) {
      setResult({
        success: false,
        message: "Please enter your phone number first.",
      });
      return;
    }
    setOtpLoading(true);
    setResult(null);
    const res = await sendPhoneOTP(identifier);
    setOtpLoading(false);

    if (res.success) {
      setOtpSent(true);
      setOtpCountdown(60);
      setResult({ success: true, message: "OTP sent to your phone!" });
    } else {
      setResult({ success: false, message: res.message });
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setResult({ success: false, message: "Please enter the OTP." });
      return;
    }
    setLoading(true);
    setResult(null);
    const res = await verifyPhoneOTP(identifier, otpCode);
    setLoading(false);

    if (res.success && res.user) {
      setResult({ success: true, message: res.message });
      setLoggedInUser(res.user);
    } else {
      setResult({ success: false, message: res.message });
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setResult(null);
    setIdentifier("");
    setPassword("");
    setOtpMode(false);
    setOtpSent(false);
    setOtpCode("");
    setOtpCountdown(0);
  };

  const handleMethodChange = (newMethod: AdminLoginMethod) => {
    setMethod(newMethod);
    setResult(null);
    setOtpMode(false);
    setOtpSent(false);
    setOtpCode("");
    setOtpCountdown(0);
  };

  const configured = isSupabaseConfigured();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 transition-all animate-in fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-login-title"
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
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold border border-gold/30">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h3
            id="admin-login-title"
            className="display-md mt-4 text-foreground"
          >
            Admin Portal Access
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Secure admin login
          </p>
        </div>

        {/* Authenticated view */}
        {loggedInUser ? (
          <div className="mt-6 text-center space-y-4">
            <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-5">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
              <h4 className="text-base font-semibold text-foreground">
                Authenticated Admin Session
              </h4>
              <p className="mt-1 text-xs text-muted-foreground">
                {loggedInUser.username ||
                  loggedInUser.email ||
                  loggedInUser.phone}
              </p>
              {loggedInUser.role && (
                <span className="mt-3 inline-block rounded-full bg-gold/20 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-gold">
                  Role: {loggedInUser.role}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-xl border border-border bg-background/60 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-gold/40 transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <>
            {/* Login method tabs */}
            <div className="mt-4 flex rounded-xl border border-border/60 bg-background/50 p-1">
              <button
                type="button"
                onClick={() => handleMethodChange("email")}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium transition-all ${
                  method === "email"
                    ? "bg-secondary text-secondary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Mail className="h-3 w-3" />
                <span>Email</span>
              </button>
              <button
                type="button"
                onClick={() => handleMethodChange("phone")}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium transition-all ${
                  method === "phone"
                    ? "bg-secondary text-secondary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Phone className="h-3 w-3" />
                <span>Phone</span>
              </button>
              <button
                type="button"
                onClick={() => handleMethodChange("username")}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium transition-all ${
                  method === "username"
                    ? "bg-secondary text-secondary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <User className="h-3 w-3" />
                <span>Username</span>
              </button>
            </div>

            {/* Config warning */}
            {!configured && (
              <div className="mt-4 rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-600 dark:text-amber-400 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  Supabase variables missing. Set{" "}
                  <code className="font-mono text-[0.7rem] bg-amber-500/20 px-1 rounded">
                    VITE_SUPABASE_URL
                  </code>{" "}
                  &amp;{" "}
                  <code className="font-mono text-[0.7rem] bg-amber-500/20 px-1 rounded">
                    VITE_SUPABASE_ANON_KEY
                  </code>{" "}
                  in .env.
                </span>
              </div>
            )}

            {/* Phone: OTP toggle */}
            {method === "phone" && (
              <div className="mt-4 flex rounded-lg border border-border/60 bg-background/50 p-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setOtpMode(false);
                    setResult(null);
                  }}
                  className={`flex-1 py-1.5 text-[0.65rem] font-medium rounded-md transition-all ${
                    !otpMode
                      ? "bg-gold/15 text-gold font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Password Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOtpMode(true);
                    setResult(null);
                  }}
                  className={`flex-1 py-1.5 text-[0.65rem] font-medium rounded-md transition-all flex items-center justify-center gap-1 ${
                    otpMode
                      ? "bg-gold/15 text-gold font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <KeyRound className="h-3 w-3" />
                  OTP Login
                </button>
              </div>
            )}

            {/* OTP Flow for Phone */}
            {method === "phone" && otpMode ? (
              <form onSubmit={handleVerifyOTP} className="mt-4 flex flex-col gap-3.5">
                {/* Phone number input */}
                <div>
                  <label className="block text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Phone Number
                  </label>
                  <div className="relative flex items-center gap-2">
                    <div className="relative flex-1">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="tel"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="+91 97119 19263"
                        disabled={otpSent}
                        className="w-full rounded-xl border border-border bg-background/60 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold disabled:opacity-60"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      disabled={otpLoading || otpCountdown > 0 || !identifier.trim()}
                      className="shrink-0 flex items-center gap-1.5 rounded-xl border border-gold/40 bg-gold/10 px-3 py-2.5 text-xs font-semibold text-gold hover:bg-gold/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {otpLoading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Send className="h-3.5 w-3.5" />
                      )}
                      {otpCountdown > 0
                        ? `${otpCountdown}s`
                        : otpSent
                        ? "Resend"
                        : "Send OTP"}
                    </button>
                  </div>
                </div>

                {/* OTP input */}
                {otpSent && (
                  <div>
                    <label className="block text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Enter 6-digit OTP
                    </label>
                    <div className="flex gap-2 justify-center">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <input
                          key={i}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={otpCode[i] || ""}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            const newOtp = otpCode.split("");
                            newOtp[i] = val;
                            setOtpCode(newOtp.join(""));
                            // Auto-focus next input
                            if (val && e.target.nextElementSibling) {
                              (
                                e.target.nextElementSibling as HTMLInputElement
                              ).focus();
                            }
                          }}
                          onKeyDown={(e) => {
                            if (
                              e.key === "Backspace" &&
                              !otpCode[i] &&
                              e.currentTarget.previousElementSibling
                            ) {
                              (
                                e.currentTarget
                                  .previousElementSibling as HTMLInputElement
                              ).focus();
                            }
                          }}
                          className="w-10 h-12 text-center text-lg font-bold rounded-xl border border-border bg-background/60 text-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-center text-[0.65rem] text-muted-foreground">
                      Check your phone for the verification code
                    </p>
                  </div>
                )}

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

                {otpSent && (
                  <button
                    type="submit"
                    disabled={loading || otpCode.length < 6}
                    className="press focus-gold mt-1 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:opacity-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Verifying...
                      </span>
                    ) : (
                      <>
                        <KeyRound className="h-4 w-4 text-gold-soft" />
                        <span>Verify & Login</span>
                      </>
                    )}
                  </button>
                )}
              </form>
            ) : (
              /* Standard Password Login Form */
              <form
                onSubmit={handleLogin}
                className="mt-4 flex flex-col gap-3.5"
              >
                <div>
                  <label className="block text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    {method === "email"
                      ? "Admin Email"
                      : method === "phone"
                      ? "Admin Phone Number"
                      : "Admin Username"}
                  </label>
                  <div className="relative flex items-center">
                    {method === "email" ? (
                      <Mail className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
                    ) : method === "phone" ? (
                      <Phone className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
                    ) : (
                      <User className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
                    )}
                    <input
                      type={
                        method === "email"
                          ? "email"
                          : method === "phone"
                          ? "tel"
                          : "text"
                      }
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={
                        method === "email"
                          ? "admin@yoursclinic.com"
                          : method === "phone"
                          ? "+91 98765 43210"
                          : "admin_username"
                      }
                      className="w-full rounded-xl border border-border bg-background/60 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full rounded-xl border border-border bg-background/60 pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
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

                <button
                  type="submit"
                  disabled={loading}
                  className="press focus-gold mt-1 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:opacity-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Authenticating...
                    </span>
                  ) : (
                    <>
                      <Database className="h-4 w-4 text-gold-soft" />
                      <span>Login</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </>
        )}

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className="text-[0.7rem] text-muted-foreground flex items-center justify-center gap-1.5">
            <Lock className="h-3 w-3 text-gold" />
            <span>Admin Authentication</span>
          </p>
        </div>
      </div>
    </div>
  );
}
