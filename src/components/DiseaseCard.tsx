import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarCheck } from "lucide-react";
import { categoryLabel, type Disease } from "@/data/diseases";
import { QuickConsultDrawer } from "@/components/QuickConsultDrawer";

export function DiseaseCard({ disease }: { disease: Disease }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/40 bg-card/50 shadow-[var(--shadow-soft)] backdrop-blur-xl transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1.4,0.36,1)] hover:-translate-y-1 hover:border-gold/40 hover:shadow-[var(--shadow-lift)]">
        <Link
          to="/diseases/$slug"
          params={{ slug: disease.slug }}
          className="relative block aspect-[4/3] w-full overflow-hidden bg-primary-light"
          tabIndex={-1}
          aria-hidden="true"
        >
          <img
            src={disease.image}
            alt=""
            loading="lazy" decoding="async"
            width={1024}
            height={768}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/45 via-transparent to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-card/80 px-3 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-gold ring-1 ring-gold/25 backdrop-blur-md">
            {categoryLabel(disease.category)}
          </span>
        </Link>

        <div className="flex flex-1 flex-col p-7">
          <h3 className="text-xl text-foreground">
            <Link
              to="/diseases/$slug"
              params={{ slug: disease.slug }}
              className="link-gold focus-gold"
            >
              {disease.title}
            </Link>
          </h3>
          <span className="gold-rule mt-4 block max-w-[3rem]" />
          <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
            {disease.short}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border/40 pt-5">
            <Link
              to="/diseases/$slug"
              params={{ slug: disease.slug }}
              className="press focus-gold inline-flex items-center gap-2 text-[0.72rem] font-extrabold uppercase tracking-[0.16em] text-primary"
            >
              Read symptoms guide
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="press focus-gold ml-auto inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-primary-foreground hover:opacity-90"
            >
              <CalendarCheck className="h-3.5 w-3.5" /> Quick consult
            </button>
          </div>
        </div>
      </article>

      <QuickConsultDrawer
        open={open}
        onClose={() => setOpen(false)}
        condition={disease.title}
      />
    </>
  );
}
