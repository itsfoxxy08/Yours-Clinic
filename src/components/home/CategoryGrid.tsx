import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { CategoryIcon } from "@/components/CategoryIcon";
import { categoryMeta, diseasesByCategory } from "@/data/diseases";

export function CategoryGrid() {
  return (
    <section id="categories" className="sanctuary px-5 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Care Departments</span>
          <h2 className="mt-6 text-[2.4rem] leading-[1.08] tracking-[-0.02em] text-foreground md:text-5xl">
            Browse by general disease category
          </h2>
          <span className="gold-rule mx-auto mt-7 block max-w-[7rem]" />
          <p className="mt-7 text-base leading-loose text-muted-foreground">
            Each department has its own page with symptoms, warning signs, and the
            conditions we treat within it.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categoryMeta.map((c, i) => (
            <Reveal key={c.value} delay={(i % 4) * 80} className="h-full">
              <Link
                to="/diseases/category/$category"
                params={{ category: c.value }}
                className="focus-gold tactile ink-bleed group flex h-full flex-col rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-accent/40">
                  <CategoryIcon name={c.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-xl leading-snug text-foreground">
                  {c.label}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {c.tagline}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  {diseasesByCategory(c.value).length}{" "}
                  {diseasesByCategory(c.value).length === 1 ? "condition" : "conditions"}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
