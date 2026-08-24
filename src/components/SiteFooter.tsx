import { Link } from "@tanstack/react-router";
import { diseases } from "@/data/diseases";
import logoAsset from "@/assets/yours-logo-lockup.png";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <img
            src={logoAsset}
            alt="Yours Clinic"
            width={631}
            height={435}
            className="h-20 w-auto"
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Research-based homeopathic care for chronic and everyday conditions.
            Telehealth and in-clinic consultations, guided by accredited clinicians.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
            Explore
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li>
              <Link to="/diseases" className="hover:text-primary">
                General Diseases
              </Link>
            </li>
            <li>
              <Link to="/" hash="treatment" className="hover:text-primary">
                Treatment Process
              </Link>
            </li>
            <li>
              <Link to="/" hash="about" className="hover:text-primary">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
            Conditions
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {diseases.slice(0, 5).map((d) => (
              <li key={d.slug}>
                <Link
                  to="/diseases/$slug"
                  params={{ slug: d.slug }}
                  className="hover:text-primary"
                >
                  {(d.title.split(/[&(]/)[0] ?? d.title).trim()}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
            Visit
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Mon – Sat · 9:00 to 19:00</li>
            <li>Teleconsult · 7 days a week</li>
            <li>care@yoursclinic.com</li>
            <li>Consultation · ₹499</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border px-5 py-6">
        <p className="mx-auto max-w-6xl text-xs text-muted-foreground">
          © {new Date().getFullYear()} Yours Clinic. Information on this site is
          educational and does not replace a personal consultation.
        </p>
      </div>
    </footer>
  );
}
