import { useTranslations } from "next-intl";
import { Link } from "../../../i18n/routing";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  const t = useTranslations("home");
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-16">
      <div
        className="relative overflow-hidden rounded-card border px-8 py-14 text-center md:px-16"
        style={{
          borderColor: "var(--border)",
          background: "var(--hero-grad), var(--bg-elevated)",
        }}
      >
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("ctaTitle")}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--fg-muted)]">
          {t("ctaBody")}
        </p>
        <Link
          href="/docs/getting-started"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-transform hover:scale-[1.02]"
        >
          {t("ctaPrimary")}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
