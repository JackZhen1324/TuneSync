import { getTranslations } from "next-intl/server";
import DocsArticle from "../../../../components/docs/DocsArticle";
import { Steps, Step, Callout, ScreenshotPlaceholder } from "../../../../components/docs/DocContent";
import { enableStaticLocale } from "../../lib";

export default async function GettingStartedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  enableStaticLocale(locale);
  const t = await getTranslations("docs.gettingStarted");

  return (
    <DocsArticle path="/docs/getting-started">
      <h1>{t("title")}</h1>
      <p className="text-lg text-[var(--fg-muted)]">{t("lead")}</p>
      <ScreenshotPlaceholder label={t("shotWelcome")} hint={t("shotHint")} tint="#3366ff" />

      <h2>{t("overview.title")}</h2>
      <p>{t("overview.body")}</p>

      <h2>{t("guide.title")}</h2>
      <Steps>
        <Step index={1} title={t("step1.title")}>
          <p>{t("step1.body")}</p>
        </Step>
        <Step index={2} title={t("step2.title")}>
          <p>{t("step2.body")}</p>
        </Step>
        <Step index={3} title={t("step3.title")}>
          <p>{t("step3.body")}</p>
        </Step>
        <Step index={4} title={t("step4.title")}>
          <p>{t("step4.body")}</p>
        </Step>
      </Steps>

      <Callout variant="tip" title={t("tip.title")}>
        <p>{t("tip.body")}</p>
      </Callout>

      <h2>{t("permissions.title")}</h2>
      <p>{t("permissions.body")}</p>
      <ul>
        <li>{t("permissions.localNetwork")}</li>
        <li>{t("permissions.microphone")}</li>
        <li>{t("permissions.speech")}</li>
        <li>{t("permissions.applemusic")}</li>
      </ul>

      <h2>{t("next.title")}</h2>
      <p>{t("next.body")}</p>
    </DocsArticle>
  );
}
