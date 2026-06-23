"use client";

import { useTranslations } from "next-intl";
import Reveal from "./Reveal";

type Quote = {
  key: "quote1" | "quote2" | "quote3" | "quote4" | "quote5" | "quote6";
};

const QUOTES: Quote[] = [
  { key: "quote1" },
  { key: "quote2" },
  { key: "quote3" },
  { key: "quote4" },
  { key: "quote5" },
  { key: "quote6" },
];

/**
 * Codex-style testimonials: a headline lead followed by an auto-scrolling
 * marquee of large pull-quote cards. Quotes loop seamlessly (the list is
 * duplicated for a continuous translateX track) and pause on hover.
 */
export default function TestimonialsSection() {
  const t = useTranslations("home");
  const track = [...QUOTES, ...QUOTES];

  return (
    <section
      className="border-t bg-[var(--bg)]"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="container-page py-20 md:py-28">
        <Reveal className="max-w-3xl">
          <span className="eyebrow">{t("testimonialsEyebrow")}</span>
          <h2 className="display-sm mt-4 text-4xl font-semibold sm:text-5xl md:text-6xl">
            {t("testimonialsTitle")}
          </h2>
        </Reveal>
      </div>

      {/* Edge-faded continuous marquee */}
      <div className="marquee-pause mask-fade-x overflow-hidden">
        <div className="animate-marquee flex w-max gap-6 px-8 pb-20">
          {track.map(({ key }, i) => (
            <figure
              key={`${key}-${i}`}
              className="surface-card flex w-[22rem] shrink-0 flex-col justify-between p-8 md:w-[28rem] md:p-10"
            >
              <blockquote className="text-lg leading-relaxed text-[var(--fg)] md:text-2xl md:leading-relaxed">
                “{t(`testimonials.${key}.text`)}”
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-3">
                <span
                  className="grid size-10 shrink-0 place-items-center rounded-full border text-sm font-semibold text-[var(--fg)]"
                  style={{ borderColor: "var(--border-strong)" }}
                  aria-hidden
                >
                  {t(`testimonials.${key}.author`).slice(0, 1)}
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-[var(--fg)]">
                    {t(`testimonials.${key}.author`)}
                  </p>
                  <p className="text-xs text-[var(--fg-muted)]">
                    {t(`testimonials.${key}.role`)}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
