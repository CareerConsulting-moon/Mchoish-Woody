import Image from "next/image";
import { requireUser } from "@/lib/auth";
import { artifactTypeLabels, visibilityLabels, TAG_PRESETS, type ArtifactType, type Visibility } from "@/lib/constants";
import { formatKoDate } from "@/lib/date";
import { prisma } from "@/lib/prisma";
import { parseJsonArray } from "@/lib/utils";
import {
  createArtifactAction,
  deleteArtifactAction,
  toggleArtifactVisibilityAction,
  updateArtifactAction,
} from "./actions";

interface ArtifactPageProps {
  searchParams: Promise<{ type?: ArtifactType; visibility?: Visibility; tag?: string; page?: string }>;
}

const PAGE_SIZE = 8;

export default async function ArtifactsPage({ searchParams }: ArtifactPageProps) {
  const user = await requireUser();
  const params = await searchParams;
  const page = Number(params.page ?? 1);

  const where = {
    ownerId: user.id,
    ...(params.type ? { type: params.type } : {}),
    ...(params.visibility ? { visibility: params.visibility } : {}),
  };

  const [artifacts, totalCount, milestones, dailyGoals] = await Promise.all([
    prisma.artifact.findMany({
      where,
      include: {
        attachments: true,
        milestoneLinks: true,
        dailyGoalLinks: true,
      },
      orderBy: { date: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.artifact.count({ where }),
    prisma.milestone.findMany({
      where: { roadmap: { ownerId: user.id } },
      orderBy: { order: "asc" },
    }),
    prisma.dailyGoal.findMany({
      where: { dailyPlan: { ownerId: user.id } },
      orderBy: { doneAt: "desc" },
      take: 30,
    }),
  ]);

  const filteredArtifacts = params.tag
    ? artifacts.filter((artifact) => parseJsonArray(artifact.tags).includes(params.tag!))
    : artifacts;

  const totalPage = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-white p-5">
        <h1 className="text-xl font-bold">증빙 기록</h1>
        <p className="text-sm text-zinc-600">학업/프로젝트/자격증/대회/현장실습 등 과정을 증빙으로 남기세요.</p>

        <form action={createArtifactAction} className="mt-4 grid gap-3 md:grid-cols-3">
          <label className="text-sm">
            유형
            <select name="type" className="mt-1 w-full">
              {Object.entries(artifactTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm md:col-span-2">
            제목
            <input name="title" required className="mt-1 w-full" />
          </label>
          <label className="text-sm md:col-span-3">
            요약
            <input name="summary" required className="mt-1 w-full" />
          </label>
          <label className="text-sm md:col-span-3">
            상세(마크다운)
            <textarea name="contentMd" className="mt-1 h-28 w-full" />
          </label>
          <label className="text-sm">
            날짜
            <input name="date" type="date" required className="mt-1 w-full" />
          </label>
          <label className="text-sm">
            링크 URL
            <input name="linkUrl" type="url" className="mt-1 w-full" />
          </label>
          <label className="text-sm">
            공개 여부
            <select name="visibility" defaultValue="PRIVATE" className="mt-1 w-full">
              {Object.entries(visibilityLabels).map(([value, label]) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm md:col-span-2">
            태그(쉼표 구분)
            <input name="tags" className="mt-1 w-full" placeholder={TAG_PRESETS.join(", ")} />
          </label>
          <label className="text-sm">
            이미지(최대 3장)
            <input name="images" type="file" accept="image/*" multiple className="mt-1 w-full" />
          </label>
          <label className="text-sm">
            연결 마일스톤
            <select name="milestoneIds" multiple className="mt-1 h-24 w-full">
              {milestones.map((milestone) => (
                <option key={milestone.id} value={milestone.id}>
                  {milestone.title}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            연결 데일리 목표
            <select name="dailyGoalIds" multiple className="mt-1 h-24 w-full">
              {dailyGoals.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.title}
                </option>
              ))}
            </select>
          </label>
          <div className="md:col-span-3">
            <button type="submit">증빙 추가</button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border bg-white p-5">
        <h2 className="text-lg font-semibold">필터</h2>
        <form className="mt-3 grid gap-3 md:grid-cols-4">
          <label className="text-sm">
            유형
            <select name="type" defaultValue={params.type ?? ""}>
              <option value="">전체</option>
              {Object.entries(artifactTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            공개 여부
            <select name="visibility" defaultValue={params.visibility ?? ""}>
              <option value="">전체</option>
              <option value="PUBLIC">공개</option>
              <option value="PRIVATE">비공개</option>
            </select>
          </label>
          <label className="text-sm">
            태그
            <input name="tag" defaultValue={params.tag ?? ""} placeholder="예: NCS" />
          </label>
          <div className="self-end">
            <button type="submit">적용</button>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        {filteredArtifacts.map((artifact) => (
          <article key={artifact.id} className="rounded-xl border bg-white p-5">
            <form action={updateArtifactAction} className="grid gap-3 md:grid-cols-3">
              <input type="hidden" name="id" value={artifact.id} />
              <label className="text-sm">
                유형
                <select name="type" defaultValue={artifact.type} className="mt-1 w-full">
                  {Object.entries(artifactTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm md:col-span-2">
                제목
                <input name="title" defaultValue={artifact.title} className="mt-1 w-full" />
              </label>
              <label className="text-sm md:col-span-3">
                요약
                <input name="summary" defaultValue={artifact.summary} className="mt-1 w-full" />
              </label>
              <label className="text-sm md:col-span-3">
                상세
                <textarea name="contentMd" defaultValue={artifact.contentMd} className="mt-1 h-24 w-full" />
              </label>
              <label className="text-sm">
                날짜
                <input name="date" type="date" defaultValue={new Date(artifact.date).toISOString().slice(0, 10)} className="mt-1 w-full" />
              </label>
              <label className="text-sm">
                링크
                <input name="linkUrl" type="url" defaultValue={artifact.linkUrl ?? ""} className="mt-1 w-full" />
              </label>
              <label className="text-sm">
                공개 여부
                <select name="visibility" defaultValue={artifact.visibility} className="mt-1 w-full">
                  <option value="PRIVATE">비공개</option>
                  <option value="PUBLIC">공개</option>
                </select>
              </label>
              <label className="text-sm md:col-span-2">
                태그
                <input name="tags" defaultValue={parseJsonArray(artifact.tags).join(", ")} className="mt-1 w-full" />
              </label>
              <label className="text-sm">
                이미지 추가
                <input name="images" type="file" accept="image/*" multiple className="mt-1 w-full" />
              </label>

              <select name="milestoneIds" multiple defaultValue={artifact.milestoneLinks.map((item) => item.milestoneId)} className="h-24">
                {milestones.map((milestone) => (
                  <option key={milestone.id} value={milestone.id}>
                    {milestone.title}
                  </option>
                ))}
              </select>
              <select name="dailyGoalIds" multiple defaultValue={artifact.dailyGoalLinks.map((item) => item.dailyGoalId)} className="h-24">
                {dailyGoals.map((goal) => (
                  <option key={goal.id} value={goal.id}>
                    {goal.title}
                  </option>
                ))}
              </select>

              <div className="md:col-span-3 flex gap-2">
                <button type="submit">수정 저장</button>
                <button formAction={toggleArtifactVisibilityAction} name="id" value={artifact.id}>
                  {artifact.visibility === "PRIVATE" ? "공개로 전환" : "비공개로 전환"}
                </button>
                <button formAction={deleteArtifactAction} name="id" value={artifact.id} className="bg-rose-600 hover:bg-rose-700">
                  삭제
                </button>
              </div>
            </form>

            <p className="mt-2 text-xs text-zinc-500">{formatKoDate(artifact.date)}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {artifact.attachments.map((file) => (
                <Image
                  key={file.id}
                  src={file.pathOrUrl}
                  alt="증빙 이미지"
                  width={120}
                  height={90}
                  className="h-20 w-28 rounded-md object-cover"
                />
              ))}
            </div>
          </article>
        ))}
        {filteredArtifacts.length === 0 && <p className="text-sm text-zinc-500">조건에 맞는 증빙이 없습니다.</p>}
      </section>

      <section className="flex items-center justify-center gap-2">
        <a className="rounded border px-3 py-2 text-sm" href={`?page=${Math.max(1, page - 1)}`}>
          이전
        </a>
        <span className="text-sm">
          {page} / {totalPage}
        </span>
        <a className="rounded border px-3 py-2 text-sm" href={`?page=${Math.min(totalPage, page + 1)}`}>
          다음
        </a>
      </section>
    </div>
  );
}
