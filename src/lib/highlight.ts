// No imports so `npm test` can load it with plain node.

/** Where to mark `highlight` in `text`: first whole-word match, else first substring match, else null. */
export function findHighlight(text: string, highlight: string): { start: number; end: number } | null {
  if (!highlight) return null;
  const escaped = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match =
    new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, "iu").exec(text) ?? new RegExp(escaped, "iu").exec(text);
  return match && { start: match.index, end: match.index + match[0].length };
}
