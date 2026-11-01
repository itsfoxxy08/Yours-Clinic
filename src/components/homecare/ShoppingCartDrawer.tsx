import React from "react";
import {
  X,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Truck,
  ArrowRight,
  ShieldCheck,
  Package,
} from "lucide-react";
import { HOMECARE_KIT_CONFIG } from "@/data/homecare-kit";

interface ShoppingCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  quantity: number;
  onUpdateQuantity: (qty: number) => void;
  onProceedToCheckout: () => void;
}

export function ShoppingCartDrawer({
  isOpen,
  onClose,
  quantity,
  onUpdateQuantity,
  onProceedToCheckout,
}: ShoppingCartDrawerProps) {
  if (!isOpen) return null;

  const itemPrice = HOMECARE_KIT_CONFIG.sellingPrice;
  const subtotal = itemPrice * quantity;
  const originalTotal = HOMECARE_KIT_CONFIG.mrp * quantity;
  const totalSavings = originalTotal - subtotal;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-card border-l border-border shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-border/70 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <ShoppingCart className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-medium text-foreground">Your Health Cart</h3>
                <span className="text-xs text-muted-foreground">
                  {quantity > 0 ? `${quantity} item selected` : "Cart is empty"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close cart"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Cart Contents */}
          <div className="flex-1 overflow-y-auto p-6">
            {quantity === 0 ? (
              <div className="text-center py-16">
                <div className="h-16 w-16 rounded-full bg-secondary text-muted-foreground flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-8 w-8" />
                </div>
                <h4 className="font-serif text-lg text-foreground mb-1">Your cart is empty</h4>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto mb-6">
                  Add the HomeCare Essentials Kit to start convenient household wellness care.
                </p>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(1)}
                  className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-xs font-bold uppercase tracking-wider"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Kit to Cart (₹{itemPrice})</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Free Shipping Progress Notification */}
                <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3.5 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Truck className="h-4 w-4" />
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold text-emerald-700 dark:text-emerald-300 block">
                      Pan-India Free Express Shipping
                    </span>
                    <span className="text-muted-foreground text-[0.7rem]">
                      Unlocked for this order · No delivery fee
                    </span>
                  </div>
                </div>

                {/* Line Item Card */}
                <div className="rounded-2xl border border-border/80 bg-secondary/30 p-4 relative">
                  <div className="flex gap-4">
                    {/* Kit Thumbnail */}
                    <div className="h-20 w-20 rounded-xl bg-[#092F50] text-white flex flex-col items-center justify-center shrink-0 p-2 text-center shadow-xs">
                      <Package className="h-6 w-6 text-emerald-400 mb-1" />
                      <span className="text-[0.55rem] font-bold uppercase tracking-wider text-slate-200 leading-tight">
                        HomeCare Box
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-serif text-base font-medium text-foreground leading-snug">
                            {HOMECARE_KIT_CONFIG.title}
                          </h4>
                          <span className="text-[0.68rem] text-muted-foreground block mt-0.5">
                            15 Formulations + Hardbound Guide
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(0)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Pricing and Quantity adjustment */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-1.5 rounded-full border border-border bg-card px-2 py-1">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(Math.max(1, quantity - 1))}
                            className="h-6 w-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-foreground">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(Math.min(10, quantity + 1))}
                            className="h-6 w-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-bold text-foreground block">
                            ₹{subtotal}
                          </span>
                          <span className="text-[0.68rem] text-muted-foreground line-through">
                            ₹{originalTotal}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assurance pills */}
                <div className="space-y-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Clinic-verified authentic sealed medicines</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-3.5 w-3.5 text-primary" />
                    <span>Includes 15-day complimentary doctor follow-up support</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {quantity > 0 && (
            <div className="p-6 border-t border-border/80 bg-card/80 backdrop-blur-sm space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>
                    Subtotal ({quantity} kit{quantity > 1 ? "s" : ""})
                  </span>
                  <span>₹{originalTotal}</span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Direct Clinic Discount (24%)</span>
                  <span>-₹{totalSavings}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping & Handling</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-base font-bold text-foreground pt-2 border-t border-border/60">
                  <span>Total Amount</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="text-[0.68rem] text-muted-foreground text-right">
                  Inclusive of all taxes
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="press focus-gold w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground py-3.5 text-sm font-bold shadow-md transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
