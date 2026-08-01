import { Reveal } from "@/components/Reveal";
import { Microscope, BriefcaseMedical, ShieldCheck } from "lucide-react";
import consultation from "@/assets/clinic/consultation.jpg";
import doc1 from "@/assets/team/doctor-1.jpg";
import doc2 from "@/assets/team/doctor-2.jpg";
import doc3 from "@/assets/team/doctor-3.jpg";
import doc4 from "@/assets/team/doctor-4.jpg";
import doc5 from "@/assets/team/doctor-5.jpg";
import doc6 from "@/assets/team/doctor-6.jpg";

const specialists = [
  {
    photo: doc2,
    name: "Dr. Sumit Jha",
    reg: "BHMS, MD (Hom.) • Founder & Chief Physician",
    specialty: "Constitutional & Chronic Care",
    bio: "Leads Yours Clinic. Known for piles, fistula and long-standing gastric cases that had run out of options.",
  },
  {
    photo: doc1,
    name: "Dr. Bandana Kumari",
    reg: "BHMS • Senior Consultant",
    specialty: "Women's Health & PCOS",
    bio: "Handles the women's health panel — PCOD, irregular cycles, fibroids and menopausal care.",
  },
  {
    photo: doc4,
    name: "Dr. M. N. Jha",
    reg: "BHMS • Senior Consultant",
    specialty: "Joint, Spine & Geriatric Care",
    bio: "Decades of classical practice in arthritis, cervical spondylosis, sciatica and elderly care.",
  },
  {
    photo: doc3,
    name: "Dr. Ansu Singh",
    reg: "BHMS • Consultant",
    specialty: "Skin & Hair Disorders",
    bio: "Psoriasis, eczema, vitiligo and hair fall — long-arc treatment plans with photographic tracking.",
  },
  {
    photo: doc5,
    name: "Dr. Megha Anand",
    reg: "BHMS • Consultant",
    specialty: "Paediatrics & Acute Care",
    bio: "Runs the acute desk: recurring colds, tonsillitis, allergic rhinitis and childhood immunity.",
  },
  {
    photo: doc6,
    name: "Dr. Shweta Sangini",
    reg: "BHMS, PG Dip. Nutrition",
    specialty: "Nutrition & Lifestyle",
    bio: "Builds the diet, sleep and stress plan that sits alongside every remedy schedule.",
  },
];


export function About() {
  return (
    <section id="about" className="px-5 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div className="tactile relative overflow-hidden rounded-[2.5rem] ring-1 ring-gold/25">
              <img
                src={consultation}
                alt="A Yours Clinic homeopath in consultation with a patient"
                loading="lazy"
                width={1280}
                height={960}
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-card/85 px-5 py-4 backdrop-blur-md">
                <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.2em] text-gold">
                  Our clinic • Pune
                </p>
                <p className="mt-1 font-serif text-lg text-foreground">
                  Forty-minute first consults. No conveyor belt.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <span className="eyebrow">Who We Are</span>
            <h2 className="mt-5 text-[2.4rem] leading-[1.08] tracking-[-0.02em] text-foreground md:text-5xl">
              Care you can actually verify
            </h2>
            <span className="gold-rule mt-6 block max-w-[7rem]" />

            <p className="mt-6 text-base leading-loose text-muted-foreground">
              Yours Clinic has been practising since 2018. Every clinician on our panel is
              council-registered, every registration number is printed on this page, and
              every plan you receive is written down before you leave the room.
            </p>

            <div className="mt-9 grid gap-6 sm:grid-cols-3">
              {[
                { value: "18,400+", label: "Consultations delivered" },
                { value: "96%", label: "Report clear improvement" },
                { value: "₹499", label: "Flat consultation fee" },
              ].map((s) => (
                <div key={s.label} className="border-l-2 border-gold/40 pl-4">
                  <span className="block font-serif text-3xl text-primary">{s.value}</span>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-9 grid gap-5 sm:grid-cols-3">
              {[
                { icon: Microscope, title: "Lab-backed", text: "Accredited partner labs." },
                { icon: BriefcaseMedical, title: "Full panel", text: "Every core specialty." },
                { icon: ShieldCheck, title: "Encrypted", text: "Records stay private." },
              ].map((f) => (
                <div key={f.title} className="flex gap-3">
                  <f.icon className="mt-0.5 h-5 w-5 shrink-0 text-sage" />
                  <span>
                    <span className="block font-serif text-base text-foreground">
                      {f.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {f.text}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-28">
          <div id="clinicians" className="scroll-mt-28 text-center">
            <span className="eyebrow">The Practice</span>
            <h3 className="display-lg mt-5 text-foreground">
              Meet our clinicians
            </h3>
            <span className="gold-rule mx-auto mt-6 block max-w-[7rem]" />
            <p className="mx-auto mt-6 max-w-xl text-sm leading-loose text-muted-foreground">
              Council-registered, named and reachable — the same six doctors who
              see patients at Yours Clinic every week. No anonymous panel.
            </p>
          </div>


          <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {specialists.map((d, i) => (
              <Reveal key={d.name} delay={i * 90}>
                <article className="tactile ink-bleed group h-full overflow-hidden rounded-[2rem] bg-card/60 ring-1 ring-border/60 hover:ring-gold/50">
                  <div className="aspect-[4/5] w-full overflow-hidden bg-primary-light">
                    <img
                      src={d.photo}
                      alt={`${d.name}, ${d.specialty} at Yours Clinic`}
                      loading="lazy"
                      width={768}
                      height={960}
                      className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="p-7">
                    <h4 className="text-xl text-foreground">{d.name}</h4>
                    <p className="mt-1.5 text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-gold">
                      {d.specialty}
                    </p>
                    <span className="gold-rule mt-4 block max-w-[3rem]" />
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {d.bio}
                    </p>
                    <p className="mt-5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-sage">
                      {d.reg}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
