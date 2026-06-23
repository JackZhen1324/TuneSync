"use client";

import { useTranslations } from "next-intl";
import { Link } from "../../../i18n/routing";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  const t = useTranslations("home");
  return (
    <section className="bg-black text-white">
      <div className="container-page grid gap-10 py-16 md:grid-cols-[1fr_auto] md:items-center md:py-20">
        <div className="max-w-2xl">
          <h2 className="display-sm text-4xl font-semibold sm:text-5xl md:text-6xl">
            {t("ctaTitle")}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/62 md:text-lg">
            {t("ctaBody")}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <Link
            href="/docs/getting-started"
            className="inline-flex items-center gap-2 rounded-md border border-white bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-transparent hover:text-white"
          >
            {t("ctaPrimary")}
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/features"
            className="inline-flex items-center rounded-md border border-white/35 px-5 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
          >
            {t("ctaSecondary")}
          </Link>
        </div>
      </div>
    </section>
  );
}
