import React from "react";
import {
  X,
  Download,
  ExternalLink,
  Printer,
  FileSpreadsheet,
  Grid,
  Check,
  Search,
  ArrowDown,
  Sparkles,
} from "lucide-react";
import type { PatientRecord } from "@/lib/patient-service";
import { formatDate12Hour } from "@/lib/patient-service";
import { toast } from "sonner";

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: PatientRecord[];
}

export function GoogleSheetsModal({
  isOpen,
  onClose,
  records,
}: GoogleSheetsModalProps) {
  if (!isOpen) return null;

  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `Yours_Clinic_Patient_Records_GoogleSheets_${dateStr}.csv`;

  const handleDownloadCsv = () => {
    const headers = [
      "S.No",
      "Patient Name",
      "Mobile Number",
      "Email Address",
      "Address",
      "Reason for Visit / Chief Complaint",
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

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("📊 Google Sheets CSV downloaded with full patient data!");
  };

  const handleOpenGoogleDrive = () => {
    handleDownloadCsv();
    window.open("https://docs.google.com/spreadsheets/u/0/", "_blank");
    toast.info("Opening Google Sheets Workspace in new tab...");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-5 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl max-h-[94vh] flex flex-col rounded-2xl bg-[#ffffff] text-slate-900 border border-emerald-600/40 shadow-2xl overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Google Sheets Branding Header */}
        <div className="bg-[#f9fbfd] border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Google Sheets Icon */}
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0f9d58] text-white shadow-md">
              <FileSpreadsheet className="h-6 w-6" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  Yours Clinic Patient Records - Google Sheets
                </h3>
                <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 border border-emerald-300">
                  Spreadsheet Mode
                </span>
              </div>
              
              {/* Google Sheets Menu Ribbon */}
              <div className="flex items-center gap-3 text-xs text-slate-600 font-medium mt-0.5">
                <span className="hover:bg-slate-200/60 px-1.5 py-0.5 rounded cursor-pointer">File</span>
                <span className="hover:bg-slate-200/60 px-1.5 py-0.5 rounded cursor-pointer">Edit</span>
                <span className="hover:bg-slate-200/60 px-1.5 py-0.5 rounded cursor-pointer">View</span>
                <span className="hover:bg-slate-200/60 px-1.5 py-0.5 rounded cursor-pointer">Insert</span>
                <span className="hover:bg-slate-200/60 px-1.5 py-0.5 rounded cursor-pointer">Format</span>
                <span className="hover:bg-slate-200/60 px-1.5 py-0.5 rounded cursor-pointer">Data</span>
                <span className="hover:bg-slate-200/60 px-1.5 py-0.5 rounded cursor-pointer">Tools</span>
                <span className="hover:bg-slate-200/60 px-1.5 py-0.5 rounded cursor-pointer">Help</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenGoogleDrive}
              className="flex items-center gap-1.5 rounded-xl bg-[#0f9d58] hover:bg-[#0b8043] text-white px-3.5 py-2 text-xs font-bold shadow-md transition-all"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Open in Google Sheets Workspace</span>
            </button>

            <button
              onClick={handleDownloadCsv}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 px-3 py-2 text-xs font-bold shadow-xs transition-all"
            >
              <Download className="h-3.5 w-3.5 text-emerald-700" />
              <span>Save .CSV</span>
            </button>

            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Formula Bar */}
        <div className="bg-[#edf2fa] border-b border-slate-300 px-4 py-1.5 flex items-center gap-3 text-xs">
          <div className="font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-300 w-16 text-center">
            A1:H{records.length + 1}
          </div>
          <div className="text-slate-400 font-bold italic">fx</div>
          <div className="flex-1 bg-white border border-slate-300 rounded px-3 py-0.5 font-mono text-slate-800 text-xs overflow-hidden truncate">
            =PATIENT_RECORDS(Total={records.length}, Filtered=Active)
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {records.length} Record(s) Loaded
          </span>
        </div>

        {/* Spreadsheet Data Grid */}
        <div className="flex-1 overflow-auto bg-slate-200 p-2">
          <div className="bg-white border border-slate-300 shadow-sm rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                {/* Column Letters Header */}
                <tr className="bg-[#f8f9fa] border-b border-slate-300 text-slate-500 font-mono text-[11px]">
                  <th className="w-10 bg-[#e9ecef] border-r border-slate-300 text-center py-1 font-semibold"></th>
                  <th className="px-3 py-1 border-r border-slate-300 font-semibold text-center w-12">A</th>
                  <th className="px-3 py-1 border-r border-slate-300 font-semibold w-48">B</th>
                  <th className="px-3 py-1 border-r border-slate-300 font-semibold w-36">C</th>
                  <th className="px-3 py-1 border-r border-slate-300 font-semibold w-48">D</th>
                  <th className="px-3 py-1 border-r border-slate-300 font-semibold w-56">E</th>
                  <th className="px-3 py-1 border-r border-slate-300 font-semibold">F</th>
                  <th className="px-3 py-1 border-r border-slate-300 font-semibold w-32">G</th>
                  <th className="px-3 py-1 border-r border-slate-300 font-semibold w-44">H</th>
                </tr>

                {/* Table Field Headers Row (Row 1) */}
                <tr className="bg-[#e6f4ea] text-[#0d652d] font-bold border-b-2 border-[#0f9d58]">
                  <td className="bg-[#dae0e5] border-r border-slate-300 text-center font-mono text-slate-700 py-2 font-bold">1</td>
                  <td className="px-3 py-2 border-r border-slate-300 text-center font-bold">S.No</td>
                  <td className="px-3 py-2 border-r border-slate-300 font-bold">Patient Name</td>
                  <td className="px-3 py-2 border-r border-slate-300 font-bold">Mobile Number</td>
                  <td className="px-3 py-2 border-r border-slate-[#0f9d58]/40 font-bold">Email Address</td>
                  <td className="px-3 py-2 border-r border-slate-300 font-bold">Address</td>
                  <td className="px-3 py-2 border-r border-slate-300 font-bold">Chief Complaint / Reason</td>
                  <td className="px-3 py-2 border-r border-slate-300 font-bold text-center">Status</td>
                  <td className="px-3 py-2 border-r border-slate-300 font-bold">Date Registered (12-Hr)</td>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 text-slate-800 font-sans">
                {records.map((r, idx) => (
                  <tr
                    key={r.id || idx}
                    className={`hover:bg-[#e8f0fe] transition-colors ${
                      idx % 2 === 1 ? "bg-[#f8f9fa]" : "bg-white"
                    }`}
                  >
                    {/* Row Index Number */}
                    <td className="bg-[#f1f3f4] border-r border-slate-300 text-center font-mono text-slate-600 py-2 font-semibold text-[11px]">
                      {idx + 2}
                    </td>

                    {/* S.No */}
                    <td className="px-3 py-2 border-r border-slate-200 text-center font-bold text-slate-700 font-mono">
                      {idx + 1}
                    </td>

                    {/* Patient Name */}
                    <td className="px-3 py-2 border-r border-slate-200 font-bold text-slate-900">
                      {r.name}
                    </td>

                    {/* Mobile Number */}
                    <td className="px-3 py-2 border-r border-slate-200 font-semibold font-mono text-slate-800">
                      {r.phone}
                    </td>

                    {/* Email */}
                    <td className="px-3 py-2 border-r border-slate-200 text-slate-700 truncate max-w-[180px]">
                      {r.email || "N/A"}
                    </td>

                    {/* Address */}
                    <td className="px-3 py-2 border-r border-slate-200 text-slate-700 truncate max-w-[220px]">
                      {r.address || "N/A"}
                    </td>

                    {/* Chief Complaint */}
                    <td className="px-3 py-2 border-r border-slate-200 text-slate-800">
                      {r.reason}
                    </td>

                    {/* Status */}
                    <td className="px-3 py-2 border-r border-slate-200 text-center">
                      <span className="inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {r.status || "Routine"}
                      </span>
                    </td>

                    {/* Date Registered (12-hour format) */}
                    <td className="px-3 py-2 border-r border-slate-200 text-slate-700 font-mono text-[11px] whitespace-nowrap">
                      {formatDate12Hour(r.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Google Sheets Bottom Tab Bar */}
        <div className="bg-[#f8f9fa] border-t border-slate-300 px-4 py-2 flex items-center justify-between text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-t-lg bg-white border-t-2 border-t-[#0f9d58] border-x border-slate-300 px-4 py-1 font-bold text-[#0d652d] shadow-xs">
              <Grid className="h-3.5 w-3.5 text-[#0f9d58]" />
              <span>Patient Records Sheet</span>
            </span>
            <span className="text-slate-400 font-bold px-2 hover:bg-slate-200 rounded cursor-pointer">+</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 font-semibold text-[11px]">
            <span>Total Patients: {records.length}</span>
            <span>•</span>
            <span>All Columns Populated</span>
          </div>
        </div>
      </div>
    </div>
  );
}
