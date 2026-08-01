import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, CircleAlert, Stethoscope } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { DiseaseCard } from "@/components/DiseaseCard";
import { categoryLabel, diseases } from "@/data/diseases";

export const Route = createFileRoute("/diseases/$slug")({
  loader: ({ params }) => {
    const disease = diseases.find((d) => d.slug === params.slug);
    if (!disease) throw notFound();
    return { disease };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Condition not found — Yours Clinic" }, { name: "robots", content: "noindex" }],
      };
    }
    const d = loaderData.disease;
    const title = `${d.title} — Symptoms, Causes & Treatment | Yours Clinic`;
    const description = d.short;
    const url = `/diseases/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        {
          name: "keywords",
          content: [
            d.title,
            `${d.title} symptoms`,
            `${d.title} treatment`,
            `${categoryLabel(d.category)} conditions`,
            "homeopathy clinic",
          ].join(", "),
        },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            name: d.title,
            description,
            url,
            about: {
              "@type": "MedicalCondition",
              name: d.title,
              description,
              signOrSymptom: d.symptoms.map((s) => ({ "@type": "MedicalSymptom", name: s })),
              possiblePrevention: d.prevention.map((p) => ({
                "@type": "MedicalTherapy",
                name: p,
              })),
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              { "@type": "ListItem", position: 2, name: "General Diseases", item: "/diseases" },
              { "@type": "ListItem", position: 3, name: d.title, item: url },
            ],
          }),
        },
      ],
    };
  },
  component: DiseaseDetail,
});


function DiseaseDetail() {
  const { disease } = Route.useLoaderData();
  const related = diseases
    .filter((d) => d.category === disease.category && d.slug !== disease.slug)
    .slice(0, 3);

  return (
    <div className="px-5 py-16">
      <article className="mx-auto max-w-4xl">
        <Link
          to="/diseases"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> All general diseases
        </Link>

        <Reveal className="mt-8">
          <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-[var(--shadow-lift)]">
            <div className="aspect-[16/9] w-full overflow-hidden bg-primary-light sm:aspect-[21/9]">
              <img
                src={disease.image}
                alt={`${disease.title} — clinical reference photo`}
                width={1024}
                height={768}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-8 md:p-12">
              <span className="w-fit rounded-full bg-secondary px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-sage">
                {categoryLabel(disease.category)}
              </span>
              <h1 className="mt-3 text-3xl text-foreground md:text-4xl">{disease.title}</h1>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {disease.short}
              </p>
            </div>
          </div>

        </Reveal>

        <Reveal delay={40} className="mt-8">
          <section className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)] md:p-12">
            <h2 className="text-2xl text-foreground">Overview</h2>
            <div className="mt-5 space-y-4">
              {disease.overview.map((p: string) => (
                <p key={p.slice(0, 40)} className="text-base leading-relaxed text-muted-foreground">
                  {p}
                </p>
              ))}
            </div>

            {disease.types && disease.types.length > 0 && (
              <div className="mt-10">
                <h3 className="text-xl text-foreground">Types & stages</h3>
                <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                  {disease.types.map((t: { name: string; text: string }) => (
                    <div
                      key={t.name}
                      className="rounded-2xl border border-border/70 bg-secondary/40 p-5"
                    >
                      <dt className="text-sm font-semibold text-foreground">{t.name}</dt>
                      <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {t.text}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {disease.causes && disease.causes.length > 0 && (
              <div className="mt-10">
                <h3 className="text-xl text-foreground">Causes & triggers</h3>
                <ul className="mt-5 space-y-3">
                  {disease.causes.map((c: string) => (
                    <li key={c} className="flex gap-3 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </Reveal>



        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Reveal className="h-full">
            <section className="h-full rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
              <h2 className="flex items-center gap-2 text-2xl text-foreground">
                <Stethoscope className="h-5 w-5 text-sage" /> Common symptoms
              </h2>
              <ul className="mt-5 space-y-3">
                {disease.symptoms.map((s: string) => (
                  <li key={s} className="flex gap-3 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                    {s}
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>

          <Reveal delay={90} className="h-full">
            <section className="h-full rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
              <h2 className="text-2xl text-foreground">Prevention & self-care</h2>
              <ul className="mt-5 space-y-3">
                {disease.prevention.map((s: string) => (
                  <li key={s} className="flex gap-3 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                    {s}
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        </div>

        <Reveal delay={60} className="mt-6">
          <section className="rounded-3xl border border-warning/30 bg-warning/10 p-8">
            <h2 className="flex items-center gap-2 text-2xl text-foreground">
              <CircleAlert className="h-5 w-5 text-warning" /> When to see a doctor
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {disease.whenToSee}
            </p>
            <Link
              to="/"
              hash="book"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Book a consultation <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </Reveal>

        {related.length > 0 && (
          <Reveal className="mt-16">
            <h2 className="text-2xl text-foreground">Related conditions</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((d) => (
                <DiseaseCard key={d.slug} disease={d} />
              ))}
            </div>
          </Reveal>
        )}
      </article>
    </div>
  );
}
