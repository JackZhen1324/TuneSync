"use client";

import { useTranslations } from "next-intl";
import { Link } from "../../../i18n/routing";
import { ArrowRight, Play } from "lucide-react";
import PhoneMockup from "./PhoneMockup";

export default function Hero() {
  const t = useTranslations("home");

  return (
    <section
      className="relative overflow-hidden text-white"
      style={{ background: "var(--hero-grad)" }}
    >
      <div className="container-page grid min-h-[calc(100svh-4rem)] items-center gap-14 py-16 md:grid-cols-[minmax(0,1fr)_minmax(22rem,34rem)] md:py-20">
        <div className="max-w-3xl">
          <h1 className="display text-[4.7rem] font-semibold sm:text-[6.4rem] md:text-[8.5rem]">
            TuneSync
          </h1>
          <p className="display-sm mt-8 max-w-2xl text-3xl font-semibold text-white sm:text-4xl md:text-5xl">
            {t.rich("headline", {
              accent: (children) => <span>{children}</span>,
            })}
          </p>
          <p className="mt-8 max-w-xl text-base leading-8 text-white/70 md:text-lg">
            {t("subhead")}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/docs/getting-started"
              className="inline-flex items-center gap-2 rounded-md border border-white bg-white px-5 py-3 text-sm font-semibold text-[var(--bg-deep)] transition hover:bg-transparent hover:text-white"
            >
              {t("ctaPrimary")}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center gap-2 rounded-md border border-white/35 px-5 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              <Play className="size-4" />
              {t("ctaSecondary")}
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[23rem] md:max-w-[25rem]">
          <div
            className="pointer-events-none absolute -inset-8 rounded-[3rem] border border-white/10"
            aria-hidden
          />
          <PhoneMockup
            screenshot="home.png"
            alt={t("phoneLabel")}
            label={t("phoneLabel")}
          />
        </div>
      </div>
    </section>
  );
}
