import type { LessonContent } from "@/lib/gemini/schemas";

export function TheorySection({ theory }: { theory: LessonContent["theory"] }) {
  return (
    <section className="space-y-4 rounded-lg border p-4">
      <h2 className="font-semibold">📐 Hiểu logic</h2>
      <p className="whitespace-pre-line leading-relaxed">{theory.explanation}</p>
      {theory.key_points.length > 0 && (
        <ul className="space-y-1">
          {theory.key_points.map((k, i) => (
            <li key={i}>🔹 {k}</li>
          ))}
        </ul>
      )}
      {theory.vietnamese_comparison && (
        <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-950">
          <p className="font-medium">💡 So sánh với tiếng Việt</p>
          <p className="mt-1 whitespace-pre-line">{theory.vietnamese_comparison}</p>
        </div>
      )}
    </section>
  );
}
