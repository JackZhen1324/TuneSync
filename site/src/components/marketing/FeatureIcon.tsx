import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  tint: string;
  className?: string;
};

/** A rounded gradient tile that hosts a Lucide icon, mirroring iOS icon styling. */
export default function FeatureIcon({ icon: Icon, tint, className }: Props) {
  return (
    <span
      className={`grid size-11 shrink-0 place-items-center rounded-2xl text-white shadow-sm ${className ?? ""}`}
      style={{
        backgroundImage: `linear-gradient(135deg, ${tint}, ${shade(tint, -18)})`,
      }}
    >
      <Icon className="size-5" strokeWidth={2} />
    </span>
  );
}

function shade(hex: string, percent: number) {
  const m = hex.replace("#", "");
  const num = parseInt(
    m.length === 3
      ? m
          .split("")
          .map((c) => c + c)
          .join("")
      : m,
    16,
  );
  const r = Math.min(255, Math.max(0, (num >> 16) + percent));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + percent));
  const b = Math.min(255, Math.max(0, (num & 0xff) + percent));
  return `rgb(${r}, ${g}, ${b})`;
}
