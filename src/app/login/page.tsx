import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { loginAction } from "./actions";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <section className="mx-auto max-w-md rounded-xl border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">로그인</h1>
      <p className="mt-1 text-sm text-zinc-600">대시보드 접근을 위해 로그인하세요.</p>
      <form action={loginAction} className="mt-6 space-y-3">
        <label className="block text-sm">
          이메일
          <input aria-label="이메일" type="email" name="email" required className="mt-1 w-full" />
        </label>
        <label className="block text-sm">
          비밀번호
          <input aria-label="비밀번호" type="password" name="password" required className="mt-1 w-full" />
        </label>
        <button type="submit" className="w-full">
          로그인
        </button>
      </form>
      <p className="mt-4 text-xs text-zinc-500">기본 계정: owner@example.com / password1234</p>
    </section>
  );
}
