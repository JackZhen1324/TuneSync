import { getTranslations, setRequestLocale } from "next-intl/server";
import { Server, Music4, Mic, Sparkles, Disc3, TrendingUp } from "lucide-react";
import Hero from "../../components/marketing/Hero";
import IntroSection from "../../components/marketing/IntroSection";
import FeatureRow from "../../components/marketing/FeatureRow";
import FeatureGrid from "../../components/marketing/FeatureGrid";
import TestimonialsSection from "../../components/marketing/TestimonialsSection";
import CTASection from "../../components/marketing/CTASection";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const f = await getTranslations("features");

  return (
    <>
      <Hero />
      <IntroSection />

      <div className="hr-soft mx-auto max-w-5xl" />

      <FeatureRow
        eyebrow={f("library.title")}
        title={f("library.featureTitle")}
        description={f("library.featureDesc")}
        bullets={[f("library.featureB1"), f("library.featureB2"), f("library.featureB3"), f("library.featureB4")]}
        screenshot="library.png"
        screenshotLabel={f("library.screenshot")}
        icon={Server}
      />
      <FeatureRow
        eyebrow={f("player.title")}
        title={f("player.featureTitle")}
        description={f("player.featureDesc")}
        bullets={[f("player.featureB1"), f("player.featureB2"), f("player.featureB3"), f("player.featureB4")]}
        screenshot="player-lyrics.png"
        screenshotLabel={f("player.screenshot")}
        icon={Music4}
        reverse
      />
      <FeatureRow
        eyebrow={f("karaoke.title")}
        title={f("karaoke.featureTitle")}
        description={f("karaoke.featureDesc")}
        bullets={[f("karaoke.featureB1"), f("karaoke.featureB2"), f("karaoke.featureB3"), f("karaoke.featureB4")]}
        screenshot="karaoke.png"
        screenshotLabel={f("karaoke.screenshot")}
        icon={Mic}
      />
      <FeatureRow
        eyebrow={f("ai.title")}
        title={f("ai.featureTitle")}
        description={f("ai.featureDesc")}
        bullets={[f("ai.featureB1"), f("ai.featureB2"), f("ai.featureB3"), f("ai.featureB4")]}
        screenshot="ai-dj.png"
        screenshotLabel={f("ai.screenshot")}
        icon={Disc3}
        reverse
      />
      <FeatureRow
        eyebrow={f("discovery.title")}
        title={f("discovery.featureTitle")}
        description={f("discovery.featureDesc")}
        bullets={[f("discovery.featureB1"), f("discovery.featureB2"), f("discovery.featureB3")]}
        screenshot="discovery.png"
        screenshotLabel={f("discovery.screenshot")}
        icon={TrendingUp}
      />

      <div className="hr-soft mx-auto max-w-5xl" />

      <FeatureGrid />
      <TestimonialsSection />
      <CTASection />
      {/* avoid unused var lint */}
      <span className="hidden">{t("phoneLabel")}</span>
    </>
  );
}
