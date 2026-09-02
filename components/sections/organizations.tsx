"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { organizations } from "@/lib/content";
import { ICON } from "@/lib/icons";

gsap.registerPlugin(ScrollTrigger);

/**
 * LAYOUT FAMILY F: pinned card stack, Section 5.A canonical skeleton.
 *
 * Four leadership roles, each holding the viewport alone and receding in
 * scale and opacity as the next arrives. Motivation: the content is a
 * progression of responsibility, and the stack makes that progression
 * physical instead of asking the reader to infer it from four identical
 * cards, which is what the legacy 2-column grid did.
 *
 * Critical points from 5.A: start "top top", pin true, every card except the
 * last is pinned, and the shrink is driven by the NEXT card's trigger.
 */
export function Organizations() {
  const root = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !root.current) return;
    // Pinning below the fold on a phone fights native scroll; keep it desktop.
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const cards = gsap.utils.toArray<HTMLElement>(".stack-card", root.current!);

      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;

        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          endTrigger: cards[cards.length - 1],
          end: "top top",
          pin: true,
          pinSpacing: false,
        });

        // Recede via scale on the card plus an OPAQUE scrim inside it. Fading
        // the card itself makes it translucent, so the cards underneath bleed
        // through and the headings garble into each other.
        const trigger = {
          trigger: cards[i + 1],
          start: "top bottom",
          end: "top top",
          scrub: true,
        } as const;

        gsap.to(card, { scale: 0.93, ease: "none", scrollTrigger: trigger });
        gsap.to(card.querySelector(".stack-scrim"), {
          opacity: 0.82,
          ease: "none",
          scrollTrigger: trigger,
        });
      });
    });

    return () => mm.revert();
  }, [reduce]);

  return (
    <section id="organizations" className="scroll-mt-16 border-t border-line py-24 md:py-32">
      <div className="shell">
        <h2 className="display max-w-[16ch] text-[clamp(2rem,5vw,3.5rem)]">
          {organizations.heading}
        </h2>
      </div>

      {/* Each card is its own 100dvh block whose contents are vertically
          centred, so the card supplies its own breathing room. A large margin
          here on top of that reads as a gap, not as space. */}
      <div ref={root} className="relative mt-2 lg:-mt-10">
        {organizations.items.map((item, i) => (
          <div
            key={item.role}
            className="stack-card flex min-h-[auto] items-center py-4 lg:min-h-[100dvh] lg:py-0"
          >
            <div className="shell w-full">
              <article className="relative grid grid-cols-1 gap-8 overflow-hidden rounded-[--radius-surface] border border-line bg-bg-raised p-7 shadow-[var(--shadow-lift)] md:p-10 lg:grid-cols-12 lg:gap-12">
                <div
                  className="stack-scrim pointer-events-none absolute inset-0 z-10 bg-bg opacity-0"
                  aria-hidden="true"
                />
                <div className="lg:col-span-7">
                  <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-text-muted">
                    {item.date}
                  </p>
                  <h3 className="display mt-3 text-[clamp(1.6rem,3.2vw,2.4rem)]">{item.role}</h3>
                  <p className="mt-2 text-[1.0625rem] font-medium text-text-muted">{item.org}</p>

                  <ul className="mt-7 space-y-4">
                    {item.bullets.map((b, j) => (
                      <li key={j} className="flex gap-3 text-[1.0625rem] leading-[1.7] text-text-muted">
                        <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 bg-accent" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="lg:col-span-5">
                  {item.evidence ? (
                    <a
                      href={item.evidence}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative block overflow-hidden rounded-[--radius-surface] border border-line bg-bg-sunken"
                    >
                      <Image
                        src={item.evidence}
                        alt={`Certificate for ${item.role} at ${item.org}`}
                        width={974}
                        height={684}
                        sizes="(min-width: 1024px) 420px, 90vw"
                        className="h-auto w-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
                      />
                      <span className="on-accent absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-[12px] font-bold text-accent-ink">
                        Certificate
                        <ArrowUpRight size={13} weight={ICON.weight} />
                      </span>
                    </a>
                  ) : (
                    <div className="flex h-full min-h-[140px] items-center rounded-[--radius-surface] border border-dashed border-line px-6 py-8">
                      <p className="font-mono text-[12.5px] leading-relaxed text-text-muted">
                        Internal role. No certificate issued.
                      </p>
                    </div>
                  )}
                </div>
              </article>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
