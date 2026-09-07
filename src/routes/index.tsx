import { abs } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { FeaturedDiseases } from "@/components/home/FeaturedDiseases";
import { About } from "@/components/home/About";
import { Awards } from "@/components/home/Awards";
import { Testimonials } from "@/components/home/Testimonials";
import { YouTubeShowcase } from "@/components/home/YouTubeShowcase";
import { Booking } from "@/components/home/Booking";
import { JoinTeam } from "@/components/home/JoinTeam";
import { youtubeVideosQuery } from "@/lib/youtube.query";
import { socialProfileUrls } from "@/lib/social";

const title = "Yours Clinic — Homeopathic Care, Triage & Appointments";
const description =
  "Personalised homeopathic care: triage your symptoms, explore 25+ conditions treated at the clinic, and book an in-clinic or online consultation with accredited clinicians.";

const clinicians = [
  "Dr. Sumit Jha",
  "Dr. Bandana Kumari",
  "Dr. M. N. Jha",
  "Dr. Ansu Singh",
  "Dr. Shweta Sangini",
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: abs("/") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: abs("/") }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MedicalClinic",
          name: "Yours Clinic",
          description,
          medicalSpecialty: "Homeopathic",
          url: "/",
          sameAs: socialProfileUrls,
          employee: clinicians.map((name) => ({
            "@type": "Physician",
            name,
            medicalSpecialty: "Homeopathic",
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify([
          { name: "Diseases", url: "/diseases" },
          { name: "Our Clinicians", url: "/#clinicians" },
          { name: "Awards", url: "/#awards" },
          { name: "Videos", url: "/#videos" },
          { name: "Book Appointment", url: "/#book" },
          { name: "About Us", url: "/#about" },
        ].map((l) => ({
          "@context": "https://schema.org",
          "@type": "SiteNavigationElement",
          name: l.name,
          url: l.url,
        }))),
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(youtubeVideosQuery),
  component: Index,
});


function Index() {
  return (
    <>
      <Hero />
      <FeaturedDiseases />
      <About />
      <Awards />
      <Testimonials />
      <YouTubeShowcase />
      <Booking />
      <JoinTeam />
    </>
  );
}
