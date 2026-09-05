import { BadgeCheck, CalendarClock, Lock, Stethoscope, Star, FileText } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const proofs = [
  {
    icon: BadgeCheck,
    metric: "6",
    unit: "council-registered clinicians",
    title: "Verified credentials",
    text: "BHMS / MD (Hom.) registration numbers printed on every profile below.",
  },
  {
    icon: Stethoscope,
    metric: "18,400",
    unit: "+ consultations",
    title: "Practice since 2018",
    text: "Continuous in-clinic and teleconsult practice, audited case records.",
  },
  {
    icon: Star,
    metric: "4.9",
    unit: "/5 from 1,200+ reviews",
    title: "Patient-rated care",
    text: "Independently posted Google reviews, unfiltered and unedited.",
  },
  {
    icon: FileText,
    metric: "100",
    unit: "% written plans",
    title: "Nothing verbal-only",
    text: "Remedy schedule, diet and follow-up date handed to you in writing.",
  },
  {
    icon: Lock,
    metric: "AES-256",
    unit: " encrypted records",
    title: "Private by design",
    text: "Your history is never sold, shared or used for marketing.",
  },
  {
    icon: CalendarClock,
    metric: "2",
    unit: "-day median wait",
    title: "Same-week slots",
    text: "Free rescheduling any time, no cancellation penalty.",
  },
];

export function TrustStrip() {
  return (
    <section
      aria-labelledby="trust-heading"
      className="px-5 pb-8 pt-2"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 id="trust-heading" className="sr-only">
            Why patients trust Yours Clinic
          </h2>
          <div className="grid gap-px overflow-hidden rounded-[2rem] bg-border/60 ring-1 ring-border/60 sm:grid-cols-2 lg:grid-cols-3">
            {proofs.map((p, i) => (
              <article
                key={p.title}
                className="ink-bleed group bg-card/75 p-7 transition-colors duration-500 hover:bg-card"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <p.icon
                  aria-hidden="true"
                  className="h-5 w-5 text-gold transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:scale-110"
                />
                <p className="mt-5 flex flex-wrap items-baseline gap-1.5">
                  <span className="tnum font-serif text-[2rem] leading-none text-primary">
                    {p.metric}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">{p.unit}</span>
                </p>
                <span className="gold-rule mt-4 block max-w-[3rem]" />
                <h3 className="mt-4 display-md text-lg text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
