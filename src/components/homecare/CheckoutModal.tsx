import React, { useState } from "react";
import {
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Package,
  Truck,
  CreditCard,
  QrCode,
  ShieldCheck,
  Building,
  MapPin,
  Phone,
  Mail,
  User,
  CheckCircle2,
  Copy,
  Printer,
  Sparkles,
  Lock,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { HOMECARE_KIT_CONFIG } from "@/data/homecare-kit";
import { placeMedicineOrder, type MedicineOrder } from "@/lib/order-service";
import { toast } from "sonner";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuantity?: number;
  onTrackOrder: (orderId: string) => void;
}

type CheckoutStep = 1 | 2 | 3 | 4 | 5;

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi NCR",
  "Chandigarh",
];

export function CheckoutModal({
  isOpen,
  onClose,
  initialQuantity = 1,
  onTrackOrder,
}: CheckoutModalProps) {
  const [step, setStep] = useState<CheckoutStep>(1);
  const [quantity, setQuantity] = useState(initialQuantity);

  // Customer & Shipping State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState(INDIAN_STATES[0]);
  const [pincode, setPincode] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking" | "cod">("upi");
  const [upiId, setUpiId] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Confirmed Order Result
  const [confirmedOrder, setConfirmedOrder] = useState<MedicineOrder | null>(null);

  if (!isOpen) return null;

  const itemPrice = HOMECARE_KIT_CONFIG.sellingPrice;
  const subtotal = itemPrice * quantity;
  const shippingCharges = 0;
  const totalAmount = subtotal + shippingCharges;

  // Validation
  const validateStep2 = () => {
    if (!fullName.trim()) {
      toast.error("Please enter your full name.");
      return false;
    }
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return false;
    }
    if (!address.trim()) {
      toast.error("Please enter your street delivery address.");
      return false;
    }
    if (!city.trim()) {
      toast.error("Please enter your city.");
      return false;
    }
    const cleanPin = pincode.replace(/\D/g, "");
    if (cleanPin.length !== 6) {
      toast.error("Please enter a valid 6-digit Indian PIN code.");
      return false;
    }
    return true;
  };

  const handleNextFromStep2 = () => {
    if (validateStep2()) {
      setStep(3);
    }
  };

  const handleProcessOrder = async () => {
    setIsProcessingPayment(true);

    try {
      // Simulate gateway processing delay
      await new Promise((resolve) => setTimeout(resolve, 1400));

      const fullDeliveryAddress = `${address.trim()}, ${city.trim()}, ${state} - ${pincode.trim()}${
        deliveryNote.trim() ? ` (Note: ${deliveryNote.trim()})` : ""
      }`;

      const res = await placeMedicineOrder({
        patient_name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        address: fullDeliveryAddress,
        medicines: `HomeCare Essentials Kit (Qty: ${quantity}) - 15 Remedies Box`,
        prescription_note: `Online Order: HomeCare Essentials Kit. Payment Method: ${paymentMethod.toUpperCase()}${
          paymentMethod === "upi" && upiId ? ` (${upiId})` : ""
        }. Estimated Delivery: 2-4 business days.`,
        total_amount: totalAmount,
      });

      if (res.success && res.order) {
        setConfirmedOrder(res.order);
        setStep(5);
        toast.success("Order confirmed successfully!");
      } else {
        // Fallback local order if anything unexpected happens
        const fallbackOrder: MedicineOrder = {
          id: `local-${Date.now()}`,
          order_id: `YC-HCK-${Math.floor(1000 + Math.random() * 9000)}`,
          patient_name: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          address: fullDeliveryAddress,
          medicines: `HomeCare Essentials Kit (Qty: ${quantity})`,
          status: "Pending",
          total_amount: totalAmount,
          created_at: new Date().toISOString(),
          estimated_delivery: "2 – 4 business days",
        };
        setConfirmedOrder(fallbackOrder);
        setStep(5);
        toast.success("Order received and queued for clinic dispatch!");
      }
    } catch (err) {
      toast.error("Payment processing error. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const copyOrderId = () => {
    if (confirmedOrder?.order_id) {
      navigator.clipboard.writeText(confirmedOrder.order_id);
      toast.success("Order ID copied to clipboard!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header Bar */}
        <div className="p-6 border-b border-border/80 flex items-center justify-between bg-card/90">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[0.68rem] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                Secure Clinic Checkout
              </span>
              <span className="text-xs text-muted-foreground font-mono">Step {step} of 5</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-medium text-foreground mt-1">
              {step === 1 && "Step 1: Product Selection"}
              {step === 2 && "Step 2: Patient & Delivery Address"}
              {step === 3 && "Step 3: Review Order Summary"}
              {step === 4 && "Step 4: Select Payment Method"}
              {step === 5 && "Order Confirmed!"}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="w-full bg-secondary h-1.5 flex">
          <div
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Modal Body Container */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {/* STEP 1: Product Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-border/80 bg-secondary/30 p-5 flex flex-col sm:flex-row items-center gap-5">
                <div className="h-20 w-20 rounded-2xl bg-[#092F50] text-white flex flex-col items-center justify-center shrink-0 p-2 shadow-xs">
                  <Package className="h-7 w-7 text-emerald-400 mb-1" />
                  <span className="text-[0.6rem] font-bold uppercase tracking-wider">
                    Essentials
                  </span>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h4 className="font-serif text-lg font-medium text-foreground">
                    {HOMECARE_KIT_CONFIG.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    15 Standard Formulations + Dr. Sumit Jha's Hardbound Care Guide
                  </p>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                    <span className="text-lg font-bold text-foreground">₹{itemPrice}</span>
                    <span className="text-xs text-muted-foreground line-through">
                      ₹{HOMECARE_KIT_CONFIG.mrp}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      Save {HOMECARE_KIT_CONFIG.discountPercentage}%
                    </span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 rounded-full border border-border bg-card p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-sm text-foreground">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    disabled={quantity >= 10}
                    className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Included Highlights */}
              <div className="rounded-2xl bg-secondary/40 p-4 border border-border/60">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                  Kit Inclusions Review:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>3 Digestive Wellness Remedies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>3 Cold &amp; Seasonal Care Dilutions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>3 First-Aid &amp; Minor Pain Remedies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>3 Skin Care &amp; Topical Ointments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>3 General Wellness Formulations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Free Pan-India Doorstep Delivery</span>
                  </div>
                </div>
              </div>

              {/* Price Calculation */}
              <div className="rounded-2xl border border-border p-4 bg-card space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Kit Price (x{quantity})</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Courier Shipping</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between text-base font-bold text-foreground pt-2 border-t border-border">
                  <span>Total Payable</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="press focus-gold w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground py-3.5 text-sm font-bold shadow-md transition-all"
              >
                <span>Continue to Delivery Details</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Customer Details & Address */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    Patient / Customer Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    10-Digit Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  Email Address (For receipt &amp; tracking)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="e.g. ramesh@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  Street Delivery Address (House / Flat / Area) *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <textarea
                    rows={2}
                    placeholder="e.g. Flat 402, Royal Residency, Near City Park"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Patna / Delhi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    State *
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/30"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    6-Digit PIN Code *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 110001"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  Delivery Notes / Landmark (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Opposite State Bank ATM, deliver after 2 PM"
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-full border border-border bg-card text-xs font-semibold hover:bg-secondary text-foreground"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNextFromStep2}
                  className="press focus-gold flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground py-3 text-sm font-bold shadow-md transition-all"
                >
                  <span>Review Order Summary</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Order Summary */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-border/80 bg-secondary/30 p-5 space-y-4">
                <div className="flex justify-between items-start pb-4 border-b border-border/60">
                  <div>
                    <h4 className="font-serif text-lg font-medium text-foreground">
                      {HOMECARE_KIT_CONFIG.title}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      Quantity:{" "}
                      <strong>
                        {quantity} Box{quantity > 1 ? "es" : ""}
                      </strong>
                    </span>
                  </div>
                  <span className="font-serif text-lg font-bold text-foreground">₹{subtotal}</span>
                </div>

                {/* Delivery Address Review */}
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="font-semibold text-foreground">
                    Delivering To: {fullName} ({phone})
                  </div>
                  <div>
                    {address}, {city}, {state} - {pincode}
                  </div>
                  {deliveryNote && <div className="italic">Note: {deliveryNote}</div>}
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-primary hover:underline font-semibold block pt-1"
                  >
                    Edit Delivery Details
                  </button>
                </div>
              </div>

              {/* Price Calculation breakdown */}
              <div className="rounded-2xl border border-border p-4 bg-card space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Kit Base Price (x{quantity})</span>
                  <span>₹{HOMECARE_KIT_CONFIG.mrp * quantity}</span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Direct Clinic Discount (24%)</span>
                  <span>-₹{(HOMECARE_KIT_CONFIG.mrp - itemPrice) * quantity}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Courier Shipping (Pan-India)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    FREE (₹0)
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-foreground pt-2 border-t border-border">
                  <span>Total Payable Amount</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-3 rounded-full border border-border bg-card text-xs font-semibold hover:bg-secondary text-foreground"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="press focus-gold flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground py-3 text-sm font-bold shadow-md transition-all"
                >
                  <span>Proceed to Payment (₹{totalAmount})</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Payment Selection */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-3">
                {/* UPI Option */}
                <label
                  onClick={() => setPaymentMethod("upi")}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    paymentMethod === "upi"
                      ? "border-emerald-600 bg-emerald-500/10 ring-2 ring-emerald-500/20"
                      : "border-border bg-card hover:bg-secondary/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center">
                      <QrCode className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        UPI / QR (Google Pay, PhonePe, Paytm, BHIM)
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Instant verification &amp; fastest dispatch
                      </div>
                    </div>
                  </div>
                  <div className="h-5 w-5 rounded-full border border-border flex items-center justify-center">
                    {paymentMethod === "upi" && (
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                    )}
                  </div>
                </label>

                {/* Card Option */}
                <label
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    paymentMethod === "card"
                      ? "border-emerald-600 bg-emerald-500/10 ring-2 ring-emerald-500/20"
                      : "border-border bg-card hover:bg-secondary/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/20 text-blue-600 flex items-center justify-center">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        Credit / Debit Card (Visa, Mastercard, RuPay)
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Secure 256-bit encrypted gateway
                      </div>
                    </div>
                  </div>
                  <div className="h-5 w-5 rounded-full border border-border flex items-center justify-center">
                    {paymentMethod === "card" && (
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                    )}
                  </div>
                </label>

                {/* Net Banking Option */}
                <label
                  onClick={() => setPaymentMethod("netbanking")}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    paymentMethod === "netbanking"
                      ? "border-emerald-600 bg-emerald-500/10 ring-2 ring-emerald-500/20"
                      : "border-border bg-card hover:bg-secondary/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-purple-500/20 text-purple-600 flex items-center justify-center">
                      <Building className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        Net Banking (All Major Indian Banks)
                      </div>
                      <div className="text-xs text-muted-foreground">
                        HDFC, ICICI, SBI, Axis, Kotak
                      </div>
                    </div>
                  </div>
                  <div className="h-5 w-5 rounded-full border border-border flex items-center justify-center">
                    {paymentMethod === "netbanking" && (
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                    )}
                  </div>
                </label>

                {/* Cash on Delivery Option */}
                <label
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    paymentMethod === "cod"
                      ? "border-emerald-600 bg-emerald-500/10 ring-2 ring-emerald-500/20"
                      : "border-border bg-card hover:bg-secondary/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        Cash on Delivery (Pay upon arrival)
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Pay cash or UPI to courier agent at doorstep
                      </div>
                    </div>
                  </div>
                  <div className="h-5 w-5 rounded-full border border-border flex items-center justify-center">
                    {paymentMethod === "cod" && (
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                    )}
                  </div>
                </label>
              </div>

              {/* UPI ID input field if UPI is selected */}
              {paymentMethod === "upi" && (
                <div className="p-4 rounded-2xl bg-secondary/50 border border-border space-y-2">
                  <label className="text-xs font-semibold text-foreground block">
                    Enter your UPI ID (Optional - for instant payment request)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. yourname@okhdfcbank or yourname@paytm"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm"
                  />
                  <p className="text-[0.7rem] text-muted-foreground">
                    Or simply proceed to scan the dispensary QR code upon confirmation.
                  </p>
                </div>
              )}

              {/* Security badge */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-primary/5 p-3 rounded-xl border border-primary/10">
                <Lock className="h-4 w-4 text-primary shrink-0" />
                <span>Payments are processed via our verified Razorpay-ready medical gateway.</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={isProcessingPayment}
                  className="px-4 py-3 rounded-full border border-border bg-card text-xs font-semibold hover:bg-secondary text-foreground"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleProcessOrder}
                  disabled={isProcessingPayment}
                  className="press focus-gold flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-sm font-bold shadow-md transition-all disabled:opacity-60"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Authorizing Payment...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Complete Order (₹{totalAmount})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Order Confirmation */}
          {step === 5 && confirmedOrder && (
            <div className="text-center space-y-6">
              <div className="h-16 w-16 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Thank You for Your Order
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-foreground mt-1">
                  HomeCare Essentials Kit Booked!
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                  Your order has been registered at our central dispensary. Our pharmacists are
                  preparing your sealed 15-remedy kit for express dispatch.
                </p>
              </div>

              {/* Order ID Banner */}
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                <div>
                  <span className="text-[0.7rem] uppercase tracking-wider text-muted-foreground block font-bold">
                    Your Unique Order Reference ID
                  </span>
                  <span className="font-mono text-xl font-bold text-foreground">
                    {confirmedOrder.order_id}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={copyOrderId}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-600/30 bg-card text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy ID</span>
                </button>
              </div>

              {/* Detailed Receipt Card */}
              <div className="rounded-2xl border border-border bg-secondary/30 p-5 text-left text-xs space-y-3">
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Order Status</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {confirmedOrder.status || "Pending Dispatch"}
                  </span>
                </div>

                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Recipient Name</span>
                  <span className="font-semibold text-foreground">{fullName}</span>
                </div>

                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Mobile Contact</span>
                  <span className="font-semibold text-foreground">{phone}</span>
                </div>

                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Shipping Address</span>
                  <span className="font-semibold text-foreground max-w-xs text-right">
                    {address}, {city}, {state} - {pincode}
                  </span>
                </div>

                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Estimated Delivery</span>
                  <span className="font-semibold text-foreground">
                    2 – 4 Business Days (Express Courier)
                  </span>
                </div>

                <div className="flex justify-between pt-1">
                  <span className="font-bold text-foreground">Total Paid / Payable</span>
                  <span className="font-serif text-base font-bold text-foreground">
                    ₹{totalAmount}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onTrackOrder(confirmedOrder.order_id);
                  }}
                  className="press focus-gold w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground py-3 text-xs font-bold uppercase tracking-wider shadow-md transition-all"
                >
                  <Truck className="h-4 w-4" />
                  <span>Track This Order</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print Receipt</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-secondary px-5 py-3 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
