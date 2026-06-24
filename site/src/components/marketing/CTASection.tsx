import { useTranslations } from "next-intl";
import AppStoreBadge from "../site/AppStoreBadge";
import Reveal from "./Reveal";

export default function CTASection() {
  const t = useTranslations("home");
  return (
    <section className="container-page py-16 md:py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[var(--radius)] px-8 py-16 text-center md:px-16"
             style={{ background: "var(--bg-subtle)" }}>
          {/* animated aurora blobs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <span className="absolute -left-10 -top-10 size-64 rounded-full opacity-50 blur-3xl float-slow"
                  style={{ background: "radial-gradient(circle, var(--brand-soft), transparent 70%)" }} />
            <span className="absolute -right-10 top-1/3 size-72 rounded-full opacity-40 blur-3xl float-slow"
                  style={{ background: "radial-gradient(circle, var(--brand-soft-2), transparent 70%)", animationDelay: "2s" }} />
          </div>
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">{t("ctaTitle")}</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--fg-muted)]">{t("ctaBody")}</p>
            <div className="mt-8 flex justify-center"><AppStoreBadge height={52} /></div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
