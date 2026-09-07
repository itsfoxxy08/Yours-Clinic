import React, { useState, useRef } from "react";
import {
  X,
  Upload,
  Camera,
  FileText,
  CheckCircle2,
  Image as ImageIcon,
  RotateCcw,
  Sparkles,
  Paperclip,
  Zap,
} from "lucide-react";
import { attachPatientReport, formatDate12Hour, type PatientRecord, type PatientReport } from "@/lib/patient-service";
import { compressFile, compressDataUrl, formatBytes, estimateDataUrlBytes } from "@/lib/image-compress";
import { toast } from "sonner";

interface UploadReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientRecord | null;
  onSuccess: () => void;
}

export function UploadReportModal({
  isOpen,
  onClose,
  patient,
  onSuccess,
}: UploadReportModalProps) {
  const [activeSource, setActiveSource] = useState<"device" | "camera">("device");
  const [title, setTitle] = useState("");
  const [reportType, setReportType] = useState<PatientReport["type"]>("prescription");
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [compressedSize, setCompressedSize] = useState<string | null>(null);

  // Camera State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  if (!isOpen || !patient) return null;

  // Handle File Input from Device — compress images before storing
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    const MAX_SIZE_MB = 10;

    if (file.type && !ALLOWED_TYPES.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|pdf)$/i)) {
      toast.error("Invalid file format. Please upload JPG, PNG, WEBP, or PDF.");
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`File size exceeds ${MAX_SIZE_MB}MB limit.`);
      return;
    }

    setFileName(file.name);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ""));
    }

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    if (isPdf) {
      // PDFs: just read as-is, no compression
      const reader = new FileReader();
      reader.onload = () => {
        setFileDataUrl(reader.result as string);
        setCompressedSize(null);
      };
      reader.readAsDataURL(file);
    } else {
      // Images: compress before storing
      setCompressing(true);
      setCompressedSize(null);
      try {
        const compressed = await compressFile(file, { maxDimension: 1600, quality: 0.75 });
        setFileDataUrl(compressed);
        const sizeBytes = estimateDataUrlBytes(compressed);
        setCompressedSize(formatBytes(sizeBytes));
      } catch (err) {
        // fallback: read original
        const reader = new FileReader();
        reader.onload = () => setFileDataUrl(reader.result as string);
        reader.readAsDataURL(file);
      } finally {
        setCompressing(false);
      }
    }
  };

  // Start Camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      setStream(mediaStream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      toast.error("Camera access denied or not available. Please use Device Upload.");
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  // Take Snapshot from Camera — compress immediately after capture
  const capturePhoto = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const rawDataUrl = canvas.toDataURL("image/jpeg", 0.92);
    stopCamera();

    setFileName(`Prescription_Snap_${Date.now()}.jpg`);
    if (!title) {
      setTitle(`Prescription Capture (${new Date().toLocaleDateString("en-IN")})`);
    }

    setCompressing(true);
    setCompressedSize(null);
    try {
      const compressed = await compressDataUrl(rawDataUrl, { maxDimension: 1600, quality: 0.75 });
      setFileDataUrl(compressed);
      const sizeBytes = estimateDataUrlBytes(compressed);
      setCompressedSize(formatBytes(sizeBytes));
      toast.success("📸 Photo captured & compressed!");
    } catch {
      setFileDataUrl(rawDataUrl);
      toast.success("📸 Photo captured successfully!");
    } finally {
      setCompressing(false);
    }
  };

  // Reset Form & Close
  const handleClose = () => {
    stopCamera();
    setTitle("");
    setFileDataUrl(null);
    setFileName("");
    setActiveSource("device");
    setCompressedSize(null);
    setCompressing(false);
    onClose();
  };

  // Submit Upload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileDataUrl) {
      toast.error("Please upload a file or take a photo first.");
      return;
    }

    setUploading(true);
    const res = await attachPatientReport(patient.id, {
      title: title || `${reportType.toUpperCase()} Record`,
      type: reportType,
      fileUrl: fileDataUrl,
      fileName: fileName || "patient_report.jpg",
      uploadedBy: "Doctor / Clinic Admin",
    });

    setUploading(false);
    if (res.success) {
      toast.success(res.message);
      onSuccess();
      handleClose();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-card border border-gold/40 shadow-2xl overflow-hidden p-6 sm:p-7 glide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold/15 text-gold border border-gold/30">
              <Paperclip className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <span>Upload Medical Report / Prescription</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Patient: <span className="text-gold font-bold">{patient.name}</span> ({patient.phone})
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-gold/40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Source Tabs: Upload File vs Take Photo */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-muted/50 rounded-2xl border border-border/60">
            <button
              type="button"
              onClick={() => {
                stopCamera();
                setActiveSource("device");
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeSource === "device"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Upload className="h-4 w-4" />
              <span>Upload from Device</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveSource("camera");
                startCamera();
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeSource === "camera"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Camera className="h-4 w-4" />
              <span>Click Photo via Camera</span>
            </button>
          </div>

          {/* Device Upload Area */}
          {activeSource === "device" && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-foreground">Select File or Photo</label>
              <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gold/40 bg-gold/5 p-6 text-center hover:bg-gold/10 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="h-8 w-8 text-gold mb-2" />
                <p className="text-xs font-bold text-foreground">
                  {fileName ? fileName : "Click to browse or drag prescription / report file"}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Supports JPG, PNG, WEBP, PDF formats
                </p>
              </div>
            </div>
          )}

          {/* Camera Capture Area */}
          {activeSource === "camera" && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-foreground">Live Camera View</label>
              <div className="relative rounded-2xl border border-border bg-black overflow-hidden aspect-video flex items-center justify-center">
                {isCameraActive ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-gold text-slate-950 font-extrabold text-xs px-5 py-2.5 shadow-lg hover:scale-105 transition-transform"
                    >
                      <Camera className="h-4 w-4" />
                      <span>Take Photo Right Now</span>
                    </button>
                  </>
                ) : (
                  <div className="text-center p-6 space-y-3">
                    <Camera className="h-10 w-10 text-muted-foreground mx-auto" />
                    <button
                      type="button"
                      onClick={startCamera}
                      className="rounded-xl bg-gold/20 text-gold border border-gold/40 px-4 py-2 text-xs font-bold"
                    >
                      Turn On Camera
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Compressing indicator */}
          {compressing && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 flex items-center gap-3 animate-pulse">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20">
                <Zap className="h-5 w-5 text-amber-400 animate-spin" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-400">Compressing image…</p>
                <p className="text-[10px] text-muted-foreground">Optimising for fast upload</p>
              </div>
            </div>
          )}

          {/* Captured / Selected Preview */}
          {!compressing && fileDataUrl && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 flex items-center gap-3">
              {fileDataUrl.startsWith("data:image") ? (
                <img
                  src={fileDataUrl}
                  alt="Preview"
                  className="h-12 w-12 rounded-xl object-cover border border-emerald-500/40"
                />
              ) : (
                <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
                  PDF
                </div>
              )}
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold text-foreground truncate">{fileName}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-[10px] text-emerald-500 font-semibold">Ready to attach to patient profile</p>
                  {compressedSize && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/30">
                      <Zap className="h-2.5 w-2.5" />
                      Compressed · {compressedSize}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFileDataUrl(null);
                  setFileName("");
                  setCompressedSize(null);
                }}
                className="text-muted-foreground hover:text-rose-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Report Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Document Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "prescription", label: "Prescription" },
                { id: "diagnosis", label: "Diagnosis Note" },
                { id: "lab_report", label: "Lab Test" },
                { id: "other", label: "Other Record" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setReportType(t.id as any)}
                  className={`rounded-xl px-3 py-2 text-xs font-bold border transition-all ${
                    reportType === t.id
                      ? "bg-gold/20 text-gold border-gold/50 shadow-xs"
                      : "bg-background text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title / Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Report / Prescription Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Homeopathic Remedy Plan & Lab Analysis"
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none"
              required
            />
          </div>

          {/* Submit / Cancel Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={uploading || compressing || !fileDataUrl}
              className="press focus-gold rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-lg hover:opacity-95 disabled:opacity-50 flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4 text-gold-soft" />
              <span>{uploading ? "Uploading..." : compressing ? "Compressing..." : "Save to Patient Profile"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
