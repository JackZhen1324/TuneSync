import { getTranslations } from "next-intl/server";
import DocsArticle from "../../../../components/docs/DocsArticle";
import { Callout, ScreenshotPlaceholder } from "../../../../components/docs/DocContent";
import { enableStaticLocale } from "../../lib";

export default async function DiscoveryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  enableStaticLocale(locale);
  const t = await getTranslations("docs.discovery");

  return (
    <DocsArticle path="/docs/discovery">
      <h1>{t("title")}</h1>
      <p className="text-lg text-[var(--fg-muted)]">{t("lead")}</p>
      <ScreenshotPlaceholder label={t("shotDiscovery")} hint={t("shotHint")} tint="#ec4899" />

      <h2>{t("home.title")}</h2>
      <p>{t("home.body")}</p>
      <ul>
        <li>{t("home.foryou")}</li>
        <li>{t("home.most")}</li>
        <li>{t("home.recent")}</li>
        <li>{t("home.favorites")}</li>
        <li>{t("home.playlists")}</li>
        <li>{t("home.genres")}</li>
      </ul>

      <h2>{t("trends.title")}</h2>
      <p>{t("trends.body")}</p>
      <ul>
        <li>{t("trends.apple")}</li>
        <li>{t("trends.bili")}</li>
        <li>{t("trends.youtube")}</li>
        <li>{t("trends.lastfm")}</li>
      </ul>

      <h2>{t("foryou.title")}</h2>
      <p>{t("foryou.body")}</p>

      <Callout variant="tip" title={t("feedback.title")}>
        <p>{t("feedback.body")}</p>
      </Callout>

      <h2>{t("recognize.title")}</h2>
      <p>{t("recognize.body")}</p>
    </DocsArticle>
  );
}
