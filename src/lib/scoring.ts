// Pure scoring logic. No imports so `npm test` can load it with plain node.

export type ProgressStatus = "not_started" | "in_progress" | "completed" | "mastered";

const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .replace(/[.!?]+$/, "")
    .trim();

/** Deterministic check for multiple_choice / fill_blank / reorder. */
export function isCorrect(_type: string, given: string, expected: string): boolean {
  const g = normalize(given ?? "");
  return g !== "" && g === normalize(expected ?? "");
}

export const scoreOf = (correct: number, total: number) =>
  total === 0 ? 0 : Math.round((correct / total) * 100);

/** ≥85% = "tự động" (mastered), ≥60% = completed, otherwise still in progress. */
export function statusFor(score: number): ProgressStatus {
  if (score >= 85) return "mastered";
  if (score >= 60) return "completed";
  return "in_progress";
}

// shortcut: days are counted in Vietnam time (UTC+7) for everyone; store a per-user timezone if users abroad complain.
const VN_OFFSET_MS = 7 * 3600 * 1000;
const dayNumber = (d: Date) => Math.floor((d.getTime() + VN_OFFSET_MS) / 86400000);

/** Consecutive study days ending today (or yesterday, so the streak survives until the day ends). */
export function computeStreak(dates: Date[], now = new Date()): number {
  const days = new Set(dates.map(dayNumber));
  let day = dayNumber(now);
  if (!days.has(day)) day -= 1;
  let streak = 0;
  while (days.has(day)) {
    streak++;
    day--;
  }
  return streak;
}
