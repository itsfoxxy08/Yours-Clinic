import React from "react";
import { AlertTriangle, ShieldCheck, Phone, Stethoscope } from "lucide-react";

export function MedicalDisclaimer() {
  return (
    <section className="py-12 bg-secondary/30 border-t border-border/60">
      <div className="mx-auto max-w-5xl px-5 sm:px-8 xl:px-12">
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div className="space-y-3">
              <h4 className="font-serif text-lg font-medium text-foreground">
                Medical &amp; Regulatory Transparency Notice
              </h4>

              <div className="text-xs text-muted-foreground leading-relaxed space-y-2">
                <p>
                  <strong>Not a Substitute for Clinical Diagnosis:</strong> The HomeCare Essentials
                  Kit is an over-the-counter collection of standardized, sealed homeopathic remedies
                  assembled under the guidance of qualified practitioners for common, mild, and
                  self-limiting household wellness needs. It is not intended to diagnose, treat,
                  cure, or prevent any chronic disease, emergency, or acute medical condition.
                </p>
                <p>
                  <strong>No Self-Medication for Severe Ailments:</strong> Do not rely on household
                  remedies for persistent, worsening, or severe medical symptoms—including but not
                  limited to high persistent fever, acute abdominal pain, chest tightness, severe
                  burns, or neurological complaints. In any emergency, immediately contact emergency
                  medical services or visit the nearest hospital.
                </p>
                <p>
                  <strong>Prescription Compliance:</strong> All medicines contained in this kit are
                  standard, legally compliant over-the-counter (OTC) homeopathic preparations as per
                  the Drugs and Cosmetics Act &amp; Rules and Homeopathic Pharmacopoeia of India
                  (HPI). Any prescription-only formulation requested by a patient requires an
                  individualized doctor consultation and verified prescription.
                </p>
                <p>
                  <strong>Storage &amp; Handling:</strong> Keep all remedies tightly sealed in the
                  supplied protective case in a cool, dark location away from direct sunlight,
                  moisture, and strong aromatic substances (such as camphor, menthol, or perfumes).
                  Keep safely out of reach of unattended children.
                </p>
              </div>

              <div className="pt-3 border-t border-border/50 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-muted-foreground">
                  Yours Clinic · Supervised by Dr. Sumit Jha &amp; Accredited Clinicians
                </span>
                <a
                  href="/#book"
                  className="font-bold text-primary hover:underline inline-flex items-center gap-1"
                >
                  <Stethoscope className="h-3.5 w-3.5" />
                  <span>Request Clinical Guidance / Book Teleconsult</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
