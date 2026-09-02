import { experience } from "@/lib/content";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { RevealItem } from "@/components/motion/reveal-item";

/**
 * LAYOUT FAMILY D: sticky aside. Role, company, dates and stack pin in the
 * left column while the detail bullets scroll past on the right, so a reader
 * deep in the sixth bullet still sees which job they are reading about.
 *
 * The pin is `position: sticky`, pure CSS. No ScrollTrigger needed for a
 * behaviour the platform already does correctly, per the motivation test.
 */
export function Experience() {
  return (
    <section id="experience" className="scroll-mt-16 border-t border-line bg-bg-raised py-24 md:py-32">
      <div className="shell">
        <Reveal as="h2" className="display max-w-[16ch] text-[clamp(2rem,5vw,3.5rem)]">
          {experience.heading}
        </Reveal>

        <div className="mt-16 space-y-20 md:space-y-28">
          {experience.roles.map((role) => (
            <article key={role.company} className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-5">
                <div className="lg:sticky lg:top-24">
                  <Reveal>
                    <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-text-muted">
                      {role.date}
                    </p>
                    <h3 className="display mt-3 text-[clamp(1.75rem,3.4vw,2.5rem)]">{role.role}</h3>
                    <p className="mt-2 text-[1.0625rem] font-medium text-text-muted">
                      {role.company}
                    </p>
                    <p className="mt-4">
                      <span className="marker font-mono text-[12px] font-semibold uppercase tracking-[0.1em]">
                        {role.badge}
                      </span>
                    </p>

                    <ul className="mt-7 flex flex-wrap gap-1.5">
                      {role.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full border border-line px-3 py-1 font-mono text-[11.5px] text-text-muted"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                </div>
              </div>

              <RevealGroup className="lg:col-span-7" stagger={0.06}>
                <ul className="space-y-0">
                  {role.bullets.map((b, i) => (
                    <RevealItem
                      key={i}
                      as="li"
                      className={`py-5 text-[1.0625rem] leading-[1.7] text-text-muted ${
                        i > 0 ? "border-t border-line" : ""
                      }`}
                    >
                      {b}
                    </RevealItem>
                  ))}
                </ul>
              </RevealGroup>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
