import type { PathPhase } from "@/lib/learning-path";

export function ProgressOverview({ phases }: { phases: PathPhase[] }) {
  return (
    <ul className="space-y-4">
      {phases.map((p) => (
        <li key={p.id} className="space-y-1.5">
          <div className="flex items-baseline justify-between gap-2 text-sm">
            <span className="min-w-0 truncate">
              <span className="font-semibold">Giai đoạn {p.id}</span>
              <span className="text-muted-foreground"> · {p.name}</span>
            </span>
            <span className="font-semibold tabular-nums text-primary">{p.percent}%</span>
          </div>
          <div
            className="h-2.5 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={p.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Giai đoạn ${p.id}`}
          >
            <div className="h-full rounded-full bg-primary" style={{ width: `${p.percent}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
