"use client";

import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * Magnetic button (Section 10). The pointer position lives entirely in motion
 * values, never in React state, so tracking the cursor costs zero re-renders
 * (Section 3.B).
 *
 * Disabled outright under reduced motion and on coarse pointers, where a
 * magnet has nothing to attract.
 */
export function Magnetic({
  children,
  className,
  href,
  download,
  strength = 0.32,
}: {
  children: ReactNode;
  className?: string;
  href: string;
  download?: boolean;
  strength?: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { stiffness: 220, damping: 18, mass: 0.4 };
  const x = useSpring(mx, spring);
  const y = useSpring(my, spring);

  // The label trails the button slightly, which is what sells the weight.
  const lx = useTransform(x, (v) => v * 0.42);
  const ly = useTransform(y, (v) => v * 0.42);

  function onMove(e: React.PointerEvent<HTMLAnchorElement>) {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * strength);
    my.set((e.clientY - (r.top + r.height / 2)) * strength);
  }

  function reset() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      download={download}
      className={className}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onBlur={reset}
      whileTap={reduce ? undefined : { scale: 0.97 }}
    >
      <motion.span style={reduce ? undefined : { x: lx, y: ly }} className="block">
        {children}
      </motion.span>
    </motion.a>
  );
}
