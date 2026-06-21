import type { ReactNode } from "react";
import { Info, Lightbulb, TriangleAlert, CheckCircle2 } from "lucide-react";

type CalloutVariant = "info" | "tip" | "warning" | "success";

const CALLOUT_STYLES: Record<
  CalloutVariant,
  { tint: string; icon: typeof Info }
> = {
  info: { tint: "#3366ff", icon: Info },
  tip: { tint: "#10b981", icon: Lightbulb },
  warning: { tint: "#f97316", icon: TriangleAlert },
  success: { tint: "#06b6d4", icon: CheckCircle2 },
};

export function Callout({
  variant = "info",
  title,
  children,
}: {
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
}) {
  const { tint, icon: Icon } = CALLOUT_STYLES[variant];
  return (
    <div
      className="my-6 flex gap-3 rounded-xl border-l-4 p-4"
      style={{
        borderColor: tint,
        background: `${tint}14`,
      }}
    >
      <Icon className="mt-0.5 size-5 shrink-0" style={{ color: tint }} />
      <div className="text-sm leading-relaxed">
        {title && <p className="font-semibold">{title}</p>}
        <div className="text-[var(--fg-muted)] [&>p]:my-0">{children}</div>
      </div>
    </div>
  );
}

export function Steps({ children }: { children: ReactNode }) {
  return <ol className="my-6 space-y-5">{children}</ol>;
}

export function Step({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <li className="relative flex gap-4">
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-xs font-bold text-white">
        {index}
      </span>
      <div className="flex-1 pb-1">
        <p className="font-semibold">{title}</p>
        <div className="mt-1 text-sm text-[var(--fg-muted)] [&>p]:my-1 [&>ul]:my-2 [&_li]:my-0.5">
          {children}
        </div>
      </div>
    </li>
  );
}

export function ScreenshotPlaceholder({
  label,
  hint,
  tint = "#3366ff",
}: {
  label: string;
  hint?: string;
  tint?: string;
}) {
  return (
    <figure className="my-6">
      <div
        className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-card border"
        style={{
          borderColor: "var(--border)",
          background: `linear-gradient(135deg, ${tint}22, ${tint}08)`,
        }}
      >
        <div className="flex flex-col items-center gap-2 px-6 text-center">
          <span
            className="grid size-10 place-items-center rounded-xl text-white"
            style={{ backgroundImage: `linear-gradient(135deg, ${tint}, ${tint}cc)` }}
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </span>
          <p className="text-sm font-medium text-[var(--fg)]">{label}</p>
          {hint && (
            <p className="text-xs text-[var(--fg-muted)]">{hint}</p>
          )}
        </div>
      </div>
    </figure>
  );
}

export function KeyValueTable({
  rows,
}: {
  rows: { k: string; v: string }[];
}) {
  return (
    <div
      className="my-6 overflow-hidden rounded-xl border"
      style={{ borderColor: "var(--border)" }}
    >
      <table className="w-full text-sm">
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r.k}
              className={i % 2 === 0 ? "" : "bg-black/[0.02] dark:bg-white/[0.02]"}
              style={{ borderTop: i === 0 ? "none" : "1px solid var(--border)" }}
            >
              <td className="w-1/3 px-4 py-2.5 align-top font-medium">
                {r.k}
              </td>
              <td className="px-4 py-2.5 align-top text-[var(--fg-muted)]">
                {r.v}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
