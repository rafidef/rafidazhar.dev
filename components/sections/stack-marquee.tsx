import { stack } from "@/lib/content";
import { inlineLogo } from "@/lib/svg";

/**
 * LAYOUT FAMILY B: full-bleed marquee band.
 *
 * The one marquee on the page (Section 5 caps it at one). It sits UNDER the
 * hero, never inside it (Section 4.7), carries logos only with no category
 * labels (Section 14), and uses real SVG marks from Simple Icons and devicon
 * rather than text wordmarks (Section 4.8).
 *
 * Server Component: the animation is pure CSS, so this ships zero JS. Under
 * prefers-reduced-motion the track stops and wraps into a static grid, which
 * is handled in globals.css.
 */
export function StackMarquee() {
  // Duplicated once so the -50% keyframe loops seamlessly.
  const lane = [...stack, ...stack];

  return (
    <section aria-label="Tools and platforms" className="border-y border-line bg-bg-raised py-10">
      <div className="marquee-mask overflow-hidden">
        <ul
          className="marquee-track flex w-max items-center gap-14 px-7"
          style={{ ["--marquee-duration" as string]: "52s" }}
        >
          {lane.map((logo, i) => (
            <li
              key={`${logo.file}-${i}`}
              aria-hidden={i >= stack.length ? "true" : undefined}
              className="shrink-0 text-text-muted transition-colors duration-300 hover:text-text"
            >
              {/* These SVGs carry only a viewBox, so an explicit height is
                  what gives them intrinsic size; w-auto then derives the
                  width. max-w clamps the wordmark-shaped marks (AWS, VMware,
                  Cisco) which would otherwise run absurdly wide, and
                  preserveAspectRatio letterboxes them inside the box. */}
              <span
                title={logo.label}
                className="block [&>svg]:h-9 [&>svg]:w-auto [&>svg]:max-w-[110px]"
                dangerouslySetInnerHTML={{ __html: inlineLogo(logo.file) }}
              />
              <span className="sr-only">{logo.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
