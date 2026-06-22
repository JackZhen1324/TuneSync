import { getTranslations } from "next-intl/server";
import DocsArticle from "../../../../components/docs/DocsArticle";
import { Callout, ScreenshotPlaceholder } from "../../../../components/docs/DocContent";
import { enableStaticLocale } from "../../lib";

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  enableStaticLocale(locale);
  const t = await getTranslations("docs.player");

  return (
    <DocsArticle path="/docs/player">
      <h1>{t("title")}</h1>
      <p className="text-lg text-[var(--fg-muted)]">{t("lead")}</p>
      <ScreenshotPlaceholder
        label={t("shotPlayer")}
        hint={t("shotHint")}
        screenshot="player-lyrics.png"
        tint="#a855f7"
      />

      <h2>{t("modes.title")}</h2>
      <p>{t("modes.body")}</p>
      <ul>
        <li>{t("modes.normal")}</li>
        <li>{t("modes.lyrics")}</li>
        <li>{t("modes.queue")}</li>
      </ul>

      <h2>{t("controls.title")}</h2>
      <p>{t("controls.body")}</p>
      <ul>
        <li>{t("controls.play")}</li>
        <li>{t("controls.scrub")}</li>
        <li>{t("controls.shuffle")}</li>
        <li>{t("controls.speed")}</li>
        <li>{t("controls.airplay")}</li>
      </ul>

      <h2>{t("menu.title")}</h2>
      <p>{t("menu.body")}</p>
      <ul>
        <li>{t("menu.importLrc")}</li>
        <li>{t("menu.searchLyrics")}</li>
        <li>{t("menu.generateLyrics")}</li>
        <li>{t("menu.searchMetadata")}</li>
        <li>{t("menu.aiDj")}</li>
        <li>{t("menu.sleep")}</li>
      </ul>

      <h2>{t("queue.title")}</h2>
      <p>{t("queue.body")}</p>

      <Callout variant="tip" title={t("bg.title")}>
        <p>{t("bg.body")}</p>
      </Callout>
    </DocsArticle>
  );
}
