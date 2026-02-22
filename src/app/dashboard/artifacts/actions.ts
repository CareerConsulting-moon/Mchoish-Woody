"use server";

import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { parseDateInput } from "@/lib/date";
import { prisma } from "@/lib/prisma";
import { parseCommaSeparated, toJsonString } from "@/lib/utils";
import { artifactSchema } from "@/lib/validators";

async function saveImages(files: File[]): Promise<Array<{ path: string; mimeType: string; size: number }>> {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const uploads: Array<{ path: string; mimeType: string; size: number }> = [];
  for (const file of files.slice(0, 3)) {
    if (!file.type.startsWith("image/") || file.size === 0) {
      continue;
    }
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "png";
    const filename = `${randomUUID()}.${ext}`;
    const filepath = path.join(uploadDir, filename);
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, bytes);
    uploads.push({
      path: `/uploads/${filename}`,
      mimeType: file.type,
      size: file.size,
    });
  }

  return uploads;
}

export async function createArtifactAction(formData: FormData) {
  const user = await requireUser();
  const parsed = artifactSchema.safeParse({
    type: formData.get("type"),
    title: formData.get("title"),
    summary: formData.get("summary"),
    contentMd: formData.get("contentMd") || "",
    date: formData.get("date"),
    tags: formData.get("tags") || "",
    linkUrl: formData.get("linkUrl") || "",
    visibility: formData.get("visibility"),
    milestoneIds: formData.getAll("milestoneIds"),
    dailyGoalIds: formData.getAll("dailyGoalIds"),
  });

  if (!parsed.success) {
    throw new Error("증빙 입력값이 올바르지 않습니다.");
  }

  const [allowedMilestones, allowedGoals] = await Promise.all([
    prisma.milestone.findMany({
      where: { id: { in: parsed.data.milestoneIds }, roadmap: { ownerId: user.id } },
      select: { id: true },
    }),
    prisma.dailyGoal.findMany({
      where: { id: { in: parsed.data.dailyGoalIds }, dailyPlan: { ownerId: user.id } },
      select: { id: true },
    }),
  ]);

  const allowedMilestoneIds = allowedMilestones.map((item) => item.id);
  const allowedGoalIds = allowedGoals.map((item) => item.id);
  const images = (formData.getAll("images") as File[]).filter((file) => file.size > 0);
  const uploaded = await saveImages(images);

  await prisma.artifact.create({
    data: {
      ownerId: user.id,
      type: parsed.data.type,
      title: parsed.data.title,
      summary: parsed.data.summary,
      contentMd: parsed.data.contentMd,
      date: parseDateInput(parsed.data.date),
      tags: toJsonString(parseCommaSeparated(parsed.data.tags)),
      linkUrl: parsed.data.linkUrl || null,
      visibility: parsed.data.visibility,
      milestoneLinks: {
        create: allowedMilestoneIds.map((milestoneId) => ({ milestoneId })),
      },
      dailyGoalLinks: {
        create: allowedGoalIds.map((dailyGoalId) => ({ dailyGoalId })),
      },
      attachments: {
        create: uploaded.map((image) => ({
          kind: "IMAGE",
          pathOrUrl: image.path,
          mimeType: image.mimeType,
          size: image.size,
        })),
      },
    },
  });

  revalidatePath("/dashboard/artifacts");
  revalidatePath("/portfolio");
}

export async function updateArtifactAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) {
    throw new Error("잘못된 요청입니다.");
  }

  const parsed = artifactSchema.safeParse({
    type: formData.get("type"),
    title: formData.get("title"),
    summary: formData.get("summary"),
    contentMd: formData.get("contentMd") || "",
    date: formData.get("date"),
    tags: formData.get("tags") || "",
    linkUrl: formData.get("linkUrl") || "",
    visibility: formData.get("visibility"),
    milestoneIds: formData.getAll("milestoneIds"),
    dailyGoalIds: formData.getAll("dailyGoalIds"),
  });

  if (!parsed.success) {
    throw new Error("증빙 수정값이 올바르지 않습니다.");
  }

  const artifact = await prisma.artifact.findFirst({
    where: { id, ownerId: user.id },
  });

  if (!artifact) {
    throw new Error("권한이 없습니다.");
  }

  const [allowedMilestones, allowedGoals] = await Promise.all([
    prisma.milestone.findMany({
      where: { id: { in: parsed.data.milestoneIds }, roadmap: { ownerId: user.id } },
      select: { id: true },
    }),
    prisma.dailyGoal.findMany({
      where: { id: { in: parsed.data.dailyGoalIds }, dailyPlan: { ownerId: user.id } },
      select: { id: true },
    }),
  ]);

  await prisma.artifact.update({
    where: { id },
    data: {
      type: parsed.data.type,
      title: parsed.data.title,
      summary: parsed.data.summary,
      contentMd: parsed.data.contentMd,
      date: parseDateInput(parsed.data.date),
      tags: toJsonString(parseCommaSeparated(parsed.data.tags)),
      linkUrl: parsed.data.linkUrl || null,
      visibility: parsed.data.visibility,
      milestoneLinks: {
        deleteMany: {},
        create: allowedMilestones.map((item) => ({ milestoneId: item.id })),
      },
      dailyGoalLinks: {
        deleteMany: {},
        create: allowedGoals.map((item) => ({ dailyGoalId: item.id })),
      },
    },
  });

  const images = (formData.getAll("images") as File[]).filter((file) => file.size > 0);
  if (images.length > 0) {
    const uploaded = await saveImages(images);
    await prisma.artifactAttachment.createMany({
      data: uploaded.map((image) => ({
        artifactId: id,
        kind: "IMAGE",
        pathOrUrl: image.path,
        mimeType: image.mimeType,
        size: image.size,
      })),
    });
  }

  revalidatePath("/dashboard/artifacts");
  revalidatePath("/portfolio");
}

export async function toggleArtifactVisibilityAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) {
    throw new Error("잘못된 요청입니다.");
  }

  const artifact = await prisma.artifact.findFirst({
    where: { id, ownerId: user.id },
  });
  if (!artifact) {
    throw new Error("권한이 없습니다.");
  }

  await prisma.artifact.update({
    where: { id },
    data: {
      visibility: artifact.visibility === "PRIVATE" ? "PUBLIC" : "PRIVATE",
    },
  });

  revalidatePath("/dashboard/artifacts");
  revalidatePath("/portfolio");
}

export async function deleteArtifactAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");

  await prisma.artifact.deleteMany({ where: { id, ownerId: user.id } });
  revalidatePath("/dashboard/artifacts");
  revalidatePath("/portfolio");
}
