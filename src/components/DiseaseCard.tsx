import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { categoryLabel, type Disease } from "@/data/diseases";

export function DiseaseCard({ disease }: { disease: Disease }) {
  return (
    <Link
      to="/diseases/$slug"
      params={{ slug: disease.slug }}
      className="tactile group flex h-full flex-col overflow-hidden rounded-[2rem] bg-card/55 shadow-[var(--shadow-soft)] ring-1 ring-border/50 backdrop-blur-sm hover:ring-gold/50"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-primary-light">
        <img
          src={disease.image}
          alt={`${disease.title} — clinical reference photo`}
          loading="lazy"
          width={1024}
          height={768}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-card/90 px-3 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-gold ring-1 ring-gold/30 backdrop-blur">
          {categoryLabel(disease.category)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-7">
        <h3 className="text-xl text-foreground">{disease.title}</h3>
        <span className="gold-rule mt-4 block max-w-[3rem]" />
        <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
          {disease.short}
        </p>

        <span className="mt-6 inline-flex items-center gap-2 text-[0.72rem] font-extrabold uppercase tracking-[0.18em] text-primary">
          Symptoms &amp; care
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

