import { asset } from "../../lib/assets";

type Props = {
  /** Square edge length in pixels. */
  size?: number;
  /** Show the "TuneSync" wordmark next to the mark. */
  withWordmark?: boolean;
  className?: string;
};

/**
 * Theme-aware TuneSync mark using the real iOS app icon assets.
 */
export default function Logo({
  size = 32,
  withWordmark = true,
  className = "",
}: Props) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className="relative inline-block shrink-0 overflow-hidden rounded-[24%] ring-1 ring-black/5 dark:ring-white/10"
        style={{ width: size, height: size }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset("/logo-light.png")}
          alt=""
          width={size}
          height={size}
          className="absolute inset-0 h-full w-full object-cover dark:hidden"
          decoding="async"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset("/logo-dark.png")}
          alt=""
          width={size}
          height={size}
          className="absolute inset-0 hidden h-full w-full object-cover dark:block"
          decoding="async"
        />
      </span>
      {withWordmark && (
        <span className="text-base font-semibold tracking-tight">TuneSync</span>
      )}
    </span>
  );
}
