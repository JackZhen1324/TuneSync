"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "../../../i18n/routing";
import { Menu, X, Music4 } from "lucide-react";
import LangSwitcher from "./LangSwitcher";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links: { href: "/features" | "/pricing" | "/docs"; label: string }[] = [
    { href: "/features", label: t("features") },
    { href: "/pricing", label: t("pricing") },
    { href: "/docs", label: t("docs") },
  ];

  function isActive(href: string) {
    if (href === "/docs") return pathname.startsWith("/docs");
    return pathname === href;
  }

  return (
    <header
      className="sticky top-0 z-50 w-full border-b backdrop-blur-xl"
      style={{
        borderColor: "var(--border)",
        background: "var(--glass)",
      }}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5">
        <Link
          href="/"
          className="flex items-center gap-2 text-[var(--fg)]"
          onClick={() => setOpen(false)}
        >
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-sm">
            <Music4 className="size-4" />
          </span>
          <span className="text-base font-semibold tracking-tight">
            TuneSync
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                isActive(l.href)
                  ? "bg-black/5 text-[var(--fg)] dark:bg-white/10"
                  : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LangSwitcher className="hidden sm:inline-flex" />
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-full border text-[var(--fg)] md:hidden"
            style={{ borderColor: "var(--border)" }}
            aria-label={t("menu")}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="border-t px-5 py-3 md:hidden"
          style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm ${
                  isActive(l.href)
                    ? "bg-black/5 dark:bg-white/10"
                    : "hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2">
              <LangSwitcher />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
