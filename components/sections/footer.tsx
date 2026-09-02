import { footer } from "@/lib/content";
import { Wordmark } from "@/components/wordmark";

/**
 * No version stamp, no build info, no emoji. The legacy footer read
 * "Built with [heart] & [cloud]", which Section 3.D rules out.
 */
export function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="shell flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <a href="#hero" className="text-[15px]" aria-label="Back to top">
          <Wordmark />
        </a>
        <p className="text-[13px] text-text-muted">{footer.copy}</p>
        <p className="font-mono text-[12px] text-text-muted">{footer.place}</p>
      </div>
    </footer>
  );
}
