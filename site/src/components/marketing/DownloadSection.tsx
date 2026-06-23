"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowRight, Clock3, Laptop, Monitor, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "../../../i18n/routing";
import { downloadUrl, type Platform } from "../../lib/links";

const PLATFORMS: {
  key: Platform;
  icon: LucideIcon;
}[] = [
  { key: "ios", icon: Smartphone },
  { key: "android", icon: Smartphone },
  { key: "macos", icon: Laptop },
  { key: "windows", icon: Monitor },
];

export default function DownloadSection() {
  const t = useTranslations("home");

  return (
    <section className="border-t bg-[var(--bg-elevated)]" style={{ borderColor: "var(--border)" }}>
      <div className="container-page py-16 md:py-24">
      <div className="max-w-2xl">
        <span className="eyebrow">{t("downloadEyebrow")}</span>
        <h2 className="display-sm mt-4 text-4xl font-semibold sm:text-5xl md:text-6xl">
          {t("downloadTitle")}
        </h2>
        <p className="mt-6 max-w-xl text-base leading-8 text-[var(--fg-muted)] md:text-lg">
          {t("downloadSubtitle")}
        </p>
      </div>

      <div className="mt-14 grid border-l border-t md:grid-cols-4" style={{ borderColor: "var(--border)" }}>
        {PLATFORMS.map(({ key, icon: Icon }) => {
          const label = t(`downloadPlatforms.${key}.label`);
          const description = t(`downloadPlatforms.${key}.desc`);
          const url = downloadUrl(key);
          const available = Boolean(url);

          if (available && url) {
            return (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("downloadIOSAria")}
                className="group relative border-b border-r bg-[var(--bg-deep)] p-6 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 md:min-h-72"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="relative flex h-full flex-col justify-between gap-10">
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid size-11 place-items-center border border-white/24">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="font-mono text-xs uppercase tracking-[0.14em] text-white/62">
                      {t("downloadAvailable")}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold">{label}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/70">
                      {description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
                      {t("downloadIOSAction")}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </a>
            );
          }

          return (
            <div
              key={key}
              aria-disabled="true"
              className="border-b border-r p-6 md:min-h-72"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex h-full flex-col justify-between gap-10">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-11 place-items-center border border-[var(--border-strong)] text-[var(--fg-muted)]">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em] text-[var(--fg-muted)]">
                    <Clock3 className="size-3.5" aria-hidden />
                    {t("downloadComingSoon")}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold">{label}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--fg-muted)]">
                    {description}
                  </p>
                  <p className="mt-5 text-sm font-medium text-[var(--fg-muted)]">
                    {t("downloadUnavailable")}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </section>
  );
}
