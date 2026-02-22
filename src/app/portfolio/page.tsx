import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatKoDate } from "@/lib/date";

export default async function PortfolioPage() {
  const [projects, artifacts] = await Promise.all([
    prisma.project.findMany({
      where: { visibility: "PUBLIC" },
      orderBy: { createdAt: "desc" },
      include: {
        artifacts: {
          include: {
            artifact: true,
          },
        },
      },
    }),
    prisma.artifact.findMany({
      where: { visibility: "PUBLIC" },
      orderBy: { date: "desc" },
      take: 20,
    }),
  ]);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-white p-6">
        <h1 className="text-2xl font-bold">공개 포트폴리오</h1>
        <p className="mt-2 text-zinc-600">공개 설정된 프로젝트와 증빙만 노출됩니다.</p>
      </section>

      <section className="rounded-xl border bg-white p-6">
        <h2 className="text-xl font-semibold">공개 프로젝트</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`} className="rounded-lg border p-4 hover:bg-zinc-50">
              <h3 className="font-medium">{project.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-zinc-600">{project.description}</p>
              <p className="mt-2 text-xs text-zinc-500">연결 증빙 {project.artifacts.length}개</p>
            </Link>
          ))}
          {projects.length === 0 && <p className="text-sm text-zinc-500">공개된 프로젝트가 없습니다.</p>}
        </div>
      </section>

      <section className="rounded-xl border bg-white p-6">
        <h2 className="text-xl font-semibold">공개 증빙 타임라인</h2>
        <div className="mt-4 space-y-3">
          {artifacts.map((artifact) => (
            <div key={artifact.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">{artifact.title}</p>
                <p className="text-xs text-zinc-500">{formatKoDate(artifact.date)}</p>
              </div>
              <p className="text-sm text-zinc-600">{artifact.summary}</p>
            </div>
          ))}
          {artifacts.length === 0 && <p className="text-sm text-zinc-500">공개된 증빙이 없습니다.</p>}
        </div>
      </section>
    </div>
  );
}
