import { getTranslations } from "next-intl/server";
import DocsArticle from "../../../../components/docs/DocsArticle";
import { Callout, KeyValueTable, ScreenshotPlaceholder, Steps, Step } from "../../../../components/docs/DocContent";
import { enableStaticLocale } from "../../lib";

export default async function LibraryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  enableStaticLocale(locale);
  const t = await getTranslations("docs.library");

  return (
    <DocsArticle path="/docs/library">
      <h1>{t("title")}</h1>
      <p className="text-lg text-[var(--fg-muted)]">{t("lead")}</p>
      <ScreenshotPlaceholder
        label={t("shotLibrary")}
        hint={t("shotHint")}
        screenshot="library.png"
        tint="#0ea5e9"
      />

      <h2>{t("protocols.title")}</h2>
      <p>{t("protocols.body")}</p>
      <KeyValueTable
        rows={[
          { k: "WebDAV / WebDAVs", v: t("protocols.webdav") },
          { k: "SMB", v: t("protocols.smb") },
          { k: "NFS", v: t("protocols.nfs") },
          { k: "FTP / FTPS", v: t("protocols.ftp") },
          { k: "DAAP", v: t("protocols.daap") },
        ]}
      />

      <h2>{t("connect.title")}</h2>
      <Steps>
        <Step index={1} title={t("connect.step1.title")}>
          <p>{t("connect.step1.body")}</p>
        </Step>
        <Step index={2} title={t("connect.step2.title")}>
          <p>{t("connect.step2.body")}</p>
        </Step>
        <Step index={3} title={t("connect.step3.title")}>
          <p>{t("connect.step3.body")}</p>
        </Step>
        <Step index={4} title={t("connect.step4.title")}>
          <p>{t("connect.step4.body")}</p>
        </Step>
      </Steps>

      <Callout variant="info" title={t("discover.title")}>
        <p>{t("discover.body")}</p>
      </Callout>

      <h2>{t("indexing.title")}</h2>
      <p>{t("indexing.body")}</p>
      <p>{t("indexing.note")}</p>

      <h2>{t("playlists.title")}</h2>
      <p>{t("playlists.body")}</p>
      <ul>
        <li>{t("playlists.create")}</li>
        <li>{t("playlists.add")}</li>
        <li>{t("playlists.favorite")}</li>
      </ul>
    </DocsArticle>
  );
}
