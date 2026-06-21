import type { LucideIcon } from "lucide-react";
import { ArrowRight, Clock3, Laptop, Monitor, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "../../../i18n/routing";

const PLATFORMS: {
  key: "ios" | "android" | "macos" | "windows";
  icon: LucideIcon;
  available: boolean;
}[] = [
  { key: "ios", icon: Smartphone, available: true },
  { key: "android", icon: Smartphone, available: false },
  { key: "macos", icon: Laptop, available: false },
  { key: "windows", icon: Monitor, available: false },
];

export default function DownloadSection() {
  const t = useTranslations("home");

  return (
    <section
      aria-labelledby="download-heading"
      className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16"
    >
      <div className="max-w-2xl">
        <span className="text-xs font-semibold uppercase text-accent-500">
          {t("downloadEyebrow")}
        </span>
        <h2 id="download-heading" className="mt-2 text-3xl font-bold sm:text-4xl">
          {t("downloadTitle")}
        </h2>
        <p className="mt-4 text-lg text-[var(--fg-muted)]">
          {t("downloadSubtitle")}
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLATFORMS.map(({ key, icon: Icon, available }) => {
          const label = t(`downloadPlatforms.${key}.label`);
          const description = t(`downloadPlatforms.${key}.desc`);

          if (available) {
            return (
              <Link
                key={key}
                href="/docs/getting-started"
                aria-label={t("downloadIOSAria")}
                className="group relative overflow-hidden rounded-card bg-gradient-to-br from-brand-500 to-accent-500 p-5 text-white shadow-lg shadow-brand-500/20 transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
              >
                <div className="absolute inset-0 bg-white/0 transition-colors group-hover:bg-white/10" />
                <div className="relative flex h-full min-h-44 flex-col justify-between gap-6">
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid size-11 place-items-center rounded-2xl bg-white/20 shadow-sm">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                      {t("downloadAvailable")}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{label}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/85">
                      {description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
                      {t("downloadIOSAction")}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          }

          return (
            <div
              key={key}
              aria-disabled="true"
              className="rounded-card border p-5 opacity-80"
              style={{
                borderColor: "var(--border)",
                background: "var(--bg-elevated)",
              }}
            >
              <div className="flex h-full min-h-44 flex-col justify-between gap-6">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-11 place-items-center rounded-2xl bg-black/5 text-[var(--fg-muted)] dark:bg-white/10">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold text-[var(--fg-muted)]"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <Clock3 className="size-3.5" aria-hidden />
                    {t("downloadComingSoon")}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--fg-muted)]">
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
    </section>
  );
}
