import React from "react";
import { ShieldCheck, FileSearch, Lock, Truck, PhoneCall, CheckCircle2 } from "lucide-react";

export function TrustSection() {
  const trustPillars = [
    {
      icon: ShieldCheck,
      title: "Clinic Curated Selection",
      description:
        "Every single dilution, biochemic salt, and topical preparation is chosen under the direct oversight of Dr. Sumit Jha and accredited Yours Clinic practitioners.",
      tag: "Practitioner Supervised",
    },
    {
      icon: FileSearch,
      title: "Transparent Product Information",
      description:
        "No hidden proprietary blends. Complete monographs, official HPI / GHP pharmacopoeia standards, GMP batch dates, and clear ingredients are fully visible.",
      tag: "100% Disclosure",
    },
    {
      icon: Lock,
      title: "Safe & Secure Ordering",
      description:
        "Your health data and payment information are processed with industry-standard 256-bit encryption. Directly integrated with our verified dispensary.",
      tag: "Encrypted & Confidential",
    },
    {
      icon: Truck,
      title: "Convenient Doorstep Delivery",
      description:
        "Safely packaged in thermal-insulated, shock-resistant cases to protect sensitive dilutions from light and temperature variations during transit.",
      tag: "Pan-India Express",
    },
    {
      icon: PhoneCall,
      title: "Access to Professional Guidance",
      description:
        "Questions regarding dosage timing, storage, or family suitability? Our clinical desk is one click away via phone, WhatsApp, or teleconsult.",
      tag: "Ongoing Clinical Support",
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-card/50 border-t border-border/50">
      <div className="mx-auto max-w-7xl xl:max-w-[1400px] px-5 sm:px-8 xl:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400">
            Our Medical Standard
          </span>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-foreground">
            Healthcare You Can Trust.
          </h2>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            We hold our household kits to the same rigorous clinical standards as our patient
            consultations. Grounded in medical ethics, verified pharmacopoeia, and clinical
            responsibility.
          </p>
        </div>

        {/* 5 Minimal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl border border-border/70 bg-card p-7 sm:p-8 hover:border-emerald-600/40 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[0.68rem] font-bold uppercase tracking-wider text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                      {pillar.tag}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-medium text-foreground mb-2.5">
                    {pillar.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50 flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Clinic Certified</span>
                </div>
              </div>
            );
          })}

          {/* 6th Card: Direct Teleconsultation Booking Highlight */}
          <div className="rounded-3xl border border-primary/30 bg-primary/5 p-7 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <PhoneCall className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-medium text-foreground mb-2.5">
                Need Individualized Care?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If your symptoms are persistent or chronic, schedule a one-on-one video or in-clinic
                consultation with Dr. Sumit Jha and our team.
              </p>
            </div>

            <a
              href="/#book"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-primary hover:bg-primary/95 text-primary-foreground py-3 px-5 text-xs font-bold uppercase tracking-wider transition-all"
            >
              Book Doctor Consultation (₹499)
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
