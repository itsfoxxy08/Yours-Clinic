import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { DiseaseCard } from "@/components/DiseaseCard";
import { diseases } from "@/data/diseases";

export function FeaturedDiseases() {
  const featured = diseases.slice(0, 6);

  return (
    <section
      id="diseases"
      className="sanctuary rule-grid bg-card/25 px-5 py-32"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Healthcare Guide</span>
          <h2 className="mt-6 text-[2.6rem] leading-[1.08] tracking-[-0.02em] text-foreground md:text-6xl">
            Conditions We Specialize In
          </h2>
          <span className="gold-rule mx-auto mt-7 block max-w-[7rem]" />
          <p className="mt-7 text-base leading-loose text-muted-foreground">
            Essential symptoms, care recommendations, and prevention guidelines for the
            concerns we treat most often.
          </p>

        </Reveal>


        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((d, i) => (
            <Reveal key={d.slug} delay={(i % 3) * 90} className="h-full">
              <DiseaseCard disease={d} />
            </Reveal>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/diseases"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            See all general diseases <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
