import React, { useState } from "react";
import {
  Flame,
  Snowflake,
  Bandage,
  Sparkles,
  HeartPulse,
  Check,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  Info,
} from "lucide-react";
import { KIT_CATEGORIES, KIT_PRODUCTS, type KitCategory } from "@/data/homecare-kit";

interface KitContentsProps {
  onSelectProductForInspection?: (productId: string) => void;
}

export function KitContents({ onSelectProductForInspection }: KitContentsProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>("digestive");

  const activeCategory = KIT_CATEGORIES.find((c) => c.id === activeCategoryId) || KIT_CATEGORIES[0];

  const categoryProducts = KIT_PRODUCTS.filter((p) => p.categoryId === activeCategoryId);

  const getCategoryIcon = (iconName: string, className = "h-5 w-5") => {
    switch (iconName) {
      case "Flame":
        return <Flame className={className} />;
      case "Snowflake":
        return <Snowflake className={className} />;
      case "Bandage":
        return <Bandage className={className} />;
      case "Sparkles":
        return <Sparkles className={className} />;
      case "HeartPulse":
      default:
        return <HeartPulse className={className} />;
    }
  };

  return (
    <section id="kit-contents" className="py-16 lg:py-24 relative overflow-hidden">
      <div className="mx-auto max-w-7xl xl:max-w-[1400px] px-5 sm:px-8 xl:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary mb-3">
            <span>Interactive Kit Breakdown</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-foreground">
            What's Inside the Kit?
          </h2>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
            The kit is systematically organized into 5 health categories with 15 full-size standard
            formulations. Select any category below to preview its included products.
          </p>
        </div>

        {/* Categories Tabs / Grid Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mb-8">
          {KIT_CATEGORIES.map((category) => {
            const isSelected = category.id === activeCategoryId;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategoryId(category.id)}
                className={`press focus-gold text-left rounded-2xl p-4 sm:p-5 border transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? "border-emerald-600/60 dark:border-emerald-500/70 bg-card shadow-md ring-2 ring-emerald-500/20"
                    : "border-border/80 bg-card/60 hover:bg-card hover:border-border"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected ? "bg-emerald-600 text-white" : "bg-secondary text-foreground"
                      }`}
                    >
                      {getCategoryIcon(category.iconName, "h-5 w-5")}
                    </div>
                    <span
                      className={`text-[0.68rem] font-bold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {category.badge}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-foreground mb-1 leading-snug">
                    {category.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {category.shortDescription}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                  <span
                    className={`font-semibold ${
                      isSelected
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    {isSelected ? "Currently Viewing" : "View Products"}
                  </span>
                  <ChevronRight
                    className={`h-3.5 w-3.5 transition-transform ${
                      isSelected
                        ? "text-emerald-600 dark:text-emerald-400 translate-x-0.5"
                        : "text-muted-foreground"
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Category Expanded Products Showcase */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 lg:p-10 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/60 mb-8">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                {getCategoryIcon(activeCategory.iconName, "h-6 w-6")}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-2xl font-medium text-foreground">
                    {activeCategory.title}
                  </h3>
                  <span className="text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full">
                    {activeCategory.productCount} Included
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  {activeCategory.shortDescription}
                </p>
              </div>
            </div>

            <a
              href="#product-details"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline uppercase tracking-wider"
            >
              <span>See Full Monograph & Expiry Data</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Product Cards for this Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categoryProducts.map((product, idx) => (
              <div
                key={product.id}
                className="group rounded-2xl border border-border/70 bg-secondary/30 hover:bg-secondary/50 p-5 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header & Form Tag */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[0.68rem] font-bold uppercase tracking-wider text-muted-foreground bg-card px-2.5 py-1 rounded-md border border-border/60">
                      Item #{idx + 1} · {product.form}
                    </span>
                    <span className="text-[0.68rem] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      Qty: {product.quantityIncluded}
                    </span>
                  </div>

                  <h4 className="font-serif text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                    {product.name}
                  </h4>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 mb-3">
                    <span>{product.manufacturer}</span>
                    <span>•</span>
                    <span className="font-mono">{product.packSize}</span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    {product.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                  <span className="text-[0.7rem] font-mono text-muted-foreground">
                    MRP: ₹{product.estimatedMrp}
                  </span>
                  <a
                    href="#product-details"
                    className="font-semibold text-primary hover:underline inline-flex items-center gap-0.5 text-[0.75rem]"
                  >
                    <span>View Specifications</span>
                    <ChevronRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Clinical & Regulatory Assurance Banner inside the Category Viewer */}
          <div className="mt-8 rounded-2xl bg-primary/5 border border-primary/15 p-4 sm:p-5 flex items-start gap-3.5">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed text-muted-foreground">
              <strong className="text-foreground font-semibold">Clinical Transparency Note:</strong>{" "}
              Product names, potencies, and manufacturers above represent the actual, genuine sealed
              medicines packed in the kit. Homeopathic medicines operate under individual symptom
              matching. This kit is curated for general household emergency readiness and
              self-limiting symptoms, not as an individualized cure or treatment guarantee for
              complex diseases. Qualified consultation with Yours Clinic clinicians is readily
              available.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
