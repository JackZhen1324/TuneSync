"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }

  if (!mounted) {
    return (
      <span
        className={`inline-flex size-9 items-center justify-center rounded-full ${className ?? ""}`}
        aria-hidden
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className={`inline-flex size-9 items-center justify-center rounded-full border text-[var(--fg)] transition-colors hover:bg-black/5 dark:hover:bg-white/10 ${className ?? ""}`}
      style={{ borderColor: "var(--border)" }}
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
