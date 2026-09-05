import React, { useState } from "react";
import {
  X,
  Package,
  Search,
  CheckCircle2,
  Truck,
  Clock,
  AlertCircle,
  Pill,
  Send,
  Sparkles,
  MapPin,
  Phone,
  User,
  FileText,
  Copy,
} from "lucide-react";
import {
  placeMedicineOrder,
  trackOrderPublic,
  type MedicineOrder,
} from "@/lib/order-service";
import { formatDate12Hour } from "@/lib/patient-service";
import { toast } from "sonner";

interface OrderMedicinesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "order" | "track";
}

const MEDICINE_PACKAGES = [
  {
    id: "custom",
    title: "Custom Prescribed Homeopathic Remedy",
    desc: "Formulated specifically according to your Yours Clinic doctor consultation.",
    price: 499,
  },
  {
    id: "immunity",
    title: "Immunity & Vitality Booster Pack",
    desc: "Natural defense kit containing Echinacea, Tinospora & Bio-Chemic combinations.",
    price: 650,
  },
  {
    id: "skin",
    title: "Skin Care & Eczema Natural Relief",
    desc: "Soothing topical spray & internal homeopathic drops for chronic skin concerns.",
    price: 799,
  },
  {
    id: "digestive",
    title: "Digestive & Acidity Care Kit",
    desc: "Gentle herbal syrup & tablets for hyperacidity, bloating, and IBS support.",
    price: 550,
  },
  {
    id: "pain",
    title: "Joint & Arthritis Pain Relief Combination",
    desc: "Rhus Tox & Arnica formulation for joint stiffness and backache relief.",
    price: 890,
  },
];

export function OrderMedicinesModal({
  isOpen,
  onClose,
  initialTab = "order",
}: OrderMedicinesModalProps) {
  const [activeTab, setActiveTab] = useState<"order" | "track">(initialTab);

  // Order Form State
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(MEDICINE_PACKAGES[0]?.id || "custom");
  const [prescriptionNote, setPrescriptionNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<MedicineOrder | null>(null);

  // Tracking Search State
  const [trackQuery, setTrackQuery] = useState("");
  const [trackingResults, setTrackingResults] = useState<MedicineOrder[] | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  if (!isOpen) return null;

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !phone.trim() || !address.trim()) {
      toast.error("Please fill in required fields (Name, Phone, Delivery Address)");
      return;
    }

    setSubmitting(true);
    const chosenPkg = MEDICINE_PACKAGES.find((p) => p.id === selectedPackage);

    const res = await placeMedicineOrder({
      patient_name: patientName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      medicines: chosenPkg?.title || "Custom Homeopathic Medicine",
      prescription_note: prescriptionNote.trim(),
      total_amount: chosenPkg?.price || 499,
    });

    setSubmitting(false);

    if (res.success && res.order) {
      setConfirmedOrder(res.order);
      toast.success("🎉 Medicine order submitted successfully!");
    } else {
      toast.error("Failed to place order. Please try again.");
    }
  };

  const handleTrackSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackQuery.trim()) {
      toast.error("Please enter Order ID or Mobile Number");
      return;
    }

    setTrackingLoading(true);
    const res = await trackOrderPublic(trackQuery);
    setTrackingLoading(false);

    if (res.success && res.orders.length > 0) {
      setTrackingResults(res.orders);
      toast.success(res.message);
    } else {
      setTrackingResults([]);
      toast.error(res.message);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Order ID copied to clipboard!");
  };

  const getStatusBadge = (status: MedicineOrder["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-amber-500/15 text-amber-500 border-amber-500/30";
      case "Processing":
        return "bg-blue-500/15 text-blue-500 border-blue-500/30";
      case "Dispatched":
        return "bg-purple-500/15 text-purple-500 border-purple-500/30";
      case "Out for Delivery":
        return "bg-sky-500/15 text-sky-500 border-sky-500/30";
      case "Delivered":
        return "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
      case "Cancelled":
        return "bg-rose-500/15 text-rose-500 border-rose-500/30";
      default:
        return "bg-slate-500/15 text-slate-500 border-slate-500/30";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-card border border-gold/40 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gold/15 text-gold border border-gold/30">
              <Pill className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <span>Yours Clinic Pharmacy</span>
                <span className="rounded-full bg-gold/15 border border-gold/30 px-2.5 py-0.5 text-[0.65rem] font-bold text-gold uppercase">
                  Home Delivery
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Order genuine homeopathic medicines or track your existing order status
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-gold/40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Tabs (Order Medicines vs Track Order) */}
        <div className="flex border-b border-border bg-card px-6 pt-3">
          <button
            onClick={() => {
              setActiveTab("order");
              setConfirmedOrder(null);
            }}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === "order"
                ? "border-gold text-gold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Package className="h-4 w-4" />
            <span>Order Medicines</span>
          </button>

          <button
            onClick={() => setActiveTab("track")}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === "track"
                ? "border-gold text-gold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Truck className="h-4 w-4" />
            <span>Track Order Status</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "order" ? (
            confirmedOrder ? (
              /* Order Confirmation Screen */
              <div className="text-center py-6 px-4 space-y-5 animate-in zoom-in-95">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-foreground">
                    Order Submitted Successfully!
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                    Your medicine order has been received. Our clinic team will process and dispatch your prescription remedies shortly.
                  </p>
                </div>

                {/* Order ID Box */}
                <div className="mx-auto max-w-sm rounded-2xl bg-muted/60 border border-gold/40 p-4 space-y-2">
                  <span className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
                    Your Tracking Number / Order ID
                  </span>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl font-black text-gold tracking-wider">
                      {confirmedOrder.order_id}
                    </span>
                    <button
                      onClick={() => copyToClipboard(confirmedOrder.order_id)}
                      className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-gold"
                      title="Copy Order ID"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-[0.7rem] text-muted-foreground">
                    Keep this ID to track live delivery status anytime!
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-background p-4 text-left text-xs space-y-2 max-w-md mx-auto">
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <span className="text-muted-foreground">Patient:</span>
                    <span className="font-bold text-foreground">{confirmedOrder.patient_name}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <span className="text-muted-foreground">Mobile:</span>
                    <span className="font-semibold text-foreground">{confirmedOrder.phone}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <span className="text-muted-foreground">Medicine Package:</span>
                    <span className="font-bold text-sage">{confirmedOrder.medicines}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Address:</span>
                    <span className="text-foreground max-w-[200px] text-right truncate">
                      {confirmedOrder.address}
                    </span>
                  </div>
                </div>

                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setTrackQuery(confirmedOrder.order_id);
                      setActiveTab("track");
                      trackOrderPublic(confirmedOrder.order_id).then((r) => setTrackingResults(r.orders));
                    }}
                    className="press rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-md hover:opacity-95"
                  >
                    Track Live Order Status →
                  </button>
                  <button
                    onClick={() => setConfirmedOrder(null)}
                    className="press rounded-xl border border-border px-5 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    Place Another Order
                  </button>
                </div>
              </div>
            ) : (
              /* Public Medicine Order Form */
              <form onSubmit={handleOrderSubmit} className="space-y-5">
                <div className="rounded-2xl bg-gold/10 border border-gold/30 p-4 flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                  <p className="text-xs text-foreground/90 leading-relaxed">
                    Order official Yours Clinic homeopathic remedies formulated by Dr. Sumit Jha. Deliveries are dispatched directly to your doorstep across India.
                  </p>
                </div>

                {/* Patient Information */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    1. Patient & Delivery Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        Patient Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <input
                          type="text"
                          required
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          placeholder="e.g. Sunita Sharma"
                          className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">
                        Mobile Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Delivery Address *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-3.5 w-3.5 text-muted-foreground" />
                      <textarea
                        required
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House/Flat No., Building, Area, City, Pincode"
                        className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Medicine Package Selection */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    2. Select Prescribed Medicine Package
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {MEDICINE_PACKAGES.map((pkg) => (
                      <label
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg.id)}
                        className={`flex flex-col justify-between rounded-2xl border p-4 cursor-pointer transition-all ${
                          selectedPackage === pkg.id
                            ? "border-gold bg-gold/10 shadow-sm"
                            : "border-border bg-background hover:border-gold/30"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-xs text-foreground">{pkg.title}</span>
                          <span className="font-extrabold text-xs text-gold">₹{pkg.price}</span>
                        </div>
                        <p className="mt-1.5 text-[0.72rem] text-muted-foreground leading-relaxed">
                          {pkg.desc}
                        </p>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Additional Doctor Prescription Notes */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Prescription / Special Doctor Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={prescriptionNote}
                    onChange={(e) => setPrescriptionNote(e.target.value)}
                    placeholder="e.g. Consulted Dr. Sumit Jha on 04 Sept for Migraine remedies"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-muted-foreground">Total Payable: </span>
                    <span className="text-base font-extrabold text-gold">
                      ₹{MEDICINE_PACKAGES.find((p) => p.id === selectedPackage)?.price || 499}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="press rounded-xl bg-primary px-7 py-3 text-xs font-bold text-primary-foreground shadow-md hover:opacity-95 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>{submitting ? "Placing Order..." : "Confirm & Place Order"}</span>
                  </button>
                </div>
              </form>
            )
          ) : (
            /* Public Track Order Screen */
            <div className="space-y-6">
              <form onSubmit={handleTrackSearch} className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Enter Your Order ID or Mobile Number
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={trackQuery}
                      onChange={(e) => setTrackQuery(e.target.value)}
                      placeholder="e.g. YC-ORD-8921 or +91 98765 43210"
                      className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={trackingLoading}
                    className="press rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-95"
                  >
                    {trackingLoading ? "Searching..." : "Track Order"}
                  </button>
                </div>
              </form>

              {/* Results Display */}
              {trackingResults !== null && (
                <div className="space-y-4">
                  {trackingResults.length === 0 ? (
                    <div className="text-center py-10 rounded-2xl border border-dashed border-border p-6">
                      <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm font-bold text-foreground">No Order Found</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Please check your Order ID (e.g. YC-ORD-8921) or phone number and try again.
                      </p>
                    </div>
                  ) : (
                    trackingResults.map((order) => (
                      <div
                        key={order.order_id}
                        className="rounded-2xl border border-gold/40 bg-background p-5 space-y-4 shadow-sm"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                          <div>
                            <span className="text-[0.65rem] font-bold uppercase text-muted-foreground">
                              Order ID
                            </span>
                            <h4 className="text-lg font-black text-gold tracking-wide">
                              {order.order_id}
                            </h4>
                          </div>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase border ${getStatusBadge(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </div>

                        {/* Order Timeline Visualizer */}
                        <div className="grid grid-cols-4 gap-2 text-center py-2">
                          {[
                            { label: "Placed", icon: Package, active: true },
                            { label: "Processing", icon: Clock, active: ["Processing", "Dispatched", "Out for Delivery", "Delivered"].includes(order.status) },
                            { label: "Dispatched", icon: Truck, active: ["Dispatched", "Out for Delivery", "Delivered"].includes(order.status) },
                            { label: "Delivered", icon: CheckCircle2, active: order.status === "Delivered" },
                          ].map((step, idx) => {
                            const Icon = step.icon;
                            return (
                              <div key={idx} className="flex flex-col items-center">
                                <div
                                  className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs ${
                                    step.active
                                      ? "bg-gold text-primary-foreground border-gold font-bold shadow-xs"
                                      : "bg-muted text-muted-foreground border-border"
                                  }`}
                                >
                                  <Icon className="h-4 w-4" />
                                </div>
                                <span
                                  className={`mt-1 text-[0.65rem] font-semibold ${
                                    step.active ? "text-foreground" : "text-muted-foreground/60"
                                  }`}
                                >
                                  {step.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Order Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-muted/40 rounded-xl p-3.5">
                          <div>
                            <span className="text-muted-foreground">Patient Name:</span>
                            <span className="block font-bold text-foreground">{order.patient_name}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Order Date:</span>
                            <span className="block font-semibold text-foreground">
                              {formatDate12Hour(order.created_at)}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Prescribed Remedy:</span>
                            <span className="block font-semibold text-sage">{order.medicines}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Courier / Tracking Code:</span>
                            <span className="block font-mono font-bold text-gold">
                              {order.courier_name || "Assigned on dispatch"}{" "}
                              {order.tracking_number ? `(${order.tracking_number})` : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
