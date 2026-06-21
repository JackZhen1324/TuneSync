import { useTranslations } from "next-intl";
import {
  Server,
  Music4,
  Mic,
  Sparkles,
  Wand2,
  TrendingUp,
} from "lucide-react";
import FeatureIcon from "./FeatureIcon";

const FEATURES = [
  { key: "library", icon: Server, tint: "#3366ff" },
  { key: "player", icon: Music4, tint: "#a855f7" },
  { key: "karaoke", icon: Mic, tint: "#f97316" },
  { key: "ai", icon: Sparkles, tint: "#06b6d4" },
  { key: "metadata", icon: Wand2, tint: "#10b981" },
  { key: "discovery", icon: TrendingUp, tint: "#ec4899" },
] as const;

export default function FeatureGrid() {
  const t = useTranslations("features");

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-4 text-lg text-[var(--fg-muted)]">{t("subtitle")}</p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ key, icon, tint }) => (
          <article
            key={key}
            className="group rounded-card border p-6 transition-all hover:-translate-y-0.5 hover:shadow-card"
            style={{
              borderColor: "var(--border)",
              background: "var(--bg-elevated)",
            }}
          >
            <FeatureIcon icon={icon} tint={tint} />
            <h3 className="mt-4 text-lg font-semibold">{t(`${key}.title`)}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--fg-muted)]">
              {t(`${key}.desc`)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
