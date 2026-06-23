"use client";

import { useTranslations } from "next-intl";
import {
  KeyRound,
  Cpu,
  Cable,
  Unlock,
  type LucideIcon,
} from "lucide-react";
import Reveal from "./Reveal";

type Point = {
  key: "byok" | "ondevice" | "protocols" | "open";
  icon: LucideIcon;
};

const POINTS: Point[] = [
  { key: "byok", icon: KeyRound },
  { key: "ondevice", icon: Cpu },
  { key: "protocols", icon: Cable },
  { key: "open", icon: Unlock },
];

/**
 * Codex-style "principles" grid: bold statement cards explaining what makes
 * TuneSync different, in the visual rhythm of a social-proof block.
 */
export default function BuiltDifferentSection() {
  const t = useTranslations("home");

  return (
    <section className="bg-black text-white">
      <div className="container-page py-20 md:py-28">
        <Reveal className="max-w-3xl">
          <span className="eyebrow text-white/56">{t("differentEyebrow")}</span>
          <h2 className="display-sm mt-4 text-4xl font-semibold sm:text-5xl md:text-6xl">
            {t("differentTitle")}
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/62 md:text-lg">
            {t("differentSubtitle")}
          </p>
        </Reveal>

        <div className="mt-16 grid border-l border-t border-white/18 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map(({ key, icon: Icon }, i) => (
            <Reveal key={key} delay={i * 70} className="h-full">
              <div className="flex h-full min-h-72 flex-col gap-5 border-b border-r border-white/18 p-7 md:p-8">
                <span className="flex items-center justify-between gap-6">
                  <span className="font-mono text-xs text-white/42">0{i + 1}</span>
                  <Icon className="size-5 text-white/62" strokeWidth={1.75} />
                </span>
                <h3 className="mt-auto text-xl font-semibold tracking-tight md:text-2xl">
                  {t(`different.${key}.title`)}
                </h3>
                <p className="text-sm leading-7 text-white/62">
                  {t(`different.${key}.desc`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
