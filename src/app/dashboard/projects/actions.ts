"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { parseDateInput } from "@/lib/date";
import { prisma } from "@/lib/prisma";
import { parseCommaSeparated, toJsonString } from "@/lib/utils";
import { projectSchema } from "@/lib/validators";

const PROJECT_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "projects");

async function saveProjectImageFile(file: FormDataEntryValue | null): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) {
    return null;
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("이미지 파일만 업로드할 수 있습니다.");
  }

  await mkdir(PROJECT_UPLOAD_DIR, { recursive: true });

  const ext = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() : "";
  const safeExt = ext && /^[a-z0-9]+$/.test(ext) ? ext : "jpg";
  const fileName = `${Date.now()}-${randomUUID()}.${safeExt}`;
  const targetPath = path.join(PROJECT_UPLOAD_DIR, fileName);
  const bytes = Buffer.from(await file.arrayBuffer());

  await writeFile(targetPath, bytes);
  return `/uploads/projects/${fileName}`;
}

export async function createProjectAction(formData: FormData) {
  const user = await requireUser();
  const uploadedImageUrl = await saveProjectImageFile(formData.get("imageFile"));
  const parsed = projectSchema.safeParse({
    category: formData.get("category"),
    topic: formData.get("topic"),
    title: formData.get("title"),
    description: formData.get("description"),
    imageUrl: uploadedImageUrl ?? (formData.get("imageUrl") || ""),
    workDate: formData.get("workDate"),
    publishedAt: formData.get("publishedAt"),
    snsPromoText: formData.get("snsPromoText") || "",
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
  if (!parsed.data.imageUrl) {
    throw new Error("대표 사진 파일 또는 URL을 입력해 주세요.");
  }
  const allowedArtifacts = await prisma.artifact.findMany({
    where: { id: { in: parsed.data.artifactIds }, ownerId: user.id },
    select: { id: true },
  });

  await prisma.project.create({
    data: {
      ownerId: user.id,
      title: parsed.data.title,
      category: parsed.data.category,
      topic: parsed.data.topic,
      description: parsed.data.description,
      imageUrl: parsed.data.imageUrl,
      workDate: parseDateInput(parsed.data.workDate),
      publishedAt: parseDateInput(parsed.data.publishedAt),
      snsPromoText: parsed.data.snsPromoText,
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
  const uploadedImageUrl = await saveProjectImageFile(formData.get("imageFile"));
  const parsed = projectSchema.safeParse({
    category: formData.get("category"),
    topic: formData.get("topic"),
    title: formData.get("title"),
    description: formData.get("description"),
    imageUrl: uploadedImageUrl ?? (formData.get("imageUrl") || ""),
    workDate: formData.get("workDate"),
    publishedAt: formData.get("publishedAt"),
    snsPromoText: formData.get("snsPromoText") || "",
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
  if (!parsed.data.imageUrl) {
    throw new Error("대표 사진 파일 또는 URL을 입력해 주세요.");
  }
  const allowedArtifacts = await prisma.artifact.findMany({
    where: { id: { in: parsed.data.artifactIds }, ownerId: user.id },
    select: { id: true },
  });

  await prisma.project.update({
    where: { id },
    data: {
      title: parsed.data.title,
      category: parsed.data.category,
      topic: parsed.data.topic,
      description: parsed.data.description,
      imageUrl: parsed.data.imageUrl,
      workDate: parseDateInput(parsed.data.workDate),
      publishedAt: parseDateInput(parsed.data.publishedAt),
      snsPromoText: parsed.data.snsPromoText,
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
