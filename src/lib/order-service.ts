import { supabase, isSupabaseConfigured } from "./supabase";
import { formatDate12Hour } from "./patient-service";

export interface MedicineOrder {
  id: string;
  order_id: string; // e.g. YC-ORD-9281
  patient_name: string;
  phone: string;
  email?: string;
  address: string;
  medicines: string;
  prescription_note?: string;
  status: "Pending" | "Processing" | "Dispatched" | "Out for Delivery" | "Delivered" | "Cancelled";
  courier_name?: string;
  tracking_number?: string;
  estimated_delivery?: string;
  created_at: string;
  total_amount?: number;
}

const STORAGE_KEY = "yc_medicine_orders";

// Initial seed orders for demonstration & testing
const INITIAL_ORDERS: MedicineOrder[] = [
  {
    id: "ord-1",
    order_id: "YC-ORD-8921",
    patient_name: "Ananya Deshmukh",
    phone: "+91 98201 11223",
    email: "ananya.d@example.com",
    address: "A-204, Lotus Towers, Andheri West, Mumbai",
    medicines: "Homeopathic Remedy Pack #4 (Arnica 30C & Rhus Tox 200C)",
    prescription_note: "Take 4 pills twice daily after meals",
    status: "Out for Delivery",
    courier_name: "BlueDart Express",
    tracking_number: "BD902817429IN",
    estimated_delivery: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
    total_amount: 650,
  },
  {
    id: "ord-2",
    order_id: "YC-ORD-8920",
    patient_name: "Vikramaditya Singh",
    phone: "+91 99100 44332",
    email: "vikram.singh@example.com",
    address: "House No 45, Sector 21-C, Chandigarh",
    medicines: "Chronic Asthma Homeopathic Tincture & Bio-Chemic Combo",
    prescription_note: "10 drops in lukewarm water 3 times a day",
    status: "Dispatched",
    courier_name: "Delhivery",
    tracking_number: "DEL84729103IN",
    estimated_delivery: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
    created_at: new Date(Date.now() - 3600000 * 44).toISOString(),
    total_amount: 890,
  },
  {
    id: "ord-3",
    order_id: "YC-ORD-8919",
    patient_name: "Meera Nair",
    phone: "+91 94470 99881",
    email: "meera.nair@example.com",
    address: "Villa 12, Palm Meadows, Whitefield, Bengaluru",
    medicines: "Skin Care & Eczema Relief Drops + Calendula Ointment",
    prescription_note: "Apply ointment gently twice daily",
    status: "Delivered",
    courier_name: "DTDC Courier",
    tracking_number: "D74920184IN",
    estimated_delivery: new Date(Date.now() - 3600000 * 10).toISOString().slice(0, 10),
    created_at: new Date(Date.now() - 3600000 * 96).toISOString(),
    total_amount: 1120,
  },
  {
    id: "ord-4",
    order_id: "YC-ORD-8918",
    patient_name: "Rahul Saxena",
    phone: "+91 98711 22334",
    email: "rahul.saxena@example.com",
    address: "C-88, Malviya Nagar, New Delhi",
    medicines: "Digestive Care Homeopathic Syrup",
    prescription_note: "1 teaspoonful before lunch and dinner",
    status: "Processing",
    courier_name: "Speed Post",
    tracking_number: "SP94018274IN",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    total_amount: 480,
  },
];

/**
 * Generate unique Order ID format: YC-ORD-XXXX
 */
export function generateOrderId(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `YC-ORD-${randomNum}`;
}

/**
 * Fetch medicine orders from Supabase `medicine_orders` table (with local fallback).
 */
export async function getMedicineOrders(): Promise<{
  data: MedicineOrder[];
  fromDatabase: boolean;
}> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("medicine_orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return { data: data as MedicineOrder[], fromDatabase: true };
      }
    } catch (err) {
      console.warn("Supabase medicine_orders fetch exception:", err);
    }
  }

  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) {
    try {
      return { data: JSON.parse(cached), fromDatabase: false };
    } catch (e) {}
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
  return { data: INITIAL_ORDERS, fromDatabase: false };
}

/**
 * Place a new public medicine order
 */
export async function placeMedicineOrder(
  orderData: Omit<MedicineOrder, "id" | "order_id" | "created_at" | "status">
): Promise<{ success: boolean; order?: MedicineOrder; message: string }> {
  const newOrder: MedicineOrder = {
    ...orderData,
    id: "ord-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
    order_id: generateOrderId(),
    status: "Pending",
    created_at: new Date().toISOString(),
  };

  let savedToDb = false;

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("medicine_orders")
        .insert([
          {
            order_id: newOrder.order_id,
            patient_name: newOrder.patient_name,
            phone: newOrder.phone,
            email: newOrder.email,
            address: newOrder.address,
            medicines: newOrder.medicines,
            prescription_note: newOrder.prescription_note,
            status: newOrder.status,
            total_amount: newOrder.total_amount || 500,
            created_at: newOrder.created_at,
          },
        ])
        .select();

      if (!error && data && data[0]) {
        savedToDb = true;
        newOrder.id = String(data[0].id || newOrder.id);
      }
    } catch (err) {
      console.warn("Supabase placeMedicineOrder exception:", err);
    }
  }

  const current = (await getMedicineOrders()).data;
  const updated = [newOrder, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  return {
    success: true,
    order: newOrder,
    message: `Order placed successfully! Your Order ID is ${newOrder.order_id}`,
  };
}

/**
 * Update order status & courier tracking details (Admin feature)
 */
export async function updateOrderStatus(
  orderId: string,
  updatedFields: Partial<MedicineOrder>
): Promise<{ success: boolean; message: string }> {
  let savedToDb = false;

  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from("medicine_orders")
        .update(updatedFields)
        .eq("order_id", orderId);

      if (!error) savedToDb = true;
    } catch (err) {
      console.warn("Supabase updateOrderStatus error:", err);
    }
  }

  const current = (await getMedicineOrders()).data;
  const updated = current.map((o) =>
    o.order_id === orderId || o.id === orderId ? { ...o, ...updatedFields } : o
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  return {
    success: true,
    message: savedToDb ? "Order updated in Supabase!" : "Order updated locally.",
  };
}

/**
 * Search/Track order publicly by Order ID or Mobile Number
 */
export async function trackOrderPublic(
  query: string
): Promise<{ success: boolean; orders: MedicineOrder[]; message: string }> {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) {
    return { success: false, orders: [], message: "Please enter an Order ID or Mobile Number" };
  }

  const allOrders = (await getMedicineOrders()).data;
  const matches = allOrders.filter(
    (o) =>
      o.order_id.toLowerCase() === cleanQuery ||
      o.order_id.toLowerCase().replace(/[^a-z0-9]/g, "") === cleanQuery.replace(/[^a-z0-9]/g, "") ||
      o.phone.replace(/\s+/g, "").includes(cleanQuery.replace(/\s+/g, ""))
  );

  if (matches.length > 0) {
    return {
      success: true,
      orders: matches,
      message: `Found ${matches.length} matching order(s)`,
    };
  }

  return {
    success: false,
    orders: [],
    message: "No order found matching this Order ID or Mobile Number",
  };
}
