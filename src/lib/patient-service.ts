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
      <td style="padding: 10px 16px; border: 1px solid #CBD5E1; mso-number-format: '\\@';">${new Date(r.created_at).toLocaleString("en-IN")}</td>
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
          <th style="width: 220px; font-weight: bold; background-color: #1E293B; color: #FFFFFF;">Date Registered</th>
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
 * Export Patient Records for Google Sheets & Copy TSV / HTML to clipboard for 1-click paste.
 * Features:
 * - NO pat-ID (starts with S.No 1, 2, 3...)
 * - Headers are formatted in BOLD
 * - Spacing and tab indentation prepared for clean Google Sheets formatting
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
    "Reason for Visit",
    "Status",
    "Date Registered",
  ];

  const tsvRows = records.map((r, index) => [
    String(index + 1),
    r.name,
    r.phone,
    r.email || "N/A",
    r.address || "N/A",
    r.reason,
    r.status || "Routine",
    new Date(r.created_at).toLocaleString("en-IN"),
  ]);

  const tsvContent = [headers.join("\t"), ...tsvRows.map((row) => row.join("\t"))].join("\n");

  // Create HTML table format for rich text clipboard copying (preserves bold headers in Google Sheets!)
  const htmlTable = `
    <table>
      <thead>
        <tr>
          ${headers.map((h) => `<th style="font-weight: bold; background-color: #e2e8f0;">${escapeHtml(h)}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${tsvRows
          .map(
            (row) => `
          <tr>
            ${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}
          </tr>`
          )
          .join("")}
      </tbody>
    </table>
  `;

  let clipboardSuccess = false;
  try {
    if (navigator.clipboard && window.ClipboardItem) {
      const blobText = new Blob([tsvContent], { type: "text/plain" });
      const blobHtml = new Blob([htmlTable], { type: "text/html" });
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/plain": blobText,
          "text/html": blobHtml,
        }),
      ]);
      clipboardSuccess = true;
    } else {
      await navigator.clipboard.writeText(tsvContent);
      clipboardSuccess = true;
    }
  } catch (err) {
    try {
      await navigator.clipboard.writeText(tsvContent);
      clipboardSuccess = true;
    } catch (e) {
      console.warn("Clipboard fallback error:", e);
    }
  }

  // Also trigger styled file download for direct import into Google Sheets / Excel
  exportPatientRecordsToExcel(records);

  return {
    success: true,
    message: clipboardSuccess
      ? "Patient records downloaded & copied! Headers are BOLD and columns spaced. Paste directly into Google Sheets (Ctrl+V)."
      : "Patient records downloaded for Google Sheets import!",
  };
}
