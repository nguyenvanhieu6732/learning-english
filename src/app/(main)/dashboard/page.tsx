import Link from "next/link";
import { Award, BookOpen, Flame, History, Sparkles, Star } from "lucide-react";
import { getUser } from "@/lib/supabase/server";
import { loadLearningPath, isDone } from "@/lib/learning-path";
import { computeStreak } from "@/lib/scoring";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressOverview } from "@/components/dashboard/ProgressOverview";
import { TopicInput } from "@/components/dashboard/TopicInput";
import { TopicCard } from "@/components/learning-path/TopicCard";
import { DifficultyBadge } from "@/components/common/DifficultyBadge";

export const metadata = { title: "Trang chủ – English Mastery" };

function Stat({ icon: Icon, label, value }: { icon: typeof Flame; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-secondary p-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xl font-bold tabular-nums leading-tight">{value}</p>
        <p className="truncate text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const { supabase, user } = await getUser();
  const [profile, phases, history, recent] = await Promise.all([
    supabase.from("users").select("display_name, current_level").eq("id", user!.id).single(),
    loadLearningPath(supabase),
    supabase.from("lesson_history").select("completed_at").order("completed_at", { ascending: false }).limit(400),
    supabase.from("lessons").select("id, title, difficulty, created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  const topics = phases.flatMap((p) => p.topics);
  const points = topics.reduce((sum, t) => sum + t.points, 0);
  const streak = computeStreak((history.data ?? []).map((h) => new Date(h.completed_at)));
  const doneCount = topics.filter((t) => isDone(t.status)).length;
  const nextTopics = topics.filter((t) => !isDone(t.status)).slice(0, 2);
  const level = profile.data?.current_level ?? "easy";
  const fmt = new Intl.NumberFormat("vi-VN");

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <h1 className="text-3xl font-medium">Xin chào, {profile.data?.display_name || "bạn"}! 👋</h1>
        <p className="mt-1 text-muted-foreground">
          {streak > 0 ? "Giữ vững chuỗi ngày học nhé." : "Học một bài hôm nay để bắt đầu chuỗi ngày học."}
        </p>
        <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
          <Stat icon={Flame} label="ngày liên tiếp" value={fmt.format(streak)} />
          <Stat icon={Star} label="điểm" value={fmt.format(points)} />
          <Stat icon={Award} label={`/${topics.length} chủ điểm`} value={fmt.format(doneCount)} />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="space-y-3 lg:col-span-3">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <BookOpen className="size-5 text-primary" aria-hidden="true" /> Bài học hôm nay
          </h2>
          {nextTopics.length ? (
            <div className="grid gap-3">
              {nextTopics.map((t) => (
                <TopicCard key={t.id} topic={t} />
              ))}
            </div>
          ) : (
            <p className="rounded-xl border bg-card p-4 text-muted-foreground">🎉 Bạn đã hoàn thành toàn bộ lộ trình!</p>
          )}
        </section>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Tiến độ học tập</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressOverview phases={phases} />
            <Link href="/progress" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
              Xem toàn bộ lộ trình →
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="size-5 text-primary" aria-hidden="true" /> Học chủ đề bất kỳ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TopicInput defaultLevel={level} />
        </CardContent>
      </Card>

      {!!recent.data?.length && (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <History className="size-5 text-primary" aria-hidden="true" /> Bài học gần đây
          </h2>
          <ul className="divide-y overflow-hidden rounded-xl border bg-card shadow-sm">
            {recent.data.map((l) => (
              <li key={l.id}>
                <Link href={`/learn/lesson/${l.id}`} className="flex items-center justify-between gap-2 p-4 transition-colors hover:bg-muted">
                  <span className="min-w-0 truncate font-medium">{l.title}</span>
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
