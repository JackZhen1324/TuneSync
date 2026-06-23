import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { asset } from "../../lib/assets";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  screenshot?: string;
  screenshotLabel?: string;
  tint?: string;
  reverse?: boolean;
  children?: ReactNode;
};

/**
 * Alternating editorial feature block — Codex-style: an eyebrow + big bold
 * headline on one side, a dramatic product shot on the other.
 */
export default function ShowcaseSection({
  eyebrow,
  title,
  description,
  bullets,
  screenshot,
  screenshotLabel,
  reverse = false,
  children,
}: Props) {
  return (
    <section className="border-t bg-[var(--bg-elevated)]" style={{ borderColor: "var(--border)" }}>
      <div className="container-page py-16 md:py-24">
        <div
          className={`grid items-center gap-12 md:grid-cols-2 md:gap-16 ${
            reverse ? "md:[&>*:first-child]:order-2" : ""
          }`}
        >
          <div className="max-w-2xl">
            <span className="eyebrow">
              {eyebrow}
            </span>
            <h2 className="display-sm mt-4 text-4xl font-semibold sm:text-5xl md:text-6xl">
              {title}
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-[var(--fg-muted)] md:text-lg">
              {description}
            </p>
            <ul className="mt-8 grid gap-px overflow-hidden border bg-[var(--border)] sm:grid-cols-2" style={{ borderColor: "var(--border)" }}>
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 bg-[var(--bg-elevated)] p-4 text-sm leading-6">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center border border-[var(--border-strong)] text-[var(--fg)]">
                    <Check className="size-3.5" strokeWidth={2.5} />
                  </span>
                  <span className="text-[var(--fg)]">{b}</span>
                </li>
              ))}
            </ul>
            {children}
          </div>

          <div className="relative mx-auto w-full max-w-[18rem] md:max-w-sm">
            <div
              className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[2rem] border-[8px] border-black bg-black"
              style={{ boxShadow: "var(--shadow-float)" }}
            >
              <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />
              <div className="absolute inset-0 overflow-hidden rounded-[1.45rem]">
                {screenshot ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={asset(`/screenshots/${screenshot}`)}
                    alt={screenshotLabel ?? title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-black p-6 text-center">
                    <span className="text-xs font-medium uppercase tracking-wider text-[var(--fg-muted)]">
                      {screenshotLabel}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
