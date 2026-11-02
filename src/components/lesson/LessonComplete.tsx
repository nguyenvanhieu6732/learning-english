import Link from "next/link";
import { Button } from "@/components/ui/button";
import { STATUS_LABEL } from "@/components/learning-path/TopicCard";
import type { ProgressStatus } from "@/lib/scoring";

export interface LessonResult {
  score: number;
  correct: number;
  total: number;
  points: number;
  status: ProgressStatus;
}

export function LessonComplete({ result, onRetry }: { result: LessonResult; onRetry: () => void }) {
  // Spec §4.5: ≥85% suggests levelling up, ≤50% suggests reviewing.
  const advice =
    result.score >= 85
      ? "🎉 Xuất sắc! Bạn có thể thử cấp độ khó hơn."
      : result.score <= 50
        ? "Hãy đọc lại phần Lý thuyết và Ví dụ, rồi làm lại bài (hoặc chọn cấp độ dễ hơn)."
        : "Khá tốt! Làm lại thêm một lần để nắm chắc hơn.";

  return (
    <section className="space-y-4 rounded-lg border p-6 text-center">
      <p className="text-5xl font-bold tabular-nums">{result.score}%</p>
      <p>
        Đúng {result.correct}/{result.total} câu · +{result.points} điểm · Trạng thái: <b>{STATUS_LABEL[result.status]}</b>
      </p>
      <p className="text-muted-foreground">{advice}</p>
      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="outline" onClick={onRetry}>
          Làm lại
        </Button>
        <Button asChild>
          <Link href="/progress">Về lộ trình</Link>
        </Button>
      </div>
    </section>
  );
}
