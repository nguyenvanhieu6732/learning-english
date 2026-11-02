"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DifficultySelector } from "@/components/common/DifficultySelector";
import { SKILLS, type Difficulty, type Skill } from "@/lib/gemini/schemas";

const SKILL_LABEL: Record<Skill, string> = { reading: "Đọc", writing: "Viết", listening: "Nghe", speaking: "Nói" };

/** Topic + level + skills → POST /api/lessons/generate → open the new lesson. With topicId, the topic is fixed. */
export function TopicInput({ defaultLevel, topicId }: { defaultLevel: Difficulty; topicId?: string }) {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState<Difficulty>(defaultLevel);
  const [skills, setSkills] = useState<Skill[]>(["reading", "writing"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/lessons/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, topicId, difficulty: level, skills }),
    }).catch(() => null);
    const data = await res?.json().catch(() => ({}));
    if (!res?.ok || !data?.lessonId) {
      setLoading(false);
      return setError(data?.error ?? "Có lỗi xảy ra, vui lòng thử lại");
    }
    router.push(`/learn/lesson/${data.lessonId}`);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {!topicId && (
        <div className="space-y-2">
          <Label htmlFor="topic">Nhập chủ đề muốn học</Label>
          <Input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="VD: Cách xác định mạo từ a/an/the…"
            minLength={3}
            maxLength={200}
            required
          />
        </div>
      )}
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Cấp độ</legend>
        <DifficultySelector value={level} onChange={setLevel} />
      </fieldset>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Kỹ năng tập trung</legend>
        <div className="flex flex-wrap gap-4">
          {SKILLS.map((s) => (
            <label key={s} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={skills.includes(s)}
                onChange={(e) => setSkills(e.target.checked ? [...skills, s] : skills.filter((x) => x !== s))}
              />
              {SKILL_LABEL[s]}
            </label>
          ))}
        </div>
      </fieldset>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
        {loading ? "AI đang soạn bài (khoảng 30 giây)…" : "Tạo bài học"}
      </Button>
    </form>
  );
}
