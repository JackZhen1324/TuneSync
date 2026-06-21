import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "../../../i18n/routing";
import { findDocMeta } from "./nav";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function DocsArticle({
  path,
  children,
}: {
  path: string;
  children: ReactNode;
}) {
  const t = useTranslations("docsNav");
  const { prev, next } = findDocMeta(path);

  return (
    <article className="prose-doc">
      {children}
      <nav
        className="mt-16 grid gap-4 border-t pt-8 sm:grid-cols-2"
        style={{ borderColor: "var(--border)" }}
      >
        {prev ? (
          <Link
            href={prev.href}
            className="group flex items-center gap-3 rounded-xl border p-4 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            style={{ borderColor: "var(--border)" }}
          >
            <ArrowLeft className="size-4 text-[var(--fg-muted)] transition-transform group-hover:-translate-x-0.5" />
            <div>
              <p className="text-xs text-[var(--fg-muted)]">{t("previous")}</p>
              <p className="text-sm font-medium">
                {t(prev.labelKey.replace("docsNav.", ""))}
              </p>
            </div>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={next.href}
            className="group flex items-center justify-end gap-3 rounded-xl border p-4 text-right transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            style={{ borderColor: "var(--border)" }}
          >
            <div>
              <p className="text-xs text-[var(--fg-muted)]">{t("next")}</p>
              <p className="text-sm font-medium">
                {t(next.labelKey.replace("docsNav.", ""))}
              </p>
            </div>
            <ArrowRight className="size-4 text-[var(--fg-muted)] transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
