/**
 * Single source of truth for every outbound social link.
 * `safeUrl` guards against malformed/unsafe hrefs: anything that is not a
 * well-formed https URL is dropped so we never render a broken link.
 */
export function safeUrl(url: string): string | null {
  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol !== "https:") return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

export const WHATSAPP_NUMBER = "919155577760";

export const whatsappLink = (
  text = "Hello Yours Clinic, I would like to know more about a consultation.",
) => {
  // wa.me is the canonical short link: no redirect chain, works on
  // desktop web + both mobile apps.
  const digits = WHATSAPP_NUMBER.replace(/\D/g, "");
  const url = new URL(`https://wa.me/${digits}`);
  if (text) url.searchParams.set("text", text);
  return safeUrl(url.toString()) ?? `https://wa.me/${digits}`;
};

export const YOUTUBE_HANDLE = "@DR_SUMIT_JHA";
export const YOUTUBE_CHANNEL_ID = "UCT85wqa7quQrn6OtSJHwkxA";
export const YOUTUBE_URL = `https://www.youtube.com/${YOUTUBE_HANDLE}`;
export const INSTAGRAM_URL = "https://www.instagram.com/dr.sumitjha/";
export const FACEBOOK_URL =
  "https://www.facebook.com/people/Drsumit-jha/100086681132472/";

export type SocialKey = "facebook" | "instagram" | "youtube" | "whatsapp";

export interface SocialItem {
  key: SocialKey;
  label: string;
  href: string;
}

export const socialLinks: SocialItem[] = (
  [
    { key: "facebook", label: "Facebook — Dr. Sumit Jha", href: FACEBOOK_URL },
    { key: "instagram", label: "Instagram — @dr.sumitjha", href: INSTAGRAM_URL },
    { key: "youtube", label: "YouTube — @DR_SUMIT_JHA", href: YOUTUBE_URL },
    { key: "whatsapp", label: "Chat on WhatsApp", href: whatsappLink() },
  ] satisfies SocialItem[]
)
  .map((s) => ({ ...s, href: safeUrl(s.href) ?? "" }))
  .filter((s) => s.href !== "");

export const socialProfileUrls = [FACEBOOK_URL, INSTAGRAM_URL, YOUTUBE_URL]
  .map((u) => safeUrl(u))
  .filter((u): u is string => Boolean(u));

/** Props every outbound link should spread so new tabs open safely. */
export const externalLinkProps = {
  target: "_blank",
  rel: "noopener noreferrer external",
  referrerPolicy: "no-referrer" as const,
};

