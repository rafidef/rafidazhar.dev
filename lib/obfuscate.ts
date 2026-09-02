/**
 * Contact obfuscation.
 *
 * The legacy site rot13'd the address and injected the href from JavaScript.
 * That defeated naive harvesters but left the anchors with no href and no
 * keyboard focus whenever JS failed, so email and phone were simply
 * unreachable. The intent was right, the mechanism was an accessibility
 * regression.
 *
 * This keeps the intent and drops the regression. The value is decoded at
 * build time and written into the markup as numeric character references.
 * Browsers decode entities in attribute values during parsing, so the link is
 * a real, focusable, JS-free anchor; a regex harvester scanning raw HTML for
 * something shaped like an address still finds nothing.
 */

export function rot13(s: string): string {
  return s.replace(/[a-zA-Z]/g, (c) => {
    const base = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });
}

/** Every character as a numeric reference, so no substring is greppable. */
export function entities(s: string): string {
  return [...s].map((c) => `&#${c.codePointAt(0)};`).join("");
}

/** rot13 payload in, entity-encoded `scheme:value` out. */
export function obfuscatedHref(scheme: string, value: string): string {
  return entities(`${rot13(scheme)}:${rot13(value)}`);
}

export function obfuscatedText(value: string): string {
  return entities(rot13(value));
}
