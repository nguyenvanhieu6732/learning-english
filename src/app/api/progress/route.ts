import { NextResponse } from "next/server";
import { getUser } from "@/lib/supabase/server";
import { isCorrect, scoreOf, statusFor, type ProgressStatus } from "@/lib/scoring";

const RANK: Record<ProgressStatus, number> = { not_started: 0, in_progress: 1, completed: 2, mastered: 3 };

/**
 * Records a finished lesson. Body: { lessonId, answers: { [exerciseId]: string }, timeSpentSeconds }.
 * The score is recomputed from the DB, never taken from the client.
 */
export async function POST(req: Request) {
  const { supabase, user } = await getUser();
  if (!user) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const answers: Record<string, string> = body.answers && typeof body.answers === "object" ? body.answers : {};
  const timeSpent = Math.max(0, Math.min(86400, Math.round(Number(body.timeSpentSeconds) || 0)));
  if (typeof body.lessonId !== "string") return NextResponse.json({ error: "Thiếu lessonId" }, { status: 400 });

  const { data: lesson } = await supabase
    .from("lessons")
    .select("id, topic_id, exercises(id, type, answer_json, points)")
    .eq("id", body.lessonId)
    .single();
  if (!lesson) return NextResponse.json({ error: "Không tìm thấy bài học" }, { status: 404 });

  let correct = 0;
  let points = 0;
  for (const ex of lesson.exercises) {
    if (isCorrect(ex.type, String(answers[ex.id] ?? ""), String(ex.answer_json?.answer ?? ""))) {
      correct++;
      points += ex.points;
    }
  }
  const total = lesson.exercises.length;
  const score = scoreOf(correct, total);
  const now = new Date().toISOString();

  const { error: hErr } = await supabase.from("lesson_history").insert({
    user_id: user.id,
    lesson_id: lesson.id,
    score,
    time_spent_seconds: timeSpent,
    answers_json: answers,
  });
  if (hErr) return NextResponse.json({ error: "Không lưu được kết quả" }, { status: 500 });

  let status: ProgressStatus = statusFor(score);
  if (lesson.topic_id) {
    const { data: prev } = await supabase
      .from("user_progress")
      .select("completion_percent, total_points, status")
      .eq("user_id", user.id)
      .eq("topic_id", lesson.topic_id)
      .maybeSingle();
    if (prev && RANK[prev.status as ProgressStatus] > RANK[status]) status = prev.status as ProgressStatus; // never downgrade
    const { error: pErr } = await supabase.from("user_progress").upsert(
      {
        user_id: user.id,
        topic_id: lesson.topic_id,
        completion_percent: Math.max(prev?.completion_percent ?? 0, score),
        total_points: (prev?.total_points ?? 0) + points,
        status,
        last_studied_at: now,
      },
      { onConflict: "user_id,topic_id" },
    );
    if (pErr) return NextResponse.json({ error: "Không lưu được tiến độ" }, { status: 500 });
  }

  await supabase.from("users").update({ last_active_at: now }).eq("id", user.id);

  return NextResponse.json({ score, correct, total, points, status });
}
