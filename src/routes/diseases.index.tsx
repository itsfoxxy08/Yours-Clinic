import { useMemo, useState } from "react";
import { abs } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { DiseaseCard } from "@/components/DiseaseCard";
import {
  additionalConditions,
  diseases,
  type DiseaseCategory,
} from "@/data/diseases";


const title = "General Diseases Library — Yours Clinic";
const description =
  "Browse general diseases treated at Yours Clinic. Search by name or category for symptoms, when to see a doctor, and prevention guidance.";

export const Route = createFileRoute("/diseases/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content: diseases
          .map((d) => d.title)
          .concat("general diseases", "symptoms and treatment", "homeopathy clinic")
          .join(", "),
      },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: abs("/diseases") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: abs("/diseases") }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: title,
          description,
          url: "/diseases",
          mainEntity: {
            "@type": "ItemList",
            itemListElement: diseases.map((d, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: d.title,
              url: `/diseases/${d.slug}`,
            })),
          },
        }),
      },
    ],
  }),
  component: DiseasesIndex,
});


function DiseasesIndex() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<DiseaseCategory | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return diseases.filter((d) => {
      const matchesCategory = category === "all" || d.category === category;
      const matchesQuery =
        !q ||
        d.title.toLowerCase().includes(q) ||
        d.short.toLowerCase().includes(q) ||
        d.symptoms.some((s) => s.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div className="px-5 py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-sage">
            Healthcare Guide
          </span>
          <h1 className="mt-4 text-4xl text-foreground md:text-5xl">General Diseases</h1>
        </Reveal>

        {filtered.length === 0 ? (
          <p className="mt-16 text-center text-sm text-muted-foreground">
            No conditions match “{query}”. Try a different search term.
          </p>
        ) : (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((d, i) => (
              <Reveal key={d.slug} delay={(i % 3) * 80} className="h-full">
                <DiseaseCard disease={d} />
              </Reveal>
            ))}
          </div>
        )}

        <Reveal className="mt-24">
          <div className="rounded-[2rem] border border-border bg-card p-8 shadow-[var(--shadow-soft)] md:p-12">
            <h2 className="text-3xl text-foreground">More conditions we treat</h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Beyond the detailed guides above, our clinicians regularly treat the
              following complaints. Mention any of them when you book and we will
              plan the consultation around it.
            </p>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {additionalConditions.map((g) => (
                <div key={g.group}>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-sage">
                    {g.group}
                  </h3>
                  <ul className="mt-4 space-y-2">
                    {g.items.map((item) => (
                      <li key={item} className="text-sm text-muted-foreground">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>

  );
}
