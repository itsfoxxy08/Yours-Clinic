import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { TreatmentProcess } from "@/components/home/TreatmentProcess";
import { FeaturedDiseases } from "@/components/home/FeaturedDiseases";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { About } from "@/components/home/About";
import { Testimonials } from "@/components/home/Testimonials";
import { Booking } from "@/components/home/Booking";
import { JoinTeam } from "@/components/home/JoinTeam";

const title = "Yours Clinic — Homeopathic Care, Triage & Appointments";
const description =
  "Personalised homeopathic care: triage your symptoms, explore 25+ conditions treated at the clinic, and book an in-clinic or online consultation with accredited clinicians.";

const clinicians = [
  "Dr. Sumit Jha",
  "Dr. Bandana Kumari",
  "Dr. M. N. Jha",
  "Dr. Ansu Singh",
  "Dr. Megha Anand",
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
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
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
          { name: "Treatment Now", url: "/#treatment" },
          { name: "Our Clinicians", url: "/#clinicians" },
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
  component: Index,
});


function Index() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <TreatmentProcess />
      <CategoryGrid />
      <FeaturedDiseases />
      <About />
      <Testimonials />
      <Booking />
      <JoinTeam />
    </>
  );
}
