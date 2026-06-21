import type { ReactNode } from "react";
import { asset } from "../../lib/assets";

type Props = {
  /** File under public/screenshots to embed; if omitted, a placeholder gradient is shown. */
  screenshot?: string;
  /** Alt text for the screenshot. */
  alt?: string;
  /** Optional eyebrow label shown on the placeholder. */
  label?: string;
  children?: ReactNode;
  className?: string;
};

/**
 * A pure-CSS iPhone frame. If `screenshot` is provided and the asset exists,
 * render the image; otherwise render an attractive gradient placeholder with
 * a hint to drop a real screenshot into public/screenshots.
 */
export default function PhoneMockup({
  screenshot,
  alt = "",
  label,
  children,
  className = "",
}: Props) {
  return (
    <div className={`relative ${className}`}>
      <div
        className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[2.75rem] border-[10px] border-black bg-black shadow-2xl dark:border-[#1c1c1e] dark:shadow-black/60"
        style={{ boxShadow: "0 30px 80px -20px rgba(0,0,0,0.5)" }}
      >
        {/* Dynamic Island */}
        <div className="absolute left-1/2 top-2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />

        <div className="absolute inset-0 overflow-hidden rounded-[2rem] bg-[var(--bg)]">
          {screenshot ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={asset(`/screenshots/${screenshot}`)}
              alt={alt}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-brand-500/30 via-accent-500/20 to-transparent p-6 text-center">
              <div
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{ background: "var(--hero-grad)" }}
              />
              <div className="relative flex flex-col items-center gap-3 text-[var(--fg-muted)]">
                {children}
                {label && (
                  <span className="text-[11px] font-medium uppercase tracking-wider opacity-70">
                    {label}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
