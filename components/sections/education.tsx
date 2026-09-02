import { education } from "@/lib/content";
import { Reveal } from "@/components/motion/reveal";

/**
 * LAYOUT FAMILY H: editorial ledger.
 *
 * Oversized display years anchor two rows, separated by a single hairline
 * rather than a border on every row (Section 9.F). Replaces the legacy
 * 2-column card grid, which was interchangeable with three other sections,
 * and drops the graduation-cap and books emoji (Section 3.D).
 */
export function Education() {
  return (
    <section id="education" className="scroll-mt-16 border-t border-line py-24 md:py-32">
      <div className="shell">
        <Reveal as="h2" className="display text-[clamp(2rem,5vw,3.5rem)]">
          {education.heading}
        </Reveal>

        <div className="mt-14">
          {education.items.map((item, i) => (
            <Reveal key={item.school} delay={i * 0.08}>
              <article
                className={`grid grid-cols-1 items-baseline gap-4 py-9 md:grid-cols-12 md:gap-8 ${
                  i > 0 ? "border-t border-line" : ""
                }`}
              >
                <p
                  aria-hidden="true"
                  className="display text-[clamp(3rem,9vw,6rem)] leading-none text-text-muted/25 md:col-span-3"
                >
                  {item.years}
                </p>

                <div className="md:col-span-6">
                  <h3 className="display text-[clamp(1.4rem,2.6vw,2rem)]">{item.school}</h3>
                  <p className="mt-2 text-[1.0625rem] text-text-muted">{item.degree}</p>
                  {item.note && (
                    <p className="mt-3">
                      <span className="marker font-mono text-[13px] font-semibold">{item.note}</span>
                    </p>
                  )}
                </div>

                <p className="font-mono text-[12.5px] uppercase tracking-[0.14em] text-text-muted md:col-span-3 md:text-right">
                  {item.date}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
