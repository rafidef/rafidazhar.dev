"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "@phosphor-icons/react";
import { ICON } from "@/lib/icons";

type Mode = "light" | "dark";

/**
 * The page follows prefers-color-scheme by default. This gives the reader an
 * override, which Section 8.C asks for when both modes carry real brand
 * expression, and the lime reads differently enough in each that they do.
 */
export function ThemeToggle() {
  const [mode, setMode] = useState<Mode | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      setMode(stored);
      return;
    }
    setMode(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }, []);

  function toggle() {
    const next: Mode = mode === "dark" ? "light" : "dark";
    setMode(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode; the in-page override still applies for this session */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mode === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-text-muted transition-colors duration-200 hover:border-line-strong hover:text-text active:scale-95"
    >
      {/* Render nothing until mounted so SSR and client agree. */}
      {mode === "dark" ? (
        <Sun size={17} weight={ICON.weight} />
      ) : mode === "light" ? (
        <Moon size={17} weight={ICON.weight} />
      ) : (
        <span className="size-[17px]" />
      )}
    </button>
  );
}
