import { getTranslations, setRequestLocale } from "next-intl/server";
import Hero from "../../components/marketing/Hero";
import TrustBar from "../../components/marketing/TrustBar";
import PillarsSection from "../../components/marketing/PillarsSection";
import DownloadSection from "../../components/marketing/DownloadSection";
import ShowcaseSection from "../../components/marketing/ShowcaseSection";
import AISection from "../../components/marketing/AISection";
import BuiltDifferentSection from "../../components/marketing/BuiltDifferentSection";
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

  return (
    <>
      <Hero />
      <TrustBar />
      <PillarsSection />

      <ShowcaseSection
        eyebrow={t("showcasePlayerEyebrow")}
        title={t("showcasePlayerTitle")}
        description={t("showcasePlayerDesc")}
        bullets={[
          t("showcasePlayerB1"),
          t("showcasePlayerB2"),
          t("showcasePlayerB3"),
          t("showcasePlayerB4"),
        ]}
        screenshot="player-lyrics.png"
        screenshotLabel={t("phoneLabel")}
        tint="#a855f7"
      />

      <div className="hr-soft mx-auto max-w-7xl" />

      <ShowcaseSection
        eyebrow={t("showcaseKaraokeEyebrow")}
        title={t("showcaseKaraokeTitle")}
        description={t("showcaseKaraokeDesc")}
        bullets={[
          t("showcaseKaraokeB1"),
          t("showcaseKaraokeB2"),
          t("showcaseKaraokeB3"),
        ]}
        screenshot="karaoke.png"
        screenshotLabel={t("phoneLabel")}
        tint="#f97316"
        reverse
      />

      <div className="hr-soft mx-auto max-w-7xl" />

      <AISection />

      <BuiltDifferentSection />
      <DownloadSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
