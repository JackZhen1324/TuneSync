"use client";

import { useTranslations } from "next-intl";
import { Layers, Disc3, Wrench, type LucideIcon } from "lucide-react";
import Reveal from "./Reveal";
import PhoneMockup from "./PhoneMockup";

type Card = { key: "dual" | "dj" | "tools"; icon: LucideIcon };

const CARDS: Card[] = [
  { key: "dual", icon: Layers },
  { key: "dj", icon: Disc3 },
  { key: "tools", icon: Wrench },
];

/**
 * Dedicated spotlight for the AI assistant — deliberately breaks from the
 * alternating ShowcaseSection template so the key differentiator gets its
 * own moment: a featured phone shot beside a stack of capability cards.
 */
export default function AISection() {
  const t = useTranslations("home");

  return (
    <section className="border-t bg-[var(--bg)]" style={{ borderColor: "var(--border)" }}>
      <div className="container-page py-20 md:py-28">
        <Reveal className="max-w-3xl">
          <span className="eyebrow">{t("showcaseAIEyebrow")}</span>
          <h2 className="display-sm mt-4 text-4xl font-semibold sm:text-5xl md:text-6xl">
            {t("showcaseAITitle")}
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--fg-muted)] md:text-lg">
            {t("showcaseAIDesc")}
          </p>
        </Reveal>

        <div className="mt-16 grid items-center gap-12 md:grid-cols-[minmax(18rem,26rem)_1fr] md:gap-20">
          <Reveal className="order-2 md:order-1">
            <div className="relative mx-auto w-full max-w-[18rem] md:max-w-sm">
              <PhoneMockup screenshot="ai-dj.png" alt={t("showcaseAITitle")} />
            </div>
          </Reveal>

          <div className="order-1 border-t md:order-2" style={{ borderColor: "var(--border)" }}>
            {CARDS.map(({ key, icon: Icon }, i) => (
              <Reveal key={key} delay={i * 90}>
                <article className="grid gap-6 border-b py-8 sm:grid-cols-[3rem_1fr]" style={{ borderColor: "var(--border)" }}>
                  <span className="grid size-11 shrink-0 place-items-center border border-[var(--border-strong)] text-[var(--fg)]">
                    <Icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
                      {t(`aiSpot.cards.${key}.title`)}
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--fg-muted)] md:text-base">
                      {t(`aiSpot.cards.${key}.desc`)}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
