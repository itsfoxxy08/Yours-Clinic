import { externalLinkProps, whatsappLink } from "@/lib/social";
import { WhatsAppIcon } from "@/components/SocialLinks";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink()}
      {...externalLinkProps}
      aria-label="Chat with Yours Clinic on WhatsApp"
      className="group fixed bottom-5 right-5 z-[60] flex items-center gap-3"
    >

      <span className="pointer-events-none hidden translate-x-2 rounded-full border border-border bg-background/95 px-4 py-2 text-xs font-semibold text-foreground opacity-0 shadow-[var(--shadow-lift)] backdrop-blur transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:block">
        Need quick help? Chat on WhatsApp
      </span>
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_12px_30px_-8px_rgba(18,140,74,0.7)] transition-transform duration-300 hover:scale-105 active:scale-95">
        <WhatsAppIcon className="h-7 w-7" />
      </span>
    </a>
  );
}
