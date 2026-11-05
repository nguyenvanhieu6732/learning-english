"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LoadingSpark } from "@/components/common/LoadingSpark";
import { MultipleChoice } from "@/components/exercises/MultipleChoice";
import { FillBlank } from "@/components/exercises/FillBlank";
import { ReorderWords } from "@/components/exercises/ReorderWords";
import { cn } from "@/lib/utils";
import type { LessonExercise } from "./LessonView";
import { LessonComplete, type LessonResult } from "./LessonComplete";

interface Feedback {
  correct: boolean;
  answer: string;
  explanation: string;
}

/** One exercise at a time: answer → /api/exercises/check → explanation → next. At the end, save to /api/progress. */
export function ExerciseRunner({ lessonId, exercises, startedAt }: { lessonId: string; exercises: LessonExercise[]; startedAt: number }) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<LessonResult | null>(null);

  const ex = exercises[index];
  const isLast = index === exercises.length - 1;

  async function submit(answer: string) {
    setBusy(true);
    setError("");
    const res = await fetch("/api/exercises/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exerciseId: ex.id, answer }),
    }).catch(() => null);
    setBusy(false);
    if (!res?.ok) return setError("Không kiểm tra được đáp án, thử lại nhé");
    setAnswers({ ...answers, [ex.id]: answer });
    setFeedback(await res.json());
  }

  async function finish() {
    setBusy(true);
    setError("");
    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, answers, timeSpentSeconds: (Date.now() - startedAt) / 1000 }),
    }).catch(() => null);
    setBusy(false);
    if (!res?.ok) return setError("Không lưu được kết quả, thử lại nhé");
    setResult(await res.json());
    router.refresh(); // dashboard/progress pages show the new status
  }

  function restart() {
    setIndex(0);
    setAnswers({});
    setFeedback(null);
    setResult(null);
  }

  if (result) return <LessonComplete result={result} onRetry={restart} />;
  if (!ex) return <p className="text-muted-foreground">Bài học này chưa có bài tập.</p>;

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">
          Câu {index + 1}/{exercises.length}
        </p>
        <Progress value={(index / exercises.length) * 100} aria-label={`Câu ${index + 1} trên ${exercises.length}`} />
      </div>

      <div key={ex.id} className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        {ex.type === "multiple_choice" && (
          <MultipleChoice question={ex} disabled={!!feedback || busy} picked={answers[ex.id]} correctAnswer={feedback?.answer} onSubmit={submit} />
        )}
        {ex.type === "fill_blank" && <FillBlank question={ex} disabled={!!feedback || busy} onSubmit={submit} />}
        {ex.type === "reorder" && <ReorderWords question={ex} disabled={!!feedback || busy} onSubmit={submit} />}
      </div>

      {feedback && (
        <div
          role="status"
          className={cn(
            "rounded-lg border p-4",
            feedback.correct
              ? "border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950"
              : "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950",
          )}
        >
          <p className="flex items-center gap-2 font-semibold">
            {feedback.correct ? <CheckCircle2 className="text-green-600" /> : <XCircle className="text-red-600" />}
            {feedback.correct ? "Chính xác!" : `Chưa đúng. Đáp án: ${feedback.answer}`}
          </p>
          <p className="mt-2 whitespace-pre-line text-sm">{feedback.explanation}</p>
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      {feedback && (
        <Button
          disabled={busy}
          onClick={() => {
            if (isLast) return finish();
            setFeedback(null);
            setIndex(index + 1);
          }}
        >
          {isLast ? (
            busy ? <LoadingSpark label="Đang lưu…" /> : "Xem kết quả"
          ) : (
            <>
              Câu tiếp theo <ArrowRight aria-hidden="true" />
            </>
          )}
        </Button>
      )}
    </section>
  );
}
