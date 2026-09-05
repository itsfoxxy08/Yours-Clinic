import { useState } from "react";
import { Lock, User, Eye, EyeOff, X, ShieldCheck } from "lucide-react";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    // Placeholder until Supabase table integration is connected
    setTimeout(() => {
      setLoading(false);
      setStatusMessage("Supabase backend connection pending. Credentials will be authenticated via Supabase table.");
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 transition-all animate-in fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-login-title"
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-card border border-gold/30 p-8 shadow-2xl transition-all"
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
          <p className="mt-2 text-xs text-muted-foreground">
            Secure administrative login for Yours Clinic management
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Admin Login ID / Email
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin ID"
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
                placeholder="Enter password"
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

          {statusMessage && (
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-center text-xs text-amber-600 dark:text-amber-400 font-medium">
              {statusMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="press focus-gold mt-2 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:opacity-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <Lock className="h-4 w-4 text-gold-soft" />
                <span>Login to Admin Panel</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="mt-6 border-t border-border/50 pt-4 text-center">
          <p className="text-[0.7rem] text-muted-foreground">
            🔒 Protected area • Authenticated via Supabase database
          </p>
        </div>
      </div>
    </div>
  );
}
