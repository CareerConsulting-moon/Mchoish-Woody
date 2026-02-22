"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { parseDateInput } from "@/lib/date";
import { prisma } from "@/lib/prisma";
import { parseCommaSeparated, toJsonString } from "@/lib/utils";
import { projectSchema } from "@/lib/validators";

export async function createProjectAction(formData: FormData) {
  const user = await requireUser();
  const parsed = projectSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    role: formData.get("role"),
    periodStart: formData.get("periodStart") || undefined,
    periodEnd: formData.get("periodEnd") || undefined,
    techStack: formData.get("techStack") || "",
    repoUrl: formData.get("repoUrl") || "",
    demoUrl: formData.get("demoUrl") || "",
    visibility: formData.get("visibility"),
    artifactIds: formData.getAll("artifactIds"),
  });
  if (!parsed.success) {
    throw new Error("프로젝트 입력값이 올바르지 않습니다.");
  }
  const allowedArtifacts = await prisma.artifact.findMany({
    where: { id: { in: parsed.data.artifactIds }, ownerId: user.id },
    select: { id: true },
  });

  await prisma.project.create({
    data: {
      ownerId: user.id,
      title: parsed.data.title,
      description: parsed.data.description,
      role: parsed.data.role,
      periodStart: parsed.data.periodStart ? parseDateInput(parsed.data.periodStart) : null,
      periodEnd: parsed.data.periodEnd ? parseDateInput(parsed.data.periodEnd) : null,
      techStack: toJsonString(parseCommaSeparated(parsed.data.techStack)),
      repoUrl: parsed.data.repoUrl || null,
      demoUrl: parsed.data.demoUrl || null,
      visibility: parsed.data.visibility,
      artifacts: {
        create: allowedArtifacts.map((item) => ({ artifactId: item.id })),
      },
    },
  });

  revalidatePath("/dashboard/projects");
  revalidatePath("/projects");
  revalidatePath("/portfolio");
}

export async function updateProjectAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const parsed = projectSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    role: formData.get("role"),
    periodStart: formData.get("periodStart") || undefined,
    periodEnd: formData.get("periodEnd") || undefined,
    techStack: formData.get("techStack") || "",
    repoUrl: formData.get("repoUrl") || "",
    demoUrl: formData.get("demoUrl") || "",
    visibility: formData.get("visibility"),
    artifactIds: formData.getAll("artifactIds"),
  });

  if (!parsed.success || !id) {
    throw new Error("프로젝트 수정값이 올바르지 않습니다.");
  }

  const project = await prisma.project.findFirst({ where: { id, ownerId: user.id } });
  if (!project) {
    throw new Error("권한이 없습니다.");
  }
  const allowedArtifacts = await prisma.artifact.findMany({
    where: { id: { in: parsed.data.artifactIds }, ownerId: user.id },
    select: { id: true },
  });

  await prisma.project.update({
    where: { id },
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      role: parsed.data.role,
      periodStart: parsed.data.periodStart ? parseDateInput(parsed.data.periodStart) : null,
      periodEnd: parsed.data.periodEnd ? parseDateInput(parsed.data.periodEnd) : null,
      techStack: toJsonString(parseCommaSeparated(parsed.data.techStack)),
      repoUrl: parsed.data.repoUrl || null,
      demoUrl: parsed.data.demoUrl || null,
      visibility: parsed.data.visibility,
      artifacts: {
        deleteMany: {},
        create: allowedArtifacts.map((item) => ({ artifactId: item.id })),
      },
    },
  });

  revalidatePath("/dashboard/projects");
  revalidatePath("/projects");
  revalidatePath("/portfolio");
}

export async function deleteProjectAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");

  await prisma.project.deleteMany({ where: { id, ownerId: user.id } });
  revalidatePath("/dashboard/projects");
  revalidatePath("/projects");
  revalidatePath("/portfolio");
}
