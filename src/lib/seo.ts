export const SITE_URL = "https://yoursclinic.com";

/** Build an absolute URL for canonical/OG tags from a site-relative path. */
export function abs(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
