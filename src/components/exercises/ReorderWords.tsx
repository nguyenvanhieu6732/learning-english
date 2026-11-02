"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { ExerciseQuestion } from "@/lib/gemini/schemas";

/** Tap words to build the sentence; tap a placed word to send it back. Indexes keep duplicate words distinct. */
export function ReorderWords({ question, disabled, onSubmit }: { question: ExerciseQuestion; disabled: boolean; onSubmit: (a: string) => void }) {
  const words = question.words ?? [];
  const [placed, setPlaced] = useState<number[]>([]);
  const remaining = words.map((_, i) => i).filter((i) => !placed.includes(i));

  const chip =
    "rounded-lg border-2 border-b-4 bg-card px-3 py-1.5 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring enabled:hover:border-primary/50 enabled:hover:bg-secondary";

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium sm:text-xl">{question.question}</p>
      <div className="flex min-h-14 flex-wrap items-center gap-2 rounded-xl border-2 border-dashed bg-muted/50 p-2.5" aria-label="Câu của bạn">
        {placed.map((i) => (
          <button key={i} type="button" disabled={disabled} className={chip} onClick={() => setPlaced(placed.filter((p) => p !== i))}>
            {words[i]}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {remaining.map((i) => (
          <button key={i} type="button" disabled={disabled} className={chip} onClick={() => setPlaced([...placed, i])}>
            {words[i]}
          </button>
        ))}
      </div>
      <Button disabled={disabled || remaining.length > 0} onClick={() => onSubmit(placed.map((i) => words[i]).join(" "))}>
        Kiểm tra
      </Button>
    </div>
  );
}
