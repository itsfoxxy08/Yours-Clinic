import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, ShieldCheck, Star } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const stories = [
  {
    name: "Manish Singh",
    topic: "Chronic illness",
    quote:
      "Yours Clinic is best. I have used the medicine from Dr. Sumit sir for many issues — he is miraculous. I have seen several patients in my locality and family who got their treatment done by sir for fatal diseases and they are enjoying their life. Thanks to the whole Yours Clinic team for support, diet advice and care.",
  },
  {
    name: "Azad Ali Khan",
    topic: "Excellent treatment",
    quote:
      "I had a great experience at Yours Clinic! The doctors and physiotherapists are very kind and helpful. They listened to my problems and gave me excellent treatment. I felt better after just a few visits. The staff is friendly and the place is clean. I highly recommend Yours Clinic for anyone needing good care!",
  },
  {
    name: "Manish Choudhary",
    topic: "Speedy recovery",
    quote:
      "Excellent doctor with great humanity — I highly recommend him to everyone. I have not yet met any other doctor like him, who takes so much personal care of the patients.",
  },
  {
    name: "OM",
    topic: "Personalised care",
    quote:
      "Yours Clinic is truly a gem for anyone seeking medical assistance. The doctors are not only highly skilled but also incredibly compassionate. My recovery was remarkably speedy, thanks to their personalised treatment plans and attentive care.",
  },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);

  const go = useCallback((next: number, d: 1 | -1) => {
    setDir(d);
    setI((next + stories.length) % stories.length);
  }, []);

  useEffect(() => {
    const t = window.setInterval(() => go(i + 1, 1), 8000);
    return () => window.clearInterval(t);
  }, [i, go]);

  const s = stories[i]!;

  return (
    <section id="stories" className="sanctuary px-5 py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal className="text-center">
          <span className="eyebrow">Patient Stories</span>
          <h2 className="mt-6 text-[2.4rem] leading-[1.08] tracking-[-0.02em] text-foreground md:text-5xl">
            Real people. Real recoveries.
          </h2>
          <span className="gold-rule mx-auto mt-7 block max-w-[7rem]" />
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            Verified patient reviews from JustDial, shared word for word.
          </p>
        </Reveal>

        <Reveal delay={120} className="mt-12">
          <div className="surface-soft relative overflow-hidden rounded-[2.5rem] px-7 py-12 md:px-16 md:py-16">
            <Quote className="pointer-events-none absolute -right-2 -top-3 h-28 w-28 text-gold/10" />

            <div
              key={i}
              aria-live="polite"
              className={dir === 1 ? "slide-in-right" : "slide-in-left"}
            >
              <div className="flex flex-col items-center text-center">
                <div className="flex justify-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>

                <blockquote className="mt-7 max-w-3xl font-serif text-[1.35rem] leading-[1.6] text-foreground md:text-[1.75rem] md:leading-[1.55]">
                  &ldquo;{s.quote}&rdquo;
                </blockquote>

                <span className="mt-8 h-px w-16 bg-border" />

                <p className="mt-6 flex items-center gap-2 font-serif text-xl text-sage">
                  {s.name}
                  <ShieldCheck
                    className="h-4 w-4 text-sage/70"
                    aria-label="Verified review"
                  />
                </p>
                <p className="mt-1.5 text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">
                  {s.topic} &bull; JustDial review
                </p>
              </div>
            </div>

            <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
              <div className="flex gap-2">
                {stories.map((st, k) => (
                  <button
                    key={st.name}
                    aria-label={`Show story from ${st.name}`}
                    aria-current={k === i}
                    onClick={() => go(k, k > i ? 1 : -1)}
                    className={`press h-1.5 rounded-full transition-all duration-500 ${
                      k === i ? "w-9 bg-gold" : "w-3 bg-border hover:bg-gold/50"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  aria-label="Previous story"
                  onClick={() => go(i - 1, -1)}
                  className="press flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold hover:text-gold"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  aria-label="Next story"
                  onClick={() => go(i + 1, 1)}
                  className="press flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold hover:text-gold"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
