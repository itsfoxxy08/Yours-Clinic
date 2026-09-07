/**
 * image-compress.ts
 *
 * Shared utility to compress images (JPEG/PNG/WEBP) before uploading to Supabase.
 * PDFs are passed through unchanged.
 *
 * Strategy:
 *  - Resize so the longest side is ≤ maxDimension (default 1600px)
 *  - Re-encode as WebP at `quality` (default 0.75)
 *  - Falls back to JPEG if WebP is unsupported by the browser
 *  - Returns the compressed data-URL string
 */

export interface CompressOptions {
  /** Max pixels for the longest dimension. Default: 1600 */
  maxDimension?: number;
  /** Encoding quality 0–1. Default: 0.75 */
  quality?: number;
}

/**
 * Compress a base64 data-URL image.
 * Non-image data-URLs (e.g. PDFs) are returned as-is.
 */
export function compressDataUrl(
  dataUrl: string,
  options: CompressOptions = {}
): Promise<string> {
  const { maxDimension = 1600, quality = 0.75 } = options;

  // Skip non-images (e.g. PDFs)
  if (!dataUrl.startsWith("data:image")) {
    return Promise.resolve(dataUrl);
  }

  return new Promise((resolve) => {
    const img = new Image();

    img.onerror = () => {
      // If decode fails, return original without crashing
      console.warn("[compress] Failed to decode image, using original.");
      resolve(dataUrl);
    };

    img.onload = () => {
      try {
        let { width, height } = img;

        // Scale down if either dimension exceeds max
        if (width > maxDimension || height > maxDimension) {
          if (width >= height) {
            height = Math.round((height / width) * maxDimension);
            width = maxDimension;
          } else {
            width = Math.round((width / height) * maxDimension);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first (best compression), fallback to JPEG
        try {
          const webp = canvas.toDataURL("image/webp", quality);
          // Some browsers return PNG when WebP is unsupported — detect by size
          if (webp.length < dataUrl.length || webp.startsWith("data:image/webp")) {
            resolve(webp);
          } else {
            resolve(canvas.toDataURL("image/jpeg", quality));
          }
        } catch {
          resolve(canvas.toDataURL("image/jpeg", quality));
        }
      } catch (err) {
        console.warn("[compress] Canvas error, using original:", err);
        resolve(dataUrl);
      }
    };

    img.src = dataUrl;
  });
}

/**
 * Compress a File object and return a compressed data-URL.
 * PDFs are returned as their original data-URL without modification.
 */
export function compressFile(
  file: File,
  options: CompressOptions = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Pass PDFs straight through
    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Failed to read PDF file"));
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.onload = async () => {
      try {
        const compressed = await compressDataUrl(reader.result as string, options);
        resolve(compressed);
      } catch (err) {
        resolve(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Human-readable file size from byte count.
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Estimate compressed size from a data-URL string.
 * (data-URL base64 ≈ 0.75 × raw bytes)
 */
export function estimateDataUrlBytes(dataUrl: string): number {
  const base64 = dataUrl.split(",")[1] || "";
  return Math.round((base64.length * 3) / 4);
}
