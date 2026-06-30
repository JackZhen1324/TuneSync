import { useTranslations } from "next-intl";
import { Link } from "../../../i18n/routing";
import Logo from "./Logo";

export default function Footer() {
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t" style={{ borderColor: "var(--border)" }}>
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Logo size={30} />
            <p className="mt-4 max-w-xs text-sm text-[var(--fg-muted)]">
              {tCommon("tagline")}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-subtle)]">
              {tNav("product")}
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link className="text-[var(--fg-muted)] hover:text-[var(--fg)]" href="/features">{tNav("features")}</Link></li>
              <li><Link className="text-[var(--fg-muted)] hover:text-[var(--fg)]" href="/docs/getting-started">{tNav("gettingStarted")}</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-subtle)]">
              {tNav("resources")}
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link className="text-[var(--fg-muted)] hover:text-[var(--fg)]" href="/docs">{tNav("docs")}</Link></li>
              <li><Link className="text-[var(--fg-muted)] hover:text-[var(--fg)]" href="/support">{tNav("support")}</Link></li>
              <li><Link className="text-[var(--fg-muted)] hover:text-[var(--fg)]" href="/privacy">{tNav("privacy")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t pt-6 text-xs text-[var(--fg-subtle)] sm:flex-row"
             style={{ borderColor: "var(--border)" }}>
          <p>© {year} TuneSync. {tCommon("rights")}</p>
          <p>{tCommon("disclaimer")}</p>
        </div>
      </div>
    </footer>
  );
}
