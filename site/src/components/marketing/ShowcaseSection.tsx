import type { ReactNode } from "react";
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

export default function ShowcaseSection({
  eyebrow,
  title,
  description,
  bullets,
  screenshot,
  screenshotLabel,
  tint = "#3366ff",
  reverse = false,
  children,
}: Props) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16">
      <div
        className={`grid items-center gap-10 md:grid-cols-2 ${
          reverse ? "md:[&>*:first-child]:order-2" : ""
        }`}
      >
        <div>
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: tint }}
          >
            {eyebrow}
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-lg text-[var(--fg-muted)]">{description}</p>
          <ul className="mt-6 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm">
                <span
                  className="mt-1.5 size-1.5 shrink-0 rounded-full"
                  style={{ background: tint }}
                />
                <span className="text-[var(--fg)]">{b}</span>
              </li>
            ))}
          </ul>
          {children}
        </div>

        <div className="relative mx-auto w-full max-w-xs md:max-w-sm">
          <div
            className="absolute -inset-6 -z-10 rounded-[3rem] blur-2xl"
            style={{
              background: `radial-gradient(closest-side, ${tint}33, transparent)`,
            }}
            aria-hidden
          />
          <div
            className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[2.75rem] border-[10px] border-black bg-black shadow-2xl"
            style={{ boxShadow: "0 30px 80px -20px rgba(0,0,0,0.5)" }}
          >
            <div className="absolute left-1/2 top-2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
            <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
              {screenshot ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={asset(`/screenshots/${screenshot}`)}
                  alt={screenshotLabel ?? title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className="flex h-full w-full flex-col items-center justify-center p-6 text-center"
                  style={{
                    background: `linear-gradient(135deg, ${tint}33, ${tint}11)`,
                  }}
                >
                  <span className="text-xs font-medium uppercase tracking-wider text-[var(--fg-muted)]">
                    {screenshotLabel}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
