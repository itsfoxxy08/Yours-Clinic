import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Search,
  FileSpreadsheet,
  Download,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  FileText,
  ShieldCheck,
  LogOut,
  RefreshCw,
  Database,
  Calendar,
  CheckCircle2,
  X,
  Sparkles,
  ArrowLeft,
  Filter,
  Truck,
  Package,
  Clock,
  Pill,
} from "lucide-react";
import { toast } from "sonner";
import {
  getPatientRecords,
  addPatientRecord,
  updatePatientRecord,
  deletePatientRecord,
  exportPatientRecordsToExcel,
  exportPatientRecordsToGoogleSheets,
  formatDate12Hour,
  type PatientRecord,
} from "@/lib/patient-service";
import {
  getMedicineOrders,
  updateOrderStatus,
  type MedicineOrder,
} from "@/lib/order-service";
import { AdminLoginModal } from "@/components/AdminLoginModal";
import { FollowUpSheetModal } from "@/components/FollowUpSheetModal";
import { isSupabaseConfigured } from "@/lib/supabase";

export const Route = createFileRoute("/admin-dashboard")({
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const navigate = useNavigate();

  // Active Admin View Tab ("patients" | "orders") - Defaults to orders
  const [adminTab, setAdminTab] = useState<"patients" | "orders">("orders");

  // Auth session check
  const [session, setSession] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Patient Records State
  const [records, setRecords] = useState<PatientRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [fromDatabase, setFromDatabase] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Medicine Orders State
  const [orders, setOrders] = useState<MedicineOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [editingOrder, setEditingOrder] = useState<MedicineOrder | null>(null);
  const [updatingOrder, setUpdatingOrder] = useState(false);

  // Date Filter State
  const [datePreset, setDatePreset] = useState<"all" | "today" | "yesterday" | "week" | "month" | "custom">("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Add / Edit / Sheet Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PatientRecord | null>(null);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    reason: "",
    status: "Routine" as PatientRecord["status"],
  });

  // Verify employee session on mount (checks localStorage for persistent sessions and sessionStorage for single-session logins)
  useEffect(() => {
    const checkSession = () => {
      const storedLocal = localStorage.getItem("yc_employee_session");
      const storedSession = sessionStorage.getItem("yc_employee_session");
      const rawSession = storedLocal || storedSession;

      if (rawSession) {
        try {
          const parsed = JSON.parse(rawSession);
          setSession(parsed);
        } catch (e) {
          setSession(null);
        }
      } else {
        setSession(null);
      }
      setLoadingSession(false);
    };
    checkSession();
  }, []);

  // Fetch patient records and medicine orders when session is verified
  const loadRecords = async () => {
    setLoadingRecords(true);
    const res = await getPatientRecords();
    setRecords(res.data);
    setFromDatabase(res.fromDatabase);
    setLoadingRecords(false);
  };

  const loadOrders = async () => {
    setLoadingOrders(true);
    const res = await getMedicineOrders();
    setOrders(res.data);
    setLoadingOrders(false);
  };

  useEffect(() => {
    if (session) {
      loadRecords();
      loadOrders();
    }
  }, [session]);

  const handleUpdateOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    setUpdatingOrder(true);
    const res = await updateOrderStatus(editingOrder.order_id, {
      status: editingOrder.status,
      courier_name: editingOrder.courier_name || "",
      tracking_number: editingOrder.tracking_number || "",
      estimated_delivery: editingOrder.estimated_delivery || "",
    });
    setUpdatingOrder(false);

    if (res.success) {
      toast.success(`Order ${editingOrder.order_id} updated successfully!`);
      setEditingOrder(null);
      loadOrders();
    } else {
      toast.error("Failed to update order details.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("yc_employee_session");
    setSession(null);
    toast.info("Logged out successfully");
  };

  // Handle Add Form Submit
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.reason.trim()) {
      toast.error("Please fill in required fields (Name, Phone, Reason)");
      return;
    }
    setSaving(true);
    const res = await addPatientRecord(formData);
    setSaving(false);

    if (res.success) {
      toast.success(res.message);
      setIsAddModalOpen(false);
      resetForm();
      loadRecords();
    } else {
      toast.error(res.message);
    }
  };

  // Handle Edit Form Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    setSaving(true);

    const res = await updatePatientRecord(editingRecord.id, formData);
    setSaving(false);

    if (res.success) {
      toast.success(res.message);
      setEditingRecord(null);
      resetForm();
      loadRecords();
    } else {
      toast.error(res.message);
    }
  };

  // Handle Delete Record
  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete patient record for "${name}"?`)) {
      const res = await deletePatientRecord(id);
      if (res.success) {
        toast.success(`Deleted patient record for ${name}`);
        loadRecords();
      }
    }
  };

  // Open Edit Modal with prefilled data
  const startEdit = (record: PatientRecord) => {
    setEditingRecord(record);
    setFormData({
      name: record.name,
      phone: record.phone,
      email: record.email,
      address: record.address,
      reason: record.reason,
      status: record.status || "Routine",
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      reason: "",
      status: "Routine",
    });
  };

  // Date Filter logic
  const matchesDateFilter = (createdIso: string) => {
    if (datePreset === "all" && !startDate && !endDate) return true;

    const rDate = new Date(createdIso);
    if (isNaN(rDate.getTime())) return true;

    const now = new Date();

    if (datePreset === "today") {
      return (
        rDate.getDate() === now.getDate() &&
        rDate.getMonth() === now.getMonth() &&
        rDate.getFullYear() === now.getFullYear()
      );
    }

    if (datePreset === "yesterday") {
      const yest = new Date(now);
      yest.setDate(yest.getDate() - 1);
      return (
        rDate.getDate() === yest.getDate() &&
        rDate.getMonth() === yest.getMonth() &&
        rDate.getFullYear() === yest.getFullYear()
      );
    }

    if (datePreset === "week") {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return rDate >= weekAgo;
    }

    if (datePreset === "month") {
      return (
        rDate.getMonth() === now.getMonth() &&
        rDate.getFullYear() === now.getFullYear()
      );
    }

    if (datePreset === "custom" || startDate || endDate) {
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (rDate < start) return false;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (rDate > end) return false;
      }
      return true;
    }

    return true;
  };

  // Filtered records
  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reason.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || r.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesDate = matchesDateFilter(r.created_at);

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Export handlers (export current filtered records)
  const handleExportExcel = () => {
    if (filteredRecords.length === 0) {
      toast.error("No matching patient records available to export");
      return;
    }
    exportPatientRecordsToExcel(filteredRecords);
    toast.success(`📊 Exported ${filteredRecords.length} patient record(s) to Excel!`);
  };

  const handleExportGoogleSheets = async () => {
    if (filteredRecords.length === 0) {
      toast.error("No matching patient records available to export");
      return;
    }
    const res = await exportPatientRecordsToGoogleSheets(filteredRecords);
    toast.success(res.message);
  };

  if (loadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  // Unauthorized view
  if (!session) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full rounded-3xl bg-card border border-gold/30 p-8 shadow-2xl text-center glide-in">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold border border-gold/30">
            <ShieldCheck className="h-8 w-8 text-gold" />
          </div>
          <h2 className="text-2xl font-bold mt-5 text-foreground tracking-tight">
            Employee Dashboard Access Required
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Please log in via <span className="text-gold font-semibold">Employee Login</span> to access patient records and management features.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() => setLoginModalOpen(true)}
              className="press focus-gold w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="h-4 w-4 text-gold-soft" />
              <span>Employee Login</span>
            </button>
            <button
              onClick={() => navigate({ to: "/" })}
              className="press w-full rounded-xl border border-border bg-background py-3 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Homepage</span>
            </button>
          </div>
        </div>

        <AdminLoginModal
          isOpen={loginModalOpen}
          onClose={() => {
            setLoginModalOpen(false);
            const stored = localStorage.getItem("yc_employee_session");
            if (stored) {
              setSession(JSON.parse(stored));
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-16 transition-colors">
      {/* Top Banner / Header */}
      <div className="border-b border-border/80 bg-card/60 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/15 border border-gold/30 text-gold shadow-sm">
                <Users className="h-6 w-6 text-gold" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-foreground">
                    Admin Dashboard
                  </h1>
                  <span className="rounded-full bg-gold/20 border border-gold/40 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-gold">
                    Live Supabase
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Logged in as: <span className="font-semibold text-foreground">{session.email || session.name || "Admin"}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={loadRecords}
                title="Refresh database records"
                className="press focus-gold flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground hover:text-foreground hover:border-gold/40 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${loadingRecords ? "animate-spin" : ""}`} />
              </button>

              <button
                onClick={() => navigate({ to: "/" })}
                className="press focus-gold hidden md:flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Website</span>
              </button>

              <button
                onClick={handleLogout}
                className="press focus-gold flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm hover:shadow transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Patients
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gold/15 text-gold">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-foreground">
              {records.length}
            </p>
            <p className="mt-1 text-[0.7rem] text-muted-foreground">
              Stored in Supabase Database
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm hover:shadow transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Database Status
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500">
                <Database className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-lg font-bold text-emerald-500 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              {isSupabaseConfigured() ? "Supabase Connected" : "Local Sync Mode"}
            </p>
            <p className="mt-1 text-[0.7rem] text-muted-foreground">
              Real-time patient record storage
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm hover:shadow transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Excel Exports
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/15 text-blue-500">
                <FileSpreadsheet className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-lg font-bold text-foreground">
              Ready (.xlsx / .csv)
            </p>
            <p className="mt-1 text-[0.7rem] text-muted-foreground">
              Instant download & Google Sheets
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm hover:shadow transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Urgent / Follow-ups
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-foreground">
              {records.filter((r) => r.status === "Urgent" || r.status === "Follow-up").length}
            </p>
            <p className="mt-1 text-[0.7rem] text-muted-foreground">
              Requires special consultation
            </p>
          </div>
        </div>

        {/* Main Dashboard Navigation Tabs */}
        <div className="flex border-b border-border/80 bg-card/40 rounded-2xl p-1.5 gap-2">
          <button
            onClick={() => setAdminTab("patients")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all ${
              adminTab === "patients"
                ? "bg-gold text-primary-foreground shadow-md font-extrabold"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Manage Patient Records ({records.length})</span>
          </button>

          <button
            onClick={() => setAdminTab("orders")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all ${
              adminTab === "orders"
                ? "bg-gold text-primary-foreground shadow-md font-extrabold"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
          >
            <Truck className="h-4 w-4" />
            <span>Track & Manage Medicine Orders ({orders.length})</span>
          </button>
        </div>

        {adminTab === "orders" ? (
          /* TRACK & MANAGE MEDICINE ORDERS SECTION */
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-md space-y-6 glide-in">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-border/60">
              <div>
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Truck className="h-5 w-5 text-gold" />
                  <span>Medicine Prescription & Courier Orders</span>
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Track live patient orders, update fulfillment status (Processing, Dispatched, Delivered), and assign courier tracking IDs.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadOrders}
                  className="press focus-gold flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-bold text-foreground hover:border-gold/40 transition-all"
                >
                  <RefreshCw className={`h-4 w-4 text-gold ${loadingOrders ? "animate-spin" : ""}`} />
                  <span>Refresh Orders</span>
                </button>
              </div>
            </div>

            {/* Orders Search & Status Filters */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="Search by Order ID (e.g. YC-ORD-8921), Patient Name, Phone, Courier Code..."
                    className="w-full rounded-2xl border border-border bg-background/70 pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none"
                  />
                  {orderSearchQuery && (
                    <button
                      onClick={() => setOrderSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                  <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-1" />
                  {["all", "pending", "processing", "dispatched", "out for delivery", "delivered", "cancelled"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`capitalize shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                        orderStatusFilter === st
                          ? "bg-gold/20 text-gold border border-gold/40 shadow-xs"
                          : "text-muted-foreground hover:text-foreground bg-background/50 border border-border/50"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Orders Data Table / Mobile Cards */}
            {loadingOrders ? (
              <div className="py-12 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
                <RefreshCw className="h-6 w-6 animate-spin text-gold" />
                <span>Loading medicine orders...</span>
              </div>
            ) : (
              (() => {
                const filteredOrders = orders.filter((o) => {
                  const matchesSearch =
                    o.order_id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                    o.patient_name.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                    o.phone.includes(orderSearchQuery) ||
                    (o.courier_name && o.courier_name.toLowerCase().includes(orderSearchQuery.toLowerCase())) ||
                    (o.tracking_number && o.tracking_number.toLowerCase().includes(orderSearchQuery.toLowerCase()));

                  const matchesStatus =
                    orderStatusFilter === "all" || o.status.toLowerCase() === orderStatusFilter.toLowerCase();

                  return matchesSearch && matchesStatus;
                });

                if (filteredOrders.length === 0) {
                  return (
                    <div className="py-12 text-center rounded-2xl border border-dashed border-border p-8">
                      <Package className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
                      <h4 className="text-sm font-bold text-foreground">No Medicine Orders Found</h4>
                      <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                        No patient order matched your active search or status filter.
                      </p>
                    </div>
                  );
                }

                return (
                  <>
                    {/* Desktop Orders Table */}
                    <div className="hidden lg:block overflow-x-auto rounded-2xl border border-border/70">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-muted/60 text-muted-foreground uppercase tracking-wider font-semibold text-[0.68rem] border-b border-border/80">
                          <tr>
                            <th className="py-3.5 px-4">Order ID</th>
                            <th className="py-3.5 px-4">Patient Details</th>
                            <th className="py-3.5 px-4">Prescribed Medicine</th>
                            <th className="py-3.5 px-4">Delivery Address</th>
                            <th className="py-3.5 px-4">Status</th>
                            <th className="py-3.5 px-4">Courier / Tracking</th>
                            <th className="py-3.5 px-4">Date Placed (12h)</th>
                            <th className="py-3.5 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60 bg-card">
                          {filteredOrders.map((order) => (
                            <tr key={order.order_id} className="hover:bg-muted/30 transition-colors">
                              <td className="py-4 px-4 font-mono font-black text-gold">
                                {order.order_id}
                              </td>
                              <td className="py-4 px-4">
                                <span className="font-bold block text-foreground">{order.patient_name}</span>
                                <span className="text-muted-foreground text-[0.7rem]">{order.phone}</span>
                              </td>
                              <td className="py-4 px-4 font-medium text-sage max-w-[200px] truncate" title={order.medicines}>
                                {order.medicines}
                              </td>
                              <td className="py-4 px-4 text-muted-foreground max-w-[180px] truncate" title={order.address}>
                                {order.address}
                              </td>
                              <td className="py-4 px-4">
                                <span
                                  className={`inline-block rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${
                                    order.status === "Pending"
                                      ? "bg-amber-500/15 text-amber-500 border border-amber-500/30"
                                      : order.status === "Processing"
                                      ? "bg-blue-500/15 text-blue-500 border border-blue-500/30"
                                      : order.status === "Dispatched"
                                      ? "bg-purple-500/15 text-purple-500 border border-purple-500/30"
                                      : order.status === "Out for Delivery"
                                      ? "bg-sky-500/15 text-sky-500 border border-sky-500/30"
                                      : order.status === "Delivered"
                                      ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                                      : "bg-rose-500/15 text-rose-500 border border-rose-500/30"
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </td>
                              <td className="py-4 px-4 font-mono text-[0.7rem]">
                                {order.courier_name ? (
                                  <div>
                                    <span className="font-bold text-foreground block">{order.courier_name}</span>
                                    <span className="text-gold">{order.tracking_number || "No tracking code"}</span>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground/60 italic">Not Dispatched</span>
                                )}
                              </td>
                              <td className="py-4 px-4 text-muted-foreground text-[0.7rem] whitespace-nowrap">
                                {formatDate12Hour(order.created_at)}
                              </td>
                              <td className="py-4 px-4 text-right">
                                <button
                                  onClick={() => setEditingOrder(order)}
                                  className="press rounded-xl border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-bold text-gold hover:bg-gold/25 transition-all"
                                >
                                  Update Order
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Responsive Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
                      {filteredOrders.map((order) => (
                        <div
                          key={order.order_id}
                          className="rounded-2xl border border-border/80 bg-background/80 p-5 space-y-3 shadow-xs"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="font-mono font-black text-gold text-sm block">
                                {order.order_id}
                              </span>
                              <h4 className="font-bold text-base text-foreground mt-0.5">
                                {order.patient_name}
                              </h4>
                            </div>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider border ${
                                order.status === "Pending"
                                  ? "bg-amber-500/15 text-amber-500 border-amber-500/30"
                                  : order.status === "Processing"
                                  ? "bg-blue-500/15 text-blue-500 border border-blue-500/30"
                                  : order.status === "Dispatched"
                                  ? "bg-purple-500/15 text-purple-500 border border-purple-500/30"
                                  : order.status === "Out for Delivery"
                                  ? "bg-sky-500/15 text-sky-500 border border-sky-500/30"
                                  : order.status === "Delivered"
                                  ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                                  : "bg-rose-500/15 text-rose-500 border border-rose-500/30"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>

                          <div className="text-xs space-y-1.5 pt-2 border-t border-border/50 text-muted-foreground">
                            <div><span className="font-semibold text-foreground">Phone:</span> {order.phone}</div>
                            <div><span className="font-semibold text-foreground">Address:</span> {order.address}</div>
                            <div><span className="font-semibold text-foreground">Remedies:</span> {order.medicines}</div>
                            <div>
                              <span className="font-semibold text-foreground">Courier:</span>{" "}
                              {order.courier_name || "Unassigned"} ({order.tracking_number || "No tracking code"})
                            </div>
                          </div>

                          <div className="pt-2 flex justify-between items-center border-t border-border/50">
                            <span className="text-[0.7rem] text-muted-foreground">
                              {formatDate12Hour(order.created_at)}
                            </span>
                            <button
                              onClick={() => setEditingOrder(order)}
                              className="press rounded-xl bg-gold/15 border border-gold/40 px-4 py-1.5 text-xs font-bold text-gold"
                            >
                              Update Status
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()
            )}
          </div>
        ) : (
          /* PATIENT RECORDS SECTION */
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-md space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-border/60">
              <div>
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gold" />
                  <span>Patient Records Directory</span>
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Manage, add, edit patient details and download formatted Excel/Google Sheets files.
                </p>
              </div>

            {/* Actions: Add Patient & Export Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => {
                  resetForm();
                  setIsAddModalOpen(true);
                }}
                className="press focus-gold flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md hover:opacity-95 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Add Patient Record</span>
              </button>

              <button
                onClick={() => setIsSheetModalOpen(true)}
                className="press focus-gold flex items-center gap-2 rounded-xl border border-gold/50 bg-gold/15 px-4 py-2.5 text-xs font-bold text-gold hover:bg-gold/25 shadow-sm transition-all"
              >
                <FileText className="h-4 w-4 text-gold" />
                <span>Download Sheet Format</span>
              </button>

              <button
                onClick={handleExportExcel}
                className="press focus-gold flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all"
              >
                <Download className="h-4 w-4" />
                <span>Download Excel (.xlsx)</span>
              </button>

              <button
                onClick={handleExportGoogleSheets}
                className="press focus-gold flex items-center gap-2 rounded-xl border border-blue-500/40 bg-blue-500/10 px-4 py-2.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-all"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>Export for Google Sheets</span>
              </button>
            </div>
          </div>

          {/* Search Bar & Filter Controls */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search patient by name, mobile number, email, address, or reason..."
                  className="w-full rounded-2xl border border-border bg-background/70 pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-1" />
                {["all", "routine", "follow-up", "urgent", "consultation"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`capitalize shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                      statusFilter === st
                        ? "bg-gold/20 text-gold border border-gold/40 shadow-xs"
                        : "text-muted-foreground hover:text-foreground bg-background/50 border border-border/50"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Filtering Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-muted/40 border border-border/60">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground mr-1">
                  <Calendar className="h-4 w-4 text-gold" />
                  <span>Registration Date:</span>
                </div>
                {[
                  { id: "all", label: "All Time" },
                  { id: "today", label: "Today" },
                  { id: "yesterday", label: "Yesterday" },
                  { id: "week", label: "This Week" },
                  { id: "month", label: "This Month" },
                  { id: "custom", label: "Custom Period" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setDatePreset(item.id as any);
                      if (item.id !== "custom") {
                        setStartDate("");
                        setEndDate("");
                      }
                    }}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                      datePreset === item.id
                        ? "bg-primary text-primary-foreground shadow-xs font-bold"
                        : "bg-background/60 text-muted-foreground hover:text-foreground border border-border/40"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {(datePreset === "custom" || startDate || endDate) && (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setDatePreset("custom");
                    }}
                    className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    placeholder="From Date"
                  />
                  <span className="text-xs text-muted-foreground font-bold">to</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setDatePreset("custom");
                    }}
                    className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    placeholder="To Date"
                  />
                  {(startDate || endDate) && (
                    <button
                      onClick={() => {
                        setStartDate("");
                        setEndDate("");
                        setDatePreset("all");
                      }}
                      className="rounded-xl bg-destructive/15 text-destructive px-2.5 py-1.5 text-xs font-bold hover:bg-destructive/25"
                    >
                      Clear
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Patient Records Table (Desktop) & Cards (Mobile) */}
          {loadingRecords ? (
            <div className="py-12 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
              <RefreshCw className="h-6 w-6 animate-spin text-gold" />
              <span>Loading patient records from database...</span>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="py-12 text-center rounded-2xl border border-dashed border-border p-8">
              <Users className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
              <h4 className="text-sm font-bold text-foreground">No Patient Records Found</h4>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                {searchQuery || datePreset !== "all" || startDate || endDate
                  ? "No patient matched your active search or date filter criteria. Try adjusting your filters."
                  : "Click 'Add Patient Record' above to add your first patient details."}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto rounded-2xl border border-border/70">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/60 text-muted-foreground uppercase tracking-wider font-semibold text-[0.68rem] border-b border-border/80">
                    <tr>
                      <th className="py-3.5 px-4 w-12 text-center">S.No</th>
                      <th className="py-3.5 px-4">Patient Name</th>
                      <th className="py-3.5 px-4">Mobile Number</th>
                      <th className="py-3.5 px-4">Email Address</th>
                      <th className="py-3.5 px-4">Address</th>
                      <th className="py-3.5 px-4">Reason for Visit</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Date Registered (12h)</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 bg-card">
                    {filteredRecords.map((patient, index) => (
                      <tr
                        key={patient.id}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        <td className="py-4 px-4 font-bold text-center text-muted-foreground">
                          {index + 1}
                        </td>
                        <td className="py-4 px-4 font-bold text-foreground">
                          {patient.name}
                        </td>
                        <td className="py-4 px-4 text-foreground/90 font-medium">
                          <div className="flex items-center gap-1.5">
                            <Phone className="h-3 w-3 text-gold shrink-0" />
                            <span>{patient.phone}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Mail className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                            <span>{patient.email || "N/A"}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground max-w-[180px] truncate" title={patient.address}>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                            <span>{patient.address || "N/A"}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-foreground font-medium max-w-[240px]">
                          <p className="line-clamp-2" title={patient.reason}>
                            {patient.reason}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${
                              patient.status === "Urgent"
                                ? "bg-rose-500/15 text-rose-500 border border-rose-500/30"
                                : patient.status === "Follow-up"
                                ? "bg-amber-500/15 text-amber-500 border border-amber-500/30"
                                : patient.status === "Consultation"
                                ? "bg-blue-500/15 text-blue-500 border border-blue-500/30"
                                : "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                            }`}
                          >
                            {patient.status || "Routine"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground whitespace-nowrap text-xs">
                          <div className="flex items-center gap-1.5 font-medium">
                            <Calendar className="h-3 w-3 text-gold/80 shrink-0" />
                            <span>{formatDate12Hour(patient.created_at)}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => startEdit(patient)}
                              title="Edit Patient Record"
                              className="press p-1.5 rounded-lg border border-border text-muted-foreground hover:text-gold hover:border-gold/40 transition-colors"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(patient.id, patient.name)}
                              title="Delete Patient Record"
                              className="press p-1.5 rounded-lg border border-border text-muted-foreground hover:text-rose-500 hover:border-rose-500/40 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Responsive Cards View */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
                {filteredRecords.map((patient) => (
                  <div
                    key={patient.id}
                    className="rounded-2xl border border-border/80 bg-background/80 p-5 space-y-3 shadow-xs hover:border-gold/30 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-base text-foreground">
                          {patient.name}
                        </h4>
                        <span
                          className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${
                            patient.status === "Urgent"
                              ? "bg-rose-500/15 text-rose-500 border border-rose-500/30"
                              : patient.status === "Follow-up"
                              ? "bg-amber-500/15 text-amber-500 border border-amber-500/30"
                              : patient.status === "Consultation"
                              ? "bg-blue-500/15 text-blue-500 border border-blue-500/30"
                              : "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                          }`}
                        >
                          {patient.status || "Routine"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEdit(patient)}
                          className="p-2 rounded-lg border border-border text-muted-foreground hover:text-gold"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(patient.id, patient.name)}
                          className="p-2 rounded-lg border border-border text-muted-foreground hover:text-rose-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-muted-foreground pt-1 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-gold shrink-0" />
                        <span className="font-semibold text-foreground">{patient.phone}</span>
                      </div>
                      {patient.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 shrink-0" />
                          <span>{patient.email}</span>
                        </div>
                      )}
                      {patient.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span>{patient.address}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 pt-1 border-t border-border/40 text-foreground/80 font-medium">
                        <Calendar className="h-3.5 w-3.5 text-gold shrink-0" />
                        <span>Registered: {formatDate12Hour(patient.created_at)}</span>
                      </div>
                    </div>

                    <div className="bg-muted/40 rounded-xl p-3 text-xs text-foreground font-medium">
                      <span className="block text-[0.65rem] uppercase font-bold text-muted-foreground mb-0.5">
                        Reason for Visit
                      </span>
                      {patient.reason}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        )}
      </div>

      {/* Order Update Modal */}
      {editingOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in"
          onClick={() => setEditingOrder(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl bg-card border border-gold/30 p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Truck className="h-5 w-5 text-gold" />
                <span>Update Order {editingOrder.order_id}</span>
              </h3>
              <button onClick={() => setEditingOrder(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Order Status *
                </label>
                <select
                  value={editingOrder.status}
                  onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value as MedicineOrder["status"] })}
                  className="w-full rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Courier Service Name
                  </label>
                  <input
                    type="text"
                    value={editingOrder.courier_name || ""}
                    onChange={(e) => setEditingOrder({ ...editingOrder, courier_name: e.target.value })}
                    placeholder="e.g. BlueDart, Delhivery, Speed Post"
                    className="w-full rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Tracking Number / AWB
                  </label>
                  <input
                    type="text"
                    value={editingOrder.tracking_number || ""}
                    onChange={(e) => setEditingOrder({ ...editingOrder, tracking_number: e.target.value })}
                    placeholder="e.g. BD902817429IN"
                    className="w-full rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Estimated Delivery Date
                </label>
                <input
                  type="date"
                  value={editingOrder.estimated_delivery || ""}
                  onChange={(e) => setEditingOrder({ ...editingOrder, estimated_delivery: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="flex-1 rounded-xl border border-border bg-background py-3 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingOrder}
                  className="flex-1 rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow-md hover:opacity-95 disabled:opacity-50"
                >
                  {updatingOrder ? "Updating..." : "Save Order Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Add / Edit Patient Modal */}
      {(isAddModalOpen || editingRecord) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in"
          onClick={() => {
            setIsAddModalOpen(false);
            setEditingRecord(null);
          }}
        >
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-card border border-gold/30 p-7 shadow-2xl transition-all max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingRecord(null);
              }}
              className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-center mb-5">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold border border-gold/30">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mt-3 text-foreground">
                {editingRecord ? "Edit Patient Record" : "Add New Patient Record"}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Data will be synced directly with Supabase database.
              </p>
            </div>

            <form onSubmit={editingRecord ? handleEditSubmit : handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="patient@example.com"
                    className="w-full rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Full Residential Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street, City, Pincode"
                  className="w-full rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Reason for Visit / Symptoms *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Describe why the patient visited, main health concerns or required consultation..."
                  className="w-full rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Visit Category / Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                >
                  <option value="Routine">Routine Checkup</option>
                  <option value="Follow-up">Follow-up Visit</option>
                  <option value="Urgent">Urgent Consultation</option>
                  <option value="Consultation">General Consultation</option>
                </select>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingRecord(null);
                  }}
                  className="flex-1 rounded-xl border border-border bg-background py-3 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow-md hover:opacity-95 disabled:opacity-50"
                >
                  {saving ? "Saving Record..." : editingRecord ? "Save Changes" : "Create Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Patient Follow-Up Sheet Format Modal */}
      <FollowUpSheetModal
        isOpen={isSheetModalOpen}
        onClose={() => setIsSheetModalOpen(false)}
        records={records}
      />
    </div>
  );
}
