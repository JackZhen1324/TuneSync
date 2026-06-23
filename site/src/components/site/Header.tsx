"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "../../../i18n/routing";
import { Menu, X } from "lucide-react";
import LangSwitcher from "./LangSwitcher";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";

export default function Header() {
  const tNav = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const t = tNav;

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
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center text-[var(--fg)]"
          onClick={() => setOpen(false)}
        >
          <Logo size={32} />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors ${
                isActive(l.href)
                  ? "text-[var(--fg)]"
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
          <Link href="/docs/getting-started" className="btn-ghost hidden md:inline-flex !px-3.5 !py-2 !text-xs">
            iOS
          </Link>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-md border text-[var(--fg)] md:hidden"
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
            <Link href="/docs/getting-started" onClick={() => setOpen(false)} className="btn-primary mt-3 justify-center">
              iOS
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
