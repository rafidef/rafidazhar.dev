import { EnvelopeSimple, Phone, LinkedinLogo, DownloadSimple } from "@phosphor-icons/react/ssr";
import { contact, CV_LABEL, CV_HREF } from "@/lib/content";
import { ICON } from "@/lib/icons";
import { obfuscatedHref, obfuscatedText } from "@/lib/obfuscate";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";

const CHANNEL_ICONS = {
  email: EnvelopeSimple,
  phone: Phone,
  linkedin: LinkedinLogo,
} as const;

const LINK_CLASS =
  "text-[0.9375rem] font-semibold text-text underline-offset-4 hover:underline";

/**
 * Builds the anchor as raw markup so the numeric character references survive.
 * React escapes `&` inside attribute values, so an entity-encoded href cannot
 * be passed as a normal prop; it has to be written as markup.
 *
 * The icon deliberately sits OUTSIDE the anchor, which keeps the link text
 * equal to the address itself (good link text) and keeps the anchor's inner
 * HTML simple enough to hand-write safely.
 */
function ObfuscatedLink({ scheme, value, label }: { scheme: string; value: string; label: string }) {
  const html = `<a class="${LINK_CLASS}" href="${obfuscatedHref(scheme, value)}">${
    label ? obfuscatedText(label) : obfuscatedText(value)
  }</a>`;
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

/**
 * LAYOUT FAMILY I: full-bleed type closer.
 *
 * Replaces the legacy 3-equal-card contact grid. Three channels on a hairline
 * ledger, one button. That button carries the identical "Download CV" label
 * used in the hero, so there is exactly one label per intent (Section 4.5).
 */
export function Contact() {
  return (
    <section id="contact" className="scroll-mt-16 border-t border-line bg-bg-raised py-24 md:py-32">
      <div className="shell">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal as="h2" className="display text-[clamp(2.25rem,6.5vw,4.5rem)]">
              {contact.heading}
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-6 max-w-[48ch] text-[1.0625rem] leading-relaxed text-text-muted">
                {contact.sub}
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-10">
                <Magnetic
                  href={CV_HREF}
                  download
                  className="on-accent inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-accent px-7 py-4 text-base font-bold text-accent-ink"
                >
                  <span className="inline-flex items-center gap-2">
                    <DownloadSimple size={19} weight={ICON.weight} />
                    {CV_LABEL}
                  </span>
                </Magnetic>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="lg:col-span-5">
            <ul>
              {contact.channels.map((ch, i) => {
                const Icon = CHANNEL_ICONS[ch.kind];

                return (
                  <li
                    key={ch.kind}
                    className={`flex items-center gap-4 py-5 ${i > 0 ? "border-t border-line" : ""}`}
                  >
                    <span
                      aria-hidden="true"
                      className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-text-muted"
                    >
                      <Icon size={17} weight={ICON.weight} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-text-muted">
                        {ch.label}
                      </span>
                      <span className="block truncate">
                        {ch.kind === "linkedin" ? (
                          <a
                            href={ch.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={LINK_CLASS}
                          >
                            {ch.value}
                          </a>
                        ) : (
                          <ObfuscatedLink
                            scheme={ch.scheme!}
                            value={ch.value}
                            label={"display" in ch ? ch.display! : ""}
                          />
                        )}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
