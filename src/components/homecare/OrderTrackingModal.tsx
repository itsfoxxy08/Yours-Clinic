import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  AlertCircle,
  MapPin,
  Calendar,
  Building,
} from "lucide-react";
import { trackOrderPublic, type MedicineOrder } from "@/lib/order-service";
import { toast } from "sonner";

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
}

export function OrderTrackingModal({
  isOpen,
  onClose,
  initialOrderId = "",
}: OrderTrackingModalProps) {
  const [searchQuery, setSearchQuery] = useState(initialOrderId);
  const [orders, setOrders] = useState<MedicineOrder[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(
    async (queryToSearch = searchQuery) => {
      if (!queryToSearch.trim()) {
        toast.error("Please enter an Order ID (e.g. YC-HCK-XXXX) or Phone Number.");
        return;
      }

      setIsLoading(true);
      setHasSearched(true);

      try {
        const results = await trackOrderPublic(queryToSearch.trim());
        setOrders(results);
        if (results.length === 0) {
          toast.info("No orders found matching that query.");
        }
      } catch {
        toast.error("Error retrieving order tracking details.");
      } finally {
        setIsLoading(false);
      }
    },
    [searchQuery],
  );

  useEffect(() => {
    if (isOpen && initialOrderId) {
      setSearchQuery(initialOrderId);
      handleSearch(initialOrderId);
    }
  }, [isOpen, initialOrderId, handleSearch]);

  const getStepProgress = (status: string) => {
    switch (status) {
      case "Pending":
        return 1;
      case "Processing":
        return 2;
      case "Dispatched":
        return 3;
      case "Out for Delivery":
        return 4;
      case "Delivered":
        return 5;
      default:
        return 1;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-medium text-foreground">
                Track HomeCare Kit Order
              </h3>
              <p className="text-xs text-muted-foreground">
                Check real-time dispensary and courier transit status
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 sm:p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex gap-2 mb-6"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. YC-HCK-1234) or 10-digit Phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="press focus-gold px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
            >
              {isLoading ? "Searching..." : "Track"}
            </button>
          </form>

          {/* Results Area */}
          {hasSearched && orders && orders.length === 0 && (
            <div className="text-center py-10 rounded-2xl border border-dashed border-border bg-secondary/20">
              <Package className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <h4 className="font-semibold text-foreground text-sm">No orders found</h4>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-1">
                Please check your Order ID or phone number. Orders placed within the last 5 minutes
                are currently syncing.
              </p>
            </div>
          )}

          {orders && orders.length > 0 && (
            <div className="space-y-6">
              {orders.map((order) => {
                const step = getStepProgress(order.status);
                return (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-6"
                  >
                    {/* Header: ID & Status */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/70">
                      <div>
                        <span className="text-[0.68rem] font-bold uppercase tracking-wider text-muted-foreground block">
                          Order Number
                        </span>
                        <span className="font-mono text-base font-bold text-foreground">
                          {order.order_id}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[0.68rem] font-bold uppercase tracking-wider text-muted-foreground block">
                          Current Status
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>{order.status}</span>
                        </span>
                      </div>
                    </div>

                    {/* Step-by-Step Progress Visual */}
                    <div>
                      <div className="grid grid-cols-4 gap-2 text-center mb-2">
                        <div className="flex flex-col items-center">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                              step >= 1
                                ? "bg-emerald-600 text-white"
                                : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            1
                          </div>
                          <span className="text-[0.68rem] font-semibold text-foreground leading-tight">
                            Placed
                          </span>
                        </div>

                        <div className="flex flex-col items-center">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                              step >= 2
                                ? "bg-emerald-600 text-white"
                                : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            2
                          </div>
                          <span className="text-[0.68rem] font-semibold text-foreground leading-tight">
                            Prepared
                          </span>
                        </div>

                        <div className="flex flex-col items-center">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                              step >= 3
                                ? "bg-emerald-600 text-white"
                                : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            3
                          </div>
                          <span className="text-[0.68rem] font-semibold text-foreground leading-tight">
                            Dispatched
                          </span>
                        </div>

                        <div className="flex flex-col items-center">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                              step >= 5
                                ? "bg-emerald-600 text-white"
                                : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            4
                          </div>
                          <span className="text-[0.68rem] font-semibold text-foreground leading-tight">
                            Delivered
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar Line */}
                      <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full transition-all duration-300"
                          style={{ width: `${(step / 5) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Order Information Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-secondary/30 p-4 rounded-xl border border-border/60">
                      <div>
                        <span className="text-muted-foreground block">Patient Name:</span>
                        <span className="font-semibold text-foreground">{order.patient_name}</span>
                      </div>

                      <div>
                        <span className="text-muted-foreground block">Delivery Address:</span>
                        <span className="font-semibold text-foreground line-clamp-2">
                          {order.address}
                        </span>
                      </div>

                      <div>
                        <span className="text-muted-foreground block">Courier Partner:</span>
                        <span className="font-semibold text-foreground">
                          {order.courier_name || "BlueDart Express / Delhivery"}
                        </span>
                      </div>

                      <div>
                        <span className="text-muted-foreground block">Estimated Delivery:</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {order.estimated_delivery || "2 – 4 Business Days"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
