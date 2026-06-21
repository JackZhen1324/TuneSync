import { useTranslations } from "next-intl";
import { Link } from "../../../i18n/routing";
import { Music4 } from "lucide-react";

export default function Footer() {
  const t = useTranslations("nav");
  const c = useTranslations("common");
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-20 border-t"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-white">
              <Music4 className="size-4" />
            </span>
            <span className="text-base font-semibold tracking-tight">
              TuneSync
            </span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-[var(--fg-muted)]">
            {c("tagline")}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
            {t("product")}
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                className="text-[var(--fg-muted)] hover:text-[var(--fg)]"
                href="/features"
              >
                {t("features")}
              </Link>
            </li>
            <li>
              <Link
                className="text-[var(--fg-muted)] hover:text-[var(--fg)]"
                href="/pricing"
              >
                {t("pricing")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
            {t("resources")}
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                className="text-[var(--fg-muted)] hover:text-[var(--fg)]"
                href="/docs"
              >
                {t("docs")}
              </Link>
            </li>
            <li>
              <Link
                className="text-[var(--fg-muted)] hover:text-[var(--fg)]"
                href="/docs/getting-started"
              >
                {t("gettingStarted")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div
        className="border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-5 py-6 text-xs text-[var(--fg-muted)] sm:flex-row">
          <p>
            © {year} TuneSync. {c("rights")}
          </p>
          <p>{c("disclaimer")}</p>
        </div>
      </div>
    </footer>
  );
}
