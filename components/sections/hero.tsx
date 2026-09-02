"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown, DownloadSimple } from "@phosphor-icons/react";
import { hero, CV_LABEL, CV_HREF } from "@/lib/content";
import { ICON } from "@/lib/icons";
import { Magnetic } from "@/components/motion/magnetic";

/**
 * LAYOUT FAMILY A: asymmetric split, off-grid.
 *
 * Four text elements exactly (Section 4.7): headline, subtext, two CTAs. The
 * legacy hero carried eight, including a role-tag row, a stats strip and a
 * scroll cue. Role tags moved to the stack marquee, the one non-redundant
 * stat moved into About, and the scroll cue is deleted per Section 9.F.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // Parallax is scroll-linked through motion values, not a scroll listener.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);
  const plateY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 150]);

  const rise = {
    hidden: { opacity: 0, y: 26 },
    shown: { opacity: 1, y: 0 },
  };

  return (
    <section
      id="hero"
      ref={ref}
      /* min-h-[100dvh], never h-screen (Section 3.E). Top padding stays inside
         the pt-24 cap (Section 4.7) and the flex centring keeps the
         composition off the top edge without adding more of it. */
      className="relative flex min-h-[100dvh] items-center overflow-hidden pb-20 pt-24 md:pb-24"
    >
      <div className="shell grid w-full grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-8">
        {/* Type column. Deliberately not centred: DESIGN_VARIANCE 9. */}
        <motion.div
          className="lg:col-span-7 lg:pr-6 xl:col-span-6"
          initial={reduce ? false : "hidden"}
          animate="shown"
          variants={{ shown: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } }}
        >
          <motion.h1
            variants={rise}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            /* Scale planned against the 7-column measure so neither line
               wraps. Section 4.7: a hero headline that wraps to 3 lines is a
               font-size error, not a copy-length error. */
            className="display text-[clamp(2.5rem,5.4vw,4.5rem)]"
          >
            <span className="block whitespace-nowrap">{hero.name[0]}</span>
            <span className="display-wide block whitespace-nowrap text-text-muted">
              {hero.name[1]}
            </span>
          </motion.h1>

          <motion.p
            variants={rise}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 max-w-[46ch] text-[1.0625rem] leading-relaxed text-text-muted md:text-lg"
          >
            {hero.subtext}
          </motion.p>

          <motion.div
            variants={rise}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Magnetic
              href={CV_HREF}
              download
              className="on-accent inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-accent px-6 py-3.5 text-[0.9375rem] font-bold text-accent-ink"
            >
              <span className="inline-flex items-center gap-2">
                <DownloadSimple size={18} weight={ICON.weight} />
                {CV_LABEL}
              </span>
            </Magnetic>

            <a
              href="#experience"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-line-strong px-6 py-3.5 text-[0.9375rem] font-semibold text-text transition-colors duration-200 hover:border-accent hover:bg-accent hover:text-accent-ink"
            >
              Experience
              <ArrowDown size={17} weight={ICON.weight} />
            </a>
          </motion.div>
        </motion.div>

        {/* Portrait column. The lime plate sits behind and drifts at a
            different rate, which is what gives the block physical depth. */}
        <div className="relative lg:col-span-5 lg:col-start-8 xl:col-span-6 xl:col-start-7">
          <div className="relative mx-auto w-full max-w-[420px] lg:ml-auto lg:mr-0 xl:max-w-[480px]">
            <motion.div
              aria-hidden="true"
              style={{ y: plateY }}
              className="absolute -left-4 -top-5 size-full rounded-[--radius-surface] bg-accent"
            />
            <motion.div
              style={{ y: portraitY }}
              initial={reduce ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden rounded-[--radius-surface] bg-bg-sunken shadow-[var(--shadow-lift)]"
            >
              <Image
                src={hero.portrait.src}
                alt={hero.portrait.alt}
                width={hero.portrait.width}
                height={hero.portrait.height}
                priority
                sizes="(min-width: 1280px) 480px, (min-width: 1024px) 420px, 90vw"
                className="h-auto w-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
