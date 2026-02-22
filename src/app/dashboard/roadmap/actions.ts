"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { parseDateInput } from "@/lib/date";
import { prisma } from "@/lib/prisma";
import { milestoneSchema, roadmapSchema } from "@/lib/validators";
import { parseCommaSeparated, toJsonString } from "@/lib/utils";

export async function createRoadmapAction(formData: FormData) {
  const user = await requireUser();
  const parsed = roadmapSchema.safeParse({
    title: formData.get("title"),
    targetRole: formData.get("targetRole"),
    targetIndustry: formData.get("targetIndustry"),
  });
  if (!parsed.success) {
    throw new Error("로드맵 입력값이 올바르지 않습니다.");
  }

  await prisma.roadmap.create({
    data: {
      ownerId: user.id,
      ...parsed.data,
    },
  });

  revalidatePath("/dashboard/roadmap");
}

export async function updateRoadmapAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const parsed = roadmapSchema.safeParse({
    title: formData.get("title"),
    targetRole: formData.get("targetRole"),
    targetIndustry: formData.get("targetIndustry"),
  });
  if (!parsed.success || !id) {
    throw new Error("수정 입력값이 올바르지 않습니다.");
  }

  await prisma.roadmap.updateMany({
    where: { id, ownerId: user.id },
    data: parsed.data,
  });

  revalidatePath("/dashboard/roadmap");
}

export async function deleteRoadmapAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) {
    throw new Error("잘못된 요청입니다.");
  }

  await prisma.roadmap.deleteMany({ where: { id, ownerId: user.id } });
  revalidatePath("/dashboard/roadmap");
}

export async function createMilestoneAction(formData: FormData) {
  const user = await requireUser();
  const parsed = milestoneSchema.safeParse({
    roadmapId: formData.get("roadmapId"),
    title: formData.get("title"),
    description: formData.get("description") || "",
    dueDate: formData.get("dueDate") || undefined,
    status: formData.get("status"),
    order: formData.get("order"),
    competencyTags: formData.get("competencyTags") || "",
  });

  if (!parsed.success) {
    throw new Error("마일스톤 입력값이 올바르지 않습니다.");
  }

  const roadmap = await prisma.roadmap.findFirst({
    where: { id: parsed.data.roadmapId, ownerId: user.id },
  });
  if (!roadmap) {
    throw new Error("권한이 없습니다.");
  }

  await prisma.milestone.create({
    data: {
      roadmapId: parsed.data.roadmapId,
      title: parsed.data.title,
      description: parsed.data.description,
      dueDate: parsed.data.dueDate ? parseDateInput(parsed.data.dueDate) : null,
      status: parsed.data.status,
      order: parsed.data.order,
      competencyTags: toJsonString(parseCommaSeparated(parsed.data.competencyTags)),
    },
  });

  revalidatePath("/dashboard/roadmap");
}

export async function updateMilestoneAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const parsed = milestoneSchema.safeParse({
    roadmapId: formData.get("roadmapId"),
    title: formData.get("title"),
    description: formData.get("description") || "",
    dueDate: formData.get("dueDate") || undefined,
    status: formData.get("status"),
    order: formData.get("order"),
    competencyTags: formData.get("competencyTags") || "",
  });

  if (!parsed.success || !id) {
    throw new Error("마일스톤 수정값이 올바르지 않습니다.");
  }

  const milestone = await prisma.milestone.findFirst({
    where: { id, roadmap: { ownerId: user.id } },
  });

  if (!milestone) {
    throw new Error("권한이 없습니다.");
  }

  await prisma.milestone.update({
    where: { id },
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      dueDate: parsed.data.dueDate ? parseDateInput(parsed.data.dueDate) : null,
      status: parsed.data.status,
      order: parsed.data.order,
      competencyTags: toJsonString(parseCommaSeparated(parsed.data.competencyTags)),
    },
  });

  revalidatePath("/dashboard/roadmap");
}

export async function deleteMilestoneAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) {
    throw new Error("잘못된 요청입니다.");
  }

  await prisma.milestone.deleteMany({
    where: { id, roadmap: { ownerId: user.id } },
  });
  revalidatePath("/dashboard/roadmap");
}
