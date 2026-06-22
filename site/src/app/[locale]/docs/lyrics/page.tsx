import { getTranslations } from "next-intl/server";
import DocsArticle from "../../../../components/docs/DocsArticle";
import { Callout, KeyValueTable, ScreenshotPlaceholder } from "../../../../components/docs/DocContent";
import { enableStaticLocale } from "../../lib";

export default async function LyricsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  enableStaticLocale(locale);
  const t = await getTranslations("docs.lyrics");

  return (
    <DocsArticle path="/docs/lyrics">
      <h1>{t("title")}</h1>
      <p className="text-lg text-[var(--fg-muted)]">{t("lead")}</p>
      <ScreenshotPlaceholder
        label={t("shotLyrics")}
        hint={t("shotHint")}
        screenshot="lyrics.png"
        tint="#8b5cf6"
      />

      <h2>{t("modes.title")}</h2>
      <p>{t("modes.body")}</p>
      <ul>
        <li>{t("modes.synced")}</li>
        <li>{t("modes.reading")}</li>
      </ul>

      <h2>{t("sources.title")}</h2>
      <p>{t("sources.body")}</p>
      <KeyValueTable
        rows={[
          { k: "LRCLIB", v: t("sources.lrclib") },
          { k: "Genius", v: t("sources.genius") },
          { k: "Musixmatch", v: t("sources.musixmatch") },
          { k: t("sources.sidecar.k"), v: t("sources.sidecar.v") },
          { k: t("sources.webdav.k"), v: t("sources.webdav.v") },
        ]}
      />

      <h2>{t("import.title")}</h2>
      <p>{t("import.body")}</p>

      <h2>{t("generate.title")}</h2>
      <p>{t("generate.body")}</p>

      <Callout variant="info" title={t("confidence.title")}>
        <p>{t("confidence.body")}</p>
      </Callout>

      <h2>{t("tuning.title")}</h2>
      <p>{t("tuning.body")}</p>
      <ul>
        <li>{t("tuning.size")}</li>
        <li>{t("tuning.spacing")}</li>
        <li>{t("tuning.motion")}</li>
      </ul>
    </DocsArticle>
  );
}
