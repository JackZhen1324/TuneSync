import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";
import PhoneMockup from "./PhoneMockup";
import Reveal from "./Reveal";
import Tilt from "./Tilt";
import Parallax from "./Parallax";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  screenshot: string;
  screenshotLabel?: string;
  icon: LucideIcon;
  reverse?: boolean;
};

/** Bear-style alternating image/text feature row, with parallax + tilt. */
export default function FeatureRow({
  eyebrow,
  title,
  description,
  bullets,
  screenshot,
  screenshotLabel,
  icon: Icon,
  reverse = false,
}: Props) {
  return (
    <section className="container-page py-16 md:py-24">
      <div className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}>
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-[var(--brand)]"
                style={{ borderColor: "var(--brand-soft)", background: "var(--brand-soft-2)" }}>
            <Icon className="size-3.5" />
            {eyebrow}
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-lg text-[var(--fg-muted)]">{description}</p>
          <ul className="mt-6 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-white"
                      style={{ background: "var(--brand)" }}>
                  <Check className="size-3" strokeWidth={3} />
                </span>
                <span className="text-[var(--fg)]">{b}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120} className="mx-auto w-full max-w-[18rem] md:max-w-[20rem]">
          <Parallax strength={30} className="relative">
            <span className="glow-halo" aria-hidden />
            <Tilt max={5}>
              <PhoneMockup screenshot={screenshot} alt={title} label={screenshotLabel} />
            </Tilt>
          </Parallax>
        </Reveal>
      </div>
    </section>
  );
}