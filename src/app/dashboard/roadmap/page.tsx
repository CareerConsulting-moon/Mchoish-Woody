import { requireUser } from "@/lib/auth";
import { JOB_ROLE_TEMPLATES, milestoneStatusLabels } from "@/lib/constants";
import { formatKoDate } from "@/lib/date";
import { prisma } from "@/lib/prisma";
import { parseJsonArray } from "@/lib/utils";
import {
  createMilestoneAction,
  createRoadmapAction,
  deleteMilestoneAction,
  deleteRoadmapAction,
  updateMilestoneAction,
  updateRoadmapAction,
} from "./actions";
import { MilestoneReorderList } from "./milestone-reorder-list";

export default async function RoadmapPage() {
  const user = await requireUser();
  const roadmaps = await prisma.roadmap.findMany({
    where: { ownerId: user.id },
    include: {
      milestones: { orderBy: [{ order: "asc" }, { createdAt: "asc" }] },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-white p-5">
        <h1 className="text-xl font-bold">로드맵 관리</h1>
        <p className="mt-1 text-sm text-zinc-600">직무/산업 목표를 설정하고 마일스톤을 단계별로 기록하세요.</p>

        <form action={createRoadmapAction} className="mt-4 grid gap-3 md:grid-cols-3">
          <label className="text-sm">
            로드맵 제목
            <input name="title" required className="mt-1 w-full" aria-label="로드맵 제목" />
          </label>
          <label className="text-sm">
            목표 직무
            <input
              name="targetRole"
              required
              className="mt-1 w-full"
              aria-label="목표 직무"
              placeholder={`예: ${JOB_ROLE_TEMPLATES[0]}`}
            />
          </label>
          <label className="text-sm">
            목표 산업
            <input name="targetIndustry" required className="mt-1 w-full" aria-label="목표 산업" />
          </label>
          <div className="md:col-span-3">
            <button type="submit">로드맵 생성</button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border bg-white p-5">
        <h2 className="text-lg font-semibold">마일스톤 추가</h2>
        <form action={createMilestoneAction} className="mt-4 grid gap-3 md:grid-cols-3">
          <label className="text-sm">
            로드맵
            <select name="roadmapId" required className="mt-1 w-full" aria-label="로드맵 선택">
              <option value="">선택</option>
              {roadmaps.map((roadmap) => (
                <option value={roadmap.id} key={roadmap.id}>
                  {roadmap.title}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            제목
            <input name="title" required className="mt-1 w-full" aria-label="마일스톤 제목" />
          </label>
          <label className="text-sm">
            상태
            <select name="status" defaultValue="TODO" className="mt-1 w-full" aria-label="마일스톤 상태">
              {Object.entries(milestoneStatusLabels).map(([value, label]) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm md:col-span-2">
            설명
            <input name="description" className="mt-1 w-full" aria-label="마일스톤 설명" />
          </label>
          <label className="text-sm">
            마감일
            <input name="dueDate" type="date" className="mt-1 w-full" aria-label="마일스톤 마감일" />
          </label>
          <label className="text-sm">
            순서
            <input name="order" type="number" min={0} defaultValue={0} className="mt-1 w-full" aria-label="마일스톤 순서" />
          </label>
          <label className="text-sm md:col-span-2">
            역량 태그(쉼표 구분)
            <input name="competencyTags" className="mt-1 w-full" aria-label="역량 태그" placeholder="Java, NCS, 문서화" />
          </label>
          <div className="md:col-span-3">
            <button type="submit" disabled={roadmaps.length === 0}>
              마일스톤 생성
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        {roadmaps.map((roadmap) => (
          <article key={roadmap.id} className="rounded-xl border bg-white p-5">
            <form action={updateRoadmapAction} className="grid gap-3 md:grid-cols-3">
              <input type="hidden" name="id" value={roadmap.id} />
              <label className="text-sm">
                제목
                <input name="title" defaultValue={roadmap.title} className="mt-1 w-full" />
              </label>
              <label className="text-sm">
                목표 직무
                <input name="targetRole" defaultValue={roadmap.targetRole} className="mt-1 w-full" />
              </label>
              <label className="text-sm">
                목표 산업
                <input name="targetIndustry" defaultValue={roadmap.targetIndustry} className="mt-1 w-full" />
              </label>
              <div className="md:col-span-3">
                <button type="submit">로드맵 수정</button>
              </div>
            </form>
            <form action={deleteRoadmapAction} className="mt-2">
              <input type="hidden" name="id" value={roadmap.id} />
              <button type="submit" className="bg-rose-600 hover:bg-rose-700">
                로드맵 삭제
              </button>
            </form>

            <div className="mt-4 space-y-3">
              {roadmap.milestones.length > 1 && (
                <MilestoneReorderList
                  roadmapId={roadmap.id}
                  milestones={roadmap.milestones.map((milestone) => ({
                    id: milestone.id,
                    title: milestone.title,
                    status: milestone.status,
                    order: milestone.order,
                  }))}
                />
              )}
              {roadmap.milestones.map((milestone) => (
                <form key={milestone.id} action={updateMilestoneAction} className="rounded-lg border p-3">
                  <input type="hidden" name="id" value={milestone.id} />
                  <input type="hidden" name="roadmapId" value={roadmap.id} />
                  <div className="grid gap-3 md:grid-cols-3">
                    <label className="text-sm">
                      제목
                      <input name="title" defaultValue={milestone.title} className="mt-1 w-full" />
                    </label>
                    <label className="text-sm">
                      상태
                      <select name="status" defaultValue={milestone.status} className="mt-1 w-full">
                        {Object.entries(milestoneStatusLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="text-sm">
                      순서
                      <input name="order" type="number" min={0} defaultValue={milestone.order} className="mt-1 w-full" />
                    </label>
                    <label className="text-sm md:col-span-3">
                      설명
                      <input name="description" defaultValue={milestone.description} className="mt-1 w-full" />
                    </label>
                    <label className="text-sm">
                      마감일
                      <input
                        name="dueDate"
                        type="date"
                        defaultValue={milestone.dueDate ? new Date(milestone.dueDate).toISOString().slice(0, 10) : ""}
                        className="mt-1 w-full"
                      />
                    </label>
                    <label className="text-sm md:col-span-2">
                      역량 태그
                      <input
                        name="competencyTags"
                        defaultValue={parseJsonArray(milestone.competencyTags).join(", ")}
                        className="mt-1 w-full"
                      />
                    </label>
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">생성일: {formatKoDate(milestone.createdAt)}</p>
                  <div className="mt-2 flex gap-2">
                    <button type="submit">마일스톤 수정</button>
                    <button formAction={deleteMilestoneAction} name="id" value={milestone.id} className="bg-rose-600 hover:bg-rose-700">
                      삭제
                    </button>
                  </div>
                </form>
              ))}
              {roadmap.milestones.length === 0 && <p className="text-sm text-zinc-500">마일스톤이 없습니다.</p>}
            </div>
          </article>
        ))}
        {roadmaps.length === 0 && <p className="text-sm text-zinc-500">로드맵을 먼저 생성하세요.</p>}
      </section>
    </div>
  );
}
