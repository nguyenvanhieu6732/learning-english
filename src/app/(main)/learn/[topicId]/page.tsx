import Link from "next/link";
import { notFound } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopicInput } from "@/components/dashboard/TopicInput";
import { DifficultyBadge } from "@/components/common/DifficultyBadge";
import { STATUS_LABEL } from "@/components/learning-path/TopicCard";
import type { ProgressStatus } from "@/lib/scoring";

export default async function TopicPage({ params }: { params: { topicId: string } }) {
  const { supabase } = await getUser();
  const { data: topic } = await supabase
    .from("topics")
    .select("id, name, description, difficulty, phase_id")
    .eq("id", params.topicId)
    .maybeSingle();
  if (!topic) notFound();

  const [progress, lessons] = await Promise.all([
    supabase.from("user_progress").select("status, completion_percent").eq("topic_id", topic.id).maybeSingle(),
    supabase
      .from("lessons")
      .select("id, title, difficulty, created_at")
      .eq("topic_id", topic.id)
      .order("created_at", { ascending: false }),
  ]);
  const status = (progress.data?.status ?? "not_started") as ProgressStatus;

  return (
    <div className="space-y-6">
      <Link href="/progress" className="text-sm text-muted-foreground hover:underline">
        ← Lộ trình
      </Link>
      <div>
        <p className="text-sm text-muted-foreground">Giai đoạn {topic.phase_id}</p>
        <h1 className="text-2xl font-bold">{topic.name}</h1>
        <p className="mt-1 text-muted-foreground">{topic.description}</p>
        <p className="mt-2 text-sm">
          Trạng thái: <b>{STATUS_LABEL[status]}</b>
          {progress.data && <> · điểm cao nhất {Math.round(progress.data.completion_percent)}%</>}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>✨ Tạo bài học mới cho chủ điểm này</CardTitle>
        </CardHeader>
        <CardContent>
          <TopicInput topicId={topic.id} defaultLevel={topic.difficulty} />
        </CardContent>
      </Card>

      {!!lessons.data?.length && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Bài đã tạo</h2>
          <ul className="divide-y rounded-lg border">
            {lessons.data.map((l) => (
              <li key={l.id}>
                <Link href={`/learn/lesson/${l.id}`} className="flex items-center justify-between gap-2 p-3 hover:bg-accent">
                  <span className="truncate">{l.title}</span>
                  <DifficultyBadge value={l.difficulty} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
