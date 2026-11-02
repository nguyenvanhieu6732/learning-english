import type { SupabaseClient } from "@supabase/supabase-js";
import type { ProgressStatus } from "./scoring";
import type { Difficulty } from "./gemini/schemas";

export interface PathTopic {
  id: string;
  name: string;
  description: string | null;
  difficulty: Difficulty;
  status: ProgressStatus;
  completion: number;
  points: number;
}
export interface PathPhase {
  id: number;
  name: string;
  description: string | null;
  estimated_days: number | null;
  daily_minutes: number | null;
  percent: number;
  topics: PathTopic[];
}

export const isDone = (s: ProgressStatus) => s === "completed" || s === "mastered";

/** The 4 phases with their topics and this user's status on each (RLS limits progress to the user). */
export async function loadLearningPath(supabase: SupabaseClient): Promise<PathPhase[]> {
  const [phases, topics, progress] = await Promise.all([
    supabase.from("learning_phases").select("id, name, description, estimated_days, daily_minutes").order("order_index"),
    supabase.from("topics").select("id, phase_id, name, description, difficulty").order("order_index"),
    supabase.from("user_progress").select("topic_id, status, completion_percent, total_points"),
  ]);
  const byTopic = new Map((progress.data ?? []).map((p) => [p.topic_id, p]));

  return (phases.data ?? []).map((ph) => {
    const ts: PathTopic[] = (topics.data ?? [])
      .filter((t) => t.phase_id === ph.id)
      .map((t) => {
        const p = byTopic.get(t.id);
        return {
          id: t.id,
          name: t.name,
          description: t.description,
          difficulty: t.difficulty,
          status: (p?.status ?? "not_started") as ProgressStatus,
          completion: p?.completion_percent ?? 0,
          points: p?.total_points ?? 0,
        };
      });
    const done = ts.filter((t) => isDone(t.status)).length;
    return { ...ph, topics: ts, percent: ts.length ? Math.round((done / ts.length) * 100) : 0 };
  });
}
