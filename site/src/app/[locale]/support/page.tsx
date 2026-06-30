import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "../../../../i18n/routing";
import { enableStaticLocale } from "../lib";
import { Mail, BookOpen } from "lucide-react";

export default async function SupportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  enableStaticLocale(locale);
  const t = await getTranslations("support");

  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
  ];

  return (
    <div className="container-page max-w-3xl py-12 md:py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t("title")}</h1>
      <p className="mt-4 text-lg text-[var(--fg-muted)]">{t("subtitle")}</p>

      {/* Contact card */}
      <div
        className="not-prose mt-8 flex items-center gap-4 rounded-card border p-6"
        style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
      >
        <span
          className="grid size-12 shrink-0 place-items-center rounded-xl text-white"
          style={{ backgroundImage: "linear-gradient(135deg, #3366ff, #3366ffcc)" }}
        >
          <Mail className="size-6" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold">{t("contact.title")}</p>
          <a
            href="mailto:xhdp123@126.com"
            className="text-[var(--fg-muted)] hover:text-[var(--fg)]"
          >
            {t("contact.email")}: {t("contact.emailLabel")}
          </a>
          <p className="mt-1 text-xs text-[var(--fg-subtle)]">{t("contact.responseTime")}</p>
        </div>
      </div>

      {/* FAQ */}
      <h2 className="mt-12 text-xl font-semibold">{t("faq.title")}</h2>
      <div className="mt-4 space-y-6">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="rounded-card border p-5"
            style={{ borderColor: "var(--border)" }}
          >
            <p className="font-medium">{faq.q}</p>
            <p className="mt-2 text-sm text-[var(--fg-muted)]">{faq.a}</p>
          </div>
        ))}
      </div>

      {/* Documentation link */}
      <div
        className="not-prose mt-12 flex items-center gap-4 rounded-card border p-6"
        style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
      >
        <span
          className="grid size-12 shrink-0 place-items-center rounded-xl text-white"
          style={{ backgroundImage: "linear-gradient(135deg, #10b981, #10b981cc)" }}
        >
          <BookOpen className="size-6" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{t("resources.title")}</p>
          <p className="mt-1 text-sm text-[var(--fg-muted)]">{t("resources.body")}</p>
        </div>
        <Link
          href="/docs"
          className="shrink-0 rounded-btn bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          {t("resources.button")}
        </Link>
      </div>
    </div>
  );
}
