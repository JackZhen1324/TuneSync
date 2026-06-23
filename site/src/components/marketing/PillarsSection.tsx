"use client";

import { useTranslations } from "next-intl";
import {
  Server,
  Music4,
  Mic,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import Reveal from "./Reveal";

type Pillar = {
  key: "connect" | "playback" | "karaoke" | "ai";
  icon: LucideIcon;
};

const PILLARS: Pillar[] = [
  { key: "connect", icon: Server },
  { key: "playback", icon: Music4 },
  { key: "karaoke", icon: Mic },
  { key: "ai", icon: Sparkles },
];

/**
 * Codex-style "built for X" narrative grid: a row of capability blocks,
 * each led by an eyebrow + bold headline + supporting paragraph.
 */
export default function PillarsSection() {
  const t = useTranslations("home");

  return (
    <section className="bg-[var(--bg)]">
      <div className="container-page py-20 md:py-28">
      <Reveal className="max-w-3xl">
        <span className="eyebrow">{t("pillarsEyebrow")}</span>
        <h2 className="display-sm mt-4 text-4xl font-semibold sm:text-5xl md:text-6xl">
          {t("pillarsTitle")}
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--fg-muted)] md:text-lg">
          {t("pillarsSubtitle")}
        </p>
      </Reveal>

      <div className="mt-16 grid border-t border-l md:grid-cols-4" style={{ borderColor: "var(--border)" }}>
        {PILLARS.map(({ key, icon: Icon }, i) => (
          <Reveal key={key} delay={i * 80}>
            <article className="h-full border-b border-r p-6 md:min-h-80 md:p-7" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between gap-6">
                <span className="font-mono text-xs text-[var(--fg-subtle)]">
                  0{i + 1}
                </span>
                <Icon className="size-5 text-[var(--fg-muted)]" strokeWidth={1.75} />
              </div>
              <div className="mt-16">
                <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
                  {t(`pillars.${key}.title`)}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[var(--fg-muted)]">
                  {t(`pillars.${key}.desc`)}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      </div>
    </section>
  );
}
