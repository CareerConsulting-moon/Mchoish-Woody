"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { parseDateInput } from "@/lib/date";
import { prisma } from "@/lib/prisma";
import { dailyGoalSchema, dailyPlanSchema } from "@/lib/validators";

export async function upsertDailyPlanAction(formData: FormData) {
  const user = await requireUser();
  const parsed = dailyPlanSchema.safeParse({
    date: formData.get("date"),
    reflection: formData.get("reflection") || "",
    mood: formData.get("mood") || undefined,
  });
  if (!parsed.success) {
    throw new Error("데일리 플랜 입력값이 올바르지 않습니다.");
  }

  const date = parseDateInput(parsed.data.date);
  await prisma.dailyPlan.upsert({
    where: {
      ownerId_date: {
        ownerId: user.id,
        date,
      },
    },
    create: {
      ownerId: user.id,
      date,
      reflection: parsed.data.reflection,
      mood: parsed.data.mood,
    },
    update: {
      reflection: parsed.data.reflection,
      mood: parsed.data.mood,
    },
  });

  revalidatePath("/dashboard/daily");
}

export async function createGoalAction(formData: FormData) {
  const user = await requireUser();
  const parsed = dailyGoalSchema.safeParse({
    dailyPlanId: formData.get("dailyPlanId"),
    title: formData.get("title"),
    category: formData.get("category") || undefined,
  });
  if (!parsed.success) {
    throw new Error("목표 입력값이 올바르지 않습니다.");
  }

  const plan = await prisma.dailyPlan.findFirst({
    where: { id: parsed.data.dailyPlanId, ownerId: user.id },
    include: { goals: true },
  });

  if (!plan) {
    throw new Error("권한이 없습니다.");
  }

  if (plan.goals.length >= 5) {
    throw new Error("하루 목표는 최대 5개까지 권장합니다.");
  }

  await prisma.dailyGoal.create({
    data: {
      dailyPlanId: parsed.data.dailyPlanId,
      title: parsed.data.title,
      category: parsed.data.category,
    },
  });

  revalidatePath("/dashboard/daily");
}

export async function toggleGoalAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) {
    throw new Error("잘못된 요청입니다.");
  }

  const goal = await prisma.dailyGoal.findFirst({
    where: { id, dailyPlan: { ownerId: user.id } },
  });

  if (!goal) {
    throw new Error("권한이 없습니다.");
  }

  await prisma.dailyGoal.update({
    where: { id },
    data: {
      isDone: !goal.isDone,
      doneAt: goal.isDone ? null : new Date(),
    },
  });

  revalidatePath("/dashboard/daily");
}

export async function deleteGoalAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");

  await prisma.dailyGoal.deleteMany({
    where: { id, dailyPlan: { ownerId: user.id } },
  });

  revalidatePath("/dashboard/daily");
}
