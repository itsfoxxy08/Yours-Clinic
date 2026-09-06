/**
 * clinician-service.ts
 *
 * Manages team clinicians/doctors display with local persistence,
 * image resizing to exact 4:5 portrait aspect ratio, and live updates.
 */

import sumitJha from "@/assets/team/sumit-jha.webp";
import bandanaKumari from "@/assets/team/bandana-kumari.webp";
import mnJha from "@/assets/team/mn-jha.webp";
import anshuSingh from "@/assets/team/anshu-singh.webp";
import shwetaSangini from "@/assets/team/shweta-sangini.webp";

export interface Clinician {
  id: string;
  name: string;
  reg: string; // Qualification or Title (e.g., "BHMS (HOM)", "Founder, CEO")
  photo: string; // Base64 data URL or imported asset path
  created_at?: string;
}

const STORAGE_KEY = "yc_clinicians_data_v1";

// Initial default clinicians list (Dr. Megha Anand removed)
export const DEFAULT_CLINICIANS: Clinician[] = [
  { id: "c-1", photo: sumitJha, name: "Dr. Sumit Jha", reg: "Founder, CEO" },
  { id: "c-2", photo: bandanaKumari, name: "Dr. Bandana Kumari", reg: "BHMS (HOM)" },
  { id: "c-3", photo: mnJha, name: "Dr. M.N. Jha", reg: "BHMS (HOM)" },
  { id: "c-4", photo: anshuSingh, name: "Dr. Anshu Singh", reg: "BHMS (HOM)" },
  { id: "c-5", photo: shwetaSangini, name: "Dr. Shweta Sangini", reg: "BHMS (HOM)" },
];

/**
 * Retrieve current active clinicians list
 */
export function getClinicians(): Clinician[] {
  if (typeof window === "undefined") return DEFAULT_CLINICIANS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CLINICIANS));
      return DEFAULT_CLINICIANS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error("Failed to parse stored clinicians:", e);
  }

  return DEFAULT_CLINICIANS;
}

/**
 * Save updated clinicians list & dispatch custom event for live UI update
 */
export function saveClinicians(list: Clinician[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("yc-clinicians-updated", { detail: list }));
  } catch (e) {
    console.error("Failed to save clinicians:", e);
  }
}

/**
 * Add a new clinician
 */
export function addClinician(data: { name: string; reg: string; photo: string }): Clinician {
  const current = getClinicians();
  const newClinician: Clinician = {
    id: `c-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: data.name.trim(),
    reg: data.reg.trim(),
    photo: data.photo,
    created_at: new Date().toISOString(),
  };

  const updated = [...current, newClinician];
  saveClinicians(updated);
  return newClinician;
}

/**
 * Update an existing clinician
 */
export function updateClinician(id: string, data: Partial<Omit<Clinician, "id">>): boolean {
  const current = getClinicians();
  const idx = current.findIndex((c) => c.id === id);
  if (idx === -1) return false;

  const existing = current[idx];
  if (!existing) return false;

  current[idx] = {
    ...existing,
    name: data.name !== undefined ? data.name.trim() : existing.name,
    reg: data.reg !== undefined ? data.reg.trim() : existing.reg,
    photo: data.photo !== undefined ? data.photo : existing.photo,
  };

  saveClinicians(current);
  return true;
}

/**
 * Delete a clinician by ID
 */
export function deleteClinician(id: string): boolean {
  const current = getClinicians();
  const filtered = current.filter((c) => c.id !== id);
  if (filtered.length === current.length) return false;

  saveClinicians(filtered);
  return true;
}

/**
 * Reset clinicians back to default panel
 */
export function resetCliniciansToDefault(): Clinician[] {
  saveClinicians(DEFAULT_CLINICIANS);
  return DEFAULT_CLINICIANS;
}

/**
 * Helper: Resize & crop any uploaded image file to exact 4:5 aspect ratio (e.g. 600x750)
 * matching current clinician cards seamlessly with object-fit: cover behavior.
 */
export function resizeAndCropImage(
  file: File,
  targetWidth = 600,
  targetHeight = 750,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to decode image"));
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          return reject(new Error("Failed to get 2d canvas context"));
        }

        // Calculate aspect ratios for cover fit (focused towards top/face)
        const srcAspect = img.width / img.height;
        const targetAspect = targetWidth / targetHeight;

        let renderWidth = targetWidth;
        let renderHeight = targetHeight;
        let offsetX = 0;
        let offsetY = 0;

        if (srcAspect > targetAspect) {
          // Source image is wider than target aspect ratio -> scale by height
          renderHeight = targetHeight;
          renderWidth = img.width * (targetHeight / img.height);
          offsetX = (targetWidth - renderWidth) / 2; // Center horizontally
          offsetY = 0;
        } else {
          // Source image is taller than target aspect ratio -> scale by width
          renderWidth = targetWidth;
          renderHeight = img.height * (targetWidth / img.width);
          offsetX = 0;
          offsetY = 0; // Align towards top for portrait face photos
        }

        // High quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Fill background with soft neutral color in case of PNG transparency
        ctx.fillStyle = "#f1f5f9";
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        // Draw cropped and scaled image onto canvas
        ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);

        // Export as WebP (or JPEG fallback)
        try {
          const dataUrl = canvas.toDataURL("image/webp", quality);
          resolve(dataUrl);
        } catch {
          const jpegUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(jpegUrl);
        }
      };

      if (typeof e.target?.result === "string") {
        img.src = e.target.result;
      }
    };

    reader.readAsDataURL(file);
  });
}
