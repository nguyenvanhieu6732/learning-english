"use client";

import { cn } from "@/lib/utils";
import type { ExerciseQuestion } from "@/lib/gemini/schemas";

interface Props {
  question: ExerciseQuestion;
  disabled: boolean;
  picked?: string;
  /** Set after checking, to color the options. */
  correctAnswer?: string;
  onSubmit: (answer: string) => void;
}

export function MultipleChoice({ question, disabled, picked, correctAnswer, onSubmit }: Props) {
  return (
    <div className="space-y-5">
      <p className="text-lg font-medium sm:text-xl">{question.question}</p>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {(question.options ?? []).map((o, i) => {
          const isRight = correctAnswer !== undefined && o === correctAnswer;
          const isWrongPick = correctAnswer !== undefined && o === picked && o !== correctAnswer;
          return (
            <button
              key={o}
              type="button"
              disabled={disabled}
              onClick={() => onSubmit(o)}
              className={cn(
                "flex items-center gap-3 rounded-xl border-2 bg-card px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring enabled:hover:border-primary/50 enabled:hover:bg-secondary disabled:cursor-default",
                isRight && "border-green-500 bg-green-50",
                isWrongPick && "border-red-500 bg-red-50",
                correctAnswer === undefined && picked === o && "border-primary",
              )}
            >
              <span
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-lg bg-muted text-sm font-semibold text-muted-foreground",
                  isRight && "bg-green-500 text-white",
                  isWrongPick && "bg-red-500 text-white",
                )}
                aria-hidden="true"
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span className="min-w-0 break-words">{o}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
