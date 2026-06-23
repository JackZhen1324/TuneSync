"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, FileMusic, Wand2 } from "lucide-react";
import Reveal from "./Reveal";

/** A metadata "field row" that gets progressively filled in. */
type MetaField = { key: "title" | "artist" | "album" | "year" | "cover" };

const FIELDS: MetaField[] = [
  { key: "title" },
  { key: "artist" },
  { key: "album" },
  { key: "year" },
  { key: "cover" },
];

/**
 * Codex-style editor visualization: a split IDE-like surface that shows
 * metadata being applied field-by-field (left) and synced lyrics lighting up
 * line-by-line against a moving playhead (right). Auto-plays in view;
 * respects reduced-motion.
 */
export default function EditorDemo() {
  const t = useTranslations("home");
  const [filled, setFilled] = useState(0);
  const [started, setStarted] = useState(false);
  const [activeLine, setActiveLine] = useState(-1);
  const sectionRef = useRef<HTMLDivElement>(null);

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Phase 1: fill metadata fields one by one.
  useEffect(() => {
    if (!started || reduceMotion) {
      if (started && reduceMotion) setFilled(FIELDS.length);
      return;
    }
    if (filled >= FIELDS.length) return;
    const timer = setTimeout(() => setFilled((f) => f + 1), 700);
    return () => clearTimeout(timer);
  }, [started, filled, reduceMotion]);

  // Phase 2: walk the lyric lines once metadata is complete.
  useEffect(() => {
    if (!started || filled < FIELDS.length) return;
    if (reduceMotion) {
      setActiveLine(5);
      return;
    }
    let i = 0;
    setActiveLine(0);
    const timer = setInterval(() => {
      i += 1;
      if (i > 5) {
        clearInterval(timer);
        return;
      }
      setActiveLine(i);
    }, 650);
    return () => clearInterval(timer);
  }, [started, filled, reduceMotion]);

  const metaDone = filled >= FIELDS.length;

  return (
    <section
      ref={sectionRef}
      className="border-t bg-[var(--bg-elevated)]"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="container-page grid items-center gap-12 py-20 md:grid-cols-2 md:py-28 md:gap-16">
        {/* Editor surface first on desktop to alternate from WorkflowDemo. */}
        <Reveal className="order-2 md:order-1">
          <div
            className="overflow-hidden rounded-xl border bg-[#0a0a0a] font-mono text-[13px] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]"
            style={{ borderColor: "var(--border-strong)" }}
          >
            {/* tab bar */}
            <div
              className="flex items-center gap-2 border-b px-4 py-3"
              style={{ borderColor: "var(--border)" }}
            >
              <FileMusic className="size-4 text-[var(--fg-muted)]" />
              <span className="text-xs text-[var(--fg-muted)]">
                {t("editorTabMeta")}
              </span>
              <span className="mx-1 text-[var(--fg-subtle)]">|</span>
              <span className="text-xs text-[var(--fg-muted)]">
                {t("editorTabLyrics")}
              </span>
              <span className="ml-auto flex items-center gap-1.5 text-xs text-[var(--fg-subtle)]">
                <Wand2 className="size-3.5" />
                {t("editorApply")}
              </span>
            </div>

            <div className="grid md:grid-cols-2">
              {/* metadata panel */}
              <div
                className="space-y-2.5 border-b p-5 md:border-b-0 md:border-r"
                style={{ borderColor: "var(--border)" }}
              >
                <p className="mb-2 text-[10px] uppercase tracking-widest text-[var(--fg-subtle)]">
                  {t("editorPanelMeta")}
                </p>
                {FIELDS.map((f, i) => {
                  const isFilled = i < filled;
                  const isApplying = started && i === filled && !metaDone;
                  return (
                    <div key={f.key} className="flex items-center gap-2">
                      <span className="w-12 shrink-0 text-[var(--fg-subtle)]">
                        {f.key}
                      </span>
                      <span className="text-[var(--fg-subtle)]">:</span>
                      <span
                        className={`flex-1 truncate transition-colors duration-300 ${
                          isFilled ? "text-[var(--fg)]" : "text-[var(--fg-subtle)]"
                        }`}
                      >
                        {isFilled ? (
                          t(`editorDemo.meta.${f.key}.value`)
                        ) : isApplying ? (
                          <span className="inline-block">
                            {t(`editorDemo.meta.${f.key}.value`).slice(0, 3)}
                            <span className="ml-0.5 inline-block w-1.5 animate-pulse bg-[var(--fg)] align-middle" style={{ height: "1em" }} />
                          </span>
                        ) : (
                          "——"
                        )}
                      </span>
                      {isFilled && (
                        <Check className="size-3.5 shrink-0 text-[var(--fg-muted)]" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* synced lyrics panel */}
              <div className="space-y-1 p-5">
                <p className="mb-2 text-[10px] uppercase tracking-widest text-[var(--fg-subtle)]">
                  {t("editorPanelLyrics")}
                </p>
                {(["l1", "l2", "l3", "l4", "l5", "l6"] as const).map((l, i) => {
                  const isActive = i === activeLine;
                  const isPast = i < activeLine;
                  const shown = metaDone && i <= activeLine;
                  return (
                    <div
                      key={l}
                      className={`rounded px-2 py-1 transition-all duration-300 ${
                        isActive
                          ? "bg-white/10 text-[var(--fg)]"
                          : isPast
                            ? "text-[var(--fg-muted)]"
                            : "text-[var(--fg-subtle)]"
                      }`}
                    >
                      <span className="mr-2 text-[var(--fg-subtle)]">
                        {String(i).padStart(2, "0")}:
                      </span>
                      {shown
                        ? t(`editorDemo.lyrics.${l}`)
                        : started
                          ? "···"
                          : "—"}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>

        {/* copy */}
        <Reveal delay={120} className="order-1 max-w-xl md:order-2">
          <span className="eyebrow">{t("editorEyebrow")}</span>
          <h2 className="display-sm mt-4 text-4xl font-semibold sm:text-5xl md:text-6xl">
            {t("editorTitle")}
          </h2>
          <p className="mt-6 text-base leading-8 text-[var(--fg-muted)] md:text-lg">
            {t("editorDesc")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
