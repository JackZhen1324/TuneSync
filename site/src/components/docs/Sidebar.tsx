"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "../../../i18n/routing";
import { DOC_NAV } from "./nav";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Sidebar() {
  const t = useTranslations("docsNav");
  const tGroups = useTranslations("docsNavGroups");
  const pathname = usePathname();

  return (
    <nav className="space-y-6">
      {DOC_NAV.map((group) => (
        <div key={group.groupKey}>
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
            {tGroups(group.groupKey)}
          </p>
          <ul className="mt-2 space-y-0.5">
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block rounded-lg px-3 py-1.5 text-sm transition-colors ${
                      active
                        ? "bg-brand-500/10 font-medium text-brand-600 dark:text-brand-300"
                        : "text-[var(--fg-muted)] hover:bg-black/5 hover:text-[var(--fg)] dark:hover:bg-white/5"
                    }`}
                  >
                    {t(item.labelKey.replace("docsNav.", ""))}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium"
        style={{ borderColor: "var(--border)" }}
      >
        {open ? <ChevronDown className="size-4 rotate-180" /> : <ChevronDown className="size-4" />}
      </button>
      {open && (
        <div
          className="mt-3 rounded-card border p-4"
          style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
        >
          <Sidebar />
        </div>
      )}
    </div>
  );
}
