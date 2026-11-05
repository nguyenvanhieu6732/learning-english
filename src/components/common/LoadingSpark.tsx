import { Sparkle } from "lucide-react";
import { cn } from "@/lib/utils";

/** Pulsing spark + shimmering label. Inherits text color, so it works on buttons and on the page. */
export function LoadingSpark({ label, className }: { label: string; className?: string }) {
  return (
    <span role="status" className={cn("inline-flex items-center gap-2", className)}>
      <Sparkle aria-hidden="true" className="loading-spark size-4 shrink-0 fill-current" />
      <span className="loading-shimmer">{label}</span>
    </span>
  );
}
