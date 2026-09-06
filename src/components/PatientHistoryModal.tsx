import React, { useState } from "react";
import {
  X,
  Phone,
  Calendar,
  FileText,
  Clock,
  Printer,
  Plus,
  Search,
  Eye,
  Download,
  ShieldCheck,
  Paperclip,
  Sparkles,
  User,
  Image as ImageIcon,
} from "lucide-react";
import { formatDate12Hour, type PatientRecord, type PatientReport } from "@/lib/patient-service";
import { toast } from "sonner";

interface PatientHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  phone: string;
  allRecords: PatientRecord[];
  onOpenUpload: (patient: PatientRecord) => void;
}

export function PatientHistoryModal({
  isOpen,
  onClose,
  phone,
  allRecords,
  onOpenUpload,
}: PatientHistoryModalProps) {
  const [activePhone, setActivePhone] = useState(phone);
  const [activeTab, setActiveTab] = useState<"timeline" | "reports">("timeline");
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

  if (!isOpen) return null;

  // Filter records matching the active mobile number (normalized digit matching)
  const cleanPhone = activePhone.replace(/\D/g, "");
  const matchingVisits = allRecords.filter((r) => {
    if (!cleanPhone) return true;
    const rPhone = r.phone.replace(/\D/g, "");
    return rPhone.includes(cleanPhone) || cleanPhone.includes(rPhone);
  });

  // Sort visits chronologically (latest first)
  const sortedVisits = [...matchingVisits].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Latest patient info
  const firstVisit = sortedVisits[0];
  const primaryPatient = firstVisit || {
    name: "Unknown Patient",
    phone: activePhone,
    email: "N/A",
    address: "N/A",
  };

  const handleUploadFirstVisit = () => {
    if (firstVisit) {
      onOpenUpload(firstVisit);
    }
  };

  // Collect all reports attached across all visits for this mobile number
  const allReports: { report: PatientReport; visitDate: string; visitReason: string }[] = [];
  sortedVisits.forEach((visit) => {
    if (visit.reports && visit.reports.length > 0) {
      visit.reports.forEach((rep) => {
        allReports.push({
          report: rep,
          visitDate: visit.created_at,
          visitReason: visit.reason,
        });
      });
    }
  });

  const handlePrintHistory = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups to print history");
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Patient Medical History - ${primaryPatient.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #1e293b; }
            .header { border-bottom: 2px solid #003875; padding-bottom: 10px; margin-bottom: 20px; }
            .title { font-size: 22px; font-weight: bold; color: #003875; }
            .sub { font-size: 13px; color: #64748b; margin-top: 4px; }
            .card { border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; margin-bottom: 12px; }
            .visit-date { font-size: 12px; font-weight: bold; color: #0d7a5f; }
            .reason { font-size: 14px; font-weight: bold; margin: 4px 0; }
            .badge { display: inline-block; padding: 2px 8px; font-size: 10px; font-weight: bold; border-radius: 4px; background: #e2e8f0; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Yours Clinic - Patient Medical Passport</div>
            <div class="sub">Patient: <strong>${primaryPatient.name}</strong> | Phone: <strong>${primaryPatient.phone}</strong> | Total Visits: <strong>${sortedVisits.length}</strong></div>
          </div>
          <h3>Chronological Visit Timeline (${sortedVisits.length} Checkups)</h3>
          ${sortedVisits
            .map(
              (v, idx) => `
            <div class="card">
              <div class="visit-date">Visit #${sortedVisits.length - idx} • ${formatDate12Hour(v.created_at)}</div>
              <div class="reason">Reason / Chief Complaint: ${v.reason}</div>
              <div>Status: <span class="badge">${v.status || "Routine"}</span></div>
              <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Address: ${v.address || "N/A"}</div>
            </div>
          `
            )
            .join("")}
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-card border border-gold/40 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-b border-border/80 bg-muted/40 gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/15 text-gold border border-gold/30 shrink-0">
              <User className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-lg font-black text-foreground">{primaryPatient.name}</h3>
                <span className="rounded-full bg-gold/20 text-gold border border-gold/40 px-3 py-0.5 text-xs font-bold shadow-xs">
                  Diagnosed {sortedVisits.length} Time{sortedVisits.length === 1 ? "" : "s"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 font-mono">
                  <Phone className="h-3 w-3 text-gold" />
                  {primaryPatient.phone}
                </span>
                {primaryPatient.email && primaryPatient.email !== "N/A" && (
                  <span>• {primaryPatient.email}</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {firstVisit && (
              <button
                onClick={handleUploadFirstVisit}
                className="press focus-gold flex items-center gap-2 rounded-xl bg-gold text-slate-950 px-3.5 py-2 text-xs font-extrabold shadow-md hover:bg-gold-soft transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Upload Report / Prescription</span>
              </button>
            )}

            <button
              onClick={handlePrintHistory}
              className="press focus-gold flex items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-bold text-foreground hover:border-gold/40"
            >
              <Printer className="h-4 w-4 text-gold" />
              <span>Print Timeline</span>
            </button>

            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-gold/40"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Live Search & Filter Bar */}
        <div className="px-6 py-3 bg-background border-b border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={activePhone}
              onChange={(e) => setActivePhone(e.target.value)}
              placeholder="Search history by mobile number..."
              className="w-full rounded-2xl border border-border bg-muted/30 pl-10 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none font-mono"
            />
          </div>

          {/* View Tabs */}
          <div className="flex items-center gap-2 p-1 bg-muted/40 rounded-xl border border-border/60 w-full sm:w-auto justify-center">
            <button
              onClick={() => setActiveTab("timeline")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "timeline"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Past Checkups ({sortedVisits.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("reports")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "reports"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Paperclip className="h-3.5 w-3.5 text-gold" />
              <span>Prescriptions & Reports ({allReports.length})</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {sortedVisits.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-border rounded-3xl p-8">
              <Phone className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
              <h4 className="text-base font-bold text-foreground">No Visit History Found</h4>
              <p className="text-xs text-muted-foreground mt-1">
                No patient entries match mobile number: <span className="font-mono text-gold">{activePhone}</span>
              </p>
            </div>
          ) : activeTab === "timeline" ? (
            /* TIMELINE VIEW */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gold" />
                  <span>Chronological Medical Visits for {primaryPatient.phone}</span>
                </h4>
                <span className="text-xs font-semibold text-muted-foreground">
                  Showing {sortedVisits.length} consultation entry(ies)
                </span>
              </div>

              <div className="relative border-l-2 border-gold/30 ml-4 space-y-6 pl-6 pt-2">
                {sortedVisits.map((v, idx) => (
                  <div key={v.id} className="relative group">
                    {/* Timeline Node Icon */}
                    <div className="absolute -left-[31px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-slate-950 text-[10px] font-black shadow-md">
                      {sortedVisits.length - idx}
                    </div>

                    <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 shadow-sm hover:border-gold/40 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-2.5">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gold" />
                          <span className="text-xs font-bold text-foreground">
                            {formatDate12Hour(v.created_at)}
                          </span>
                        </div>
                        <span
                          className={`self-start sm:self-auto rounded-full px-3 py-0.5 text-[0.65rem] font-extrabold uppercase tracking-wider border ${
                            v.status === "Urgent"
                              ? "bg-rose-500/15 text-rose-500 border-rose-500/30"
                              : v.status === "Follow-up"
                              ? "bg-amber-500/15 text-amber-500 border-amber-500/30"
                              : "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
                          }`}
                        >
                          {v.status || "Routine"}
                        </span>
                      </div>

                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-[0.65rem]">
                          Chief Complaint / Diagnosis Reason
                        </p>
                        <p className="text-sm font-semibold text-foreground mt-0.5">{v.reason}</p>
                      </div>

                      {/* Attachments for this visit */}
                      {v.reports && v.reports.length > 0 && (
                        <div className="pt-2 border-t border-border/40 space-y-2">
                          <p className="text-[0.65rem] font-bold text-gold uppercase tracking-wider flex items-center gap-1">
                            <Paperclip className="h-3 w-3" />
                            <span>Attached Reports & Prescriptions ({v.reports.length})</span>
                          </p>
                          <div className="flex items-center gap-2 overflow-x-auto pb-1">
                            {v.reports.map((rep) => (
                              <button
                                key={rep.id}
                                onClick={() => setPreviewImage({ url: rep.fileUrl, title: rep.title })}
                                className="flex items-center gap-2 rounded-xl bg-muted/60 border border-border px-3 py-1.5 text-xs font-semibold hover:border-gold/40 transition-colors shrink-0"
                              >
                                <Eye className="h-3.5 w-3.5 text-gold" />
                                <span className="truncate max-w-[120px]">{rep.title}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* REPORTS GALLERY VIEW */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-gold" />
                  <span>All Uploaded Prescriptions & Diagnosis Documents</span>
                </h4>
                {firstVisit && (
                  <button
                    onClick={handleUploadFirstVisit}
                    className="rounded-xl bg-gold/20 text-gold border border-gold/40 px-3 py-1 text-xs font-bold hover:bg-gold/30"
                  >
                    + Upload New
                  </button>
                )}
              </div>

              {allReports.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-border rounded-2xl p-6">
                  <Paperclip className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
                  <p className="text-xs font-bold text-foreground">No Prescriptions or Reports Uploaded Yet</p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Click "Upload Report / Prescription" above to attach patient diagnosis documents.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {allReports.map(({ report, visitDate }) => (
                    <div
                      key={report.id}
                      className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-xs hover:border-gold/40 transition-all flex flex-col justify-between"
                    >
                      <div>
                        {report.fileUrl.startsWith("data:image") ? (
                          <div
                            onClick={() => setPreviewImage({ url: report.fileUrl, title: report.title })}
                            className="relative rounded-xl overflow-hidden aspect-video bg-black cursor-pointer group mb-3"
                          >
                            <img
                              src={report.fileUrl}
                              alt={report.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                              <Eye className="h-4 w-4 text-gold" />
                              <span>View Full Image</span>
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-xl bg-gold/10 border border-gold/30 p-4 text-center mb-3">
                            <FileText className="h-8 w-8 text-gold mx-auto mb-1" />
                            <span className="text-xs font-bold text-gold">Document File</span>
                          </div>
                        )}

                        <h5 className="text-xs font-bold text-foreground leading-snug">{report.title}</h5>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Uploaded: {formatDate12Hour(report.uploadedAt)}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                        <span className="capitalize text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {report.type}
                        </span>
                        <a
                          href={report.fileUrl}
                          download={report.fileName}
                          className="text-xs font-bold text-gold hover:underline flex items-center gap-1"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Download</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Fullscreen Previewer */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 animate-in fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gold text-sm font-bold flex items-center gap-1"
            >
              <X className="h-6 w-6" />
              <span>Close</span>
            </button>
            <img
              src={previewImage.url}
              alt={previewImage.title}
              className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl border border-gold/40"
            />
            <p className="mt-3 text-sm font-bold text-white text-center">{previewImage.title}</p>
          </div>
        </div>
      )}
    </div>
  );
}
