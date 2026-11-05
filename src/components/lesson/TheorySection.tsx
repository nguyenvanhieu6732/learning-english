import { Brain, Diamond, Lightbulb } from "lucide-react";
import type { LessonContent } from "@/lib/gemini/schemas";

export function TheorySection({ theory }: { theory: LessonContent["theory"] }) {
  return (
    <section className="space-y-4 rounded-lg border p-4">
      <h2 className="flex items-center gap-2 font-semibold">
        <Brain className="size-5 shrink-0 text-primary" aria-hidden="true" /> Hiểu logic
      </h2>
      <p className="whitespace-pre-line leading-relaxed">{theory.explanation}</p>
      {theory.key_points.length > 0 && (
        <ul className="space-y-1">
          {theory.key_points.map((k, i) => (
            <li key={i} className="flex gap-2">
              <Diamond className="mt-1.5 size-3 shrink-0 fill-current text-primary" aria-hidden="true" />
              <span>{k}</span>
            </li>
          ))}
        </ul>
      )}
      {theory.vietnamese_comparison && (
        <div className="rounded-md bg-accent p-3">
          <p className="flex items-center gap-2 font-medium">
            <Lightbulb className="size-5 shrink-0 text-primary" aria-hidden="true" /> So sánh với tiếng Việt
          </p>
          <p className="mt-1 whitespace-pre-line">{theory.vietnamese_comparison}</p>
        </div>
      )}
    </section>
  );
}
