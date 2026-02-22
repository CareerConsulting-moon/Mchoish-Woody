import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatKoDate } from "@/lib/date";
import { parseJsonArray } from "@/lib/utils";

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
      <div>
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
