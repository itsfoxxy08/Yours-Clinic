/**
 * clinician-service.ts
 *
 * Manages team clinicians/doctors display with local persistence,
 * Supabase storage bucket & database cloud sync, image resizing to exact 4:5 portrait ratio,
 * and multi-tab live updates across all devices.
 */

import sumitJha from "@/assets/team/sumit-jha.webp";
import bandanaKumari from "@/assets/team/bandana-kumari.webp";
import mnJha from "@/assets/team/mn-jha.webp";
import anshuSingh from "@/assets/team/anshu-singh.webp";
import shwetaSangini from "@/assets/team/shweta-sangini.webp";
import { supabase, isSupabaseConfigured } from "./supabase";

export interface Clinician {
  id: string;
  name: string;
  reg: string; // Qualification or Title (e.g., "BHMS (HOM)", "Founder, CEO")
  photo: string; // Public CDN URL or Base64 data URL
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
 * Synchronous retrieval from LocalStorage / Defaults
 */
export function getClinicians(): Clinician[] {
  if (typeof window === "undefined") return DEFAULT_CLINICIANS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to parse local clinicians:", e);
  }

  // Seed default if empty
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CLINICIANS));
  } catch {}
  return DEFAULT_CLINICIANS;
}

/**
 * Save updated clinicians list locally & trigger cross-tab & custom events
 */
export function saveCliniciansLocal(list: Clinician[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("yc-clinicians-updated", { detail: list }));
  } catch (e) {
    console.error("Failed to save clinicians locally:", e);
  }
}

/**
 * Upload base64 image to Supabase Storage Bucket ('clinician-photos')
 * Returns public CDN URL if bucket exists, or base64 string as fallback.
 */
export async function uploadImageToSupabaseStorage(id: string, base64Image: string): Promise<string> {
  if (!isSupabaseConfigured() || !base64Image.startsWith("data:image")) {
    return base64Image;
  }

  try {
    // Extract format & blob from data URL
    const match = base64Image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match || !match[1] || !match[2]) return base64Image;

    const mimeType = match[1];
    const base64Data = match[2];
    const extension = mimeType.split("/")[1] || "webp";
    const fileName = `${id}.${extension}`;

    // Convert base64 string to Blob
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    // Upload to Supabase Storage bucket 'clinician-photos'
    const { data, error } = await supabase.storage
      .from("clinician-photos")
      .upload(fileName, blob, {
        contentType: mimeType,
        upsert: true,
      });

    if (!error && data) {
      const { data: publicUrlData } = supabase.storage
        .from("clinician-photos")
        .getPublicUrl(fileName);

      if (publicUrlData?.publicUrl) {
        return publicUrlData.publicUrl;
      }
    } else if (error) {
      console.info("Supabase storage bucket note (storing image in DB column):", error.message);
    }
  } catch (err) {
    console.warn("Storage upload fallback to database string:", err);
  }

  return base64Image;
}

/**
 * Fetch clinicians from Supabase Cloud Database (if configured),
 * merging into local storage and broadcasting updates.
 */
export async function fetchCliniciansFromSupabase(): Promise<Clinician[]> {
  if (!isSupabaseConfigured()) {
    return getClinicians();
  }

  try {
    const { data, error } = await supabase
      .from("clinicians")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error && data && data.length > 0) {
      const formatted: Clinician[] = data.map((item: any) => ({
        id: String(item.id),
        name: item.name,
        reg: item.reg,
        photo: item.photo,
        created_at: item.created_at,
      }));

      saveCliniciansLocal(formatted);
      return formatted;
    } else if (!error && data && data.length === 0) {
      // If table is empty, seed defaults into Supabase
      await seedSupabaseClinicians(DEFAULT_CLINICIANS);
      saveCliniciansLocal(DEFAULT_CLINICIANS);
      return DEFAULT_CLINICIANS;
    }
  } catch (err) {
    console.warn("Supabase clinicians fetch fallback to local:", err);
  }

  return getClinicians();
}

/**
 * Seed default clinicians into Supabase database table
 */
async function seedSupabaseClinicians(list: Clinician[]) {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from("clinicians").upsert(
      list.map((c) => ({
        id: c.id,
        name: c.name,
        reg: c.reg,
        photo: c.photo,
        created_at: new Date().toISOString(),
      }))
    );
  } catch (err) {
    console.warn("Could not seed default clinicians to Supabase:", err);
  }
}

/**
 * Add a new clinician (saves locally & syncs to Supabase Database & Storage)
 */
export async function addClinician(data: { name: string; reg: string; photo: string }): Promise<Clinician> {
  const current = getClinicians();
  const id = `c-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Upload image to Supabase Storage if configured
  const finalPhotoUrl = await uploadImageToSupabaseStorage(id, data.photo);

  const newClinician: Clinician = {
    id,
    name: data.name.trim(),
    reg: data.reg.trim(),
    photo: finalPhotoUrl,
    created_at: new Date().toISOString(),
  };

  const updated = [...current, newClinician];
  saveCliniciansLocal(updated);

  if (isSupabaseConfigured()) {
    try {
      await supabase.from("clinicians").insert([
        {
          id: newClinician.id,
          name: newClinician.name,
          reg: newClinician.reg,
          photo: newClinician.photo,
          created_at: newClinician.created_at,
        },
      ]);
    } catch (err) {
      console.warn("Supabase clinician insert note:", err);
    }
  }

  return newClinician;
}

/**
 * Update an existing clinician
 */
export async function updateClinician(id: string, data: Partial<Omit<Clinician, "id">>): Promise<boolean> {
  const current = getClinicians();
  const idx = current.findIndex((c) => c.id === id);
  if (idx === -1) return false;

  const existing = current[idx];
  if (!existing) return false;

  let photoUrl = existing.photo;
  if (data.photo !== undefined && data.photo !== existing.photo) {
    photoUrl = await uploadImageToSupabaseStorage(id, data.photo);
  }

  const updatedItem: Clinician = {
    ...existing,
    name: data.name !== undefined ? data.name.trim() : existing.name,
    reg: data.reg !== undefined ? data.reg.trim() : existing.reg,
    photo: photoUrl,
  };

  current[idx] = updatedItem;
  saveCliniciansLocal(current);

  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from("clinicians")
        .update({
          name: updatedItem.name,
          reg: updatedItem.reg,
          photo: updatedItem.photo,
        })
        .eq("id", id);
    } catch (err) {
      console.warn("Supabase clinician update note:", err);
    }
  }

  return true;
}

/**
 * Delete a clinician by ID
 */
export async function deleteClinician(id: string): Promise<boolean> {
  const current = getClinicians();
  const filtered = current.filter((c) => c.id !== id);
  if (filtered.length === current.length) return false;

  saveCliniciansLocal(filtered);

  if (isSupabaseConfigured()) {
    try {
      await supabase.from("clinicians").delete().eq("id", id);
      await supabase.storage.from("clinician-photos").remove([`${id}.webp`, `${id}.png`, `${id}.jpg`]);
    } catch (err) {
      console.warn("Supabase clinician delete note:", err);
    }
  }

  return true;
}

/**
 * Reset clinicians back to default panel
 */
export async function resetCliniciansToDefault(): Promise<Clinician[]> {
  saveCliniciansLocal(DEFAULT_CLINICIANS);

  if (isSupabaseConfigured()) {
    try {
      await supabase.from("clinicians").delete().neq("id", "0");
      await seedSupabaseClinicians(DEFAULT_CLINICIANS);
    } catch (err) {
      console.warn("Supabase clinician reset note:", err);
    }
  }

  return DEFAULT_CLINICIANS;
}

/**
 * Helper: Resize & crop any uploaded image file to exact 4:5 aspect ratio (e.g. 500x625)
 * matching current clinician cards seamlessly with high compression object-fit cover.
 */
export function resizeAndCropImage(
  file: File,
  targetWidth = 500,
  targetHeight = 625,
  quality = 0.80
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

        const srcAspect = img.width / img.height;
        const targetAspect = targetWidth / targetHeight;

        let renderWidth = targetWidth;
        let renderHeight = targetHeight;
        let offsetX = 0;
        let offsetY = 0;

        if (srcAspect > targetAspect) {
          renderHeight = targetHeight;
          renderWidth = img.width * (targetHeight / img.height);
          offsetX = (targetWidth - renderWidth) / 2;
          offsetY = 0;
        } else {
          renderWidth = targetWidth;
          renderHeight = img.height * (targetWidth / img.width);
          offsetX = 0;
          offsetY = 0;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.fillStyle = "#f1f5f9";
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);

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
