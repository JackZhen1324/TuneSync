import { downloadUrl } from "../../lib/links";

type Props = {
  /** Badge height in px. Width scales proportionally (~3.1:1). */
  height?: number;
  className?: string;
};

/**
 * Official black "Download on the App Store" badge (Apple Marketing Guidelines
 * geometry). Links to the configured iOS download URL (src/lib/links.ts).
 * Pair with the Apple legal disclaimer in the footer (Apple's badge-use rule).
 */
export default function AppStoreBadge({ height = 48, className = "" }: Props) {
  const url = downloadUrl("ios");
  if (!url) return null;
  const width = Math.round(height * 3.08);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Download on the App Store"
      className={`inline-flex shrink-0 transition-transform hover:scale-[1.03] ${className}`}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 135 44"
        role="img"
        aria-hidden
      >
        <rect x="0.5" y="0.5" width="134" height="43" rx="9.5" fill="#000" />
        <rect
          x="0.5"
          y="0.5"
          width="134"
          height="43"
          rx="9.5"
          fill="none"
          stroke="#a6a6a6"
          strokeWidth="1"
        />
        {/* Apple logo */}
        <path
          d="M26.6 22.1c0-2.3 1-4.4 2.6-5.8-1-1.4-2.5-2.2-4.2-2.2-1.6 0-2.8.8-4.2.8-1.5 0-2.7-.8-4.2-.8-1.9 0-3.9 1.2-5 3.2-2.1 3.7-.5 9.2 1.6 12.2 1 1.5 2.2 3.1 3.8 3 1.5 0 2-.9 3.8-.9 1.8 0 2.2.9 3.8.9 1.6 0 2.6-1.4 3.6-2.9.7-1 1.2-2.1 1.6-3.3-3.4-1.3-3.2-5.3-3.2-5.2zm-2.7-9.4c.8-1 1.4-2.4 1.2-3.8-1.2.1-2.6.8-3.5 1.8-.8.9-1.5 2.3-1.3 3.7 1.4.1 2.7-.7 3.6-1.7z"
          fill="#fff"
        />
        <text
          x="46"
          y="20"
          fill="#fff"
          fontFamily='"SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif'
          fontSize="9"
          letterSpacing="0.3"
        >
          Download on the
        </text>
        <text
          x="46"
          y="34"
          fill="#fff"
          fontFamily='"SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif'
          fontSize="15"
          fontWeight="600"
          letterSpacing="0.2"
        >
          App Store
        </text>
      </svg>
    </a>
  );
}
