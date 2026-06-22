import { getTranslations } from "next-intl/server";
import DocsArticle from "../../../../components/docs/DocsArticle";
import { Callout, KeyValueTable, ScreenshotPlaceholder } from "../../../../components/docs/DocContent";
import { enableStaticLocale } from "../../lib";

export default async function MetadataPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  enableStaticLocale(locale);
  const t = await getTranslations("docs.metadata");

  return (
    <DocsArticle path="/docs/metadata">
      <h1>{t("title")}</h1>
      <p className="text-lg text-[var(--fg-muted)]">{t("lead")}</p>
      <ScreenshotPlaceholder
        label={t("shotMetadata")}
        hint={t("shotHint")}
        screenshot="metadata.png"
        tint="#10b981"
      />

      <h2>{t("sources.title")}</h2>
      <p>{t("sources.body")}</p>
      <KeyValueTable
        rows={[
          { k: "iTunes", v: t("sources.itunes") },
          { k: "MusicBrainz", v: t("sources.musicbrainz") },
          { k: "Deezer", v: t("sources.deezer") },
          { k: "AI", v: t("sources.ai") },
          { k: t("sources.embedded.k"), v: t("sources.embedded.v") },
        ]}
      />

      <h2>{t("single.title")}</h2>
      <p>{t("single.body")}</p>

      <h2>{t("album.title")}</h2>
      <p>{t("album.body")}</p>
      <ul>
        <li>{t("album.tracklist")}</li>
        <li>{t("album.missing")}</li>
        <li>{t("album.intro")}</li>
      </ul>

      <h2>{t("artist.title")}</h2>
      <p>{t("artist.body")}</p>

      <h2>{t("weights.title")}</h2>
      <p>{t("weights.body")}</p>

      <h2>{t("batch.title")}</h2>
      <p>{t("batch.body")}</p>

      <Callout variant="info" title={t("history.title")}>
        <p>{t("history.body")}</p>
      </Callout>
    </DocsArticle>
  );
}
