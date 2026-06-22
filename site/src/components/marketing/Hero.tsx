import { useTranslations } from "next-intl";
import { Link } from "../../../i18n/routing";
import {
  ArrowRight,
  Play,
  Server,
  ListMusic,
  Mic,
  Sparkles,
  Search,
} from "lucide-react";
import PhoneMockup from "./PhoneMockup";

export default function Hero() {
  const t = useTranslations("home");

  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--hero-grad)" }}
        aria-hidden
      />
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
        <div>
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium text-[var(--fg-muted)]"
            style={{ borderColor: "var(--border)" }}
          >
            <Sparkles className="size-3.5 text-accent-500" />
            {t("badge")}
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {t.rich("headline", {
              accent: (c) => (
                <span className="bg-gradient-to-r from-brand-500 to-accent-500 bg-clip-text text-transparent">
                  {c}
                </span>
              ),
            })}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-[var(--fg-muted)]">
            {t("subhead")}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/docs/getting-started"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-transform hover:scale-[1.02]"
            >
              {t("ctaPrimary")}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold text-[var(--fg)] transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              style={{ borderColor: "var(--border-strong)" }}
            >
              <Play className="size-4" />
              {t("ctaSecondary")}
            </Link>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-6 border-t pt-6"
              style={{ borderColor: "var(--border)" }}>
            {[
              { k: "statProviders", v: "40+" },
              { k: "statProtocols", v: "5" },
              { k: "statLangs", v: "2" },
            ].map((s) => (
              <div key={s.k}>
                <dt className="text-2xl font-bold tracking-tight">{s.v}</dt>
                <dd className="mt-1 text-xs text-[var(--fg-muted)]">
                  {t(s.k)}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-xs md:max-w-sm">
          <PhoneMockup
            screenshot="home.png"
            alt={t("phoneLabel")}
            label={t("phoneLabel")}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-col gap-2.5">
                {[
                  { icon: Server, label: t("chipServers") },
                  { icon: ListMusic, label: t("chipLibrary") },
                  { icon: Mic, label: t("chipKaraoke") },
                  { icon: Search, label: t("chipDiscover") },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2.5 rounded-xl bg-white/70 px-3 py-2 text-xs font-medium text-[var(--fg)] shadow-sm backdrop-blur dark:bg-white/10"
                  >
                    <span className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-white">
                      <Icon className="size-3.5" />
                    </span>
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </PhoneMockup>
          <div
            className="absolute -inset-6 -z-10 rounded-[3rem] blur-2xl"
            style={{
              background:
                "radial-gradient(closest-side, rgba(51,102,255,0.25), transparent)",
            }}
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}
