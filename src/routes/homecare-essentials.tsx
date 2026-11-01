import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { abs } from "@/lib/seo";
import { toast } from "sonner";
import { ShoppingBag, Truck, ShieldCheck, HeartHandshake, PhoneCall } from "lucide-react";

import { HOMECARE_KIT_CONFIG } from "@/data/homecare-kit";
import { HomeCareHero } from "@/components/homecare/HomeCareHero";
import { KitProductCard } from "@/components/homecare/KitProductCard";
import { KitContents } from "@/components/homecare/KitContents";
import { ProductDetails } from "@/components/homecare/ProductDetails";
import { PricingCard } from "@/components/homecare/PricingCard";
import { TrustSection } from "@/components/homecare/TrustSection";
import { FAQSection } from "@/components/homecare/FAQSection";
import { MedicalDisclaimer } from "@/components/homecare/MedicalDisclaimer";
import { ShoppingCartDrawer } from "@/components/homecare/ShoppingCartDrawer";
import { CheckoutModal } from "@/components/homecare/CheckoutModal";
import { OrderTrackingModal } from "@/components/homecare/OrderTrackingModal";
import { MobileStickyBar } from "@/components/homecare/MobileStickyBar";

const title = "HomeCare Essentials Kit — Everyday Homeopathic Wellness | Yours Clinic";
const description =
  "A thoughtfully curated collection of 15 standard homeopathic healthcare essentials for convenient household access. Curated under the clinical guidance of Yours Clinic accredited practitioners.";

export const Route = createFileRoute("/homecare-essentials")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "product" },
      { property: "og:url", content: abs("/homecare-essentials") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: abs("/homecare-essentials") }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "HomeCare Essentials Kit",
          image: abs("/favicon.png"),
          description,
          brand: {
            "@type": "Brand",
            name: "Yours Clinic",
          },
          offers: {
            "@type": "Offer",
            url: abs("/homecare-essentials"),
            priceCurrency: "INR",
            price: HOMECARE_KIT_CONFIG.sellingPrice,
            priceValidUntil: "2027-12-31",
            availability: "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "84",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          name: "HomeCare Essentials Kit Overview",
          description,
          specialty: "Homeopathic",
        }),
      },
    ],
  }),
  component: HomeCareEssentialsPage,
});

function HomeCareEssentialsPage() {
  const [cartQuantity, setCartQuantity] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState("");

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleAddToCart = (qty: number) => {
    setCartQuantity(qty);
    setIsCartOpen(true);
    toast.success(`HomeCare Essentials Kit (${qty} box${qty > 1 ? "es" : ""}) added to your cart.`);
  };

  const handleBuyNow = (qty = cartQuantity) => {
    setCartQuantity(Math.max(1, qty));
    setIsCheckoutOpen(true);
  };

  const handleOpenTracking = (orderId?: string) => {
    if (orderId) setTrackingOrderId(orderId);
    setIsTrackingOpen(true);
  };

  return (
    <div className="relative min-h-screen pb-16">
      {/* Top Floating Helper Ribbon: Cart & Tracking Shortcuts */}
      <div className="sticky top-[72px] md:top-[108px] z-30 bg-background/80 backdrop-blur-md border-b border-border/60 py-2.5 px-4">
        <div className="mx-auto max-w-7xl xl:max-w-[1400px] flex items-center justify-between text-xs">
          <div className="hidden sm:flex items-center gap-3 text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" />
              Direct Clinic Dispensary Fulfillment
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-primary" />
              Pan-India Free Express Shipping
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            <button
              type="button"
              onClick={() => handleOpenTracking()}
              className="press focus-gold inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 font-semibold text-muted-foreground hover:text-foreground transition-colors shadow-2xs"
            >
              <Truck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span>Track Order</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="press focus-gold inline-flex items-center gap-1.5 rounded-full border border-emerald-600/30 bg-emerald-500/10 px-3 py-1.5 font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition-colors shadow-2xs"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Cart ({cartQuantity})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. Hero Section */}
      <HomeCareHero
        onExploreKit={() => scrollToSection("kit-overview")}
        onWhatsIncluded={() => scrollToSection("kit-contents")}
        onBuyNow={() => handleBuyNow()}
      />

      {/* 2. Product Overview Section */}
      <KitProductCard
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onInspectDetails={() => scrollToSection("product-details")}
      />

      {/* 3. Interactive What's Inside the Kit Categories */}
      <KitContents onSelectProductForInspection={() => scrollToSection("product-details")} />

      {/* 4. Product Details & Full Transparency Monograph */}
      <ProductDetails />

      {/* 5. Pricing Section */}
      <PricingCard onOrderNow={() => handleBuyNow()} />

      {/* 6. Trust & Credibility Section */}
      <TrustSection />

      {/* 7. Frequently Asked Questions Accordion */}
      <FAQSection />

      {/* 8. Medical & Regulatory Disclaimer */}
      <MedicalDisclaimer />

      {/* 9. Shopping Cart Drawer */}
      <ShoppingCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        quantity={cartQuantity}
        onUpdateQuantity={(qty) => setCartQuantity(qty)}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* 10. Multi-step Checkout Workflow Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        initialQuantity={cartQuantity}
        onTrackOrder={(orderId) => handleOpenTracking(orderId)}
      />

      {/* 11. Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        initialOrderId={trackingOrderId}
      />

      {/* 12. Mobile Sticky Quick Action Bar */}
      <MobileStickyBar
        onBuyNow={() => handleBuyNow()}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cartQuantity}
      />
    </div>
  );
}
