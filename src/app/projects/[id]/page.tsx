import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatKoDate } from "@/lib/date";
import { parseJsonArray } from "@/lib/utils";
import { projectCategoryLabels } from "@/lib/constants";

interface ProjectDetailProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailProps) {
  const { id } = await params;
  const project = await prisma.project.findFirst({
    where: { id, visibility: "PUBLIC" },
    include: {
      artifacts: {
        include: {
          artifact: {
            include: {
              attachments: true,
            },
          },
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <article className="space-y-5 rounded-xl border bg-white p-6">
      {project.imageUrl ? (
        <div className="overflow-hidden rounded-xl border">
          <img src={project.imageUrl} alt={`${project.title} 대표 이미지`} className="h-64 w-full object-cover md:h-96" />
        </div>
      ) : null}
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-zinc-100 px-2 py-1">
            {projectCategoryLabels[(project.category as keyof typeof projectCategoryLabels) ?? "OTHER"] ?? "기타"}
          </span>
          {project.workDate ? <span className="text-zinc-500">작업일 {formatKoDate(project.workDate)}</span> : null}
          {project.publishedAt ? <span className="text-zinc-500">게시일 {formatKoDate(project.publishedAt)}</span> : null}
        </div>
        <p className="text-sm font-medium text-zinc-600">{project.topic || project.title}</p>
        <h1 className="text-2xl font-bold">{project.title}</h1>
        <p className="mt-2 text-zinc-700">{project.description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">역할</h2>
          <p className="mt-1 text-sm text-zinc-600">{project.role}</p>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">기술 스택</h2>
          <p className="mt-1 text-sm text-zinc-600">{parseJsonArray(project.techStack).join(", ") || "-"}</p>
        </div>
      </div>

      {project.snsPromoText ? (
        <section className="rounded-lg border bg-zinc-50 p-4">
          <h2 className="font-semibold">SNS 홍보문</h2>
          <pre className="mt-2 whitespace-pre-wrap font-sans text-sm text-zinc-700">{project.snsPromoText}</pre>
        </section>
      ) : null}

      <div className="flex flex-wrap gap-3 text-sm">
        {project.repoUrl && (
          <Link href={project.repoUrl} className="rounded-md border px-3 py-2" target="_blank">
            저장소 보기
          </Link>
        )}
        {project.demoUrl && (
          <Link href={project.demoUrl} className="rounded-md border px-3 py-2" target="_blank">
            데모 보기
          </Link>
        )}
      </div>

      <section>
        <h2 className="text-lg font-semibold">연결된 공개 증빙</h2>
        <div className="mt-3 space-y-3">
          {project.artifacts
            .filter((item) => item.artifact.visibility === "PUBLIC")
            .map((item) => (
              <div key={item.artifactId} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{item.artifact.title}</h3>
                  <p className="text-xs text-zinc-500">{formatKoDate(item.artifact.date)}</p>
                </div>
                <p className="mt-1 text-sm text-zinc-600">{item.artifact.summary}</p>
              </div>
            ))}
        </div>
      </section>
    </article>
  );
}
