"use server";

import { redirect } from "next/navigation";
import { createSession, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isPrismaRuntimeDbError } from "@/lib/prisma-errors";
import { loginSchema } from "@/lib/validators";

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.");
  }

  let user = null;
  try {
    user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  } catch (error) {
    if (isPrismaRuntimeDbError(error)) {
      throw new Error("배포 환경 데이터베이스가 아직 준비되지 않았습니다. 잠시 후 다시 시도해 주세요.");
    }
    throw error;
  }
  if (!user) {
    throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
  }

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) {
    throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
  }

  await createSession(user.id);
  redirect("/dashboard");
}
