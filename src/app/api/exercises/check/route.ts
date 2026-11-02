import { NextResponse } from "next/server";
import { getUser } from "@/lib/supabase/server";
import { isCorrect } from "@/lib/scoring";

/** Checks one answer. Explanations were written by Gemini at generation time, so no AI call per answer. */
export async function POST(req: Request) {
  const { supabase, user } = await getUser();
  if (!user) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const { exerciseId, answer } = await req.json().catch(() => ({}));
  if (typeof exerciseId !== "string" || typeof answer !== "string") {
    return NextResponse.json({ error: "Thiếu dữ liệu" }, { status: 400 });
  }

  const { data: ex } = await supabase
    .from("exercises")
    .select("type, answer_json, explanation")
    .eq("id", exerciseId)
    .single();
  if (!ex) return NextResponse.json({ error: "Không tìm thấy bài tập" }, { status: 404 });

  const expected = String(ex.answer_json?.answer ?? "");
  return NextResponse.json({
    correct: isCorrect(ex.type, answer, expected),
    answer: expected,
    explanation: ex.explanation,
  });
}
