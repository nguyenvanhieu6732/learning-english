"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ExerciseQuestion } from "@/lib/gemini/schemas";

export function FillBlank({ question, disabled, onSubmit }: { question: ExerciseQuestion; disabled: boolean; onSubmit: (a: string) => void }) {
  const [value, setValue] = useState("");

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) onSubmit(value);
      }}
    >
      <p className="text-lg font-medium sm:text-xl">{question.question}</p>
      <div className="flex gap-2">
        <Input
          aria-label="Từ cần điền"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={disabled}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        <Button type="submit" disabled={disabled || !value.trim()}>
          Kiểm tra
        </Button>
      </div>
    </form>
  );
}
