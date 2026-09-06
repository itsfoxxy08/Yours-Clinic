import { supabase, isSupabaseConfigured } from "./supabase";

export interface PatientReport {
  id: string;
  title: string;
  type: "prescription" | "diagnosis" | "lab_report" | "other";
  fileUrl: string;
  fileName: string;
  uploadedAt: string;
  uploadedBy?: string;
}

export interface PatientRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  reason: string;
  status: "Routine" | "Follow-up" | "Urgent" | "Consultation";
  created_at: string;
  reports?: PatientReport[];
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
 * Format ISO date string into 12-hour format with AM/PM (e.g., "05 Sep 2026, 04:27 PM").
 */
export function formatDate12Hour(dateIsoStr: string): string {
  if (!dateIsoStr) return "N/A";
  try {
    const date = new Date(dateIsoStr);
    if (isNaN(date.getTime())) return dateIsoStr;
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (e) {
    return dateIsoStr;
  }
}

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

  const current = (await getPatientRecords()).data;
  const updated = [newRecord, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  return {
    success: true,
    record: newRecord,
    message: savedToDb
      ? "Patient record added & saved to Supabase!"
      : "Patient record added locally.",
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
 * Helper to escape HTML characters for safe spreadsheet rendering
 */
function escapeHtml(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Download Patient Records as styled Excel spreadsheet (.xls / .xlsx compatible).
 * Features:
 * - NO pat-ID (replaced with clean sequential S.No starting from 1)
 * - Headers rendered in BOLD with dark background and contrast text
 * - Generous column width & padding for proper indentation and readability
 * - 12-hour format with AM/PM for dates
 */
export function exportPatientRecordsToExcel(records: PatientRecord[]) {
  const tableRows = records
    .map(
      (r, index) => `
    <tr>
      <td style="text-align: center; font-weight: bold; padding: 10px 14px; border: 1px solid #CBD5E1; mso-number-format: '\\@';">${index + 1}</td>
      <td style="font-weight: 600; padding: 10px 16px; border: 1px solid #CBD5E1; mso-number-format: '\\@';">${escapeHtml(r.name)}</td>
      <td style="padding: 10px 16px; border: 1px solid #CBD5E1; mso-number-format: '\\@';">${escapeHtml(r.phone)}</td>
      <td style="padding: 10px 16px; border: 1px solid #CBD5E1; mso-number-format: '\\@';">${escapeHtml(r.email || "N/A")}</td>
      <td style="padding: 10px 16px; border: 1px solid #CBD5E1; mso-number-format: '\\@';">${escapeHtml(r.address || "N/A")}</td>
      <td style="padding: 10px 16px; border: 1px solid #CBD5E1; mso-number-format: '\\@';">${escapeHtml(r.reason)}</td>
      <td style="padding: 10px 16px; border: 1px solid #CBD5E1; font-weight: 600; mso-number-format: '\\@';">${escapeHtml(r.status || "Routine")}</td>
      <td style="padding: 10px 16px; border: 1px solid #CBD5E1; mso-number-format: '\\@';">${formatDate12Hour(r.created_at)}</td>
    </tr>`
    )
    .join("");

  const excelHtml = `
  <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta charset="utf-8">
    <!--[if gte mso 9]>
    <xml>
      <x:ExcelWorkbook>
        <x:ExcelWorksheets>
          <x:ExcelWorksheet>
            <x:Name>Patient Records</x:Name>
            <x:WorksheetOptions>
              <x:DisplayGridlines/>
            </x:WorksheetOptions>
          </x:ExcelWorksheet>
        </x:ExcelWorksheets>
      </x:ExcelWorkbook>
    </xml>
    <![endif]-->
    <style>
      table {
        border-collapse: collapse;
        width: 100%;
        font-family: 'Segoe UI', Arial, sans-serif;
        font-size: 13px;
      }
      th {
        background-color: #1E293B;
        color: #FFFFFF;
        font-weight: bold !important;
        font-size: 14px;
        text-align: left;
        padding: 12px 18px;
        border: 1.5px solid #0F172A;
      }
      td {
        vertical-align: middle;
      }
    </style>
  </head>
  <body>
    <table>
      <thead>
        <tr>
          <th style="width: 70px; text-align: center; font-weight: bold; background-color: #1E293B; color: #FFFFFF;">S.No</th>
          <th style="width: 240px; font-weight: bold; background-color: #1E293B; color: #FFFFFF;">Patient Name</th>
          <th style="width: 180px; font-weight: bold; background-color: #1E293B; color: #FFFFFF;">Mobile Number</th>
          <th style="width: 250px; font-weight: bold; background-color: #1E293B; color: #FFFFFF;">Email Address</th>
          <th style="width: 300px; font-weight: bold; background-color: #1E293B; color: #FFFFFF;">Address</th>
          <th style="width: 360px; font-weight: bold; background-color: #1E293B; color: #FFFFFF;">Reason for Visit</th>
          <th style="width: 150px; font-weight: bold; background-color: #1E293B; color: #FFFFFF;">Status</th>
          <th style="width: 240px; font-weight: bold; background-color: #1E293B; color: #FFFFFF;">Date Registered</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  </body>
  </html>
  `;

  const blob = new Blob([excelHtml], {
    type: "application/vnd.ms-excel;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute("href", url);
  link.setAttribute("download", `Yours_Clinic_Patient_Records_${dateStr}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export Patient Records formatted for Google Sheets.
 * Features:
 * - NO pat-ID (starts with clean sequential S.No 1, 2, 3...)
 * - Headers are formatted in BOLD
 * - Dates formatted in 12-hour format with AM/PM
 * - Downloads populated CSV file for Google Sheets & copies formatted table to clipboard
 */
export async function exportPatientRecordsToGoogleSheets(
  records: PatientRecord[]
): Promise<{ success: boolean; message: string }> {
  const headers = [
    "S.No",
    "Patient Name",
    "Mobile Number",
    "Email Address",
    "Address",
    "Chief Complaint / Reason",
    "Status",
    "Date Registered",
  ];

  const csvRows = records.map((r, index) => [
    String(index + 1),
    `"${(r.name || "").replace(/"/g, '""')}"`,
    `"${(r.phone || "").replace(/"/g, '""')}"`,
    `"${(r.email || "N/A").replace(/"/g, '""')}"`,
    `"${(r.address || "N/A").replace(/"/g, '""')}"`,
    `"${(r.reason || "").replace(/"/g, '""')}"`,
    `"${(r.status || "Routine").replace(/"/g, '""')}"`,
    `"${formatDate12Hour(r.created_at)}"`,
  ]);

  const csvContent =
    "\uFEFF" + [headers.join(","), ...csvRows.map((row) => row.join(","))].join("\n");

  // 1. Download populated CSV file for Google Sheets
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute("href", url);
  link.setAttribute("download", `Yours_Clinic_Patient_Records_GoogleSheets_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  // 2. Copy formatted TSV data to clipboard
  try {
    const tsvContent = [
      headers.join("\t"),
      ...records.map((r, index) =>
        [
          index + 1,
          r.name,
          r.phone,
          r.email || "N/A",
          r.address || "N/A",
          r.reason,
          r.status || "Routine",
          formatDate12Hour(r.created_at),
        ].join("\t")
      ),
    ].join("\n");

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(tsvContent);
    }
  } catch (err) {
    console.warn("Clipboard copy notice:", err);
  }

  return {
    success: true,
    message: `📊 Exported ${records.length} patient record(s)! CSV file downloaded & table copied to clipboard.`,
  };
}

/**
 * Attach a new prescription/diagnosis report to a patient record.
 */
export async function attachPatientReport(
  patientId: string,
  report: Omit<PatientReport, "id" | "uploadedAt">
): Promise<{ success: boolean; message: string; report?: PatientReport }> {
  const newReport: PatientReport = {
    ...report,
    id: "rep-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
    uploadedAt: new Date().toISOString(),
  };

  const recordsRes = await getPatientRecords();
  const records = recordsRes.data;
  const targetRecord = records.find((r) => r.id === patientId);

  if (!targetRecord) {
    return { success: false, message: "Patient record not found." };
  }

  const existingReports = targetRecord.reports || [];
  const updatedReports = [newReport, ...existingReports];
  targetRecord.reports = updatedReports;

  // Update Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from("patient_records")
        .update({ reports: updatedReports })
        .eq("id", patientId);
    } catch (e) {
      console.warn("Supabase update report notice:", e);
    }
  }

  // Save to local cache
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));

  return {
    success: true,
    message: "📄 Prescription / Report attached successfully!",
    report: newReport,
  };
}
