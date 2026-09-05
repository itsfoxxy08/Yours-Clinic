import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  Check,
  CircleAlert,
  CircleCheck,
  CircleX,
  HeartPulse,
  Sparkles,
  Stethoscope,
  Thermometer,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { useActiveStep } from "@/hooks/use-active-step";


const process = [
  {
    num: "I",
    part: "PART ONE • FOUNDATION",
    title: "Triage & Diagnose",
    text: "Before consulting, gauge your immediate health status. Our quick checker suggests treatment urgency and maps indicator patterns to classic homeopathic profiles.",
    points: [
      "A quick check of common homeopathic indications",
      "Immediate urgency guides for acute concerns",
      "Helps clarify key details before your consult",
      "Direct alignment with clinical treatment paths",
    ],
  },
  {
    num: "II",
    part: "PART TWO • REFLECTION",
    title: "Consult with Experts",
    text: "Partner with accredited homeopathic doctors online or in-facility. We conduct a complete, holistic audit of physical, mental, and constitutional health factors.",
    points: [
      "Structured digital clinic health records",
      "Telehealth video calls or in-clinic visits",
      "Comprehensive constitutional history review",
      "Patient-focused scheduling and reminders",
    ],
  },
  {
    num: "III",
    part: "PART THREE • DAILY PRACTICE",
    title: "Holistic Treatment",
    text: "Receive your tailored remedy schedule. Follow clear, natural dosings that target core vulnerabilities and promote long-term systemic healing.",
    points: [
      "Custom natural remedy plan and tracking logs",
      "Clean dose guidelines, timings, and schedules",
      "Continuous monitoring of symptom recovery",
      "Seamless remedy renewals and checkups",
    ],
  },
];

const concerns = [
  {
    value: "cold-flu",
    icon: Thermometer,
    title: "Cold, Flu & Fever",
    text: "Coughing, sore throat, sinus congestion, temperature",
  },
  {
    value: "digestion",
    icon: Sparkles,
    title: "Stomach & Digestion",
    text: "Acid reflux, bloating, stomach aches, mild nausea",
  },
  {
    value: "chronic-check",
    icon: HeartPulse,
    title: "Chronic Monitoring",
    text: "Blood pressure, glucose levels, heart wellness",
  },
  {
    value: "skin-general",
    icon: Stethoscope,
    title: "Skin & Irritations",
    text: "Dryness, red patches, rashes, minor allergies",
  },
];

const severities = [
  {
    value: "low",
    icon: CircleCheck,
    tone: "text-success",
    title: "Mild / Low severity",
    text: "Slight discomfort, manageable, doesn't interfere with daily tasks.",
  },
  {
    value: "medium",
    icon: CircleAlert,
    tone: "text-warning",
    title: "Moderate / Medium severity",
    text: "Noticeable pain or discomfort, interferes slightly with activities.",
  },
  {
    value: "high",
    icon: CircleX,
    tone: "text-destructive",
    title: "Severe / High severity",
    text: "Intense pain, difficulty breathing, majorly impacts vital functions.",
  },
];

const symptomTags = [
  "Fever",
  "Dry Cough",
  "Sore Throat",
  "Headache",
  "Body Aches",
  "Heartburn",
  "Stomach Cramps",
  "Skin Rash",
  "Extreme Fatigue",
  "Shortness of Breath",
];

const results = {
  high: {
    badge: "Urgent consultation",
    tone: "bg-destructive/10 text-destructive",
    title: "Please speak to a clinician today",
    text: "Your reported severity needs prompt attention. Book the earliest available slot, or visit an emergency facility if breathing is difficult or pain is intense.",
  },
  medium: {
    badge: "Book a consultation",
    tone: "bg-warning/15 text-warning",
    title: "A structured consultation is recommended",
    text: "Your symptoms are likely to keep recurring without a constitutional plan. A full history review will identify the underlying pattern.",
  },
  low: {
    badge: "Supported home care",
    tone: "bg-success/15 text-success",
    title: "Home care with a follow-up check",
    text: "Rest, hydration, and a simple acute remedy are usually enough. Book a consultation if symptoms persist beyond five days or worsen.",
  },
} as const;

export function TreatmentProcess() {
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState<1 | -1>(1);
  const [concern, setConcern] = useState<string | null>(null);
  const [severity, setSeverity] = useState<keyof typeof results | null>(null);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const { active, setRef } = useActiveStep(process.length);

  const canContinue =
    (step === 1 && concern) || (step === 2 && severity) || (step === 3 && symptoms.length > 0);

  const toggleSymptom = (s: string) =>
    setSymptoms((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const goStep = (n: number) => {
    setDir(n > step ? 1 : -1);
    setStep(n);
  };

  const reset = () => {
    setDir(-1);
    setStep(1);
    setConcern(null);
    setSeverity(null);
    setSymptoms([]);
  };

  const result = severity ? results[severity] : results.low;

  return (
    <section id="treatment" className="sanctuary paper-grain px-5 pb-32 pt-20">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">The Treatment Process</span>
          <h2 className="mt-6 text-[2.6rem] leading-[1.08] tracking-[-0.02em] text-foreground md:text-6xl">
            Three steps. One recovery.
          </h2>
          <span className="gold-rule mx-auto mt-7 block max-w-[7rem]" />
          <p className="mt-7 text-base leading-loose text-muted-foreground">
            How we guide you from initial symptom triage to complete homeopathic recovery.
          </p>
        </Reveal>

        <div className="mt-20 grid items-start gap-10 lg:grid-cols-3 lg:gap-8">
          {process.map((col, i) => (
            <div
              key={col.num}
              ref={setRef(i)}
              className={`step-dim h-full ${active === i ? "step-active" : ""}`}
            >
              <div
                className={`tactile relative flex h-full flex-col rounded-[2.25rem] p-9 ${
                  active === i
                    ? "surface-soft shadow-[var(--shadow-lift)]"
                    : "bg-card/40 shadow-[var(--shadow-soft)]"
                }`}
              >
                <span className="deco-numeral pointer-events-none absolute right-3 top-3 text-[7rem]">
                  {col.num}
                </span>
                <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.24em] text-gold">
                  {col.part}
                </span>
                <h3 className="mt-3 text-2xl text-foreground">{col.title}</h3>
                <span
                  className={`mt-5 block h-px origin-left bg-gold/60 transition-transform duration-700 ${
                    active === i ? "scale-x-100" : "scale-x-0"
                  }`}
                />
                <p className="mt-5 text-sm leading-loose text-muted-foreground">
                  {col.text}
                </p>
                <ul className="mt-7 space-y-3.5">
                  {col.points.map((p) => (
                    <li key={p} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-5">
                  {i === 1 ? (
                    <Link
                      to="/"
                      hash="book"
                      className="link-gold inline-flex items-center gap-2 text-[0.72rem] font-extrabold uppercase tracking-[0.18em] text-primary"
                    >
                      Book consultation <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : i === 2 ? (
                    <Link
                      to="/diseases"
                      className="link-gold inline-flex items-center gap-2 text-[0.72rem] font-extrabold uppercase tracking-[0.18em] text-primary"
                    >
                      Browse conditions <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <a
                      href="#triage"
                      className="link-gold inline-flex items-center gap-2 text-[0.72rem] font-extrabold uppercase tracking-[0.18em] text-primary"
                    >
                      Start triage below <ArrowDown className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>


        <Reveal className="mt-20">
          <div
            id="triage"
            className="surface-soft overflow-hidden rounded-[2.5rem]"
          >
            <div className="h-1 w-full bg-secondary/60">
              <div
                className="h-full bg-gradient-to-r from-sage to-gold transition-all duration-700"
                style={{ width: `${(Math.min(step, 4) / 4) * 100}%` }}
              />
            </div>

            <div
              key={step}
              className={`p-8 md:p-12 ${dir === 1 ? "slide-in-right" : "slide-in-left"}`}
            >
              {step === 1 && (
                <>
                  <h3 className="text-center text-2xl leading-snug text-foreground md:text-[1.9rem]">
                    Let&rsquo;s start gently — what&rsquo;s troubling you most?
                  </h3>
                  <p className="mx-auto mt-3 max-w-md text-center text-sm leading-relaxed text-muted-foreground">
                    There are no wrong answers. Pick whatever feels closest today.
                  </p>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {concerns.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => {
                          setConcern(c.value);
                          window.setTimeout(() => goStep(2), 380);
                        }}
                        className={`tactile press rounded-3xl p-6 text-left ${
                          concern === c.value
                            ? "bg-primary-light ring-1 ring-primary/40"
                            : "bg-card/50 ring-1 ring-border/60 hover:ring-gold/50"
                        }`}
                      >
                        <c.icon className="h-6 w-6 text-sage" />
                        <span className="mt-4 block font-serif text-lg text-foreground">
                          {c.title}
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                          {c.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}


              {step === 2 && (
                <>
                  <h3 className="text-center text-2xl leading-snug text-foreground md:text-[1.9rem]">
                    How much is it affecting your day?
                  </h3>
                  <p className="mx-auto mt-3 max-w-md text-center text-sm leading-relaxed text-muted-foreground">
                    Take your time — describe it the way you&rsquo;d tell a friend.
                  </p>
                  <div className="mx-auto mt-8 grid max-w-xl gap-4">
                    {severities.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => {
                          setSeverity(s.value as keyof typeof results);
                          window.setTimeout(() => goStep(3), 380);
                        }}
                        className={`tactile press flex items-center gap-4 rounded-3xl p-5 text-left ${
                          severity === s.value
                            ? "bg-primary-light ring-1 ring-primary/40"
                            : "bg-card/50 ring-1 ring-border/60 hover:ring-gold/50"
                        }`}
                      >
                        <s.icon className={`h-6 w-6 shrink-0 ${s.tone}`} />
                        <span>
                          <span className="block font-serif text-lg text-foreground">
                            {s.title}
                          </span>
                          <span className="block text-sm leading-relaxed text-muted-foreground">
                            {s.text}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h3 className="text-center text-2xl leading-snug text-foreground md:text-[1.9rem]">
                    Anything else you&rsquo;ve been noticing?
                  </h3>
                  <p className="mx-auto mt-3 max-w-md text-center text-sm leading-relaxed text-muted-foreground">
                    Choose as many or as few as you like.
                  </p>
                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    {symptomTags.map((s) => (
                      <button
                        key={s}
                        onClick={() => toggleSymptom(s)}
                        className={`press rounded-full px-5 py-2.5 text-sm font-medium ring-1 hover:-translate-y-0.5 ${
                          symptoms.includes(s)
                            ? "bg-primary text-primary-foreground ring-primary"
                            : "text-muted-foreground ring-border/70 hover:ring-gold/60"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              )}


              {step === 4 && (
                <div className="text-center">
                  <span
                    className={`inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${result.tone}`}
                  >
                    {result.badge}
                  </span>
                  <h3 className="mt-5 text-3xl text-foreground">{result.title}</h3>
                  <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                    {result.text}
                  </p>
                  {symptoms.length > 0 && (
                    <p className="mx-auto mt-4 max-w-xl text-xs text-muted-foreground">
                      Noted: {symptoms.join(", ")}
                    </p>
                  )}
                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Link
                      to="/"
                      hash="book"
                      className="press inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground"
                    >
                      Book consultation <ArrowRight className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={reset}
                      className="press rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-foreground"
                    >
                      Start over
                    </button>
                  </div>
                </div>
              )}

              {step < 4 && (
                <div className="mt-10 flex items-center justify-between">
                  <button
                    onClick={() => goStep(Math.max(1, step - 1))}
                    className={`press rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground ${
                      step === 1 ? "invisible" : ""
                    }`}
                  >
                    Back
                  </button>
                  <button
                    disabled={!canContinue}
                    onClick={() => goStep(step + 1)}
                    className="press rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-40"
                  >
                    {step === 3 ? "See result" : "Continue"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
