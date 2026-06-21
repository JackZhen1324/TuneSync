import { getTranslations, setRequestLocale } from "next-intl/server";
import { Check, Crown, Sparkles } from "lucide-react";

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pricing");

  const freeBenefits = t.raw("free.benefits") as string[];
  const vipBenefits = t.raw("vip.benefits") as string[];

  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-5 py-16 text-center md:py-20">
        <span
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium text-[var(--fg-muted)]"
          style={{ borderColor: "var(--border)" }}
        >
          <Crown className="size-3.5 text-accent-500" />
          {t("badge")}
        </span>
        <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--fg-muted)]">
          {t("subtitle")}
        </p>
      </section>

      <section className="mx-auto w-full max-w-5xl px-5 pb-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Free */}
          <div
            className="rounded-card border p-8"
            style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
          >
            <h2 className="text-xl font-semibold">{t("free.title")}</h2>
            <p className="mt-1 text-sm text-[var(--fg-muted)]">
              {t("free.subtitle")}
            </p>
            <ul className="mt-6 space-y-3">
              {freeBenefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-500/15 text-brand-500">
                    <Check className="size-3" />
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* VIP */}
          <div
            className="relative overflow-hidden rounded-card border p-8"
            style={{
              borderColor: "transparent",
              backgroundImage:
                "linear-gradient(var(--bg-elevated), var(--bg-elevated)), linear-gradient(135deg, #3366ff, #a855f7)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
            }}
          >
            <div
              className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full opacity-20 blur-2xl"
              style={{ background: "radial-gradient(circle, #a855f7, transparent)" }}
              aria-hidden
            />
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white">
                <Sparkles className="size-3.5" />
              </span>
              <h2 className="text-xl font-semibold">{t("vip.title")}</h2>
            </div>
            <p className="mt-1 text-sm text-[var(--fg-muted)]">
              {t("vip.subtitle")}
            </p>
            <ul className="mt-6 space-y-3">
              {vipBenefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-500/15 text-accent-500">
                    <Check className="size-3" />
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-8 rounded-card border p-6 text-center text-sm text-[var(--fg-muted)]"
          style={{ borderColor: "var(--border)" }}
        >
          {t("note")}
        </div>
      </section>
    </>
  );
}
