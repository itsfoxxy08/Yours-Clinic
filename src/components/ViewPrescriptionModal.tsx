import React, { useState } from "react";
import {
  X,
  FileText,
  Eye,
  Download,
  Printer,
  Trash2,
  Paperclip,
  Plus,
  Calendar,
  Phone,
  User,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import {
  deletePatientReport,
  formatDate12Hour,
  type PatientRecord,
  type PatientReport,
} from "@/lib/patient-service";
import { toast } from "sonner";

interface ViewPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientRecord | null;
  onOpenUpload?: (patient: PatientRecord) => void;
  onRefresh?: () => void;
}

export function ViewPrescriptionModal({
  isOpen,
  onClose,
  patient,
  onOpenUpload,
  onRefresh,
}: ViewPrescriptionModalProps) {
  const [selectedReport, setSelectedReport] = useState<PatientReport | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!isOpen || !patient) return null;

  const reports = patient.reports || [];

  const handleDelete = async (reportId: string, reportTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${reportTitle}"? This will permanently delete it from Supabase.`)) {
      return;
    }

    setDeletingId(reportId);
    const res = await deletePatientReport(patient.id, reportId);
    setDeletingId(null);

    if (res.success) {
      toast.success(res.message);
      if (selectedReport?.id === reportId) {
        setSelectedReport(null);
      }
      if (onRefresh) onRefresh();
    } else {
      toast.error(res.message);
    }
  };

  const handlePrint = (report: PatientReport) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups to print prescription.");
      return;
    }

    const isImage =
      report.fileUrl.startsWith("data:image") ||
      report.fileUrl.match(/\.(jpg|jpeg|png|webp)($|\?)/i);

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Prescription - ${patient.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; margin: 0; }
            .clinic-header { border-bottom: 2px solid #b8860b; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
            .title { font-size: 24px; font-weight: bold; color: #003875; }
            .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
            .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
            .meta-table td { padding: 6px 10px; border: 1px solid #e2e8f0; }
            .meta-table td.label { font-weight: bold; background: #f8fafc; width: 25%; color: #475569; }
            .doc-container { text-align: center; margin-top: 20px; }
            .doc-image { max-width: 100%; max-height: 800px; border: 1px solid #cbd5e1; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
          </style>
        </head>
        <body>
          <div class="clinic-header">
            <div>
              <div class="title">Yours Clinic</div>
              <div class="subtitle">Official Patient Medical Record & Prescription Attachment</div>
            </div>
            <div style="font-size: 12px; text-align: right; color: #64748b;">
              Printed Date: ${new Date().toLocaleDateString("en-IN")}
            </div>
          </div>

          <table class="meta-table">
            <tr>
              <td class="label">Patient Name:</td>
              <td><strong>${patient.name}</strong></td>
              <td class="label">Mobile Number:</td>
              <td>${patient.phone}</td>
            </tr>
            <tr>
              <td class="label">Consultation Reason:</td>
              <td>${patient.reason}</td>
              <td class="label">Visit Date:</td>
              <td>${formatDate12Hour(patient.created_at)}</td>
            </tr>
            <tr>
              <td class="label">Document Title:</td>
              <td>${report.title}</td>
              <td class="label">Type / Category:</td>
              <td><strong style="text-transform: uppercase;">${report.type}</strong></td>
            </tr>
          </table>

          <div class="doc-container">
            ${
              isImage
                ? `<img src="${report.fileUrl}" class="doc-image" alt="${report.title}" />`
                : `<p>Document attached: <a href="${report.fileUrl}">${report.fileName}</a></p>`
            }
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() { window.print(); }, 500);
            };
          </script>
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
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-card border border-gold/40 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 bg-muted/40 gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold/15 text-gold border border-gold/30 shrink-0">
              <Paperclip className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-foreground">{patient.name}</h3>
                <span className="rounded-full bg-gold/20 text-gold border border-gold/40 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase">
                  {reports.length} Prescription{reports.length === 1 ? "" : "s"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                <span className="font-mono">{patient.phone}</span>
                <span>• Visit: {formatDate12Hour(patient.created_at)}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenUpload && (
              <button
                onClick={() => {
                  onClose();
                  onOpenUpload(patient);
                }}
                className="press focus-gold flex items-center gap-1.5 rounded-xl bg-gold text-slate-950 px-3 py-1.5 text-xs font-extrabold shadow-md hover:bg-gold-soft transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Prescription</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-gold/40"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {reports.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-border rounded-3xl p-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
              <h4 className="text-base font-bold text-foreground">No Prescriptions Attached</h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                No prescription or diagnosis image has been uploaded for <strong className="text-foreground">{patient.name}</strong> yet.
              </p>
              {onOpenUpload && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenUpload(patient);
                  }}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gold text-slate-950 px-4 py-2 text-xs font-bold hover:bg-gold-soft"
                >
                  <Plus className="h-4 w-4" />
                  <span>Upload First Prescription</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reports.map((rep, idx) => {
                const isImage =
                  rep.fileUrl.startsWith("data:image") ||
                  rep.fileUrl.match(/\.(jpg|jpeg|png|webp)($|\?)/i);

                return (
                  <div
                    key={rep.id}
                    className="rounded-2xl border border-border/80 bg-background/60 p-4 space-y-3.5 hover:border-gold/40 transition-all shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      {/* Document Header & Type */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="text-[0.65rem] font-bold text-gold uppercase tracking-wider block">
                            Attachment #{idx + 1} • {rep.type || "Prescription"}
                          </span>
                          <h4 className="text-sm font-bold text-foreground leading-snug">{rep.title}</h4>
                        </div>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {formatDate12Hour(rep.uploadedAt)}
                        </span>
                      </div>

                      {/* Document Preview Thumbnail */}
                      <div className="relative rounded-xl overflow-hidden border border-border/60 bg-black/40 aspect-[4/3] flex items-center justify-center group">
                        {isImage ? (
                          <>
                            <img
                              src={rep.fileUrl}
                              alt={rep.title}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                onClick={() => setSelectedReport(rep)}
                                className="flex items-center gap-1.5 rounded-xl bg-gold text-slate-950 px-3 py-1.5 text-xs font-bold shadow-md hover:scale-105 transition-transform"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span>Preview Full Screen</span>
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-4">
                            <FileText className="h-10 w-10 text-gold mx-auto mb-2" />
                            <p className="text-xs font-bold text-foreground">{rep.fileName}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedReport(rep)}
                          className="flex items-center gap-1 text-xs font-bold text-gold hover:underline bg-gold/10 border border-gold/30 px-2.5 py-1 rounded-lg"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>View</span>
                        </button>

                        <button
                          onClick={() => handlePrint(rep)}
                          className="flex items-center gap-1 text-xs font-semibold text-foreground hover:text-gold bg-muted/50 border border-border px-2.5 py-1 rounded-lg"
                        >
                          <Printer className="h-3.5 w-3.5" />
                          <span>Print</span>
                        </button>

                        <a
                          href={rep.fileUrl}
                          download={rep.fileName || "prescription.jpg"}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs font-semibold text-foreground hover:text-gold bg-muted/50 border border-border px-2.5 py-1 rounded-lg"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Download</span>
                        </a>
                      </div>

                      <button
                        onClick={() => handleDelete(rep.id, rep.title)}
                        disabled={deletingId === rep.id}
                        title="Delete Prescription"
                        className="p-1.5 text-muted-foreground hover:text-rose-500 rounded-lg hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox / Fullscreen Previewer */}
      {selectedReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 animate-in fade-in"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between mb-3 text-white">
              <div>
                <h4 className="text-base font-bold flex items-center gap-2">
                  <Eye className="h-4 w-4 text-gold" />
                  <span>{selectedReport.title}</span>
                </h4>
                <p className="text-xs text-slate-300">
                  Patient: {patient.name} ({patient.phone})
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePrint(selectedReport)}
                  className="flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20"
                >
                  <Printer className="h-4 w-4 text-gold" />
                  <span>Print</span>
                </button>
                <a
                  href={selectedReport.fileUrl}
                  download={selectedReport.fileName}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 rounded-lg bg-gold text-slate-950 px-3 py-1.5 text-xs font-bold hover:bg-gold-soft"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-gold/40 max-h-[80vh] max-w-full bg-slate-950 flex items-center justify-center">
              {selectedReport.fileUrl.startsWith("data:image") ||
              selectedReport.fileUrl.match(/\.(jpg|jpeg|png|webp)($|\?)/i) ? (
                <img
                  src={selectedReport.fileUrl}
                  alt={selectedReport.title}
                  className="max-h-[80vh] max-w-full object-contain"
                />
              ) : (
                <iframe
                  src={selectedReport.fileUrl}
                  title={selectedReport.title}
                  className="w-[800px] h-[600px] max-w-full max-h-[80vh]"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
