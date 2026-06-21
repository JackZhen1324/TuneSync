import { getTranslations, setRequestLocale } from "next-intl/server";
import Hero from "../../components/marketing/Hero";
import FeatureGrid from "../../components/marketing/FeatureGrid";
import ShowcaseSection from "../../components/marketing/ShowcaseSection";
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
      <FeatureGrid />

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
        screenshotLabel={t("phoneLabel")}
        tint="#a855f7"
      />

      <ShowcaseSection
        eyebrow={t("showcaseKaraokeEyebrow")}
        title={t("showcaseKaraokeTitle")}
        description={t("showcaseKaraokeDesc")}
        bullets={[
          t("showcaseKaraokeB1"),
          t("showcaseKaraokeB2"),
          t("showcaseKaraokeB3"),
        ]}
        screenshotLabel={t("phoneLabel")}
        tint="#f97316"
        reverse
      />

      <ShowcaseSection
        eyebrow={t("showcaseAIEyebrow")}
        title={t("showcaseAITitle")}
        description={t("showcaseAIDesc")}
        bullets={[
          t("showcaseAIB1"),
          t("showcaseAIB2"),
          t("showcaseAIB3"),
          t("showcaseAIB4"),
        ]}
        screenshotLabel={t("phoneLabel")}
        tint="#06b6d4"
      />

      <CTASection />
    </>
  );
}
