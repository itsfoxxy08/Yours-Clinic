import React from "react";
import {
  Check,
  ShieldCheck,
  Truck,
  Package,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  Lock,
} from "lucide-react";
import { HOMECARE_KIT_CONFIG } from "@/data/homecare-kit";

interface PricingCardProps {
  onOrderNow: () => void;
}

export function PricingCard({ onOrderNow }: PricingCardProps) {
  return (
    <section id="pricing" className="py-16 lg:py-24 relative overflow-hidden">
      {/* Background radial atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl xl:max-w-[1400px] px-5 sm:px-8 xl:px-12">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400">
            Transparent Single-Kit Pricing
          </span>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-foreground">
            Complete Protection for Your Family.
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            No recurring subscription or hidden fees. One comprehensive box containing everything
            you need for home wellness.
          </p>
        </div>

        {/* Premium Pricing Card Container */}
        <div className="max-w-2xl mx-auto">
          <div className="rounded-3xl border-2 border-emerald-600/30 dark:border-emerald-500/40 bg-card shadow-2xl p-7 sm:p-10 relative overflow-hidden">
            {/* Top Badge Ribbon */}
            <div className="flex items-center justify-between pb-6 border-b border-border/70 mb-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Edition
                </span>
                <h3 className="font-serif text-2xl font-medium text-foreground">
                  HomeCare Essentials Box
                </h3>
              </div>
              <div className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Save {HOMECARE_KIT_CONFIG.discountPercentage}%</span>
              </div>
            </div>

            {/* Price Header */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-5xl sm:text-6xl font-bold tracking-tight text-foreground">
                  ₹{HOMECARE_KIT_CONFIG.sellingPrice}
                </span>
                <div className="flex flex-col">
                  <span className="text-base text-muted-foreground line-through">
                    MRP ₹{HOMECARE_KIT_CONFIG.mrp}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Inclusive of all taxes
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Covers all {HOMECARE_KIT_CONFIG.totalProductsCount} standard sealed homeopathic
                formulations + Guidebook + Organizer Case.
              </p>
            </div>

            {/* What's Included Checklist */}
            <div className="space-y-3.5 py-6 border-y border-border/70 mb-8">
              {HOMECARE_KIT_CONFIG.boxIncludes.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm text-foreground">
                  <div className="h-5 w-5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="leading-snug">{item}</span>
                </div>
              ))}
            </div>

            {/* Shipping & Delivery Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl bg-secondary/50 p-4 border border-border/60 mb-8 text-xs">
              <div className="flex items-center gap-2.5">
                <Truck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <span className="font-semibold block text-foreground">
                    Pan-India Free Shipping
                  </span>
                  <span className="text-muted-foreground text-[0.7rem]">
                    No extra courier charges
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <div>
                  <span className="font-semibold block text-foreground">Estimated Delivery</span>
                  <span className="text-muted-foreground text-[0.7rem]">
                    {HOMECARE_KIT_CONFIG.shipping.estimatedDays}
                  </span>
                </div>
              </div>
            </div>

            {/* Prominent CTA */}
            <div className="text-center">
              <button
                type="button"
                onClick={onOrderNow}
                className="press focus-gold w-full inline-flex items-center justify-center gap-2.5 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground py-4 px-8 text-base font-bold shadow-lg transition-all"
              >
                <span>Get Your HomeCare Kit</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="mt-3 text-xs sm:text-sm text-muted-foreground">
                Conveniently order your household homeopathic essentials in one place.
              </p>
            </div>

            {/* Security note */}
            <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-border/50 text-[0.72rem] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Lock className="h-3 w-3" />
                100% Encrypted Checkout
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                Direct Clinic Fulfillment
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
