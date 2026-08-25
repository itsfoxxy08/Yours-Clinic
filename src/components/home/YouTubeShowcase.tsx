import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Play, Youtube } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { externalLinkProps, YOUTUBE_URL } from "@/lib/social";
import { youtubeVideosQuery } from "@/lib/youtube.query";

function formatDate(value: string) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function YouTubeShowcase() {
  const { data: videos } = useSuspenseQuery(youtubeVideosQuery);
  const [playing, setPlaying] = useState<string | null>(null);

  const featured = videos[0];
  const rest = videos.slice(1, 4);

  return (
    <section id="videos" className="border-t border-border px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div className="max-w-2xl">
            <span className="eyebrow text-sage">On YouTube</span>
            <h2 className="display-md mt-4 text-foreground">
              Watch &amp; Learn with Dr. Sumit Jha
            </h2>
            <p className="lede mt-4 text-muted-foreground">
              Health tips, clinical insights, and patient recovery stories on YouTube.
            </p>
          </div>
          <a
            href={YOUTUBE_URL}
            {...externalLinkProps}
            className="press focus-gold inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#ff0000] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <Youtube className="h-4 w-4" aria-hidden="true" /> View more on YouTube
          </a>
        </Reveal>

        {featured ? (
          <div className="mt-12 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
            <Reveal>
              <article className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-[var(--shadow-lift)]">
                <div className="relative aspect-video w-full bg-secondary">
                  {playing === featured.id ? (
                    <iframe
                      className="absolute inset-0 h-full w-full"
                      src={`https://www.youtube-nocookie.com/embed/${featured.id}?autoplay=1&rel=0`}
                      title={featured.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPlaying(featured.id)}
                      className="focus-gold group absolute inset-0 h-full w-full"
                      aria-label={`Play video: ${featured.title}`}
                    >
                      <img
                        src={featured.thumbnail}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                      <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#ff0000] text-white shadow-[0_18px_36px_-12px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-110">
                        <Play className="ml-0.5 h-7 w-7 fill-current" aria-hidden="true" />
                      </span>
                    </button>
                  )}
                </div>
                <div className="border-t border-border p-6">
                  <p className="micro-label text-sage">Latest upload</p>
                  <h3 className="mt-2 line-clamp-2 font-serif text-xl leading-snug text-foreground sm:text-2xl">
                    {featured.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {formatDate(featured.publishedAt)}
                  </p>
                </div>
              </article>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {rest.map((v, i) => (
                <Reveal key={v.id} delay={90 + i * 80}>
                  <a
                    href={`https://www.youtube.com/watch?v=${v.id}`}
                    {...externalLinkProps}
                    className="press focus-gold group flex h-full items-center gap-4 rounded-2xl border border-border bg-card p-3 transition-all duration-300 hover:-translate-y-1 hover:border-sage/50 hover:shadow-[var(--shadow-lift)]"
                  >
                    <span className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-xl bg-secondary sm:w-36">
                      <img
                        src={v.thumbnail}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff0000]/90 text-white transition-transform duration-300 group-hover:scale-110">
                          <Play className="ml-0.5 h-3.5 w-3.5 fill-current" aria-hidden="true" />
                        </span>
                      </span>
                    </span>
                    <span className="min-w-0">
                      <span className="line-clamp-2 block text-sm font-semibold leading-snug text-foreground">
                        {v.title}
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {formatDate(v.publishedAt)}
                      </span>
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        ) : (
          <Reveal className="mt-12">
            <a
              href={YOUTUBE_URL}
              {...externalLinkProps}
              className="press focus-gold flex flex-col items-start gap-4 rounded-[2rem] border border-border bg-card p-10"
            >
              <Youtube className="h-10 w-10 text-[#ff0000]" aria-hidden="true" />
              <h3 className="font-serif text-2xl text-foreground">
                Visit the channel of Dr. Sumit Jha
              </h3>
              <p className="max-w-lg text-sm text-muted-foreground">
                Weekly videos on homeopathic care, chronic condition management and
                patient recovery journeys.
              </p>
              <span className="text-sm font-semibold text-primary">
                View more on YouTube →
              </span>
            </a>
          </Reveal>
        )}
      </div>
    </section>
  );
}
