import { notFound } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { LessonView, type LessonExercise } from "@/components/lesson/LessonView";
import type { LessonContent } from "@/lib/gemini/schemas";

export default async function LessonPage({ params }: { params: { lessonId: string } }) {
  const { supabase } = await getUser();
  // answer_json is deliberately not selected: answers are checked server-side.
  const { data: lesson } = await supabase
    .from("lessons")
    .select("id, title, difficulty, topic_id, content_json, exercises(id, type, question_json, order_index)")
    .eq("id", params.lessonId)
    .maybeSingle();
  if (!lesson) notFound();

  const exercises: LessonExercise[] = [...lesson.exercises]
    .sort((a, b) => a.order_index - b.order_index)
    .map((e) => ({ id: e.id, type: e.type, ...e.question_json }));

  return (
    <LessonView
      lessonId={lesson.id}
      title={lesson.title}
      difficulty={lesson.difficulty}
      backHref={lesson.topic_id ? `/learn/${lesson.topic_id}` : "/dashboard"}
      content={lesson.content_json as Omit<LessonContent, "exercises">}
      exercises={exercises}
    />
  );
}
