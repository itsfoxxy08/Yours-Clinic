import type { SVGProps } from "react";
import { externalLinkProps, socialLinks, type SocialKey } from "@/lib/social";
import { cn } from "@/lib/utils";


export function WhatsAppIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 4.99L2 22l5.19-1.36a9.94 9.94 0 0 0 4.85 1.24h.01c5.5 0 9.96-4.46 9.96-9.96 0-2.66-1.04-5.16-2.92-7.04A9.89 9.89 0 0 0 12.04 2Zm0 18.18h-.01a8.27 8.27 0 0 1-4.21-1.15l-.3-.18-3.08.81.82-3-.2-.31a8.24 8.24 0 0 1-1.26-4.39c0-4.57 3.72-8.29 8.29-8.29 2.21 0 4.29.86 5.86 2.43a8.23 8.23 0 0 1 2.43 5.86c0 4.57-3.72 8.29-8.29 8.29Zm4.55-6.21c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.98-.14.16-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.44.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.11-.23-.17-.48-.29Z" />
    </svg>
  );
}

function FacebookGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#1877F2"
        d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z"
      />
      <path
        fill="#fff"
        d="m16.67 15.56.53-3.49h-3.33V9.81c0-.96.47-1.89 1.96-1.89h1.51V4.96s-1.37-.24-2.68-.24c-2.74 0-4.53 1.67-4.53 4.69v2.66H7.08v3.49h3.05V24a12.2 12.2 0 0 0 3.74 0v-8.44h2.8Z"
      />
    </svg>
  );
}

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="24" height="24" rx="6" fill="url(#ig-grad)" />
      <path
        fill="#fff"
        d="M12 6.9a5.1 5.1 0 1 0 0 10.2 5.1 5.1 0 0 0 0-10.2Zm0 8.42a3.32 3.32 0 1 1 0-6.64 3.32 3.32 0 0 1 0 6.64Zm6.5-8.62a1.19 1.19 0 1 1-2.38 0 1.19 1.19 0 0 1 2.38 0Z"
      />
    </svg>
  );
}

function YouTubeGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#FF0000"
        d="M23.5 6.9a3.02 3.02 0 0 0-2.12-2.14C19.5 4.25 12 4.25 12 4.25s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.9C0 8.79 0 12 0 12s0 3.21.5 5.1a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.21 24 12 24 12s0-3.21-.5-5.1Z"
      />
      <path fill="#fff" d="M9.6 15.57 15.82 12 9.6 8.43v7.14Z" />
    </svg>
  );
}

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#25D366" />
      <path
        fill="#fff"
        d="M17.1 6.9A7.06 7.06 0 0 0 5.98 15.4L5 19l3.7-.97a7.05 7.05 0 0 0 3.37.86h.01A7.06 7.06 0 0 0 17.1 6.9Zm-5.02 10.8a5.86 5.86 0 0 1-2.99-.82l-.21-.13-2.2.58.59-2.14-.14-.22a5.86 5.86 0 1 1 4.95 2.73Zm3.23-4.39c-.18-.09-1.05-.52-1.21-.58-.16-.06-.28-.09-.4.09-.12.18-.46.58-.56.7-.1.12-.21.13-.39.04-.18-.09-.75-.28-1.42-.88-.53-.47-.88-1.05-.99-1.23-.1-.18-.01-.27.08-.36.08-.08.18-.21.27-.31.09-.11.12-.18.18-.3.06-.12.03-.22-.01-.31-.05-.09-.4-.96-.55-1.31-.14-.35-.29-.3-.4-.31h-.34c-.12 0-.31.04-.47.22-.16.18-.62.6-.62 1.48s.64 1.71.73 1.83c.09.12 1.25 1.91 3.03 2.68.42.18.75.29 1.01.37.42.14.81.12 1.12.07.34-.05 1.05-.43 1.2-.85.15-.42.15-.77.1-.85-.04-.08-.16-.12-.34-.21Z"
      />
    </svg>
  );
}

const glyphs: Record<SocialKey, (p: { className?: string }) => React.ReactElement> = {
  facebook: FacebookGlyph,
  instagram: InstagramGlyph,
  youtube: YouTubeGlyph,
  whatsapp: WhatsAppGlyph,
};

export function SocialLinks({
  size = "md",
  className,
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  const box = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const glyph = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {socialLinks.map((s) => {
        const Glyph = glyphs[s.key];
        return (
          <li key={s.key}>
            <a
              href={s.href}
              {...externalLinkProps}
              aria-label={s.label}
              title={s.label}

              className={cn(
                "press focus-gold flex items-center justify-center rounded-full border border-border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-[var(--shadow-lift)]",
                box,
              )}
            >
              <Glyph className={glyph} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
