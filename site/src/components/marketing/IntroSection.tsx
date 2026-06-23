import { useTranslations } from "next-intl";
import { Link } from "../../../i18n/routing";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

export default function IntroSection() {
  const t = useTranslations("home");
  return (
    <section className="container-narrow py-12 text-center md:py-16">
      <Reveal>
        <p className="mx-auto max-w-2xl text-2xl font-medium leading-snug tracking-tight text-[var(--fg)] sm:text-3xl">
          {t("introTitle")}
        </p>
        <p className="mx-auto mt-4 max-w-xl text-base text-[var(--fg-muted)]">
          {t("introBody")}
        </p>
        <Link href="/features" className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-[var(--brand)]">
          {t("ctaSecondary")}
          <ArrowRight className="size-4" />
        </Link>
      </Reveal>
    </section>
  );
}
