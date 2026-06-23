"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Loader2, Terminal } from "lucide-react";
import Reveal from "./Reveal";

type StepStatus = "pending" | "running" | "done";

type Step = {
  /** key into home.workflowDemo.steps */
  key: "discover" | "connect" | "index" | "metadata" | "lyrics" | "ready";
  /** leading command token, e.g. "$ tunesync" */
  prompt: string;
  /** sub-key under the step: { label, detail } */
  ms: number;
};

const STEPS: Step[] = [
  { key: "discover", prompt: "$ tunesync discover", ms: 1100 },
  { key: "connect", prompt: "$ tunesync connect nas", ms: 1300 },
  { key: "index", prompt: "$ tunesync index /music", ms: 1700 },
  { key: "metadata", prompt: "$ tunesync enrich --source itunes,ai", ms: 1900 },
  { key: "lyrics", prompt: "$ tunesync lyrics --align", ms: 1500 },
  { key: "ready", prompt: "$ tunesync play", ms: 900 },
];

/**
 * Codex-style agent-workflow demo: a terminal surface that types through the
 * TuneSync ingestion pipeline step by step — discover → connect → index →
 * enrich → lyrics → play — with per-step status and a live progress meter.
 * It auto-plays on scroll into view and respects reduced-motion.
 */
export default function WorkflowDemo() {
  const t = useTranslations("home");
  const [active, setActive] = useState(0);
  const [statuses, setStatuses] = useState<StepStatus[]>(
    STEPS.map(() => "pending"),
  );
  const [progress, setProgress] = useState(0);
  const [started, setStarted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // Kick off the sequence when scrolled into view (once).
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

  // Drive the step machine.
  useEffect(() => {
    if (!started) return;
    if (reduceMotion) {
      // Reduced-motion: jump to final state.
      setStatuses(STEPS.map(() => "done"));
      setProgress(100);
      setActive(STEPS.length);
      return;
    }
    if (active >= STEPS.length) return;
    setStatuses((prev) => {
      const next = [...prev];
      next[active] = "running";
      return next;
    });
    const startedAt = Date.now();
    const step = STEPS[active];
    const timer = setInterval(() => {
      const ratio = Math.min(1, (Date.now() - startedAt) / step.ms);
      const base = (active / STEPS.length) * 100;
      setProgress(Math.round(base + ratio * (100 / STEPS.length)));
    }, 60);
    const done = setTimeout(() => {
      clearInterval(timer);
      setStatuses((prev) => {
        const next = [...prev];
        next[active] = "done";
        return next;
      });
      setProgress(Math.round(((active + 1) / STEPS.length) * 100));
      setActive((a) => a + 1);
    }, step.ms);
    return () => {
      clearInterval(timer);
      clearTimeout(done);
    };
  }, [started, active, reduceMotion]);

  const finished = active >= STEPS.length;

  return (
    <section
      ref={sectionRef}
      className="border-t bg-[var(--bg)]"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="container-page grid items-center gap-12 py-20 md:grid-cols-2 md:py-28 md:gap-16">
        <Reveal className="max-w-xl">
          <span className="eyebrow">{t("workflowEyebrow")}</span>
          <h2 className="display-sm mt-4 text-4xl font-semibold sm:text-5xl md:text-6xl">
            {t("workflowTitle")}
          </h2>
          <p className="mt-6 text-base leading-8 text-[var(--fg-muted)] md:text-lg">
            {t("workflowDesc")}
          </p>
        </Reveal>

        {/* Terminal surface */}
        <Reveal delay={120}>
          <div
            className="overflow-hidden rounded-xl border bg-[#0a0a0a] font-mono text-[13px] leading-relaxed shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]"
            style={{ borderColor: "var(--border-strong)" }}
          >
            {/* title bar */}
            <div
              className="flex items-center gap-2 border-b px-4 py-3"
              style={{ borderColor: "var(--border)" }}
            >
              <span className="size-3 rounded-full bg-[#ff5f57]" />
              <span className="size-3 rounded-full bg-[#febc2e]" />
              <span className="size-3 rounded-full bg-[#28c840]" />
              <span className="ml-2 flex items-center gap-2 text-xs text-[var(--fg-subtle)]">
                <Terminal className="size-3.5" />
                {t("workflowTerminalTitle")}
              </span>
            </div>

            {/* steps */}
            <div className="min-h-[20rem] space-y-3 p-5">
              {STEPS.map((step, i) => {
                const status = statuses[i];
                const visible = started && (status !== "pending" || finished);
                if (!visible) return null;
                return (
                  <div key={step.key} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate text-[var(--fg)]">
                        <span className="text-[var(--fg-subtle)]">
                          {step.prompt}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-1.5 text-xs">
                        {status === "running" && (
                          <>
                            <Loader2 className="size-3.5 animate-spin text-[var(--fg-muted)]" />
                            <span className="text-[var(--fg-muted)]">
                              {t(`workflowDemo.steps.${step.key}.label`)}
                            </span>
                          </>
                        )}
                        {status === "done" && (
                          <span className="flex items-center gap-1 text-[var(--fg-muted)]">
                            <Check className="size-3.5" />
                            {t(`workflowDemo.steps.${step.key}.detail`)}
                          </span>
                        )}
                      </span>
                    </div>
                    {status === "running" && (
                      <div
                        className="h-px w-full overflow-hidden"
                        style={{ background: "var(--border)" }}
                      >
                        <div
                          className="h-px bg-[var(--fg-muted)]"
                          style={{ width: "40%" }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* final line */}
              {finished && (
                <div className="pt-1 text-[var(--fg)]">
                  <span className="text-[var(--fg-subtle)]">$</span>{" "}
                  <span className="text-[var(--fg)]">{">"}_</span>
                  <span className="ml-2 inline-block w-2 animate-pulse bg-[var(--fg)] align-middle" style={{ height: "1em" }} />
                </div>
              )}
            </div>

            {/* progress footer */}
            <div
              className="flex items-center justify-between border-t px-5 py-3 text-xs text-[var(--fg-subtle)]"
              style={{ borderColor: "var(--border)" }}
            >
              <span>{t("workflowProgress")}</span>
              <span>{progress}%</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
