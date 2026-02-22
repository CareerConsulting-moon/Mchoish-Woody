"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { milestoneStatusLabels, type MilestoneStatus } from "@/lib/constants";

interface MilestoneItem {
  id: string;
  title: string;
  status: string;
  order: number;
}

interface Props {
  roadmapId: string;
  milestones: MilestoneItem[];
}

function reorder<T extends { id: string }>(items: T[], dragId: string, dropId: string): T[] {
  const dragIndex = items.findIndex((item) => item.id === dragId);
  const dropIndex = items.findIndex((item) => item.id === dropId);
  if (dragIndex < 0 || dropIndex < 0 || dragIndex === dropIndex) {
    return items;
  }

  const next = [...items];
  const [moved] = next.splice(dragIndex, 1);
  next.splice(dropIndex, 0, moved);
  return next;
}

export function MilestoneReorderList({ roadmapId, milestones }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [dragId, setDragId] = useState<string | null>(null);
  const [items, setItems] = useState(() => [...milestones].sort((a, b) => a.order - b.order));

  const orderedIds = useMemo(() => items.map((item) => item.id), [items]);

  const saveOrder = (nextItems: MilestoneItem[]) => {
    startTransition(async () => {
      const response = await fetch("/api/milestones/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roadmapId,
          orderedMilestoneIds: nextItems.map((item) => item.id),
        }),
      });

      if (!response.ok) {
        setItems([...milestones].sort((a, b) => a.order - b.order));
        return;
      }

      router.refresh();
    });
  };

  const moveBy = (index: number, delta: -1 | 1) => {
    const nextIndex = index + delta;
    if (nextIndex < 0 || nextIndex >= items.length) {
      return;
    }

    const next = [...items];
    const [moved] = next.splice(index, 1);
    next.splice(nextIndex, 0, moved);
    setItems(next);
    saveOrder(next);
  };

  return (
    <div className="rounded-lg border p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold">드래그 정렬</h3>
        <p className="text-xs text-zinc-500">{isPending ? "저장 중..." : "드롭 시 자동 저장"}</p>
      </div>
      <ul className="space-y-2">
        {items.map((milestone, index) => (
          <li
            key={milestone.id}
            draggable
            onDragStart={() => setDragId(milestone.id)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (!dragId) {
                return;
              }
              const next = reorder(items, dragId, milestone.id);
              setItems(next);
              setDragId(null);
              saveOrder(next);
            }}
            className="flex items-center justify-between rounded border bg-zinc-50 px-3 py-2"
          >
            <div>
              <p className="text-sm font-medium">{milestone.title}</p>
              <p className="text-xs text-zinc-500">{milestoneStatusLabels[milestone.status as MilestoneStatus] ?? milestone.status}</p>
            </div>
            <div className="flex gap-1">
              <button type="button" onClick={() => moveBy(index, -1)} className="bg-zinc-700 px-2 py-1 text-xs">
                위
              </button>
              <button type="button" onClick={() => moveBy(index, 1)} className="bg-zinc-700 px-2 py-1 text-xs">
                아래
              </button>
            </div>
          </li>
        ))}
      </ul>
      <input type="hidden" value={orderedIds.join(",")} readOnly />
    </div>
  );
}
