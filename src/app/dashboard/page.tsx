import Link from "next/link";
import { startOfWeek, endOfWeek } from "date-fns";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatKoDate, toDateRange } from "@/lib/date";
import { logoutAction } from "./actions";

export default async function DashboardPage() {
  const user = await requireUser();
  const today = new Date();
  const todayRange = toDateRange(today);
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

  const [dailyPlan, weekArtifactCount, doneMilestones, recentArtifacts] = await Promise.all([
    prisma.dailyPlan.findFirst({
      where: {
        ownerId: user.id,
        date: { gte: todayRange.start, lte: todayRange.end },
      },
      include: { goals: true },
    }),
    prisma.artifact.count({
      where: {
        ownerId: user.id,
        date: { gte: weekStart, lte: weekEnd },
      },
    }),
    prisma.milestone.count({
      where: {
        roadmap: { ownerId: user.id },
        status: "DONE",
      },
    }),
    prisma.artifact.findMany({
      where: { ownerId: user.id },
      orderBy: { date: "desc" },
      take: 8,
    }),
  ]);

  const goalTotal = dailyPlan?.goals.length ?? 0;
  const goalDone = dailyPlan?.goals.filter((goal) => goal.isDone).length ?? 0;
  const progress = goalTotal === 0 ? 0 : Math.round((goalDone / goalTotal) * 100);

  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between rounded-xl border bg-white p-5">
        <div>
          <h1 className="text-2xl font-bold">대시보드</h1>
          <p className="text-sm text-zinc-600">오늘의 학습/취업 준비 현황을 확인하세요.</p>
        </div>
        <form action={logoutAction}>
          <button type="submit">로그아웃</button>
        </form>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-4">
          <h2 className="text-sm text-zinc-500">오늘 목표 진행률</h2>
          <p className="mt-2 text-3xl font-bold">{progress}%</p>
          <p className="text-sm text-zinc-600">{goalDone} / {goalTotal}</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <h2 className="text-sm text-zinc-500">이번 주 증빙</h2>
          <p className="mt-2 text-3xl font-bold">{weekArtifactCount}개</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <h2 className="text-sm text-zinc-500">완료 마일스톤</h2>
          <p className="mt-2 text-3xl font-bold">{doneMilestones}개</p>
        </div>
      </section>

      <section className="rounded-xl border bg-white p-5">
        <h2 className="text-lg font-semibold">빠른 이동</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <Link href="/dashboard/roadmap" className="rounded-md border px-3 py-2">로드맵</Link>
          <Link href="/dashboard/daily" className="rounded-md border px-3 py-2">데일리</Link>
          <Link href="/dashboard/artifacts" className="rounded-md border px-3 py-2">증빙</Link>
          <Link href="/dashboard/projects" className="rounded-md border px-3 py-2">프로젝트</Link>
          <Link href="/dashboard/settings" className="rounded-md border px-3 py-2">설정</Link>
        </div>
      </section>

      <section className="rounded-xl border bg-white p-5">
        <h2 className="text-lg font-semibold">최근 증빙 타임라인</h2>
        <div className="mt-3 space-y-3">
          {recentArtifacts.map((artifact) => (
            <div key={artifact.id} className="rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <p className="font-medium">{artifact.title}</p>
                <p className="text-xs text-zinc-500">{formatKoDate(artifact.date)}</p>
              </div>
              <p className="text-sm text-zinc-600">{artifact.summary}</p>
            </div>
          ))}
          {recentArtifacts.length === 0 && <p className="text-sm text-zinc-500">아직 기록된 증빙이 없습니다.</p>}
        </div>
      </section>
    </div>
  );
}
