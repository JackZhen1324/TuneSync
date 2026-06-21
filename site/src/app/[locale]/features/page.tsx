import { getTranslations, setRequestLocale } from "next-intl/server";
import ShowcaseSection from "../../../components/marketing/ShowcaseSection";
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
      <section className="mx-auto w-full max-w-6xl px-5 py-16 text-center md:py-24">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t("pageTitle")}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--fg-muted)]">
          {t("subtitle")}
        </p>
      </section>

      <ShowcaseSection
        eyebrow={t("library.title")}
        title={t("library.featureTitle")}
        description={t("library.featureDesc")}
        bullets={[
          t("library.featureB1"),
          t("library.featureB2"),
          t("library.featureB3"),
          t("library.featureB4"),
        ]}
        screenshotLabel={t("library.screenshot")}
        tint="#3366ff"
      />

      <ShowcaseSection
        eyebrow={t("player.title")}
        title={t("player.featureTitle")}
        description={t("player.featureDesc")}
        bullets={[
          t("player.featureB1"),
          t("player.featureB2"),
          t("player.featureB3"),
          t("player.featureB4"),
        ]}
        screenshotLabel={t("player.screenshot")}
        tint="#a855f7"
        reverse
      />

      <ShowcaseSection
        eyebrow={t("karaoke.title")}
        title={t("karaoke.featureTitle")}
        description={t("karaoke.featureDesc")}
        bullets={[
          t("karaoke.featureB1"),
          t("karaoke.featureB2"),
          t("karaoke.featureB3"),
          t("karaoke.featureB4"),
        ]}
        screenshotLabel={t("karaoke.screenshot")}
        tint="#f97316"
      />

      <ShowcaseSection
        eyebrow={t("ai.title")}
        title={t("ai.featureTitle")}
        description={t("ai.featureDesc")}
        bullets={[
          t("ai.featureB1"),
          t("ai.featureB2"),
          t("ai.featureB3"),
          t("ai.featureB4"),
        ]}
        screenshotLabel={t("ai.screenshot")}
        tint="#06b6d4"
        reverse
      />

      <ShowcaseSection
        eyebrow={t("metadata.title")}
        title={t("metadata.featureTitle")}
        description={t("metadata.featureDesc")}
        bullets={[
          t("metadata.featureB1"),
          t("metadata.featureB2"),
          t("metadata.featureB3"),
        ]}
        screenshotLabel={t("metadata.screenshot")}
        tint="#10b981"
      />

      <ShowcaseSection
        eyebrow={t("discovery.title")}
        title={t("discovery.featureTitle")}
        description={t("discovery.featureDesc")}
        bullets={[
          t("discovery.featureB1"),
          t("discovery.featureB2"),
          t("discovery.featureB3"),
        ]}
        screenshotLabel={t("discovery.screenshot")}
        tint="#ec4899"
        reverse
      />

      <CTASection />
    </>
  );
}
