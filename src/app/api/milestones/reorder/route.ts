import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reorderMilestoneSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = reorderMilestoneSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }

  const roadmap = await prisma.roadmap.findFirst({
    where: { id: parsed.data.roadmapId, ownerId: user.id },
    include: { milestones: { select: { id: true } } },
  });

  if (!roadmap) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const existingIds = roadmap.milestones.map((item) => item.id).sort();
  const incomingIds = [...parsed.data.orderedMilestoneIds].sort();

  if (existingIds.length !== incomingIds.length || existingIds.some((id, idx) => id !== incomingIds[idx])) {
    return NextResponse.json({ message: "Milestone set mismatch" }, { status: 400 });
  }

  await prisma.$transaction(
    parsed.data.orderedMilestoneIds.map((id, index) =>
      prisma.milestone.update({
        where: { id },
        data: { order: index },
      }),
    ),
  );

  return NextResponse.json({ ok: true });
}
