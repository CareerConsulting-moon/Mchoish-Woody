import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hashPassword, verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { isPrismaRuntimeDbError } from "@/lib/prisma-errors";

export { hashPassword, verifyPassword };

const SESSION_COOKIE = "owner_session";
const SESSION_TTL_DAYS = 7;

function buildSessionToken(): string {
  return randomBytes(32).toString("hex");
}

export async function createSession(userId: string): Promise<void> {
  const token = buildSessionToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_TTL_DAYS);

  try {
    await prisma.session.create({
      data: { token, userId, expiresAt },
    });
  } catch (error) {
    if (isPrismaRuntimeDbError(error)) {
      throw new Error("배포 환경 데이터베이스가 아직 준비되지 않았습니다.");
    }
    throw error;
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    try {
      await prisma.session.deleteMany({ where: { token } });
    } catch (error) {
      if (!isPrismaRuntimeDbError(error)) {
        throw error;
      }
    }
  }
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }

  let session = null;
  try {
    session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });
  } catch (error) {
    if (isPrismaRuntimeDbError(error)) {
      cookieStore.delete(SESSION_COOKIE);
      return null;
    }
    throw error;
  }

  if (!session || session.expiresAt <= new Date()) {
    cookieStore.delete(SESSION_COOKIE);
    return null;
  }

  return session.user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}
