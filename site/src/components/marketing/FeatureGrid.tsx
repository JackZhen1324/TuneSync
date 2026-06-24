"use client";

import { useTranslations } from "next-intl";
import { Server, Music4, Mic, Sparkles, Wand2, TrendingUp, type LucideIcon } from "lucide-react";
import Reveal from "./Reveal";

const ITEMS: { key: string; icon: LucideIcon }[] = [
  { key: "library", icon: Server },
  { key: "player", icon: Music4 },
  { key: "karaoke", icon: Mic },
  { key: "ai", icon: Sparkles },
  { key: "metadata", icon: Wand2 },
  { key: "discovery", icon: TrendingUp },
];

/** Halide/Bear-style compact icon+title+desc grid for secondary capabilities. */
export default function FeatureGrid() {
  const t = useTranslations("features");
  return (
    <section className="container-page py-16 md:py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t("title")}</h2>
        <p className="mt-4 text-lg text-[var(--fg-muted)]">{t("subtitle")}</p>
      </Reveal>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map(({ key, icon: Icon }, i) => (
          <Reveal key={key} delay={i * 60}>
            <article className="surface-card lift-on-hover h-full p-6">
              <span className="grid size-11 place-items-center rounded-2xl text-white shadow-[0_8px_20px_-6px_var(--brand)]"
                    style={{ background: "var(--brand)" }}>
                <Icon className="size-5" strokeWidth={1.75} />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{t(`${key}.title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--fg-muted)]">{t(`${key}.desc`)}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
