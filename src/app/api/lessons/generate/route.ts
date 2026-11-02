import { NextResponse } from "next/server";
import { getUser } from "@/lib/supabase/server";
import { generateLesson } from "@/lib/gemini/client";
import { DIFFICULTIES, SKILLS, type Difficulty, type Skill } from "@/lib/gemini/schemas";

export const maxDuration = 60; // Gemini can take 20–40s for a full lesson

export async function POST(req: Request) {
  const { supabase, user } = await getUser();
  if (!user) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const difficulty = body.difficulty as Difficulty;
  const skills = (Array.isArray(body.skills) ? body.skills : []).filter((s: Skill) => SKILLS.includes(s)) as Skill[];
  let topic = typeof body.topic === "string" ? body.topic.trim() : "";
  const topicId = typeof body.topicId === "string" ? body.topicId : null;

  if (!DIFFICULTIES.includes(difficulty)) return NextResponse.json({ error: "Cấp độ không hợp lệ" }, { status: 400 });

  if (topicId) {
    const { data: t } = await supabase.from("topics").select("name, description").eq("id", topicId).single();
    if (!t) return NextResponse.json({ error: "Không tìm thấy chủ đề" }, { status: 404 });
    topic = `${t.name}: ${t.description ?? ""}`;
  }
  if (topic.length < 3 || topic.length > 200) {
    return NextResponse.json({ error: "Chủ đề cần dài 3–200 ký tự" }, { status: 400 });
  }

  // shortcut: no rate limit on Gemini calls; add a per-user daily cap before opening sign-ups publicly.
  let content;
  try {
    content = await generateLesson(topic, difficulty, skills.length ? skills : ["reading", "writing"]);
  } catch (e) {
    console.error("generateLesson failed", e);
    return NextResponse.json({ error: "AI chưa tạo được bài học, vui lòng thử lại" }, { status: 502 });
  }

  const { exercises, ...rest } = content;
  const { data: lesson, error } = await supabase
    .from("lessons")
    .insert({
      topic_id: topicId,
      created_by: user.id,
      title: content.title,
      content_json: rest,
      difficulty,
      skill_type: skills[0] ?? "reading",
      estimated_minutes: 30,
    })
    .select("id")
    .single();
  if (error || !lesson) return NextResponse.json({ error: "Không lưu được bài học" }, { status: 500 });

  const { error: exError } = await supabase.from("exercises").insert(
    exercises.map((e, i) => ({
      lesson_id: lesson.id,
      type: e.type,
      question_json: { question: e.question, options: e.options, words: e.words },
      answer_json: { answer: e.answer },
      explanation: e.explanation,
      order_index: i,
      points: 10,
    })),
  );
  if (exError) {
    await supabase.from("lessons").delete().eq("id", lesson.id); // no half-saved lesson
    return NextResponse.json({ error: "Không lưu được bài tập" }, { status: 500 });
  }

  return NextResponse.json({ lessonId: lesson.id });
}
