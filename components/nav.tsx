"use client";

import { useEffect, useRef, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { motion, useReducedMotion, useScroll, useMotionValueEvent } from "motion/react";
import { nav, navCta } from "@/lib/content";
import { ICON } from "@/lib/icons";
import { Wordmark } from "./wordmark";
import { ThemeToggle } from "./theme-toggle";

/**
 * Single-line desktop nav, 64px tall (Section 4.7 caps it at 80px).
 * Labels and order are locked by the SEO constraint and unchanged.
 *
 * Scroll state comes from Motion's useScroll, never a scroll listener
 * (Section 5.D hard ban).
 */
export function Nav() {
  const [open, setOpen] = useState(false);
  const [lifted, setLifted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setLifted(y > 24));

  // Escape closes the menu and returns focus to the page.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        lifted ? "border-b border-line bg-bg/85 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="shell flex h-16 items-center justify-between gap-4">
        <a href="#hero" className="text-[15px] leading-none" aria-label="Rafid Azhar, home">
          <Wordmark />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-[13.5px] font-medium text-text-muted transition-colors duration-200 hover:text-text"
            >
              {item.label}
            </a>
          ))}
          <a
            href={navCta.href}
            className="on-accent ml-2 rounded-full bg-accent px-4 py-2 text-[13.5px] font-bold text-accent-ink transition-transform duration-200 hover:-translate-y-px active:translate-y-0 active:scale-[0.98]"
          >
            {navCta.label}
          </a>
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-9 place-items-center rounded-full border border-line text-text"
          >
            {open ? <X size={17} weight={ICON.weight} /> : <List size={17} weight={ICON.weight} />}
          </button>
        </div>
      </div>

      {open && (
        <motion.div
          ref={panelRef}
          id="mobile-nav"
          initial={reduce ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="border-b border-line bg-bg lg:hidden"
        >
          <div className="shell flex flex-col gap-1 py-4">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-[--radius-surface] px-2 py-3 text-base font-medium text-text-muted"
              >
                {item.label}
              </a>
            ))}
            <a
              href={navCta.href}
              onClick={() => setOpen(false)}
              className="on-accent mt-2 rounded-full bg-accent px-5 py-3 text-center text-base font-bold text-accent-ink"
            >
              {navCta.label}
            </a>
          </div>
        </motion.div>
      )}
    </header>
  );
}
