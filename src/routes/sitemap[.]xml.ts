import { createFileRoute } from "@tanstack/react-router";
import { categories, diseases } from "@/data/diseases";
import { abs } from "@/lib/seo";

function urlEntry(loc: string, priority: string, changefreq = "monthly") {
  return `  <url><loc>${loc}</loc><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const entries = [
          urlEntry(abs("/"), "1.0", "weekly"),
          urlEntry(abs("/diseases"), "0.9", "weekly"),
          ...categories.map((c) => urlEntry(abs(`/diseases/category/${c}`), "0.7")),
          ...diseases.map((d) => urlEntry(abs(`/diseases/${d.slug}`), "0.8")),
        ].join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;

        return new Response(xml, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
