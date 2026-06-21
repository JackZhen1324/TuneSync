import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "../../../../i18n/routing";
import DocsArticle from "../../../components/docs/DocsArticle";
import {
  Rocket,
  Server,
  Music4,
  Mic,
  Sparkles,
  Wand2,
  TrendingUp,
  FileMusic,
  Settings,
  ArrowRight,
} from "lucide-react";

const CARDS = [
  { href: "/docs/getting-started", icon: Rocket, tint: "#3366ff", key: "gettingStarted" },
  { href: "/docs/library", icon: Server, tint: "#0ea5e9", key: "library" },
  { href: "/docs/player", icon: Music4, tint: "#a855f7", key: "player" },
  { href: "/docs/lyrics", icon: FileMusic, tint: "#8b5cf6", key: "lyrics" },
  { href: "/docs/karaoke", icon: Mic, tint: "#f97316", key: "karaoke" },
  { href: "/docs/ai", icon: Sparkles, tint: "#06b6d4", key: "ai" },
  { href: "/docs/metadata", icon: Wand2, tint: "#10b981", key: "metadata" },
  { href: "/docs/discovery", icon: TrendingUp, tint: "#ec4899", key: "discovery" },
  { href: "/docs/settings", icon: Settings, tint: "#64748b", key: "settings" },
];

export default async function DocsHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("docs");
  const tc = await getTranslations("docsNav");

  return (
    <DocsArticle path="/docs">
      <h1>{t("intro.title")}</h1>
      <p className="text-lg text-[var(--fg-muted)]">{t("intro.lead")}</p>
      <p>{t("intro.body")}</p>

      <div className="not-prose my-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map(({ href, icon: Icon, tint, key }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-3 rounded-card border p-4 transition-all hover:-translate-y-0.5 hover:shadow-card"
            style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
          >
            <span
              className="grid size-10 shrink-0 place-items-center rounded-xl text-white"
              style={{ backgroundImage: `linear-gradient(135deg, ${tint}, ${tint}cc)` }}
            >
              <Icon className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{tc(key)}</p>
            </div>
            <ArrowRight className="size-4 text-[var(--fg-muted)] transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </DocsArticle>
  );
}
