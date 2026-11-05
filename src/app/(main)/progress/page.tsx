import { Map } from "lucide-react";
import { getUser } from "@/lib/supabase/server";
import { loadLearningPath, isDone } from "@/lib/learning-path";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TopicCard } from "@/components/learning-path/TopicCard";

export const metadata = { title: "Lộ trình – English Mastery" };

/** Learning path "5 Đầu Mục Cốt Lõi": phases → topics, each topic is a checklist item. */
export default async function ProgressPage() {
  const { supabase } = await getUser();
  const phases = await loadLearningPath(supabase);
  const all = phases.flatMap((p) => p.topics);
  const mastered = all.filter((t) => t.status === "mastered").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Map className="size-6 shrink-0 text-primary" aria-hidden="true" /> Lộ trình 5 Đầu Mục Cốt Lõi
        </h1>
        <p className="mt-1 text-muted-foreground">
          Hoàn thành {all.filter((t) => isDone(t.status)).length}/{all.length} chủ điểm · {mastered} chủ điểm đã “tự động”
          (đúng ≥ 85%). Mỗi chủ điểm: Hiểu logic → Ví dụ → Bài tập → Tự viết → Sửa lỗi.
        </p>
      </div>
      {phases.map((p) => (
        <Card key={p.id}>
          <CardHeader>
            <CardTitle>
              Giai đoạn {p.id}: {p.name}
            </CardTitle>
            <CardDescription>
              {p.description} · {p.estimated_days} ngày · {p.daily_minutes} phút/ngày
            </CardDescription>
            <Progress value={p.percent} aria-label={`Tiến độ giai đoạn ${p.id}: ${p.percent}%`} />
          </CardHeader>
          <CardContent className="space-y-2">
            {p.topics.map((t) => (
              <TopicCard key={t.id} topic={t} />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
