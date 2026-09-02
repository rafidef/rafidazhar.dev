import { footer } from "@/lib/content";

/**
 * The one brand element carried over from the legacy site. The shape is
 * unchanged: angle brackets, the name, an accented separator dot, "dev", and a
 * self-closing slash. The name reads "rafidazhar" so the mark matches the
 * domain the site is served from. Only the treatment is new: it was gold with a muted
 * mono bracket, it is now ink with the dot as the single lime element, which
 * makes the accent the punctuation rather than the whole mark.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  const { open, name, dot, tld, close } = footer.wordmark;

  return (
    <span className={`font-mono font-medium tracking-tight ${className}`}>
      <span className="text-text-muted">{open}</span>
      <span className="text-text">{name}</span>
      <span className="text-accent-text">{dot}</span>
      <span className="text-text">{tld}</span>
      <span className="text-text-muted">{close}</span>
    </span>
  );
}
