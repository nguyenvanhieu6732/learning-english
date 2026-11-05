"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DifficultyBadge } from "@/components/common/DifficultyBadge";
import type { Difficulty, ExerciseQuestion, ExerciseType, LessonContent } from "@/lib/gemini/schemas";
import { TheorySection } from "./TheorySection";
import { ExampleList } from "./ExampleList";
import { ExerciseRunner } from "./ExerciseRunner";
import { ChallengeSection } from "./ChallengeSection";

export type LessonExercise = ExerciseQuestion & { id: string; type: ExerciseType };

const STEPS = [
  { key: "theory", label: "Lý thuyết" },
  { key: "examples", label: "Ví dụ" },
  { key: "exercises", label: "Bài tập" },
  { key: "challenge", label: "Thử thách" },
] as const;

interface Props {
  lessonId: string;
  title: string;
  difficulty: Difficulty;
  backHref: string;
  content: Omit<LessonContent, "exercises">;
  exercises: LessonExercise[];
}

export function LessonView({ lessonId, title, difficulty, backHref, content, exercises }: Props) {
  const [step, setStep] = useState(0);
  const startedAt = useRef(Date.now());

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link href={backHref} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline">
          <ArrowLeft className="size-4" aria-hidden="true" /> Quay lại
        </Link>
        <DifficultyBadge value={difficulty} />
      </div>
      <h1 className="flex items-start gap-2 text-2xl font-bold">
        <BookOpen className="mt-1 size-6 shrink-0 text-primary" aria-hidden="true" />
        {title}
      </h1>

      <Tabs value={STEPS[step].key} onValueChange={(v) => setStep(STEPS.findIndex((s) => s.key === v))}>
        <TabsList className="grid w-full grid-cols-4">
          {STEPS.map((s) => (
            <TabsTrigger key={s.key} value={s.key}>
              {s.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="theory">
          <TheorySection theory={content.theory} />
        </TabsContent>
        <TabsContent value="examples">
          <ExampleList examples={content.examples} />
        </TabsContent>
        {/* forceMount keeps exercise progress when switching tabs */}
        <TabsContent value="exercises" forceMount className="data-[state=inactive]:hidden">
          <ExerciseRunner lessonId={lessonId} exercises={exercises} startedAt={startedAt.current} />
        </TabsContent>
        <TabsContent value="challenge">
          <ChallengeSection challenge={content.challenge} />
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between border-t pt-4">
        <Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>
          <ChevronLeft aria-hidden="true" /> Trước
        </Button>
        <span className="text-sm text-muted-foreground">
          Bước {step + 1}/{STEPS.length}
        </span>
        <Button disabled={step === STEPS.length - 1} onClick={() => setStep(step + 1)}>
          Tiếp theo <ChevronRight aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
