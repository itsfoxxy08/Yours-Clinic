import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Calendar,
  Building,
  Package,
  Layers,
  Sparkles,
  AlertCircle,
  FileCheck2,
} from "lucide-react";
import { KIT_PRODUCTS, KIT_CATEGORIES, type KitProductItem } from "@/data/homecare-kit";

export function ProductDetails() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    KIT_PRODUCTS.forEach((p) => {
      allExpanded[p.id] = true;
    });
    setExpandedItems(allExpanded);
  };

  const collapseAll = () => {
    setExpandedItems({});
  };

  const filteredProducts = useMemo(() => {
    return KIT_PRODUCTS.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.ingredients.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === "all" || product.categoryId === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <section id="product-details" className="py-16 lg:py-24 bg-card/30 border-t border-border/50">
      <div className="mx-auto max-w-7xl xl:max-w-[1400px] px-5 sm:px-8 xl:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3">
              <FileCheck2 className="h-3.5 w-3.5" />
              <span>Full Medical Transparency</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-foreground">
              Inspect Every Single Remedy.
            </h2>
            <p className="mt-2 text-base text-muted-foreground max-w-2xl">
              Examine the official monographs, GMP-certified manufacturers, pack sizes, shelf-life,
              and safety instructions for all 15 included formulations before purchasing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={expandAll}
              className="text-xs font-semibold text-primary hover:underline px-3 py-1.5 rounded-lg border border-border bg-card"
            >
              Expand All (15)
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg border border-border bg-card"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by remedy name, manufacturer, or ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              All Remedies (15)
            </button>
            {KIT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.title} ({cat.productCount})
              </button>
            ))}
          </div>
        </div>

        {/* Products List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-dashed border-border bg-card/50">
            <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h4 className="font-semibold text-foreground">No remedies match your search</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Try searching for "Nux Vomica", "Arnica", or clear the category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 text-xs font-bold text-primary hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => {
              const isExpanded = !!expandedItems[product.id];
              return (
                <div
                  key={product.id}
                  className={`rounded-2xl border transition-all duration-200 ${
                    isExpanded
                      ? "border-primary/40 bg-card shadow-md"
                      : "border-border/80 bg-card/70 hover:bg-card hover:border-border"
                  }`}
                >
                  {/* Summary Header Row */}
                  <div
                    onClick={() => toggleExpand(product.id)}
                    className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start sm:items-center gap-4">
                      {/* Form Icon Badge */}
                      <div className="h-11 w-11 rounded-xl bg-secondary border border-border flex items-center justify-center shrink-0">
                        <Package className="h-5 w-5 text-primary" />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="font-serif text-lg font-medium text-foreground">
                            {product.name}
                          </h4>
                          <span className="text-[0.68rem] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                            {product.category}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Building className="h-3.5 w-3.5" />
                            {product.manufacturer}
                          </span>
                          <span>•</span>
                          <span>Pack Size: {product.packSize}</span>
                          <span>•</span>
                          <span>Form: {product.form}</span>
                          <span>•</span>
                          <span className="font-semibold text-foreground">
                            Qty in Kit: {product.quantityIncluded}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-5">
                      <div className="text-right">
                        <span className="text-xs text-muted-foreground block">Individual MRP</span>
                        <span className="font-mono font-bold text-foreground text-sm">
                          ₹{product.estimatedMrp}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shrink-0"
                        aria-label={
                          isExpanded ? "Collapse product details" : "Expand product details"
                        }
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Detailed Accordion Content */}
                  {isExpanded && (
                    <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-2 border-t border-border/60">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="rounded-xl bg-secondary/50 p-3.5 border border-border/50">
                          <span className="text-[0.7rem] uppercase font-bold text-muted-foreground block mb-1">
                            Pharmacopoeia Standard
                          </span>
                          <span className="text-xs font-semibold text-foreground">
                            {product.pharmacopoeia}
                          </span>
                        </div>

                        <div className="rounded-xl bg-secondary/50 p-3.5 border border-border/50">
                          <span className="text-[0.7rem] uppercase font-bold text-muted-foreground block mb-1">
                            Shelf Life & Expiry
                          </span>
                          <span className="text-xs font-semibold text-foreground">
                            {product.expiryInfo}
                          </span>
                        </div>

                        <div className="rounded-xl bg-secondary/50 p-3.5 border border-border/50">
                          <span className="text-[0.7rem] uppercase font-bold text-muted-foreground block mb-1">
                            Standard Potency
                          </span>
                          <span className="text-xs font-semibold text-foreground">
                            {product.standardPotency || "Standard OTC"}
                          </span>
                        </div>

                        <div className="rounded-xl bg-secondary/50 p-3.5 border border-border/50">
                          <span className="text-[0.7rem] uppercase font-bold text-muted-foreground block mb-1">
                            Storage Guidelines
                          </span>
                          <span className="text-xs font-semibold text-foreground">
                            {product.storage}
                          </span>
                        </div>
                      </div>

                      {/* Monograph Description & Ingredients */}
                      <div className="space-y-3">
                        <div className="text-xs text-muted-foreground">
                          <strong className="text-foreground font-semibold">
                            Household Wellness Purpose:
                          </strong>{" "}
                          {product.description}
                        </div>

                        <div className="text-xs text-muted-foreground">
                          <strong className="text-foreground font-semibold">
                            Standard Composition:
                          </strong>{" "}
                          {product.ingredients}
                        </div>

                        <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
                          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                          <div>
                            <span className="font-semibold">Safety & Direction:</span>{" "}
                            {product.safetyNote}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
