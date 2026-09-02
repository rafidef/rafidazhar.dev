"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { revealChild } from "./reveal";

/** Child of a RevealGroup. Inherits the parent's stagger orchestration. */
export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const Tag = motion[as];
  return (
    <Tag className={className} variants={revealChild}>
      {children}
    </Tag>
  );
}
