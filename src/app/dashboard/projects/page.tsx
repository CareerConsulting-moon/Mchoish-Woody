import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { formatKoDate } from "@/lib/date";
import { prisma } from "@/lib/prisma";
import { parseJsonArray } from "@/lib/utils";
import { createProjectAction, deleteProjectAction, updateProjectAction } from "./actions";

export default async function ProjectsDashboardPage() {
  const user = await requireUser();
  const [projects, artifacts] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: user.id },
      include: { artifacts: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.artifact.findMany({
      where: { ownerId: user.id },
      orderBy: { date: "desc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-white p-5">
        <h1 className="text-xl font-bold">프로젝트 관리</h1>
        <p className="text-sm text-zinc-600">프로젝트와 연결된 증빙을 함께 보여주세요.</p>

        <form action={createProjectAction} className="mt-4 grid gap-3 md:grid-cols-3">
          <label className="text-sm md:col-span-2">
            제목
            <input name="title" required className="mt-1 w-full" />
          </label>
          <label className="text-sm">
            역할
            <input name="role" required className="mt-1 w-full" />
          </label>
          <label className="text-sm md:col-span-3">
            설명
            <textarea name="description" required className="mt-1 h-24 w-full" />
          </label>
          <label className="text-sm">
            시작일
            <input name="periodStart" type="date" className="mt-1 w-full" />
          </label>
          <label className="text-sm">
            종료일
            <input name="periodEnd" type="date" className="mt-1 w-full" />
          </label>
          <label className="text-sm">
            공개 여부
            <select name="visibility" defaultValue="PRIVATE" className="mt-1 w-full">
              <option value="PRIVATE">비공개</option>
              <option value="PUBLIC">공개</option>
            </select>
          </label>
          <label className="text-sm md:col-span-2">
            기술 스택(쉼표 구분)
            <input name="techStack" className="mt-1 w-full" placeholder="Next.js, TypeScript, Prisma" />
          </label>
          <label className="text-sm">
            저장소 URL
            <input name="repoUrl" type="url" className="mt-1 w-full" />
          </label>
          <label className="text-sm">
            데모 URL
            <input name="demoUrl" type="url" className="mt-1 w-full" />
          </label>
          <label className="text-sm md:col-span-3">
            연결 증빙
            <select name="artifactIds" multiple className="mt-1 h-24 w-full">
              {artifacts.map((artifact) => (
                <option key={artifact.id} value={artifact.id}>
                  {artifact.title}
                </option>
              ))}
            </select>
          </label>
          <div className="md:col-span-3">
            <button type="submit">프로젝트 생성</button>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        {projects.map((project) => (
          <article key={project.id} className="rounded-xl border bg-white p-5">
            <form action={updateProjectAction} className="grid gap-3 md:grid-cols-3">
              <input type="hidden" name="id" value={project.id} />
              <label className="text-sm md:col-span-2">
                제목
                <input name="title" defaultValue={project.title} className="mt-1 w-full" />
              </label>
              <label className="text-sm">
                역할
                <input name="role" defaultValue={project.role} className="mt-1 w-full" />
              </label>
              <label className="text-sm md:col-span-3">
                설명
                <textarea name="description" defaultValue={project.description} className="mt-1 h-24 w-full" />
              </label>
              <label className="text-sm">
                시작일
                <input
                  name="periodStart"
                  type="date"
                  defaultValue={project.periodStart ? new Date(project.periodStart).toISOString().slice(0, 10) : ""}
                  className="mt-1 w-full"
                />
              </label>
              <label className="text-sm">
                종료일
                <input
                  name="periodEnd"
                  type="date"
                  defaultValue={project.periodEnd ? new Date(project.periodEnd).toISOString().slice(0, 10) : ""}
                  className="mt-1 w-full"
                />
              </label>
              <label className="text-sm">
                공개 여부
                <select name="visibility" defaultValue={project.visibility} className="mt-1 w-full">
                  <option value="PRIVATE">비공개</option>
                  <option value="PUBLIC">공개</option>
                </select>
              </label>
              <label className="text-sm md:col-span-2">
                기술 스택
                <input name="techStack" defaultValue={parseJsonArray(project.techStack).join(", ")} className="mt-1 w-full" />
              </label>
              <label className="text-sm">
                저장소 URL
                <input name="repoUrl" type="url" defaultValue={project.repoUrl ?? ""} className="mt-1 w-full" />
              </label>
              <label className="text-sm">
                데모 URL
                <input name="demoUrl" type="url" defaultValue={project.demoUrl ?? ""} className="mt-1 w-full" />
              </label>
              <label className="text-sm md:col-span-3">
                연결 증빙
                <select
                  name="artifactIds"
                  multiple
                  className="mt-1 h-24 w-full"
                  defaultValue={project.artifacts.map((item) => item.artifactId)}
                >
                  {artifacts.map((artifact) => (
                    <option key={artifact.id} value={artifact.id}>
                      {artifact.title}
                    </option>
                  ))}
                </select>
              </label>
              <div className="md:col-span-3 flex gap-2">
                <button type="submit">수정 저장</button>
                <button formAction={deleteProjectAction} name="id" value={project.id} className="bg-rose-600 hover:bg-rose-700">
                  삭제
                </button>
                {project.visibility === "PUBLIC" && (
                  <Link href={`/projects/${project.id}`} className="rounded-md border px-3 py-2 text-sm">
                    공개 상세 보기
                  </Link>
                )}
              </div>
            </form>
            <p className="mt-2 text-xs text-zinc-500">생성일 {formatKoDate(project.createdAt)}</p>
          </article>
        ))}
        {projects.length === 0 && <p className="text-sm text-zinc-500">프로젝트를 먼저 생성하세요.</p>}
      </section>
    </div>
  );
}
