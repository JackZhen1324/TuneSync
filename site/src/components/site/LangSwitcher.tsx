"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "../../../i18n/routing";
import { useTransition } from "react";
import { Globe } from "lucide-react";

const LOCALES: { code: "zh-CN" | "en"; short: string }[] = [
  { code: "zh-CN", short: "中" },
  { code: "en", short: "EN" },
];

export default function LangSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as "zh-CN" | "en";
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("common");

  function onSelect(next: "zh-CN" | "en") {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div
      className={`relative inline-flex items-center gap-1 rounded-full border px-1 py-1 ${className ?? ""}`}
      style={{ borderColor: "var(--border)" }}
    >
      <Globe className="ml-1.5 size-3.5 text-[var(--fg-muted)]" />
      {LOCALES.map((l) => {
        const active = l.code === locale;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => onSelect(l.code)}
            disabled={isPending}
            aria-pressed={active}
            aria-label={t("switchLanguage")}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
              active
                ? "bg-[var(--fg)] text-[var(--bg)]"
                : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
            }`}
          >
            {l.short}
          </button>
        );
      })}
    </div>
  );
}
