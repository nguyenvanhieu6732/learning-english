import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { DifficultyBadge } from "@/components/common/DifficultyBadge";
import { cn } from "@/lib/utils";
import type { PathTopic } from "@/lib/learning-path";
import type { ProgressStatus } from "@/lib/scoring";

export const STATUS_LABEL: Record<ProgressStatus, string> = {
  not_started: "Chưa học",
  in_progress: "Đang học",
  completed: "Hoàn thành",
  mastered: "Tự động",
};

const STATUS_STYLE: Record<ProgressStatus, string> = {
  not_started: "bg-muted text-muted-foreground",
  in_progress: "bg-amber-100 text-amber-900",
  completed: "bg-green-100 text-green-800",
  mastered: "bg-primary/10 text-primary",
};

export function StatusBadge({ status }: { status: ProgressStatus }) {
  return (
    <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-medium", STATUS_STYLE[status])}>
      {status === "mastered" && "✓ "}
      {STATUS_LABEL[status]}
    </span>
  );
}

export function TopicCard({ topic }: { topic: PathTopic }) {
  return (
    <Link
      href={`/learn/${topic.id}`}
      className="group flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm transition-[border-color,box-shadow] hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="min-w-0 flex-1 space-y-1.5">
        <p className="font-semibold leading-snug">{topic.name}</p>
        <p className="line-clamp-2 text-sm text-muted-foreground">{topic.description}</p>
        <div className="flex flex-wrap gap-1.5">
          <DifficultyBadge value={topic.difficulty} />
          <StatusBadge status={topic.status} />
        </div>
      </div>
      <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
    </Link>
  );
}
