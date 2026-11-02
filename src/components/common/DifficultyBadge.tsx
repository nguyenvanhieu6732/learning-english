import { cn } from "@/lib/utils";
import type { Difficulty } from "@/lib/gemini/schemas";

export const DIFFICULTY_LABEL: Record<Difficulty, string> = { easy: "Dễ", medium: "Trung bình", hard: "Khó" };

const COLORS: Record<Difficulty, string> = {
  easy: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  hard: "bg-red-100 text-red-800",
};

export function DifficultyBadge({ value }: { value: Difficulty }) {
  return (
    <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-medium", COLORS[value])}>
      {DIFFICULTY_LABEL[value]}
    </span>
  );
}
