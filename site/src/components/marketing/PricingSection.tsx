"use client";

import { useTranslations } from "next-intl";
import { Check, Sparkles } from "lucide-react";
import AppStoreBadge from "../site/AppStoreBadge";
import Reveal from "./Reveal";

export default function PricingSection() {
  const t = useTranslations("pricing");
  const free = t.raw("free.benefits") as string[];
  const vip = t.raw("vip.benefits") as string[];

  return (
    <section className="container-page py-16 md:py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="eyebrow">{t("badge")}</span>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{t("title")}</h2>
        <p className="mt-4 text-lg text-[var(--fg-muted)]">{t("subtitle")}</p>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {/* Free */}
        <Reveal>
          <div className="surface-card h-full p-8">
            <h3 className="text-xl font-semibold">{t("free.title")}</h3>
            <p className="mt-1 text-sm text-[var(--fg-muted)]">{t("free.subtitle")}</p>
            <ul className="mt-6 space-y-3">
              {free.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full"
                        style={{ background: "var(--brand-soft)", color: "var(--brand)" }}>
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* VIP */}
        <Reveal delay={100}>
          <div className="surface-card relative h-full overflow-hidden p-8"
               style={{ borderColor: "var(--brand)", boxShadow: "0 12px 40px -12px var(--brand-soft)" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-full text-white" style={{ background: "var(--brand)" }}>
                  <Sparkles className="size-3.5" />
                </span>
                <h3 className="text-xl font-semibold">{t("vip.title")}</h3>
              </div>
            </div>
            <p className="mt-1 text-sm text-[var(--fg-muted)]">{t("vip.subtitle")}</p>
            <ul className="mt-6 space-y-3">
              {vip.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-white" style={{ background: "var(--brand)" }}>
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8"><AppStoreBadge height={44} /></div>
          </div>
        </Reveal>
      </div>

      <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-[var(--fg-subtle)]">{t("note")}</p>
    </section>
  );
}
