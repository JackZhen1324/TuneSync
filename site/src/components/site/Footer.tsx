import { useTranslations } from "next-intl";
import { Link } from "../../../i18n/routing";
import Logo from "./Logo";

export default function Footer() {
  const t = useTranslations("nav");
  const c = useTranslations("common");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-black text-white" style={{ borderColor: "rgb(255 255 255 / 0.18)" }}>
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo size={32} />
          <p className="mt-3 max-w-sm text-sm text-white/58">
            {c("tagline")}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
            {t("product")}
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                className="text-white/58 hover:text-white"
                href="/features"
              >
                {t("features")}
              </Link>
            </li>
            <li>
              <Link
                className="text-white/58 hover:text-white"
                href="/pricing"
              >
                {t("pricing")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
            {t("resources")}
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                className="text-white/58 hover:text-white"
                href="/docs"
              >
                {t("docs")}
              </Link>
            </li>
            <li>
              <Link
                className="text-white/58 hover:text-white"
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
        style={{ borderColor: "rgb(255 255 255 / 0.18)" }}
      >
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/45 sm:flex-row">
          <p>
            © {year} TuneSync. {c("rights")}
          </p>
          <p>{c("disclaimer")}</p>
        </div>
      </div>
    </footer>
  );
}
