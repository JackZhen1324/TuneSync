"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "../../../i18n/routing";
import { Menu, X } from "lucide-react";
import LangSwitcher from "./LangSwitcher";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";
import { downloadUrl } from "../../lib/links";

export default function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const iosUrl = downloadUrl("ios");

  const links: { href: "/features" | "/docs"; label: string }[] = [
    { href: "/features", label: t("features") },
    { href: "/docs", label: t("docs") },
  ];

  function isActive(href: string) {
    if (href === "/docs") return pathname.startsWith("/docs");
    return pathname === href;
  }

  return (
    <header
      className="sticky top-0 z-50 w-full border-b backdrop-blur-xl"
      style={{ borderColor: "var(--border)", background: "var(--glass)" }}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
          <Logo size={30} />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                isActive(l.href)
                  ? "font-medium text-[var(--fg)]"
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
          {iosUrl && (
            <a
              href={iosUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary hidden md:inline-flex !px-4 !py-2 !text-xs"
            >
              {t("download")}
            </a>
          )}
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
          <div className="container-page flex flex-col gap-1 !px-0">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm ${
                  isActive(l.href) ? "bg-[var(--bg-subtle)] font-medium" : "hover:bg-[var(--bg-subtle)]"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-2">
              <LangSwitcher />
              {iosUrl && (
                <a
                  href={iosUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="btn-primary !px-4 !py-2 !text-xs"
                >
                  {t("download")}
                </a>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
