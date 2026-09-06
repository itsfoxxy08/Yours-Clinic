import { Link } from "@tanstack/react-router";
import { ArrowRight, MoveRight, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import consultation from "@/assets/clinic/consultation.jpg";

const parts = [
  { num: "I", label: "PART ONE", title: "Triage Symptoms", hash: "treatment" },
  { num: "II", label: "PART TWO", title: "Consult with Experts", hash: "book" },
  { num: "III", label: "PART THREE", title: "Holistic Treatment", hash: "treatment" },
];

export function Hero() {
  return (
    <section id="home" className="sanctuary paper-grain relative px-5 pb-20 pt-16 md:pt-24">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <Reveal>
          <h1 className="display-xl text-foreground">
            Your health journey,{" "}
            <em className="relative inline-block font-normal italic text-sage">
              in balance.
              <svg
                aria-hidden="true"
                viewBox="0 0 400 12"
                className="absolute -bottom-1 left-0 h-3 w-full text-gold"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 9C70 3 180 3 398 9"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.55"
                />
              </svg>
            </em>
          </h1>

          <div className="mt-8 max-w-xl border-l-2 border-gold/40 pl-6">
            <p className="text-base leading-relaxed text-muted-foreground">
              You have probably thought about holistic healing and natural wellness.
              The chronic concerns, the symptoms you can't quite resolve, the state of
              vibrant health you are looking to reclaim.
            </p>
            <p className="mt-4 text-base font-semibold leading-relaxed text-sage">
              Yours Clinic offers a personalized, expert path to complete recovery,
              guided by professional homeopathic principles.
            </p>
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/"
              hash="book"
              className="press focus-gold group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-bold text-primary-foreground shadow-[var(--shadow-lift)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Book Appointment
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <Link
              to="/diseases"
              className="press ink-bleed focus-gold inline-flex items-center gap-2 rounded-full border border-gold/40 bg-card px-8 py-4 text-sm font-bold text-foreground"
            >
              Browse Diseases
            </Link>
          </div>


          <div className="mt-11 grid max-w-lg grid-cols-3 divide-x divide-border border-y border-border">
            {[
              { v: "18k+", l: "Consultations" },
              { v: "96%", l: "Improved" },
              { v: "2018", l: "Serving since" },
            ].map((s) => (
              <div key={s.l} className="px-4 py-4 first:pl-0">
                <span className="block font-serif text-2xl text-primary">{s.v}</span>
                <span className="mt-1 block text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">
                  {s.l}
                </span>
              </div>
            ))}
          </div>

        </Reveal>

        <Reveal delay={150}>
          <div className="surface-soft float-soft relative rounded-[2.5rem] p-7">
            <span className="absolute -top-3 right-8 rounded-full bg-gold px-4 py-1 text-[0.62rem] font-extrabold uppercase tracking-[0.2em] text-primary-foreground">
              Since 2018
            </span>
            <img
              src={consultation}
              alt="A Yours Clinic homeopath listening to a patient during a consultation"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              width={1280}
              height={960}
              className="mb-7 h-52 w-full rounded-[1.75rem] bg-primary-light object-cover object-[50%_45%] ring-1 ring-gold/25"
            />

            <span className="eyebrow">The Triage Panel</span>
            <h3 className="mt-3 font-serif text-[1.7rem] text-foreground">
              Three steps. One recovery.
            </h3>

            <div className="mt-6 divide-y divide-border border-y border-border">
              {parts.map((p) => (
                <Link
                  key={p.num}
                  to="/"
                  hash={p.hash}
                  className="group flex items-center gap-5 py-5"
                >
                  <span className="deco-numeral w-8 shrink-0 text-2xl transition-colors group-hover:text-gold">
                    {p.num}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.6rem] font-extrabold uppercase tracking-[0.22em] text-muted-foreground">
                      {p.label}
                    </span>
                    <span className="mt-0.5 block font-serif text-lg text-foreground transition-colors group-hover:text-sage">
                      {p.title}
                    </span>
                  </span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border transition-colors group-hover:border-gold group-hover:bg-gold/10">
                    <MoveRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-sage" />
                Telehealth • In-Clinic • Secure
              </span>
              <span className="rounded-full bg-gold/15 px-3 py-1.5 font-extrabold text-gold">
                Consultation • ₹499
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
