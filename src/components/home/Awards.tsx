import { useState, useEffect, useCallback } from "react";
import { Reveal } from "@/components/Reveal";
import { Trophy, Award, Medal, Sparkles, ChevronLeft, ChevronRight, X, Maximize2, Grid, ChevronDown, ChevronUp } from "lucide-react";

export interface AwardItem {
  id: number;
  src: string;
  title: string;
  category?: string;
}

const awardImages: AwardItem[] = [
  { id: 1, src: "/awards/485391636_9081301818664410_5342881775737082617_n.jpg", title: "Clinical Excellence Award", category: "Excellence" },
  { id: 2, src: "/awards/489097903_9178463835614874_7654798877011174839_n.jpg", title: "Healthcare Pioneer Recognition", category: "Pioneer" },
  { id: 3, src: "/awards/489318892_9178463815614876_7755118884671399617_n (1).jpg", title: "Excellence in Homeopathy", category: "Excellence" },
  { id: 4, src: "/awards/490303082_9229697843824806_4828298162782536839_n.jpg", title: "Outstanding Medical Service", category: "Service" },
  { id: 5, src: "/awards/490604390_9229698050491452_2385184220192949406_n.jpg", title: "Best Patient Care Honor", category: "Patient Care" },
  { id: 6, src: "/awards/491277971_9252367231557867_8055960684699042833_n.jpg", title: "National Health Achievement", category: "Achievement" },
  { id: 7, src: "/awards/491421973_9252379014890022_4527597078568208502_n (1).jpg", title: "Top Homeopathic Practice", category: "Recognition" },
  { id: 8, src: "/awards/491751769_9252361534891770_5504283460080777241_n.jpg", title: "Distinguished Service Award", category: "Service" },
  { id: 9, src: "/awards/494054351_9338385506289372_1428480556358908488_n.jpg", title: "Medical Innovation Honor", category: "Innovation" },
  { id: 10, src: "/awards/494273069_9338462602948329_264089565471836427_n.jpg", title: "Healthcare Leadership Trophy", category: "Leadership" },
  { id: 11, src: "/awards/494435443_9338360029625253_6231876749110919131_n.jpg", title: "Excellence in Holistic Healing", category: "Holistic Care" },
  { id: 12, src: "/awards/509427864_9768286999965885_2710017652103291109_n.jpg", title: "State Medical Honor", category: "Recognition" },
  { id: 13, src: "/awards/509655026_9766508346810417_4581169830114227908_n.jpg", title: "Community Wellness Award", category: "Community" },
  { id: 14, src: "/awards/510411255_9760979430696642_3610574908129450887_n.jpg", title: "Doctor of the Year Citation", category: "Excellence" },
  { id: 15, src: "/awards/511150238_9766513810143204_612841520647257478_n.jpg", title: "Honour of Distinction", category: "Distinction" },
  { id: 16, src: "/awards/511620079_9768059876655264_6314837674812367208_n.jpg", title: "Lifetime Health Achievement", category: "Achievement" },
  { id: 17, src: "/awards/511688308_9766754920119093_8425746378032060726_n.jpg", title: "Pioneer in Natural Medicine", category: "Pioneer" },
  { id: 18, src: "/awards/511712034_9768306583297260_8647258255863450912_n.jpg", title: "Healthcare Icon Honor", category: "Leadership" },
  { id: 19, src: "/awards/512509924_9768287056632546_938969424376115821_n.jpg", title: "Excellence in Medical Practice", category: "Excellence" },
  { id: 20, src: "/awards/512737964_9761179260676659_4481469472189039861_n.jpg", title: "Prestigious Health Citation", category: "Distinction" },
  { id: 21, src: "/awards/517403132_9864491737012077_4382151205580428305_n.jpg", title: "Leader in Homeopathy", category: "Leadership" },
  { id: 22, src: "/awards/534948410_23972024919165522_4588936906121933494_n.jpg", title: "National Medical Summit Award", category: "Achievement" },
  { id: 23, src: "/awards/536623110_23979937691707578_429219903209374023_n.jpg", title: "Special Recognition Award", category: "Recognition" },
  { id: 24, src: "/awards/536841041_23972033325831348_1333732904964356993_n.jpg", title: "Outstanding Doctor Award", category: "Excellence" },
  { id: 25, src: "/awards/537552154_23988631377504876_6902898024731195833_n (1).jpg", title: "Clinical Merit Award", category: "Merit" },
  { id: 26, src: "/awards/672063213_26074584292242897_8437135105429147814_n.jpg", title: "Homeopathic Excellence Shield", category: "Excellence" },
  { id: 27, src: "/awards/673396645_26127153916985934_421779327187525271_n.jpg", title: "Health Excellence Award", category: "Excellence" },
  { id: 28, src: "/awards/673831355_26140291765672149_8945030133700963961_n.jpg", title: "Healthcare Achiever Trophy", category: "Achievement" },
  { id: 29, src: "/awards/674176462_26127414110293248_8837310298453009683_n.jpg", title: "Celebrated Homeopath Citation", category: "Distinction" },
  { id: 30, src: "/awards/675489180_26127417863626206_785080446619201378_n.jpg", title: "Medical Conclave Award", category: "Recognition" },
  { id: 31, src: "/awards/676726512_26165779396456719_8326065396344304423_n.jpg", title: "Pinnacle of Healthcare", category: "Leadership" },
  { id: 32, src: "/awards/677269696_26171163225918336_3001520929722296523_n.jpg", title: "Visionary Medical Leader", category: "Visionary" },
  { id: 33, src: "/awards/731935271_26974284128939571_789603866184361981_n.jpg", title: "Global Health Distinction", category: "Distinction" },
  { id: 34, src: "/awards/732309748_26974284478939536_7982362370104030310_n.jpg", title: "Honour of Excellence", category: "Excellence" },
  { id: 35, src: "/awards/NZ7_1000415-scaled (1).webp", title: "Featured Healthcare Feature", category: "Media" },
  { id: 36, src: "/awards/WhatsApp-Image-2024-07-07-at-21.33.44_298944ff.webp", title: "Award Ceremony Highlight", category: "Event" },
  { id: 37, src: "/awards/WhatsApp-Image-2024-07-07-at-21.35.55_bd48e78a.webp", title: "Excellence Trophy Presentation", category: "Trophy" },
  { id: 38, src: "/awards/WhatsApp-Image-2024-12-29-at-07.26.57_e0cc72fd-qztgdp1h1mx8xpgfk4ugj11ekv0a0kk7dv81ktaheo.webp", title: "Medical Society Recognition", category: "Recognition" },
  { id: 39, src: "/awards/WhatsApp-Image-2025-04-21-at-09.24.52_288484d2.webp", title: "Annual Clinical Award", category: "Clinical" },
];

const INITIAL_SHOW_COUNT = 8;

export function Awards() {
  const [showAll, setShowAll] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const displayedAwards = showAll ? awardImages : awardImages.slice(0, INITIAL_SHOW_COUNT);

  const handlePrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev === 0 ? awardImages.length - 1 : prev - 1) : null
    );
  }, []);

  const handleNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev === awardImages.length - 1 ? 0 : prev + 1) : null
    );
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    },
    [lightboxIndex, handlePrev, handleNext]
  );

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxIndex, handleKeyDown]);

  return (
    <section id="awards" className="scroll-mt-28 px-5 py-24 bg-card/40 border-y border-border/50 relative overflow-hidden">
      {/* Background soft ambient glow */}
      <div className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-sage/10 blur-3xl" />

      <div className="mx-auto max-w-6xl relative">
        {/* Section Header */}
        <div className="text-center">
          <Reveal>
            <span className="eyebrow inline-flex items-center gap-2">
              <Trophy className="h-4 w-4 text-gold" />
              Honours & Recognitions
            </span>
            <h2 className="display-lg mt-4 text-foreground">
              Awards We Have Received
            </h2>
            <span className="gold-rule mx-auto mt-5 block max-w-[8rem]" />
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Celebrating our clinical excellence, patient trust, and milestone achievements in holistic homeopathic healthcare over the years.
            </p>
          </Reveal>

          {/* Quick stats strip */}
          <Reveal delay={100} className="mt-8">
            <div className="inline-flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-gold/20 bg-background/80 px-6 py-3.5 shadow-sm backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/15 text-gold">
                  <Award className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-foreground tnum">35+ Awards</p>
                  <p className="text-[0.65rem] text-muted-foreground">National & State Level</p>
                </div>
              </div>

              <div className="hidden h-6 w-px bg-border sm:block" />

              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sage/15 text-sage">
                  <Medal className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-foreground">Clinical Merit</p>
                  <p className="text-[0.65rem] text-muted-foreground">Council & Practice Honors</p>
                </div>
              </div>

              <div className="hidden h-6 w-px bg-border sm:block" />

              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-foreground">Dr. Sumit Jha</p>
                  <p className="text-[0.65rem] text-muted-foreground">Founder & Lead Clinician</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Gallery Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {displayedAwards.map((award, index) => (
            <Reveal key={award.id} delay={(index % 4) * 60}>
              <button
                type="button"
                onClick={() => setLightboxIndex(index)}
                className="group tactile relative block w-full overflow-hidden rounded-2xl bg-card border border-border/80 text-left shadow-sm focus-gold transition-all duration-300 hover:border-gold/60 hover:shadow-lg"
              >
                {/* Aspect ratio container */}
                <div className="aspect-[4/3] w-full overflow-hidden bg-muted/40 relative">
                  <img
                    src={award.src}
                    alt={award.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-primary/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-md transition-transform duration-300 group-hover:scale-105">
                      <Maximize2 className="h-3.5 w-3.5 text-gold" />
                      View Award
                    </span>
                  </div>

                  {/* Corner Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="inline-flex items-center gap-1 rounded-md bg-background/85 px-2 py-0.5 text-[0.65rem] font-bold text-gold backdrop-blur-md border border-gold/30">
                      <Trophy className="h-3 w-3" />
                      #{award.id}
                    </span>
                  </div>
                </div>

                {/* Info Footer */}
                <div className="p-4 bg-card">
                  <p className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {award.title}
                  </p>
                  <div className="mt-1 flex items-center justify-between text-[0.7rem] text-muted-foreground">
                    <span className="uppercase tracking-wider font-semibold text-sage">
                      {award.category}
                    </span>
                    <span className="flex items-center gap-1 text-gold font-medium">
                      Click to expand
                    </span>
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        {/* Toggle Show All Button */}
        {awardImages.length > INITIAL_SHOW_COUNT && (
          <Reveal delay={120} className="mt-12 text-center">
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="press focus-gold inline-flex items-center gap-2 rounded-full border border-gold/40 bg-card px-7 py-3 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-gold/10 hover:border-gold"
            >
              {showAll ? (
                <>
                  <ChevronUp className="h-4 w-4 text-gold" />
                  Show Less (Displaying all 39 awards)
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 text-gold" />
                  View All Awards ({awardImages.length - INITIAL_SHOW_COUNT} More)
                </>
              )}
            </button>
          </Reveal>
        )}
      </div>

      {/* Lightbox / Fullscreen Modal */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-4 transition-all duration-300 animate-in fade-in"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Award Image Modal"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-gold"
            aria-label="Close award modal"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Previous button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-4 top-1/2 z-50 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-gold sm:left-8"
            aria-label="Previous award"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          {/* Next button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 top-1/2 z-50 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-gold sm:right-8"
            aria-label="Next award"
          >
            <ChevronRight className="h-7 w-7" />
          </button>

          {/* Modal Content Container */}
          <div
            className="relative max-h-[85vh] max-w-4xl overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main image container */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px] max-h-[70vh]">
              <img
                src={awardImages[lightboxIndex].src}
                alt={awardImages[lightboxIndex].title}
                className="max-h-[70vh] w-auto max-w-full object-contain p-2 transition-all duration-300"
              />
            </div>

            {/* Bottom Caption & Controls */}
            <div className="bg-zinc-900/95 px-6 py-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-400" />
                  <h3 className="text-base font-bold text-white">
                    {awardImages[lightboxIndex].title}
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Yours Clinic Official Award & Recognition Gallery
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-semibold text-amber-400 border border-zinc-700">
                  {lightboxIndex + 1} of {awardImages.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
