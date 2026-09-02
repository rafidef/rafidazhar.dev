"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { ArrowUpRight, Certificate } from "@phosphor-icons/react";
import { certifications } from "@/lib/content";
import { ICON } from "@/lib/icons";

gsap.registerPlugin(ScrollTrigger);

/**
 * LAYOUT FAMILY G: horizontally panned track, Section 5.B canonical skeleton.
 *
 * Motivation: this is the only section backed by real photographic evidence,
 * and it is breadth-heavy. The legacy version was eight near-identical rows
 * with a hairline under each, which Section 4.9 names as the single worst
 * default for a list this long. Panning turns the same eight items into the
 * page's most physical moment and puts the actual certificates on screen.
 *
 * Critical points from 5.B: start "top top", pin the wrapper, scrub the inner
 * track, end at exactly the horizontal distance, invalidateOnRefresh so a
 * resize recalculates rather than stranding the track mid-pan.
 *
 * Below 1024px it degrades to a native scroll-snap rail, which is the correct
 * behaviour on touch: no hijack, no pin, momentum preserved.
 */
export function Certifications() {
  const wrap = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !wrap.current || !track.current) return;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const distance = () => track.current!.scrollWidth - window.innerWidth;

        gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: wrap.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      }, wrap);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [reduce]);

  return (
    <section
      id="certifications"
      ref={wrap}
      className="scroll-mt-16 overflow-hidden border-t border-line bg-bg-raised py-24 lg:py-0"
    >
      <div className="lg:flex lg:h-[100dvh] lg:flex-col lg:justify-center">
        <div className="shell">
          <h2 className="display max-w-[16ch] text-[clamp(2rem,5vw,3.5rem)]">
            {certifications.heading}
          </h2>
        </div>

        <div
          ref={track}
          className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:px-10 lg:mt-12 lg:w-max lg:snap-none lg:overflow-visible lg:px-16 lg:pb-0"
        >
          {certifications.items.map((cert) => {
            const Wrapper = cert.href ? "a" : "div";

            return (
              <Wrapper
                key={cert.title}
                {...(cert.href
                  ? { href: cert.href, target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className={`group flex w-[78vw] shrink-0 snap-start flex-col overflow-hidden rounded-[--radius-surface] border border-line bg-bg sm:w-[380px] lg:w-[340px] ${
                  cert.href ? "" : "cursor-default"
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-bg-sunken">
                  {cert.image ? (
                    <Image
                      src={cert.image}
                      alt={`${cert.title} certificate issued by ${cert.issuer}`}
                      fill
                      sizes="(min-width: 1024px) 340px, (min-width: 640px) 380px, 78vw"
                      className="object-cover object-top transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                    />
                  ) : (
                    /* No file exists for this one. A typographic panel rather
                       than a fabricated certificate image. */
                    <div className="flex h-full flex-col items-center justify-center gap-3 text-text-muted">
                      <Certificate size={26} weight={ICON.weight} />
                      <p className="font-mono text-[11.5px] uppercase tracking-[0.14em]">
                        Certificate not on file
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <p className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-text-muted">
                    {cert.date}
                  </p>
                  <h3 className="mt-2.5 text-[1.0625rem] font-bold leading-snug text-text">
                    {cert.title}
                  </h3>
                  <p className="mt-1.5 text-[0.875rem] leading-snug text-text-muted">
                    {cert.issuer}
                  </p>

                  {cert.href && (
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-[13px] font-semibold text-text transition-colors duration-200 group-hover:text-accent-text">
                      View
                      <ArrowUpRight size={14} weight={ICON.weight} />
                    </span>
                  )}
                </div>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
