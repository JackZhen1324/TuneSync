import { getTranslations } from "next-intl/server";
import DocsArticle from "../../../../components/docs/DocsArticle";
import { Callout, ScreenshotPlaceholder, Steps, Step } from "../../../../components/docs/DocContent";
import { enableStaticLocale } from "../../lib";

export default async function KaraokePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  enableStaticLocale(locale);
  const t = await getTranslations("docs.karaoke");

  return (
    <DocsArticle path="/docs/karaoke">
      <h1>{t("title")}</h1>
      <p className="text-lg text-[var(--fg-muted)]">{t("lead")}</p>
      <ScreenshotPlaceholder
        label={t("shotKaraoke")}
        hint={t("shotHint")}
        screenshot="karaoke.png"
        tint="#f97316"
      />

      <h2>{t("how.title")}</h2>
      <p>{t("how.body")}</p>

      <h2>{t("flow.title")}</h2>
      <Steps>
        <Step index={1} title={t("flow.step1.title")}>
          <p>{t("flow.step1.body")}</p>
        </Step>
        <Step index={2} title={t("flow.step2.title")}>
          <p>{t("flow.step2.body")}</p>
        </Step>
        <Step index={3} title={t("flow.step3.title")}>
          <p>{t("flow.step3.body")}</p>
        </Step>
        <Step index={4} title={t("flow.step4.title")}>
          <p>{t("flow.step4.body")}</p>
        </Step>
      </Steps>

      <h2>{t("balance.title")}</h2>
      <p>{t("balance.body")}</p>

      <h2>{t("record.title")}</h2>
      <p>{t("record.body")}</p>
      <ul>
        <li>{t("record.countdown")}</li>
        <li>{t("record.meter")}</li>
        <li>{t("record.pause")}</li>
        <li>{t("record.save")}</li>
      </ul>

      <Callout variant="warning" title={t("model.title")}>
        <p>{t("model.body")}</p>
      </Callout>

      <h2>{t("recordings.title")}</h2>
      <p>{t("recordings.body")}</p>

      <h2>{t("live.title")}</h2>
      <p>{t("live.body")}</p>
    </DocsArticle>
  );
}
