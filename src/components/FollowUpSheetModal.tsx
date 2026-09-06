import React, { useRef } from "react";
import { X, Printer, Download, Sparkles, FileText, CheckCircle2 } from "lucide-react";
import { logoBase64 } from "@/assets/logo-base64";
import type { PatientRecord } from "@/lib/patient-service";
import { toast } from "sonner";

interface FollowUpSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: PatientRecord[];
}

export function FollowUpSheetModal({
  isOpen,
  onClose,
  records,
}: FollowUpSheetModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Group records into pages of 20 items per page (matching the exact sheet layout)
  const ROWS_PER_PAGE = 20;
  const totalPages = Math.max(1, Math.ceil(records.length / ROWS_PER_PAGE));
  const pages = Array.from({ length: totalPages }, (_, i) => {
    const pageRecords = records.slice(i * ROWS_PER_PAGE, (i + 1) * ROWS_PER_PAGE);
    // Pad remaining rows up to 20 for full sheet look
    const emptyCount = ROWS_PER_PAGE - pageRecords.length;
    const emptyRows = Array.from({ length: emptyCount });
    return { pageNumber: i + 1, pageRecords, emptyRows, startIndex: i * ROWS_PER_PAGE };
  });

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups to print / save PDF");
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Yours Clinic Patient Follow-up Form</title>
          <meta charset="utf-8" />
          <style>
            @page {
              size: A4 landscape;
              margin: 8mm;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 0;
              background: #fff;
              color: #0f172a;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .page-container {
              width: 100%;
              max-width: 1100px;
              margin: 0 auto 30px auto;
              page-break-after: always;
              background: #ffffff;
              padding: 16px 20px;
              box-sizing: border-box;
              border: 1px solid #cbd5e1;
              position: relative;
            }
            .header-strip {
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom: 2px solid #003875;
              padding-bottom: 10px;
              margin-bottom: 12px;
            }
            .logo-box {
              display: flex;
              align-items: center;
              gap: 12px;
            }
            .logo-img {
              height: 52px;
              width: auto;
              object-fit: contain;
            }
            .clinic-tagline {
              font-size: 10px;
              font-weight: 600;
              color: #003875;
              line-height: 1.2;
            }
            .title-box {
              text-align: center;
              flex: 1;
              padding: 0 15px;
            }
            .main-title {
              font-size: 24px;
              font-weight: 800;
              color: #003875;
              margin: 0;
              letter-spacing: -0.5px;
            }
            .sub-tagline {
              font-size: 12px;
              font-weight: 600;
              color: #0d7a5f;
              margin-top: 2px;
              font-style: italic;
            }
            .date-box {
              text-align: right;
              font-size: 13px;
              font-weight: 700;
              color: #1e293b;
            }
            .sub-info-row {
              display: flex;
              align-items: center;
              justify-content: space-between;
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 8px 16px;
              margin-bottom: 12px;
              font-size: 12px;
              font-weight: 700;
              color: #1e293b;
            }
            .sub-info-field {
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .line-fill {
              display: inline-block;
              width: 220px;
              border-bottom: 1.5px dotted #64748b;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 11px;
            }
            th {
              background: linear-gradient(90deg, #003875 0%, #005f73 50%, #0a9396 100%) !important;
              color: #ffffff !important;
              font-weight: 700;
              text-transform: capitalize;
              padding: 8px 10px;
              border: 1px solid #002855;
              text-align: left;
            }
            th.center, td.center {
              text-align: center;
            }
            td {
              padding: 6px 10px;
              border: 1px solid #cbd5e1;
              color: #1e293b;
              height: 22px;
            }
            tr:nth-child(even) td {
              background-color: #f8fafc;
            }
            .circles {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
            }
            .circle {
              width: 13px;
              height: 13px;
              border: 1.5px solid #475569;
              border-radius: 50%;
              display: inline-block;
            }
            .footer-note {
              margin-top: 10px;
              display: flex;
              justify-content: space-between;
              font-size: 10px;
              color: #64748b;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          ${content.innerHTML}
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleDownloadHtmlSheet = () => {
    const content = printRef.current;
    if (!content) return;

    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <title>Yours Clinic Patient Follow-up Form</title>
  <meta charset="utf-8" />
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 20px; background: #f1f5f9; color: #0f172a; }
    .page-container { width: 100%; max-width: 1050px; margin: 0 auto 30px auto; background: #ffffff; padding: 24px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); }
    .header-strip { display: flex; align-items: center; justify-content: space-between; border-bottom: 2.5px solid #003875; padding-bottom: 12px; margin-bottom: 14px; }
    .logo-img { height: 56px; width: auto; }
    .main-title { font-size: 26px; font-weight: 800; color: #003875; margin: 0; text-align: center; }
    .sub-tagline { font-size: 13px; font-weight: 600; color: #0d7a5f; margin-top: 3px; font-style: italic; text-align: center; }
    .sub-info-row { display: flex; align-items: center; justify-content: space-between; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 18px; margin-bottom: 14px; font-size: 12px; font-weight: 700; color: #1e293b; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { background: linear-gradient(90deg, #003875 0%, #005f73 50%, #0a9396 100%); color: #ffffff; font-weight: 700; padding: 10px 12px; border: 1px solid #002855; text-align: left; }
    td { padding: 8px 12px; border: 1px solid #cbd5e1; color: #1e293b; }
    tr:nth-child(even) td { background-color: #f8fafc; }
    .circles { display: flex; align-items: center; justify-content: center; gap: 12px; }
    .circle { width: 14px; height: 14px; border: 1.5px solid #475569; border-radius: 50%; display: inline-block; }
  </style>
</head>
<body>
  ${content.innerHTML}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute("href", url);
    link.setAttribute("download", `Yours_Clinic_FollowUp_Sheet_${dateStr}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("📄 Follow-up Sheet downloaded in exact form layout!");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl bg-card border border-gold/40 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gold/15 text-gold border border-gold/30">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <span>Yours Clinic Patient Follow-up Sheet</span>
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[0.65rem] font-bold text-emerald-500 uppercase">
                  Exact Sheet Template
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Showing {records.length} patient record(s) formatted into the official clinic sheet.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="press focus-gold flex items-center gap-2 rounded-xl bg-primary px-4.5 py-2 text-xs font-bold text-primary-foreground shadow-md hover:opacity-95 transition-all"
            >
              <Printer className="h-4 w-4 text-gold-soft" />
              <span>Print / Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-gold/40"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable & Scrollable Sheet Content Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 dark:bg-zinc-950">
          <div ref={printRef} className="space-y-8">
            {pages.map(({ pageNumber, pageRecords, emptyRows, startIndex }) => (
              <div
                key={pageNumber}
                className="page-container mx-auto max-w-[1050px] bg-white text-slate-900 p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200 relative overflow-hidden"
              >
                {/* Top Corner Decorative Accents */}
                <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-emerald-600/20 via-teal-600/10 to-transparent pointer-events-none rounded-br-full" />
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-600/20 via-sky-600/10 to-transparent pointer-events-none rounded-bl-full" />

                {/* Header Strip */}
                <div className="header-strip flex items-center justify-between border-b-2 border-[#003875] pb-3 mb-4">
                  {/* Logo Box */}
                  <div className="logo-box flex items-center gap-3 w-1/4">
                    <img
                      src={logoBase64}
                      alt="Yours Clinic Logo"
                      className="logo-img h-12 w-auto object-contain"
                    />
                  </div>

                  {/* Title Box */}
                  <div className="title-box text-center flex-1">
                    <h2 className="main-title text-2xl font-black text-[#003875] tracking-tight">
                      Yours Clinic Patient Follow-up Form
                    </h2>
                    <p className="sub-tagline text-xs font-bold text-[#0d7a5f] italic mt-0.5">
                      🍃 India's Leading Online Homeopathic Clinic 🍃
                    </p>
                  </div>

                  {/* Date Box */}
                  <div className="date-box w-1/4 text-right text-xs font-bold text-slate-800">
                    <div className="text-slate-900 font-extrabold text-sm">
                      Date: <span className="text-[#003875] font-mono">{new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-bold mt-0.5">
                      {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
                    </div>
                  </div>
                </div>

                {/* Sub Header Information Bar */}
                <div className="sub-info-row flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 mb-4 text-xs font-bold text-slate-800">
                  <div className="sub-info-field flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-800 text-[10px]">
                      👤
                    </span>
                    <span>Follow-up Done By:</span>
                    <span className="inline-block w-48 border-b-2 border-dotted border-slate-400"></span>
                  </div>

                  <div className="h-4 w-px bg-slate-300"></div>

                  <div className="sub-info-field flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
                      📋
                    </span>
                    <span>Doctor / Team Remark:</span>
                    <span className="inline-block w-48 border-b-2 border-dotted border-slate-400"></span>
                  </div>
                </div>

                {/* Main Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-300">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-[#003875] via-[#005f73] to-[#0a9396] text-white font-bold">
                        <th className="py-2.5 px-3 border border-[#002855] text-center w-12">
                          S. No.
                        </th>
                        <th className="py-2.5 px-3 border border-[#002855] w-48">
                          Patient Name
                        </th>
                        <th className="py-2.5 px-3 border border-[#002855] w-36">
                          Phone Number
                        </th>
                        <th className="py-2.5 px-3 border border-[#002855]">
                          Chief Complaint
                        </th>
                        <th className="py-2.5 px-3 border border-[#002855] w-52">
                          Patient Remark / Feedback
                        </th>
                        <th className="py-2.5 px-3 border border-[#002855] text-center w-28">
                          Follow Up
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {pageRecords.map((patient, idx) => (
                        <tr
                          key={patient.id}
                          className={idx % 2 === 1 ? "bg-slate-50" : "bg-white"}
                        >
                          <td className="py-2 px-3 border border-slate-300 text-center font-bold text-slate-700">
                            {startIndex + idx + 1}
                          </td>
                          <td className="py-2 px-3 border border-slate-300 font-bold text-slate-900">
                            {patient.name}
                          </td>
                          <td className="py-2 px-3 border border-slate-300 font-semibold text-slate-800">
                            {patient.phone}
                          </td>
                          <td className="py-2 px-3 border border-slate-300 text-slate-800">
                            {patient.reason}
                          </td>
                          <td className="py-2 px-3 border border-slate-300 text-slate-600">
                            {patient.address || patient.status || "Routine"}
                          </td>
                          <td className="py-2 px-3 border border-slate-300 text-center">
                            <div className="circles flex items-center justify-center gap-2">
                              <span className="circle inline-block w-3.5 h-3.5 rounded-full border-2 border-slate-600"></span>
                              <span className="circle inline-block w-3.5 h-3.5 rounded-full border-2 border-slate-600"></span>
                              <span className="circle inline-block w-3.5 h-3.5 rounded-full border-2 border-slate-600"></span>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {/* Empty Pad Rows to match 20 rows per sheet */}
                      {emptyRows.map((_, emptyIdx) => (
                        <tr key={"empty-" + emptyIdx} className="h-7">
                          <td className="py-2 px-3 border border-slate-300 text-center font-bold text-slate-400">
                            {startIndex + pageRecords.length + emptyIdx + 1}
                          </td>
                          <td className="py-2 px-3 border border-slate-300"></td>
                          <td className="py-2 px-3 border border-slate-300"></td>
                          <td className="py-2 px-3 border border-slate-300"></td>
                          <td className="py-2 px-3 border border-slate-300"></td>
                          <td className="py-2 px-3 border border-slate-300 text-center">
                            <div className="circles flex items-center justify-center gap-2">
                              <span className="circle inline-block w-3.5 h-3.5 rounded-full border-2 border-slate-400"></span>
                              <span className="circle inline-block w-3.5 h-3.5 rounded-full border-2 border-slate-400"></span>
                              <span className="circle inline-block w-3.5 h-3.5 rounded-full border-2 border-slate-400"></span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer Page Number Note */}
                <div className="footer-note flex items-center justify-between text-[11px] font-semibold text-slate-500 mt-3 pt-2 border-t border-slate-200">
                  <span>Yours Clinic © Official Patient Follow-up Document</span>
                  <span>
                    Page {pageNumber} of {totalPages}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
