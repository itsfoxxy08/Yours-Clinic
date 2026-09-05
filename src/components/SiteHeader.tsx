import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Moon, Sun, X, ShieldCheck, Lock } from "lucide-react";
import logoAsset from "@/assets/yours-logo-trim.png";
import { SocialLinks } from "@/components/SocialLinks";
import { AdminLoginModal } from "@/components/AdminLoginModal";

const links: { label: string; to: "/" | "/diseases"; hash?: string }[] = [
  { label: "Home", to: "/" },
  { label: "Diseases", to: "/diseases" },
  { label: "Treatment Now", to: "/", hash: "treatment" },
  { label: "Our Clinicians", to: "/", hash: "clinicians" },
  { label: "Awards", to: "/", hash: "awards" },
  { label: "Book Appointment", to: "/", hash: "book" },
  { label: "About Us", to: "/", hash: "about" },
];


export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("yc-theme");
    const isDark = stored === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("yc-theme", next ? "dark" : "light");
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-400 ${
          scrolled
            ? "border-b border-border bg-background/85 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <div className="hidden border-b border-border/60 bg-card/70 backdrop-blur-sm md:block">
          <div className="mx-auto flex h-9 max-w-6xl items-center justify-between px-5">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Follow Dr. Sumit Jha
            </p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setAdminModalOpen(true)}
                className="focus-gold flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-gold hover:text-foreground transition-colors"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-gold" />
                <span>Admin Login</span>
              </button>
              <SocialLinks size="sm" />
            </div>
          </div>
        </div>
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-4 px-5">
          <Link
            to="/"
            className="focus-gold flex items-center"
            aria-label="Yours Clinic — home"
            onClick={() => setOpen(false)}
          >
            <img
              src={logoAsset}
              alt="Yours Clinic"
              width={626}
              height={395}
              className="h-12 w-auto md:h-14"
            />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
            {links.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                {...(l.hash ? { hash: l.hash } : {})}
                className="link-gold focus-gold text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
                activeOptions={{ exact: true, includeHash: false }}
                activeProps={{ className: "text-foreground", "aria-current": "page" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
              aria-pressed={dark}
              className="press focus-gold flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold/50 hover:text-primary"
            >
              {dark ? (
                <Sun className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setAdminModalOpen(true)}
              className="press focus-gold hidden rounded-full border border-gold/40 px-4 py-2 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-gold/15 hover:border-gold md:inline-flex items-center gap-1.5"
            >
              <Lock className="h-3.5 w-3.5 text-gold" />
              <span>Admin Login</span>
            </button>

            <Link
              to="/"
              hash="book"
              className="press focus-gold hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:inline-flex"
            >
              Book Now
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="press focus-gold flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground lg:hidden"
            >
              {open ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <nav
          id="mobile-nav"
          aria-label="Mobile"
          hidden={!open}
          className="glide-in border-t border-border bg-background px-5 py-4 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  {...(l.hash ? { hash: l.hash } : {})}
                  onClick={() => setOpen(false)}
                  className="press focus-gold block rounded-xl px-3 py-3 text-sm font-medium text-foreground hover:bg-secondary"
                  activeOptions={{ exact: true, includeHash: false }}
                  activeProps={{ "aria-current": "page" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setAdminModalOpen(true);
                }}
                className="press focus-gold flex w-full items-center gap-2 rounded-xl px-3 py-3 text-sm font-bold text-gold hover:bg-secondary"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Admin Login</span>
              </button>
            </li>
          </ul>
          <SocialLinks size="sm" className="mt-4 px-3" />
        </nav>
      </header>

      <AdminLoginModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
      />
    </>
  );
}

