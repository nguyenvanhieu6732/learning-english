import { CornerDownRight } from "lucide-react";
import { findHighlight } from "@/lib/highlight";
import type { LessonContent } from "@/lib/gemini/schemas";

function Highlighted({ text, highlight }: { text: string; highlight: string }) {
  const range = findHighlight(text, highlight);
  if (!range) return <>{text}</>;
  return (
    <>
      {text.slice(0, range.start)}
      <mark className="rounded bg-yellow-200 px-0.5 dark:bg-yellow-800 dark:text-white">
        {text.slice(range.start, range.end)}
      </mark>
      {text.slice(range.end)}
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
          <p className="mt-1 flex gap-1.5 text-sm">
            <CornerDownRight className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <span>{ex.why}</span>
          </p>
        </li>
      ))}
    </ol>
  );
}
