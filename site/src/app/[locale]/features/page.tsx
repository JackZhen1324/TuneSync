import { getTranslations, setRequestLocale } from "next-intl/server";
import { Server, Music4, Mic, Disc3, Wand2, TrendingUp } from "lucide-react";
import FeatureRow from "../../../components/marketing/FeatureRow";
import CTASection from "../../../components/marketing/CTASection";

export default async function FeaturesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("features");

  return (
    <>
      <section className="container-narrow py-16 text-center md:py-24">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{t("pageTitle")}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--fg-muted)]">{t("subtitle")}</p>
      </section>

      <FeatureRow
        eyebrow={t("library.title")} title={t("library.featureTitle")} description={t("library.featureDesc")}
        bullets={[t("library.featureB1"),t("library.featureB2"),t("library.featureB3"),t("library.featureB4")]}
        screenshot="library.png" screenshotLabel={t("library.screenshot")} icon={Server}
      />
      <FeatureRow
        eyebrow={t("player.title")} title={t("player.featureTitle")} description={t("player.featureDesc")}
        bullets={[t("player.featureB1"),t("player.featureB2"),t("player.featureB3"),t("player.featureB4")]}
        screenshot="player-lyrics.png" screenshotLabel={t("player.screenshot")} icon={Music4} reverse
      />
      <FeatureRow
        eyebrow={t("karaoke.title")} title={t("karaoke.featureTitle")} description={t("karaoke.featureDesc")}
        bullets={[t("karaoke.featureB1"),t("karaoke.featureB2"),t("karaoke.featureB3"),t("karaoke.featureB4")]}
        screenshot="karaoke.png" screenshotLabel={t("karaoke.screenshot")} icon={Mic}
      />
      <FeatureRow
        eyebrow={t("ai.title")} title={t("ai.featureTitle")} description={t("ai.featureDesc")}
        bullets={[t("ai.featureB1"),t("ai.featureB2"),t("ai.featureB3"),t("ai.featureB4")]}
        screenshot="ai-dj.png" screenshotLabel={t("ai.screenshot")} icon={Disc3} reverse
      />
      <FeatureRow
        eyebrow={t("metadata.title")} title={t("metadata.featureTitle")} description={t("metadata.featureDesc")}
        bullets={[t("metadata.featureB1"),t("metadata.featureB2"),t("metadata.featureB3")]}
        screenshot="metadata.png" screenshotLabel={t("metadata.screenshot")} icon={Wand2}
      />
      <FeatureRow
        eyebrow={t("discovery.title")} title={t("discovery.featureTitle")} description={t("discovery.featureDesc")}
        bullets={[t("discovery.featureB1"),t("discovery.featureB2"),t("discovery.featureB3")]}
        screenshot="discovery.png" screenshotLabel={t("discovery.screenshot")} icon={TrendingUp} reverse
      />
      <CTASection />
    </>
  );
}
