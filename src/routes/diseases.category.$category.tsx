import { abs } from "@/lib/seo";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, AlertTriangle, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { DiseaseCard } from "@/components/DiseaseCard";
import { CategoryIcon } from "@/components/CategoryIcon";
import {
  categoryMeta,
  diseasesByCategory,
  getCategoryMeta,
  type DiseaseCategory,
} from "@/data/diseases";

export const Route = createFileRoute("/diseases/category/$category")({
  loader: ({ params }) => {
    const meta = getCategoryMeta(params.category);
    if (!meta) throw notFound();
    return { meta };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Category not found — Yours Clinic" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { meta } = loaderData;
    const list = diseasesByCategory(meta.value);
    const title = `${meta.label} Conditions — Yours Clinic`;
    const description = `${meta.tagline}. Symptoms, warning signs and homeopathic care for ${list
      .map((d) => d.title)
      .join(", ")}.`;
    const url = `/diseases/category/${meta.value}`;
    return {
      meta: [
        { title },
        { name: "description", content: description.slice(0, 158) },
        { property: "og:title", content: title },
        { property: "og:description", content: description.slice(0, 158) },
        { property: "og:type", content: "website" },
        { property: "og:url", content: abs(url) },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: abs(url) }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: title,
            description,
            url,
            mainEntity: {
              "@type": "ItemList",
              itemListElement: list.map((d, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: d.title,
                url: `/diseases/${d.slug}`,
              })),
            },
          }),
        },
      ],
    };
  },
  notFoundComponent: CategoryNotFound,
  component: CategoryPage,
});

function CategoryNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-32 text-center">
      <h1 className="text-4xl text-foreground">Category not found</h1>
      <p className="mt-4 text-muted-foreground">
        That care department does not exist. Browse the full library instead.
      </p>
      <Link
        to="/diseases"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
      >
        All general diseases <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function CategoryPage() {
  const { meta } = Route.useLoaderData();
  const list = diseasesByCategory(meta.value as DiseaseCategory);

  return (
    <div>
      <section className="sanctuary rule-grid px-5 pb-16 pt-16 md:pt-24">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/diseases"
            className="focus-gold inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> All general diseases
          </Link>

          <Reveal className="mt-8 flex flex-col gap-6 md:flex-row md:items-center">
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-accent/50">
              <CategoryIcon name={meta.icon} className="h-9 w-9" />
            </span>
            <div>
              <span className="eyebrow">Care Department</span>
              <h1 className="mt-3 text-[2.6rem] leading-[1.05] tracking-[-0.02em] text-foreground md:text-6xl">
                {meta.label}
              </h1>
              <p className="mt-3 text-base italic text-muted-foreground">
                {meta.tagline}
              </p>
            </div>
          </Reveal>

          <span className="gold-rule mt-10 block max-w-[9rem]" />
          <Reveal>
            <p className="mt-8 max-w-3xl text-lg leading-loose text-muted-foreground">
              {meta.intro}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-5 py-8">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="text-2xl text-foreground md:text-3xl">
              Symptoms we look for
            </h2>
            <span className="gold-rule mt-5 block max-w-[6rem]" />
          </Reveal>

          <div className="mt-10 space-y-10">
            {list.map((d, i) => (
              <Reveal key={d.slug} delay={(i % 3) * 70}>
                <article className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur md:p-8">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="text-xl text-foreground md:text-2xl">
                      {d.title}
                    </h3>
                    <Link
                      to="/diseases/$slug"
                      params={{ slug: d.slug }}
                      className="focus-gold inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
                    >
                      Full guide <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                    {d.short}
                  </p>

                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                        <ShieldCheck className="h-4 w-4 text-primary" /> Common symptoms
                      </h4>
                      <ul className="mt-3 space-y-2">
                        {d.symptoms.map((s) => (
                          <li
                            key={s}
                            className="flex gap-2 text-sm leading-relaxed text-muted-foreground"
                          >
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                        <AlertTriangle className="h-4 w-4 text-accent" /> When to seek care
                      </h4>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {d.whenToSee}
                      </p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 pt-8">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="text-2xl text-foreground md:text-3xl">
              Conditions in {meta.label}
            </h2>
            <span className="gold-rule mt-5 block max-w-[6rem]" />
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((d, i) => (
              <Reveal key={d.slug} delay={(i % 3) * 80} className="h-full">
                <DiseaseCard disease={d} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="sanctuary px-5 pb-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
            Other departments
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {categoryMeta
              .filter((c) => c.value !== meta.value)
              .map((c) => (
                <Link
                  key={c.value}
                  to="/diseases/category/$category"
                  params={{ category: c.value }}
                  className="focus-gold inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <CategoryIcon name={c.icon} className="h-4 w-4" />
                  {c.label}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
