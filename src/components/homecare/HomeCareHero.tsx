import React from "react";
import {
  ShieldCheck,
  Package,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Award,
  HeartHandshake,
  Layers,
} from "lucide-react";
import { HOMECARE_KIT_CONFIG } from "@/data/homecare-kit";

interface HomeCareHeroProps {
  onExploreKit: () => void;
  onWhatsIncluded: () => void;
  onBuyNow: () => void;
}

export function HomeCareHero({ onExploreKit, onWhatsIncluded, onBuyNow }: HomeCareHeroProps) {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-emerald-500/5 dark:bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-[400px] h-[350px] bg-primary/5 dark:bg-primary/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl xl:max-w-[1400px] px-5 sm:px-8 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-600/30 dark:border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-6 shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>INTRODUCING HOMECARE ESSENTIALS</span>
            </div>

            {/* Large Heading */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-foreground leading-[1.1] mb-6">
              Your Everyday <br className="hidden sm:inline" />
              <span className="italic text-primary font-normal">Wellness Kit.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground font-normal leading-relaxed max-w-2xl mb-8">
              A thoughtfully curated collection of homeopathic healthcare essentials for convenient
              access to commonly used products at home.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10">
              <button
                type="button"
                onClick={onExploreKit}
                className="press focus-gold inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/95 transition-all w-full sm:w-auto"
              >
                <span>Explore the Kit</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={onWhatsIncluded}
                className="press focus-gold inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card/80 hover:bg-accent px-6 py-3.5 text-sm font-semibold text-foreground transition-colors w-full sm:w-auto"
              >
                <span>What's Included?</span>
              </button>
            </div>

            {/* Key Assurance Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-border/70 w-full max-w-xl">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="text-xs">
                  <span className="font-semibold block text-foreground">Clinic Curated</span>
                  <span className="text-muted-foreground text-[0.7rem]">Accredited doctors</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Package className="h-4 w-4" />
                </div>
                <div className="text-xs">
                  <span className="font-semibold block text-foreground">15 Essentials</span>
                  <span className="text-muted-foreground text-[0.7rem]">+ Hardbound Guide</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
                <div className="h-8 w-8 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Award className="h-4 w-4" />
                </div>
                <div className="text-xs">
                  <span className="font-semibold block text-foreground">100% Sealed</span>
                  <span className="text-muted-foreground text-[0.7rem]">GMP Certified labs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Wellness Box Presentation */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Visual Kit Box & Elements Showcase */}
            <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-none">
              {/* Outer decorative card frame with soft glassmorphism */}
              <div className="relative rounded-3xl border border-border/80 bg-card/90 backdrop-blur-md p-6 sm:p-8 shadow-xl overflow-hidden group">
                {/* Subtle header tag inside the card */}
                <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                      Yours Clinic Curated Edition
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                    Ready to Dispatch
                  </span>
                </div>

                {/* 3D Representation of Kit Packaging & Bottles */}
                <div className="relative bg-gradient-to-b from-primary/5 via-primary/10 to-transparent dark:from-primary/20 dark:via-primary/10 rounded-2xl p-6 sm:p-8 border border-primary/15 flex flex-col items-center justify-center min-h-[300px]">
                  {/* Premium Box Graphic Illustration */}
                  <div className="w-full max-w-[340px] relative">
                    {/* Kit Box Representation */}
                    <div className="relative z-10 rounded-2xl bg-gradient-to-br from-[#092F50] to-[#051c31] text-white p-6 shadow-2xl border border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-7 w-7 rounded-lg bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center">
                          <Package className="h-4 w-4 text-emerald-400" />
                        </div>
                        <span className="text-[0.68rem] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                          Household Edition
                        </span>
                      </div>

                      <div className="mb-6">
                        <h3 className="font-serif text-xl tracking-tight text-white mb-0.5">
                          HomeCare Essentials
                        </h3>
                        <p className="text-[0.75rem] text-slate-300">
                          Complete 15-Remedy Homeopathic Family Kit
                        </p>
                      </div>

                      {/* Mock Remedies Inside the Kit Visual */}
                      <div className="grid grid-cols-5 gap-2 pt-3 border-t border-white/10">
                        {/* Amber Bottle 1 */}
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-10 rounded-t-sm rounded-b-md bg-amber-700/80 border border-amber-600/50 relative flex items-center justify-center shadow-xs">
                            <div className="w-3 h-2 bg-slate-900 rounded-t-sm absolute -top-1" />
                            <div className="w-4 h-5 bg-white/90 rounded-[1px] text-[0.45rem] text-slate-900 font-bold flex items-center justify-center">
                              30C
                            </div>
                          </div>
                          <span className="text-[0.6rem] text-slate-300 mt-1 font-mono">Dig.</span>
                        </div>

                        {/* Amber Bottle 2 */}
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-10 rounded-t-sm rounded-b-md bg-amber-700/80 border border-amber-600/50 relative flex items-center justify-center shadow-xs">
                            <div className="w-3 h-2 bg-slate-900 rounded-t-sm absolute -top-1" />
                            <div className="w-4 h-5 bg-white/90 rounded-[1px] text-[0.45rem] text-slate-900 font-bold flex items-center justify-center">
                              30C
                            </div>
                          </div>
                          <span className="text-[0.6rem] text-slate-300 mt-1 font-mono">Cold</span>
                        </div>

                        {/* Tablet Container */}
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-9 rounded-md bg-slate-200 border border-slate-300 relative flex items-center justify-center shadow-xs">
                            <div className="w-5 h-2 bg-emerald-600 rounded-t-sm absolute -top-1" />
                            <div className="w-4 h-4 bg-white rounded-[1px] text-[0.45rem] text-emerald-800 font-bold flex items-center justify-center">
                              6X
                            </div>
                          </div>
                          <span className="text-[0.6rem] text-slate-300 mt-1 font-mono">Bio</span>
                        </div>

                        {/* First Aid Tube */}
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-11 rounded-t-sm rounded-b-md bg-emerald-600/90 border border-emerald-500 relative flex items-center justify-center shadow-xs">
                            <div className="w-3 h-2 bg-white rounded-t-sm absolute -top-1" />
                            <div className="w-4 h-6 bg-white/95 rounded-[1px] text-[0.4rem] text-emerald-900 font-bold flex items-center justify-center text-center leading-none">
                              Gel
                            </div>
                          </div>
                          <span className="text-[0.6rem] text-slate-300 mt-1 font-mono">Aid</span>
                        </div>

                        {/* Amber Bottle 3 */}
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-10 rounded-t-sm rounded-b-md bg-amber-700/80 border border-amber-600/50 relative flex items-center justify-center shadow-xs">
                            <div className="w-3 h-2 bg-slate-900 rounded-t-sm absolute -top-1" />
                            <div className="w-4 h-5 bg-white/90 rounded-[1px] text-[0.45rem] text-slate-900 font-bold flex items-center justify-center">
                              30C
                            </div>
                          </div>
                          <span className="text-[0.6rem] text-slate-300 mt-1 font-mono">Care</span>
                        </div>
                      </div>
                    </div>

                    {/* Floating Doctor Guidebook Overlay */}
                    <div className="absolute -bottom-4 -right-4 bg-card border border-border/80 rounded-xl p-3 shadow-lg flex items-center gap-3 z-20">
                      <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Layers className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-foreground">
                          Doctor Usage Handbook
                        </div>
                        <div className="text-[0.68rem] text-muted-foreground">
                          Clear household indications & storage
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Quick Action & Pricing inside Hero Card */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/60">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-foreground">
                        ₹{HOMECARE_KIT_CONFIG.sellingPrice}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{HOMECARE_KIT_CONFIG.mrp}
                      </span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        ({HOMECARE_KIT_CONFIG.discountPercentage}% OFF)
                      </span>
                    </div>
                    <div className="text-[0.72rem] text-muted-foreground mt-0.5">
                      All 15 Remedies + Handbook + Free Delivery
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onBuyNow}
                    className="press focus-gold w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
                  >
                    <span>Order Kit Now</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
