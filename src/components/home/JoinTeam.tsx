import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";

export function JoinTeam() {
  return (
    <section className="px-5 pb-24">
      <Reveal className="mx-auto max-w-6xl">
        <div className="flex flex-col items-start gap-6 rounded-[2rem] bg-primary px-8 py-12 text-primary-foreground md:flex-row md:items-center md:justify-between md:px-14">
          <div>
            <h3 className="font-serif text-3xl text-primary-foreground">
              Practising homeopath? Join our clinical team.
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-primary-foreground/80">
              We are expanding our panel of accredited clinicians across teleconsult and
              in-clinic care.
            </p>
          </div>
          <Link
            to="/"
            hash="book"
            className="inline-flex items-center gap-2 rounded-full bg-card px-7 py-3.5 text-sm font-semibold text-primary transition-opacity hover:opacity-90"
          >
            Get in touch <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
