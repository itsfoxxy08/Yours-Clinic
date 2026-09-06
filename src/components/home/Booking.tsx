import { useState, type FormEvent } from "react";
import { CalendarCheck, CheckCircle2, Loader2 } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { diseases } from "@/data/diseases";
import { externalLinkProps, whatsappLink } from "@/lib/social";
import { WhatsAppIcon } from "@/components/SocialLinks";
import { addPatientRecord } from "@/lib/patient-service";

const slots = ["09:30", "11:00", "12:30", "15:00", "16:30", "18:00"];

export function Booking() {
  const [mode, setMode] = useState<"clinic" | "online">("clinic");
  const [slot, setSlot] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const date = String(data.get("date") ?? "");
    const concern = String(data.get("concern") ?? "");
    const notes = String(data.get("notes") ?? "").trim();

    if (name.length < 2) return setError("Please enter your full name.");
    if (!/^[0-9+\s-]{8,15}$/.test(phone)) return setError("Enter a valid phone number.");
    if (!date) return setError("Choose a preferred date.");
    if (!slot) return setError("Choose a time slot.");

    setError(null);
    setSubmitting(true);

    try {
      await addPatientRecord({
        name,
        phone,
        email: "",
        address: `${mode === "clinic" ? "In-Clinic Visit" : "Teleconsultation"} (${date} @ ${slot})`,
        reason: `[${mode.toUpperCase()}] ${concern ? concern : "Consultation"}${notes ? ` — ${notes}` : ""}`,
        status: "Consultation",
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to save patient appointment:", err);
      setError("Failed to save appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-sage";

  return (
    <section id="book" className="border-y border-border bg-card/40 px-5 py-24">
      <div className="mx-auto max-w-4xl">
        <Reveal className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-sage">
            Appointment Booking
          </span>
          <h2 className="mt-4 text-4xl text-foreground">Schedule Your Consultation</h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Book an in-clinic visit or a secure teleconsultation. Choose your preferences
            and confirm your slot instantly.
          </p>
        </Reveal>

        <Reveal delay={120} className="mt-12">
          <div className="rounded-[2rem] border border-border bg-card p-8 shadow-[var(--shadow-lift)] md:p-12">
            {submitted ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
                <h3 className="mt-5 text-2xl text-foreground">Appointment requested</h3>
                <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
                  Our front desk will confirm your{" "}
                  {mode === "clinic" ? "in-clinic visit" : "teleconsultation"} at {slot} by
                  phone shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setSlot(null);
                  }}
                  className="mt-7 rounded-full border border-border px-7 py-3 text-sm font-semibold text-foreground"
                >
                  Book another
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  {(
                    [
                      { value: "clinic", label: "In-clinic visit", note: "Walk into the clinic" },
                      { value: "online", label: "Teleconsultation", note: "Secure video call" },
                    ] as const
                  ).map((m) => (
                    <button
                      type="button"
                      key={m.value}
                      onClick={() => setMode(m.value)}
                      className={`rounded-2xl border p-5 text-left transition-all ${
                        mode === m.value
                          ? "border-primary bg-primary-light"
                          : "border-border hover:border-sage/50"
                      }`}
                    >
                      <span className="block font-serif text-lg text-foreground">
                        {m.label}
                      </span>
                      <span className="block text-sm text-muted-foreground">{m.note}</span>
                    </button>
                  ))}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-foreground">
                      Full name
                    </span>
                    <input name="name" className={inputClass} placeholder="Your name" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-foreground">
                      Phone number
                    </span>
                    <input name="phone" className={inputClass} placeholder="+91 90000 00000" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-foreground">
                      Preferred date
                    </span>
                    <input type="date" name="date" className={inputClass} />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-foreground">
                      Primary concern
                    </span>
                    <select name="concern" className={inputClass} defaultValue="">
                      <option value="">Select a condition</option>
                      {diseases.map((d) => (
                        <option key={d.slug} value={d.slug}>
                          {d.title}
                        </option>
                      ))}
                      <option value="other">Something else</option>
                    </select>
                  </label>
                </div>

                <div>
                  <span className="mb-3 block text-sm font-medium text-foreground">
                    Available time slots
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {slots.map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setSlot(s)}
                        className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all ${
                          slot === s
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border text-muted-foreground hover:border-sage/50"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-foreground">
                    Notes for the doctor (optional)
                  </span>
                  <textarea
                    name="notes"
                    rows={3}
                    className={inputClass}
                    placeholder="Briefly describe your symptoms and how long they have lasted"
                  />
                </label>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
                  >
                    <CalendarCheck className="h-4 w-4" /> Confirm appointment
                  </button>
                  <a
                    href={whatsappLink(
                      "Hello Dr. Sumit Jha, I would like to enquire about booking a consultation.",
                    )}
                    {...externalLinkProps}
                    className="press focus-gold inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#128c4a]/40 px-7 py-4 text-sm font-semibold text-[#128c4a] transition-colors hover:bg-[#128c4a]/10 sm:w-auto"
                  >
                    <WhatsAppIcon className="h-4 w-4" /> Chat on WhatsApp
                  </a>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
