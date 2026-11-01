import React, { useState, useEffect } from "react";
import { Zap, ShoppingBag, Truck } from "lucide-react";
import { HOMECARE_KIT_CONFIG } from "@/data/homecare-kit";

interface MobileStickyBarProps {
  onBuyNow: () => void;
  onOpenCart: () => void;
  cartCount: number;
}

export function MobileStickyBar({ onBuyNow, onOpenCart, cartCount }: MobileStickyBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past 400px
      if (window.scrollY > 400) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <aside
      aria-label="Quick order action"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-md border-t border-border p-3 shadow-2xl safe-area-inset-bottom"
    >
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenCart}
            className="relative h-11 w-11 rounded-2xl bg-secondary border border-border flex items-center justify-center text-foreground shrink-0"
            aria-label="Open Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-emerald-600 text-white text-[0.68rem] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-foreground">
                ₹{HOMECARE_KIT_CONFIG.sellingPrice}
              </span>
              <span className="text-xs text-muted-foreground line-through">
                ₹{HOMECARE_KIT_CONFIG.mrp}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[0.65rem] text-emerald-600 dark:text-emerald-400 font-semibold">
              <Truck className="h-3 w-3" />
              <span>Free Express Delivery</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onBuyNow}
          className="press focus-gold flex-1 max-w-[180px] inline-flex items-center justify-center gap-1.5 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground py-2.5 px-4 text-xs font-bold uppercase tracking-wider shadow-md"
        >
          <Zap className="h-3.5 w-3.5 fill-current" />
          <span>Buy Kit Now</span>
        </button>
      </div>
    </aside>
  );
}
