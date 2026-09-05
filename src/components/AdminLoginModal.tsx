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
  UserPlus,
  Code2,
  Copy,
  Check,
} from "lucide-react";
import {
  authenticateAdmin,
  registerAdminInSupabase,
  isSupabaseConfigured,
  type AdminLoginMethod,
  type AdminAuthResult,
} from "@/lib/supabase";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [method, setMethod] = useState<AdminLoginMethod>("email");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AdminAuthResult | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<AdminAuthResult["user"] | null>(null);
  const [showSql, setShowSql] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const regRes = await registerAdminInSupabase({
      username: regUsername,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
    });

    setLoading(false);
    setResult(regRes);

    if (regRes.success) {
      setIdentifier(regUsername);
      setPassword(regPassword);
      setMethod("username");
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setResult(null);
    setIdentifier("");
    setPassword("");
  };

  const configured = isSupabaseConfigured();

  const sqlQuery = `-- Copy and run this in your Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and insert default admin
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public admin lookup" ON public.admin_users FOR ALL USING (true);`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlQuery);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

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

        {/* Header Icon & Title */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold border border-gold/30">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h3 id="admin-login-title" className="display-md mt-4 text-foreground">
            Admin Portal Access
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Supabase Database Admin Credentials System
          </p>
        </div>

        {/* Action Toggle: Login vs Register/Store */}
        {!loggedInUser && (
          <div className="mt-5 flex rounded-xl border border-gold/20 bg-gold/5 p-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setResult(null);
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
                activeTab === "login"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Admin Login</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("register");
                setResult(null);
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
                activeTab === "register"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Save Admin to DB</span>
            </button>
          </div>
        )}

        {/* Logged-In State View */}
        {loggedInUser ? (
          <div className="mt-6 text-center space-y-4">
            <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-5">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
              <h4 className="text-base font-semibold text-foreground">
                Authenticated Admin Session
              </h4>
              <p className="mt-1 text-xs text-muted-foreground">
                {loggedInUser.username || loggedInUser.email || loggedInUser.phone}
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
        ) : activeTab === "login" ? (
          <>
            {/* Login Method Tabs */}
            <div className="mt-4 flex rounded-xl border border-border/60 bg-background/50 p-1">
              <button
                type="button"
                onClick={() => {
                  setMethod("email");
                  setResult(null);
                }}
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
                onClick={() => {
                  setMethod("phone");
                  setResult(null);
                }}
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
                onClick={() => {
                  setMethod("username");
                  setResult(null);
                }}
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

            {/* Config Warning */}
            {!configured && (
              <div className="mt-4 rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-600 dark:text-amber-400 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  Supabase variables missing in environment. Set{" "}
                  <code className="font-mono text-[0.7rem] bg-amber-500/20 px-1 rounded">
                    VITE_SUPABASE_URL
                  </code>{" "}
                  &{" "}
                  <code className="font-mono text-[0.7rem] bg-amber-500/20 px-1 rounded">
                    VITE_SUPABASE_ANON_KEY
                  </code>{" "}
                  in your .env file.
                </span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="mt-4 flex flex-col gap-3.5">
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
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <Database className="h-4 w-4 text-gold-soft" />
                    <span>Login via Supabase</span>
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          /* Register / Save Credentials in Supabase DB Form */
          <form onSubmit={handleRegister} className="mt-4 flex flex-col gap-3">
            <div>
              <label className="block text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Admin Username *
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="e.g. clinic_admin"
                  className="w-full rounded-xl border border-border bg-background/60 pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Admin Email (Optional)
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="admin@yoursclinic.com"
                  className="w-full rounded-xl border border-border bg-background/60 pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Admin Phone (Optional)
              </label>
              <div className="relative flex items-center">
                <Phone className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-border bg-background/60 pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Admin Password *
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Set admin password"
                  className="w-full rounded-xl border border-border bg-background/60 pl-10 pr-10 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
              className="press focus-gold mt-1 w-full rounded-xl bg-gold py-2.5 text-sm font-semibold text-black shadow-md transition-all hover:opacity-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Saving to Supabase...</span>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Store Password in Supabase DB</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Supabase SQL Table Helper Accordion */}
        <div className="mt-4 border-t border-border/50 pt-3">
          <button
            type="button"
            onClick={() => setShowSql(!showSql)}
            className="w-full flex items-center justify-between text-xs text-muted-foreground hover:text-foreground"
          >
            <span className="flex items-center gap-1.5 font-medium">
              <Code2 className="h-3.5 w-3.5 text-gold" />
              Supabase SQL Table Schema Script
            </span>
            <span className="text-[0.65rem] underline">{showSql ? "Hide" : "Show SQL"}</span>
          </button>

          {showSql && (
            <div className="mt-2.5 rounded-xl border border-border/60 bg-black/60 p-3 text-[0.7rem] font-mono text-emerald-400 relative">
              <button
                type="button"
                onClick={copySql}
                className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded bg-white/10 px-2 py-1 text-[0.65rem] text-white hover:bg-white/20"
              >
                {copiedSql ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" /> Copy SQL
                  </>
                )}
              </button>
              <pre className="whitespace-pre-wrap overflow-x-auto pr-16 text-muted-foreground">
                {sqlQuery}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-4 text-center">
          <p className="text-[0.7rem] text-muted-foreground flex items-center justify-center gap-1.5">
            <Lock className="h-3 w-3 text-gold" />
            <span>Supabase Database Auth • Email, Phone & Username Stored</span>
          </p>
        </div>
      </div>
    </div>
  );
}
