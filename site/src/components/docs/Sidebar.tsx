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
    <nav className="space-y-7">
      {DOC_NAV.map((group) => (
        <div key={group.groupKey}>
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-[var(--fg-subtle)]">
            {tGroups(group.groupKey)}
          </p>
          <ul className="mt-2 space-y-0.5 border-l" style={{ borderColor: "var(--border)" }}>
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`relative -ml-px block border-l-2 px-3 py-1.5 text-sm transition-colors ${
                      active
                        ? "border-[var(--brand)] font-medium text-[var(--fg)]"
                        : "border-transparent text-[var(--fg-muted)] hover:text-[var(--fg)]"
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
  const pathname = usePathname();
  const tNav = useTranslations("docsNav");
  const activeItem = DOC_NAV.flatMap((g) => g.items).find((i) => i.href === pathname);
  const label = activeItem ? tNav(activeItem.labelKey.replace("docsNav.", "")) : tNav("intro");

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex w-full items-center justify-between rounded-lg border px-4 py-2.5 text-sm font-medium"
        style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
      >
        {label}
        <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="mt-2 rounded-[var(--radius)] border p-4" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
          <Sidebar />
        </div>
      )}
    </div>
  );
}
