"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Parallax strength in px (how far it drifts on scroll). */
  strength?: number;
  className?: string;
};

/**
 * Gentle vertical parallax: the element drifts opposite to scroll within its
 * band. Only active when in view; disabled under reduced-motion.
 */
export default function Parallax({ children, strength = 40, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    let raf = 0;
    function update() {
      raf = 0;
      const node = ref.current;
      if (!node) return;
      const r = node.getBoundingClientRect();
      const vh = window.innerHeight;
      // progress: -1 (below) → 0 (centered) → 1 (above)
      const progress = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
      setOffset(Math.max(-1, Math.min(1, progress)) * strength);
    }
    function onScroll() {
      if (!raf) raf = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [strength]);

  return (
    <div ref={ref} className={className} style={{ transform: `translateY(${offset}px)` }}>
      {children}
    </div>
  );
}
