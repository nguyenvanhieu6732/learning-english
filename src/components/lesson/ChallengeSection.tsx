"use client";

import { useState } from "react";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { LessonContent } from "@/lib/gemini/schemas";

// shortcut: the challenge is self-checked against the sample; AI grading of free writing comes with the Writing module (spec Phase 2).
export function ChallengeSection({ challenge }: { challenge: LessonContent["challenge"] }) {
  const [text, setText] = useState("");
  const [shown, setShown] = useState(false);

  return (
    <section className="space-y-4 rounded-lg border p-4">
      <h2 className="flex items-center gap-2 font-semibold">
        <Trophy className="size-5 shrink-0 text-primary" aria-hidden="true" /> Thử thách: tự sản xuất
      </h2>
      <p className="whitespace-pre-line">{challenge.prompt}</p>
      <div className="space-y-2">
        <Label htmlFor="challenge">Bài làm của bạn</Label>
        <Textarea id="challenge" rows={6} value={text} onChange={(e) => setText(e.target.value)} />
        <p className="text-xs text-muted-foreground">{text.trim().split(/\s+/).filter(Boolean).length} từ</p>
      </div>
      <Button variant="outline" onClick={() => setShown(!shown)}>
        {shown ? "Ẩn bài mẫu" : "So sánh với bài mẫu"}
      </Button>
      {shown && (
        <div className="rounded-md bg-muted p-3">
          <p className="font-medium">Bài mẫu</p>
          <p className="mt-1 whitespace-pre-line">{challenge.sample_answer}</p>
        </div>
      )}
    </section>
  );
}
