import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { KIT_FAQS } from "@/data/homecare-kit";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="py-16 lg:py-24 border-t border-border/50">
      <div className="mx-auto max-w-4xl px-5 sm:px-8 xl:px-12">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400">
            Frequently Asked Questions
          </span>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-foreground">
            Questions? We’re Here to Help.
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Clear, honest answers about the HomeCare Essentials Kit, shipping, consultation, and
            safety.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-3.5">
          {KIT_FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "border-primary/40 bg-card shadow-sm"
                    : "border-border/80 bg-card/60 hover:bg-card hover:border-border"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-hidden"
                >
                  <span className="font-serif text-lg sm:text-xl font-medium text-foreground">
                    {faq.question}
                  </span>
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? "bg-primary text-primary-foreground rotate-180"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border/40">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Additional Help Callout */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-secondary/40 border border-border/60">
          <p className="text-sm text-muted-foreground">Have a question that isn't answered here?</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:care@yoursclinic.com"
              className="text-xs font-bold text-primary hover:underline"
            >
              Email Clinical Desk: care@yoursclinic.com
            </a>
            <span className="text-muted-foreground text-xs">•</span>
            <a
              href="tel:+919876543210"
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Call Clinic Helpline
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
