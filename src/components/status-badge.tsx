import type { MilestoneStatus, Visibility } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function MilestoneBadge({ status }: { status: MilestoneStatus }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-1 text-xs font-medium",
        status === "TODO" && "bg-zinc-100 text-zinc-700",
        status === "DOING" && "bg-blue-100 text-blue-700",
        status === "DONE" && "bg-emerald-100 text-emerald-700",
      )}
    >
      {status}
    </span>
  );
}

export function VisibilityBadge({ visibility }: { visibility: Visibility }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-1 text-xs font-medium",
        visibility === "PRIVATE" ? "bg-zinc-100 text-zinc-700" : "bg-emerald-100 text-emerald-700",
      )}
    >
      {visibility}
    </span>
  );
}
