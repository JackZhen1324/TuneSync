"use client";

import { useTranslations } from "next-intl";
import Reveal from "./Reveal";

const KEYS = ["quote1","quote2","quote3","quote4","quote5","quote6"] as const;

/** Static testimonial card grid (replaces the old marquee). */
export default function TestimonialsSection() {
  const t = useTranslations("home");
  return (
    <section className="container-page py-16 md:py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="eyebrow">{t("testimonialsEyebrow")}</span>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{t("testimonialsTitle")}</h2>
      </Reveal>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {KEYS.map((k, i) => (
          <Reveal key={k} delay={i * 60}>
            <figure className="surface-card lift-on-hover flex h-full flex-col p-6">
              <blockquote className="flex-1 text-[var(--fg)]">“{t(`testimonials.${k}.text`)}”</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full text-sm font-semibold text-white"
                      style={{ background: "var(--brand)" }}>
                  {t(`testimonials.${k}.author`).slice(0,1)}
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-[var(--fg)]">{t(`testimonials.${k}.author`)}</p>
                  <p className="text-xs text-[var(--fg-muted)]">{t(`testimonials.${k}.role`)}</p>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
