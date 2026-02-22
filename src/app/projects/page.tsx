import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatKoDate } from "@/lib/date";
import { projectCategoryLabels } from "@/lib/constants";

export default async function PublicProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { visibility: "PUBLIC" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });

  return (
    <section className="rounded-xl border bg-white p-6">
      <h1 className="text-2xl font-bold">공개 프로젝트</h1>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`} className="overflow-hidden rounded-lg border hover:bg-zinc-50">
            {project.imageUrl ? (
              <img src={project.imageUrl} alt={`${project.title} 대표 이미지`} className="h-44 w-full object-cover" />
            ) : null}
            <div className="p-4">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-zinc-100 px-2 py-1">
                  {projectCategoryLabels[(project.category as keyof typeof projectCategoryLabels) ?? "OTHER"] ?? "기타"}
                </span>
                {project.workDate ? <span className="text-zinc-500">작업일 {formatKoDate(project.workDate)}</span> : null}
                {project.publishedAt ? <span className="text-zinc-500">게시일 {formatKoDate(project.publishedAt)}</span> : null}
              </div>
              <h2 className="font-semibold">{project.topic || project.title}</h2>
              <p className="mt-1 text-sm text-zinc-700">{project.title}</p>
              <p className="mt-2 line-clamp-2 text-sm text-zinc-600">{project.description}</p>
            </div>
          </Link>
        ))}
        {projects.length === 0 && <p className="text-sm text-zinc-500">아직 공개된 프로젝트가 없습니다.</p>}
      </div>
    </section>
  );
}
