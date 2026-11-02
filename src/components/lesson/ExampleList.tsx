import type { LessonContent } from "@/lib/gemini/schemas";

/** Wraps the first occurrence of `highlight` in <mark>. */
function Highlighted({ text, highlight }: { text: string; highlight: string }) {
  const i = highlight ? text.toLowerCase().indexOf(highlight.toLowerCase()) : -1;
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded bg-yellow-200 px-0.5 dark:bg-yellow-800 dark:text-white">
        {text.slice(i, i + highlight.length)}
      </mark>
      {text.slice(i + highlight.length)}
    </>
  );
}

export function ExampleList({ examples }: { examples: LessonContent["examples"] }) {
  return (
    <ol className="space-y-3">
      {examples.map((ex, i) => (
        <li key={i} className="rounded-lg border p-3">
          <p className="font-medium">
            {i + 1}. <Highlighted text={ex.en} highlight={ex.highlight} />
          </p>
          <p className="text-sm text-muted-foreground">{ex.vi}</p>
          <p className="mt-1 text-sm">👉 {ex.why}</p>
        </li>
      ))}
    </ol>
  );
}
