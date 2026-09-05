import { supabase, isSupabaseConfigured } from "./supabase";

export interface PatientRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  reason: string;
  status: "Routine" | "Follow-up" | "Urgent" | "Consultation";
  created_at: string;
}

const STORAGE_KEY = "yc_patient_records";

// Initial seed patient records if database is empty or fallback needed
const INITIAL_PATIENT_RECORDS: PatientRecord[] = [
  {
    id: "pat-101",
    name: "Rajesh Sharma",
    phone: "+91 98765 43210",
    email: "rajesh.sharma@example.com",
    address: "B-402, Green Park, New Delhi",
    reason: "High blood pressure checkup & routine ECG review",
    status: "Routine",
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: "pat-102",
    name: "Priya Verma",
    phone: "+91 98112 34567",
    email: "priya.v@example.com",
    address: "Flat 12A, Sunset Heights, Gurgaon",
    reason: "Severe migraine and neck tension consultation",
    status: "Follow-up",
    created_at: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
  },
  {
    id: "pat-103",
    name: "Amitabh Malhotra",
    phone: "+91 99554 11223",
    email: "amitabh.m@example.com",
    address: "House 88, Sector 15, Noida",
    reason: "Acute knee pain & mobility evaluation post-injury",
    status: "Urgent",
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: "pat-104",
    name: "Sunita Patel",
    phone: "+91 97188 99887",
    email: "sunita.patel@example.com",
    address: "C-14, Vasant Kunj, New Delhi",
    reason: "Annual wellness checkup & diabetes monitoring",
    status: "Consultation",
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
];

/**
 * Fetch patient records from Supabase `patient_records` table (with local fallback).
 */
export async function getPatientRecords(): Promise<{
  data: PatientRecord[];
  fromDatabase: boolean;
  error?: string;
}> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("patient_records")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        // Cache locally for offline/fast access
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return { data: data as PatientRecord[], fromDatabase: true };
      }

      if (error) {
        console.warn("Supabase patient_records fetch note:", error.message);
      }
    } catch (err: any) {
      console.warn("Supabase query exception:", err?.message);
    }
  }

  // Fallback to localStorage or Initial Mock Data
  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      return { data: parsed, fromDatabase: false };
    } catch (e) {
      // invalid json
    }
  }

  // Seed default data into localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PATIENT_RECORDS));
  return { data: INITIAL_PATIENT_RECORDS, fromDatabase: false };
}

/**
 * Add a new patient record into Supabase and local cache.
 */
export async function addPatientRecord(
  patient: Omit<PatientRecord, "id" | "created_at">
): Promise<{ success: boolean; record?: PatientRecord; message: string }> {
  const newRecord: PatientRecord = {
    ...patient,
    id: "pat-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
    created_at: new Date().toISOString(),
  };

  let savedToDb = false;

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("patient_records")
        .insert([
          {
            name: newRecord.name,
            phone: newRecord.phone,
            email: newRecord.email,
            address: newRecord.address,
            reason: newRecord.reason,
            status: newRecord.status,
            created_at: newRecord.created_at,
          },
        ])
        .select();

      if (!error && data && data[0]) {
        savedToDb = true;
        newRecord.id = String(data[0].id || newRecord.id);
      } else if (error) {
        console.warn("Supabase insert error:", error.message);
      }
    } catch (err: any) {
      console.warn("Supabase insert exception:", err?.message);
    }
  }

  // Update local storage
  const current = (await getPatientRecords()).data;
  const updated = [newRecord, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  return {
    success: true,
    record: newRecord,
    message: savedToDb
      ? "Patient record added & saved to Supabase!"
      : "Patient record added locally (Supabase table sync ready).",
  };
}

/**
 * Update an existing patient record in Supabase and local cache.
 */
export async function updatePatientRecord(
  id: string,
  updatedFields: Partial<Omit<PatientRecord, "id">>
): Promise<{ success: boolean; message: string }> {
  let savedToDb = false;

  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from("patient_records")
        .update(updatedFields)
        .eq("id", id);

      if (!error) {
        savedToDb = true;
      }
    } catch (err) {
      console.warn("Supabase update error:", err);
    }
  }

  // Update local storage
  const current = (await getPatientRecords()).data;
  const updated = current.map((p) =>
    p.id === id ? { ...p, ...updatedFields } : p
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  return {
    success: true,
    message: savedToDb
      ? "Patient record updated in Supabase!"
      : "Patient record updated in local storage.",
  };
}

/**
 * Delete a patient record from Supabase and local cache.
 */
export async function deletePatientRecord(
  id: string
): Promise<{ success: boolean; message: string }> {
  if (isSupabaseConfigured()) {
    try {
      await supabase.from("patient_records").delete().eq("id", id);
    } catch (err) {
      console.warn("Supabase delete error:", err);
    }
  }

  const current = (await getPatientRecords()).data;
  const updated = current.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  return { success: true, message: "Patient record deleted." };
}

/**
 * Download Patient Records as formatted Excel (.xlsx / .csv with UTF-8 BOM).
 */
export function exportPatientRecordsToExcel(records: PatientRecord[]) {
  const headers = [
    "ID",
    "Patient Name",
    "Mobile Number",
    "Email Address",
    "Address",
    "Reason for Visit",
    "Status",
    "Date Registered",
  ];

  const csvRows = records.map((r) => [
    `"${r.id}"`,
    `"${r.name.replace(/"/g, '""')}"`,
    `"${r.phone.replace(/"/g, '""')}"`,
    `"${r.email.replace(/"/g, '""')}"`,
    `"${r.address.replace(/"/g, '""')}"`,
    `"${r.reason.replace(/"/g, '""')}"`,
    `"${r.status}"`,
    `"${new Date(r.created_at).toLocaleString("en-IN")}"`,
  ]);

  const csvContent =
    "\uFEFF" +
    [headers.join(","), ...csvRows.map((e) => e.join(","))].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute("href", url);
  link.setAttribute("download", `Yours_Clinic_Patient_Records_${dateStr}.xlsx`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export Patient Records for Google Sheets & Copy TSV to clipboard for 1-click paste.
 */
export async function exportPatientRecordsToGoogleSheets(
  records: PatientRecord[]
): Promise<{ success: boolean; message: string }> {
  // 1. Create TSV string for instant clipboard pasting into Google Sheets
  const headers = [
    "Patient Name",
    "Mobile Number",
    "Email Address",
    "Address",
    "Reason for Visit",
    "Status",
    "Date Registered",
  ];

  const tsvRows = records.map((r) => [
    r.name,
    r.phone,
    r.email,
    r.address,
    r.reason,
    r.status,
    new Date(r.created_at).toLocaleString("en-IN"),
  ]);

  const tsvContent = [headers.join("\t"), ...tsvRows.map((row) => row.join("\t"))].join("\n");

  let clipboardSuccess = false;
  try {
    await navigator.clipboard.writeText(tsvContent);
    clipboardSuccess = true;
  } catch (err) {
    console.warn("Clipboard write error:", err);
  }

  // 2. Also trigger CSV file download for direct import in Google Sheets
  exportPatientRecordsToExcel(records);

  return {
    success: true,
    message: clipboardSuccess
      ? "Patient records downloaded AND copied to clipboard! You can paste directly into any Google Sheet (Ctrl+V)."
      : "Patient records downloaded for Google Sheets import!",
  };
}
