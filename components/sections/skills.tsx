import type { Icon } from "@phosphor-icons/react";
import {
  Cloud,
  GitBranch,
  ShareNetwork,
  TerminalWindow,
  StackSimple,
  UsersThree,
} from "@phosphor-icons/react/ssr";
import { skills } from "@/lib/content";
import { inlineLogo } from "@/lib/svg";
import { ICON } from "@/lib/icons";
import { Reveal } from "@/components/motion/reveal";

const ICONS: Record<string, Icon> = {
  cloud: Cloud,
  pipeline: GitBranch,
  network: ShareNetwork,
  terminal: TerminalWindow,
  stack: StackSimple,
  people: UsersThree,
};

/**
 * LAYOUT FAMILY E: bento grid.
 *
 * Six categories, exactly six cells, no empty tiles (Section 4.7 cell-count
 * rule). Replaces the legacy `repeat(3, 1fr)` grid, which was the banned
 * three-equal-card row (Section 9.C).
 *
 * Background diversity (Section 14): the flagship cell is a full lime fill,
 * one cell is sunken, one carries an oversized logo watermark. Not six
 * identical text cards.
 */
const CELLS = [
  { span: "lg:col-span-7", tone: "accent" },
  { span: "lg:col-span-5", tone: "sunken" },
  { span: "lg:col-span-5", tone: "watermark" },
  { span: "lg:col-span-4", tone: "plain" },
  { span: "lg:col-span-3", tone: "plain" },
  { span: "lg:col-span-12", tone: "wide" },
] as const;

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-16 py-24 md:py-32">
      <div className="shell">
        <Reveal as="h2" className="display max-w-[14ch] text-[clamp(2rem,5vw,3.5rem)]">
          {skills.heading}
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-3 lg:grid-cols-12">
          {skills.categories.map((cat, i) => {
            const cell = CELLS[i];
            const Icon = ICONS[cat.icon];
            const onAccent = cell.tone === "accent";

            return (
              <Reveal
                key={cat.name}
                delay={i * 0.05}
                className={`${cell.span} ${onAccent ? "on-accent" : ""}`}
              >
                <div
                  className={`relative flex h-full flex-col overflow-hidden rounded-[--radius-surface] p-6 md:p-7 ${
                    onAccent
                      ? "bg-accent text-accent-ink"
                      : cell.tone === "sunken"
                        ? "bg-bg-sunken"
                        : "border border-line bg-bg-raised"
                  }`}
                >
                  {cell.tone === "watermark" && cat.logos[0] && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-6 -right-4 text-text opacity-[0.055] [&>svg]:size-44"
                      dangerouslySetInnerHTML={{ __html: inlineLogo(cat.logos[0]) }}
                    />
                  )}

                  <div className="relative flex items-center gap-2.5">
                    <Icon size={20} weight={ICON.weight} />
                    <h3
                      className={`text-[0.9375rem] font-bold ${
                        onAccent ? "text-accent-ink" : "text-text"
                      }`}
                    >
                      {cat.name}
                    </h3>
                  </div>

                  <ul
                    className={`relative mt-5 flex flex-wrap gap-1.5 ${
                      cell.tone === "wide" ? "md:mt-4" : ""
                    }`}
                  >
                    {cat.items.map((item) => (
                      <li
                        key={item}
                        className={`rounded-full px-3 py-1 font-mono text-[12px] ${
                          onAccent
                            ? "bg-accent-ink/10 text-accent-ink"
                            : "border border-line text-text-muted"
                        }`}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>

                  {cat.logos.length > 0 && cell.tone !== "watermark" && (
                    <ul className="relative mt-auto flex items-center gap-4 pt-8">
                      {cat.logos.map((file) => (
                        <li
                          key={file}
                          className={onAccent ? "text-accent-ink/70" : "text-text-muted/45"}
                          aria-hidden="true"
                        >
                          <span
                            className="block [&>svg]:h-7 [&>svg]:w-auto [&>svg]:max-w-[80px]"
                            dangerouslySetInnerHTML={{ __html: inlineLogo(file) }}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
