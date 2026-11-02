"use client";

import { cn } from "@/lib/utils";
import { DIFFICULTIES, type Difficulty } from "@/lib/gemini/schemas";

const OPTIONS: Record<Difficulty, { label: string; hint: string; dot: string }> = {
  easy: { label: "Dễ", hint: "Mới bắt đầu", dot: "bg-green-500" },
  medium: { label: "Trung bình", hint: "Giao tiếp", dot: "bg-yellow-500" },
  hard: { label: "Khó", hint: "IELTS", dot: "bg-red-500" },
};

export function DifficultySelector({ value, onChange }: { value: Difficulty; onChange: (d: Difficulty) => void }) {
  return (
    <div role="radiogroup" className="grid grid-cols-3 gap-2">
      {DIFFICULTIES.map((d) => {
        const o = OPTIONS[d];
        const active = value === d;
        return (
          <button
            key={d}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(d)}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-xl border-2 px-2 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active ? "border-primary bg-secondary text-secondary-foreground" : "border-border bg-card hover:border-primary/40",
            )}
          >
            <span className="flex items-center gap-1.5 font-semibold">
              <span className={cn("size-2 rounded-full", o.dot)} aria-hidden="true" />
              {o.label}
            </span>
            <span className="text-xs text-muted-foreground">{o.hint}</span>
          </button>
        );
      })}
    </div>
  );
}
