"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { about } from "@/lib/content";
import { Reveal } from "@/components/motion/reveal";

/**
 * LAYOUT FAMILY C: split-screen scroll, two columns travelling at different
 * rates (Section 10 Split-Screen Scroll).
 *
 * The terminal motif survives as TYPOGRAPHY, not as a simulated window. The
 * legacy version had macOS traffic lights and a title bar, which is exactly
 * the div-built fake terminal Section 9.F bans. What made it good was the
 * command transcript, and that is what is kept.
 */
export function About() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const asideY = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 60, reduce ? 0 : -60]);

  return (
    <section id="about" ref={ref} className="scroll-mt-16 py-24 md:py-32">
      <div className="shell grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <Reveal as="h2" className="display text-[clamp(2rem,5vw,3.5rem)]">
            {about.heading}
          </Reveal>

          <div className="mt-8 space-y-5">
            {about.paragraphs.map((para, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <p className="max-w-[62ch] text-[1.0625rem] leading-[1.75] text-text-muted">
                  {para.map((seg, j) =>
                    seg.mark ? (
                      /* Only the first paragraph's phrase gets the full lime
                         block; later emphasis takes the lighter rule. */
                      <span key={j} className={i === 0 ? "marker font-medium" : "mark-rule"}>
                        {seg.t}
                      </span>
                    ) : seg.strong ? (
                      <strong key={j} className="font-semibold text-text">
                        {seg.t}
                      </strong>
                    ) : (
                      <span key={j}>{seg.t}</span>
                    ),
                  )}
                </p>
              </Reveal>
            ))}
          </div>

          {/* Five facts on a hairline ledger, not five boxes. Cards omitted in
              favour of spacing (Section 4.4). */}
          <Reveal delay={0.1}>
            {/* Five facts in a 2-column grid would leave a sixth cell empty,
                so the last one spans the row. No empty tiles. */}
            <dl className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-[--radius-surface] bg-line sm:grid-cols-2">
              {about.info.map((row, idx) => (
                <div
                  key={row.label}
                  className={`bg-bg px-5 py-4 ${
                    idx === about.info.length - 1 && about.info.length % 2 === 1
                      ? "sm:col-span-2"
                      : ""
                  }`}
                >
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-muted">
                    {row.label}
                  </dt>
                  <dd className="mt-1.5 text-[0.9375rem] font-semibold text-text">{row.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Command transcript. Set as type on the page surface. */}
        <motion.aside style={{ y: asideY }} className="lg:col-span-5 lg:pt-6">
          <Reveal delay={0.12}>
            <div className="rounded-[--radius-surface] border border-line bg-bg-sunken p-6 font-mono text-[0.8125rem] leading-[2] md:p-7">
              {about.transcript.map((line, i) =>
                "cmd" in line ? (
                  <p key={i} className="text-text">
                    <span className="mr-2 select-none text-accent-text" aria-hidden="true">
                      $
                    </span>
                    {line.cmd}
                  </p>
                ) : (
                  <p key={i} className="pl-4 text-text-muted">
                    {line.out}
                  </p>
                ),
              )}
            </div>
          </Reveal>
        </motion.aside>
      </div>
    </section>
  );
}
