import { useState } from "react";
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
} from "lucide-react";
import {
  authenticateAdmin,
  isSupabaseConfigured,
  type AdminLoginMethod,
  type AdminAuthResult,
} from "@/lib/supabase";

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
  const [loggedInUser, setLoggedInUser] = useState<AdminAuthResult["user"] | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
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

  const handleLogout = () => {
    setLoggedInUser(null);
    setResult(null);
    setIdentifier("");
    setPassword("");
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
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-card border border-gold/30 p-7 shadow-2xl transition-all"
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

        {/* Header Icon & Title */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold border border-gold/30">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h3 id="admin-login-title" className="display-md mt-4 text-foreground">
            Admin Portal Access
          </h3>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Supabase Database & Authentication System
          </p>
        </div>

        {/* Logged-In State View */}
        {loggedInUser ? (
          <div className="mt-6 text-center space-y-4">
            <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-5">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
              <h4 className="text-base font-semibold text-foreground">
                Authenticated as Admin
              </h4>
              <p className="mt-1 text-xs text-muted-foreground">
                {loggedInUser.email || loggedInUser.phone || loggedInUser.username}
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
              Sign Out of Admin Session
            </button>
          </div>
        ) : (
          <>
            {/* Login Method Tabs */}
            <div className="mt-6 flex rounded-xl border border-border/60 bg-background/50 p-1">
              <button
                type="button"
                onClick={() => {
                  setMethod("email");
                  setResult(null);
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-all ${
                  method === "email"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Mail className="h-3.5 w-3.5" />
                <span>Email</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMethod("phone");
                  setResult(null);
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-all ${
                  method === "phone"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Phone</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMethod("username");
                  setResult(null);
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-all ${
                  method === "username"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <User className="h-3.5 w-3.5" />
                <span>Username</span>
              </button>
            </div>

            {/* Config Status Banner if env vars missing */}
            {!configured && (
              <div className="mt-4 rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-600 dark:text-amber-400 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  Supabase DB configured for email, phone & username auth. Set{" "}
                  <code className="font-mono text-[0.7rem] bg-amber-500/20 px-1 rounded">
                    VITE_SUPABASE_URL
                  </code>{" "}
                  to connect live database.
                </span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
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
                    type={method === "email" ? "email" : method === "phone" ? "tel" : "text"}
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
                    className="w-full rounded-xl border border-border bg-background/60 pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full rounded-xl border border-border bg-background/60 pl-10 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Response Message Alert */}
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
                  <span>Authenticating with Supabase...</span>
                ) : (
                  <>
                    <Database className="h-4 w-4 text-gold-soft" />
                    <span>Login via {method.toUpperCase()}</span>
                  </>
                )}
              </button>
            </form>
          </>
        )}

        {/* Footer Note */}
        <div className="mt-6 border-t border-border/50 pt-4 text-center">
          <p className="text-[0.7rem] text-muted-foreground flex items-center justify-center gap-1.5">
            <Lock className="h-3 w-3 text-gold" />
            <span>Supabase Database Auth • Email, Phone & Username Supported</span>
          </p>
        </div>
      </div>
    </div>
  );
}
