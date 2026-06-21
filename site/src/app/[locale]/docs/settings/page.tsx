import { getTranslations } from "next-intl/server";
import DocsArticle from "../../../../components/docs/DocsArticle";
import { Callout, KeyValueTable, ScreenshotPlaceholder } from "../../../../components/docs/DocContent";
import { enableStaticLocale } from "../../lib";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  enableStaticLocale(locale);
  const t = await getTranslations("docs.settings");

  return (
    <DocsArticle path="/docs/settings">
      <h1>{t("title")}</h1>
      <p className="text-lg text-[var(--fg-muted)]">{t("lead")}</p>
      <ScreenshotPlaceholder label={t("shotSettings")} hint={t("shotHint")} tint="#64748b" />

      <h2>{t("appearance.title")}</h2>
      <KeyValueTable
        rows={[
          { k: t("appearance.theme.k"), v: t("appearance.theme.v") },
          { k: t("appearance.language.k"), v: t("appearance.language.v") },
        ]}
      />

      <h2>{t("animation.title")}</h2>
      <p>{t("animation.body")}</p>
      <ul>
        <li>{t("animation.height")}</li>
        <li>{t("animation.ramp")}</li>
        <li>{t("animation.delay")}</li>
      </ul>

      <h2>{t("cache.title")}</h2>
      <p>{t("cache.body")}</p>

      <h2>{t("tasks.title")}</h2>
      <p>{t("tasks.body")}</p>
      <ul>
        <li>{t("tasks.indexing")}</li>
        <li>{t("tasks.metadata")}</li>
        <li>{t("tasks.separation")}</li>
        <li>{t("tasks.lyrics")}</li>
      </ul>

      <Callout variant="info" title={t("guide.title")}>
        <p>{t("guide.body")}</p>
      </Callout>

      <h2>{t("about.title")}</h2>
      <p>{t("about.body")}</p>
    </DocsArticle>
  );
}
