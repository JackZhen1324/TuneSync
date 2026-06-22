import { getTranslations } from "next-intl/server";
import DocsArticle from "../../../../components/docs/DocsArticle";
import { Callout, KeyValueTable, ScreenshotPlaceholder, Steps, Step } from "../../../../components/docs/DocContent";
import { enableStaticLocale } from "../../lib";

export default async function AiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  enableStaticLocale(locale);
  const t = await getTranslations("docs.ai");

  return (
    <DocsArticle path="/docs/ai">
      <h1>{t("title")}</h1>
      <p className="text-lg text-[var(--fg-muted)]">{t("lead")}</p>
      <ScreenshotPlaceholder
        label={t("shotAi")}
        hint={t("shotHint")}
        screenshot="ai-dj.png"
        tint="#06b6d4"
      />

      <h2>{t("setup.title")}</h2>
      <Steps>
        <Step index={1} title={t("setup.step1.title")}>
          <p>{t("setup.step1.body")}</p>
        </Step>
        <Step index={2} title={t("setup.step2.title")}>
          <p>{t("setup.step2.body")}</p>
        </Step>
        <Step index={3} title={t("setup.step3.title")}>
          <p>{t("setup.step3.body")}</p>
        </Step>
        <Step index={4} title={t("setup.step4.title")}>
          <p>{t("setup.step4.body")}</p>
        </Step>
      </Steps>

      <h2>{t("roles.title")}</h2>
      <p>{t("roles.body")}</p>
      <KeyValueTable
        rows={[
          { k: t("roles.instant.k"), v: t("roles.instant.v") },
          { k: t("roles.reasoning.k"), v: t("roles.reasoning.v") },
        ]}
      />

      <h2>{t("dj.title")}</h2>
      <p>{t("dj.body")}</p>
      <ul>
        <li>{t("dj.preview")}</li>
        <li>{t("dj.oneTap")}</li>
        <li>{t("dj.auto")}</li>
      </ul>

      <h2>{t("tools.title")}</h2>
      <p>{t("tools.body")}</p>
      <ul>
        <li>{t("tools.web")}</li>
        <li>{t("tools.fetch")}</li>
        <li>{t("tools.art")}</li>
        <li>{t("tools.lyrics")}</li>
        <li>{t("tools.library")}</li>
        <li>{t("tools.playback")}</li>
        <li>{t("tools.playlist")}</li>
        <li>{t("tools.custom")}</li>
      </ul>

      <Callout variant="tip" title={t("privacy.title")}>
        <p>{t("privacy.body")}</p>
      </Callout>

      <h2>{t("trial.title")}</h2>
      <p>{t("trial.body")}</p>
    </DocsArticle>
  );
}
