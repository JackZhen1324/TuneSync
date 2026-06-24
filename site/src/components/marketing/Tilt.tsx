"use client";

import { useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Max tilt in degrees. */
  max?: number;
  className?: string;
};

/**
 * Subtle 3D tilt that follows the cursor. Disabled under reduced-motion.
 * Pure transform — no layout thrash.
 */
export default function Tilt({ children, max = 6, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  function onMove(e: React.MouseEvent) {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setStyle({
      transform: `perspective(1000px) rotateY(${px * max}deg) rotateX(${-py * max}deg)`,
    });
  }

  function onLeave() {
    setStyle({ transform: "perspective(1000px) rotateY(0) rotateX(0)" });
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`tilt ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
