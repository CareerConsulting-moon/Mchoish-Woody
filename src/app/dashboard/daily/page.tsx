import { format } from "date-fns";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createGoalAction, deleteGoalAction, toggleGoalAction, upsertDailyPlanAction } from "./actions";

interface DailyPageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function DailyPage({ searchParams }: DailyPageProps) {
  const user = await requireUser();
  const params = await searchParams;
  const selectedDate = params.date ?? format(new Date(), "yyyy-MM-dd");
  const dateObj = new Date(`${selectedDate}T00:00:00`);

  const dailyPlan = await prisma.dailyPlan.findFirst({
    where: {
      ownerId: user.id,
      date: dateObj,
    },
    include: {
      goals: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-white p-5">
        <h1 className="text-xl font-bold">데일리 목표/회고</h1>
        <p className="text-sm text-zinc-600">오늘 끝내야 할 3가지(Top3)와 취업역량 1개 강화를 기록하세요.</p>

        <form action={upsertDailyPlanAction} className="mt-4 grid gap-3 md:grid-cols-3">
          <label className="text-sm">
            날짜
            <input name="date" type="date" defaultValue={selectedDate} className="mt-1 w-full" />
          </label>
          <label className="text-sm">
            컨디션 (1~5)
            <input name="mood" type="number" min={1} max={5} defaultValue={dailyPlan?.mood ?? undefined} className="mt-1 w-full" />
          </label>
          <div className="md:col-span-3">
            <label className="text-sm">
              회고
              <textarea
                name="reflection"
                defaultValue={dailyPlan?.reflection ?? ""}
                placeholder="오늘 배운 점과 보완할 점"
                className="mt-1 h-28 w-full"
              />
            </label>
          </div>
          <div className="md:col-span-3">
            <button type="submit">데일리 저장</button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border bg-white p-5">
        <h2 className="text-lg font-semibold">오늘 목표 체크리스트</h2>
        {dailyPlan ? (
          <>
            <form action={createGoalAction} className="mt-3 grid gap-3 md:grid-cols-3">
              <input type="hidden" name="dailyPlanId" value={dailyPlan.id} />
              <label className="text-sm md:col-span-2">
                목표
                <input name="title" required placeholder="예: NCS 문제 30문항" className="mt-1 w-full" />
              </label>
              <label className="text-sm">
                카테고리
                <input name="category" placeholder="예: 학습/프로젝트" className="mt-1 w-full" />
              </label>
              <div className="md:col-span-3">
                <button type="submit">목표 추가</button>
              </div>
            </form>

            <div className="mt-4 space-y-2">
              {dailyPlan.goals.map((goal) => (
                <div key={goal.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className={goal.isDone ? "text-zinc-400 line-through" : "font-medium"}>{goal.title}</p>
                    {goal.category && <p className="text-xs text-zinc-500">{goal.category}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button formAction={toggleGoalAction} name="id" value={goal.id}>
                      {goal.isDone ? "되돌리기" : "완료"}
                    </button>
                    <button formAction={deleteGoalAction} name="id" value={goal.id} className="bg-rose-600 hover:bg-rose-700">
                      삭제
                    </button>
                  </div>
                </div>
              ))}
              {dailyPlan.goals.length === 0 && <p className="text-sm text-zinc-500">목표를 추가해보세요.</p>}
            </div>
          </>
        ) : (
          <p className="mt-2 text-sm text-zinc-500">먼저 위에서 데일리 플랜을 저장하세요.</p>
        )}
      </section>
    </div>
  );
}
