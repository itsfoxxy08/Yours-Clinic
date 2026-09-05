import { useEffect, useState, type FormEvent } from "react";
import { CalendarCheck, CheckCircle2, X } from "lucide-react";

const slots = ["09:30", "11:00", "12:30", "15:00", "16:30", "18:00"];

export function QuickConsultDrawer({
  open,
  onClose,
  condition,
}: {
  open: boolean;
  onClose: () => void;
  condition: string;
}) {
  const [mode, setMode] = useState<"clinic" | "online">("clinic");
  const [slot, setSlot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const inputClass =
    "w-full rounded-2xl border border-border bg-background/70 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-sage";

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const date = String(data.get("date") ?? "");
    if (name.length < 2) return setError("Please enter your full name.");
    if (!/^[0-9+\s-]{8,15}$/.test(phone)) return setError("Enter a valid phone number.");
    if (!date) return setError("Choose a preferred date.");
    if (!slot) return setError("Choose a time slot.");
    setError(null);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[80] flex justify-end" role="dialog" aria-modal="true"
      aria-label={`Quick consult for ${condition}`}>
      <button
        aria-label="Close quick consult"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/35 backdrop-blur-[2px]"
      />
      <div className="slide-in-right relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-card/95 p-7 shadow-[var(--shadow-lift)] ring-1 ring-border/60 backdrop-blur-xl md:p-9">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="eyebrow">Quick consult</span>
            <h2 className="mt-3 text-2xl text-foreground">{condition}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="press rounded-full p-2 text-muted-foreground ring-1 ring-border/60 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <span className="gold-rule mt-5 block" />

        {submitted ? (
          <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
            <CheckCircle2 className="h-12 w-12 text-success" />
            <h3 className="mt-5 text-2xl text-foreground">Request sent</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Our front desk will confirm your{" "}
              {mode === "clinic" ? "in-clinic visit" : "teleconsultation"} for {condition} at{" "}
              {slot} by phone shortly.
            </p>
            <button
              onClick={onClose}
              className="press mt-7 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-7 space-y-5">
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  { value: "clinic", label: "In-clinic" },
                  { value: "online", label: "Online" },
                ] as const
              ).map((m) => (
                <button
                  type="button"
                  key={m.value}
                  onClick={() => setMode(m.value)}
                  className={`press rounded-2xl border px-4 py-3 text-sm font-medium ${
                    mode === m.value
                      ? "border-primary bg-primary-light text-foreground"
                      : "border-border text-muted-foreground hover:border-sage/50"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <input type="hidden" name="concern" value={condition} />

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-foreground">Full name</span>
              <input name="name" className={inputClass} placeholder="Your name" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-foreground">Phone number</span>
              <input name="phone" className={inputClass} placeholder="+91 90000 00000" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-foreground">Preferred date</span>
              <input type="date" name="date" className={inputClass} />
            </label>

            <div>
              <span className="mb-3 block text-sm font-medium text-foreground">Time slot</span>
              <div className="flex flex-wrap gap-2.5">
                {slots.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setSlot(s)}
                    className={`press rounded-full border px-4 py-2 text-sm ${
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

            {error && <p className="text-sm text-destructive">{error}</p>}

            <button
              type="submit"
              className="press inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground"
            >
              <CalendarCheck className="h-4 w-4" /> Request appointment
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
