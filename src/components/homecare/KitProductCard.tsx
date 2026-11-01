import React, { useState } from "react";
import {
  Package,
  Plus,
  Minus,
  ShoppingCart,
  Zap,
  CheckCircle2,
  Truck,
  ShieldCheck,
  Star,
  Info,
  Clock,
  Sparkles,
} from "lucide-react";
import { HOMECARE_KIT_CONFIG, KIT_CATEGORIES } from "@/data/homecare-kit";

interface KitProductCardProps {
  onAddToCart: (quantity: number) => void;
  onBuyNow: (quantity: number) => void;
  onInspectDetails: () => void;
}

export function KitProductCard({ onAddToCart, onBuyNow, onInspectDetails }: KitProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [stockDemoState, setStockDemoState] = useState(true);

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < 10) setQuantity(quantity + 1);
  };

  return (
    <section id="kit-overview" className="py-12 lg:py-20 bg-card/40 border-y border-border/50">
      <div className="mx-auto max-w-7xl xl:max-w-[1400px] px-5 sm:px-8 xl:px-12">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400">
            The Complete Household Wellness Box
          </span>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-foreground">
            Everything You Need, Thoughtfully Curated.
          </h2>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            One ready-to-use household kit containing 15 standardized homeopathic formulations,
            organized by health category to handle everyday mild ailments safely at home.
          </p>
        </div>

        {/* Large Prominent Product Card */}
        <div className="max-w-5xl mx-auto rounded-3xl border border-border/80 bg-card shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left Product Display: Visual Presentation */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#092F50]/90 to-[#031526] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
              {/* Decorative accent glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-semibold text-emerald-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    Doctor Formulated
                  </span>
                  <span className="text-xs font-mono text-slate-300">15 Standard Formulations</span>
                </div>

                {/* Main Product Box Illustration */}
                <div className="my-8 flex flex-col items-center text-center">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl bg-gradient-to-tr from-white/10 to-white/5 border border-white/20 p-6 flex flex-col items-center justify-center shadow-2xl relative">
                    <div className="h-16 w-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mb-4">
                      <Package className="h-9 w-9 text-emerald-300" />
                    </div>
                    <span className="font-serif text-lg font-medium text-white tracking-wide">
                      HomeCare Essentials
                    </span>
                    <span className="text-[0.72rem] text-slate-300 mt-1 uppercase tracking-widest font-mono">
                      Yours Clinic Dispensary
                    </span>

                    {/* Badge on corner */}
                    <div className="absolute -top-3 -right-3 bg-emerald-500 text-slate-950 font-extrabold text-[0.65rem] px-2.5 py-1 rounded-full uppercase shadow-md">
                      24% OFF
                    </div>
                  </div>
                </div>
              </div>

              {/* What comes inside bullet summary */}
              <div className="space-y-2 border-t border-white/10 pt-6">
                <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                  Kit Components Included:
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>15 Sealed Standard Formulations (Dilutions & Biochemic Salts)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Dr. Sumit Jha's Hardbound Clinical Household Guidebook</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Shock-Proof Thermal Padded Medicine Travel Organizer</span>
                </div>
              </div>
            </div>

            {/* Right Product Details & Actions */}
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
              <div>
                {/* Title and Rating */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h3 className="font-serif text-2xl sm:text-3xl font-medium text-foreground">
                    {HOMECARE_KIT_CONFIG.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span>4.9 / 5.0 (Clinic Verified)</span>
                  </div>
                </div>

                <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium mb-4">
                  "{HOMECARE_KIT_CONFIG.tagline}"
                </p>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {HOMECARE_KIT_CONFIG.description}
                </p>

                {/* Categories Included Pills */}
                <div className="mb-6">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                    Covered Healthcare Categories:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {KIT_CATEGORIES.map((cat) => (
                      <span
                        key={cat.id}
                        className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full bg-secondary text-secondary-foreground border border-border/80"
                      >
                        {cat.title}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pricing & Stock Status */}
                <div className="rounded-2xl bg-secondary/60 border border-border/70 p-4 sm:p-5 mb-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <span className="text-xs uppercase font-semibold tracking-wider text-muted-foreground block mb-0.5">
                        Kit Selling Price
                      </span>
                      <div className="flex items-baseline gap-2.5">
                        <span className="text-3xl font-extrabold text-foreground">
                          ₹{HOMECARE_KIT_CONFIG.sellingPrice}
                        </span>
                        <span className="text-base text-muted-foreground line-through">
                          ₹{HOMECARE_KIT_CONFIG.mrp}
                        </span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-md">
                          Save ₹{HOMECARE_KIT_CONFIG.mrp - HOMECARE_KIT_CONFIG.sellingPrice} (24%)
                        </span>
                      </div>
                      <span className="text-[0.7rem] text-muted-foreground">
                        Inclusive of all GST & taxes
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                        <span>
                          {stockDemoState
                            ? "In Stock (Dispatches within 24h)"
                            : "Currently Sold Out"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[0.72rem] text-muted-foreground mt-1 justify-end">
                        <Truck className="h-3.5 w-3.5 text-primary" />
                        <span>Free Pan-India Delivery</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    Quantity:
                  </span>
                  <div className="inline-flex items-center rounded-full border border-border bg-card p-1 shadow-xs">
                    <button
                      type="button"
                      onClick={handleDecrease}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-40 transition-colors"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-foreground">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={handleIncrease}
                      disabled={quantity >= 10}
                      aria-label="Increase quantity"
                      className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-40 transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Total:{" "}
                    <strong className="text-foreground">
                      ₹{HOMECARE_KIT_CONFIG.sellingPrice * quantity}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Action Buttons: Add to Cart & Buy Now */}
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => onAddToCart(quantity)}
                    disabled={!stockDemoState}
                    className="press focus-gold inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary px-5 py-3.5 text-sm font-bold tracking-wide transition-all disabled:opacity-50"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onBuyNow(quantity)}
                    disabled={!stockDemoState}
                    className="press focus-gold inline-flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground px-5 py-3.5 text-sm font-bold tracking-wide shadow-md transition-all disabled:opacity-50"
                  >
                    <Zap className="h-4 w-4 fill-current" />
                    <span>Buy Now</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/60">
                  <button
                    type="button"
                    onClick={onInspectDetails}
                    className="text-primary hover:underline font-semibold inline-flex items-center gap-1"
                  >
                    <Info className="h-3.5 w-3.5" />
                    <span>Inspect all 15 medicine names & details</span>
                  </button>
                  <span className="text-[0.7rem]">Standard HPI/GHP Formulations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
