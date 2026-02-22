import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function PublicProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { visibility: "PUBLIC" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="rounded-xl border bg-white p-6">
      <h1 className="text-2xl font-bold">공개 프로젝트</h1>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`} className="rounded-lg border p-4 hover:bg-zinc-50">
            <h2 className="font-semibold">{project.title}</h2>
            <p className="mt-1 line-clamp-2 text-sm text-zinc-600">{project.description}</p>
          </Link>
        ))}
        {projects.length === 0 && <p className="text-sm text-zinc-500">아직 공개된 프로젝트가 없습니다.</p>}
      </div>
    </section>
  );
}
