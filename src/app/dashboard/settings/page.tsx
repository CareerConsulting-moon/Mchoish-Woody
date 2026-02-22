import { requireUser } from "@/lib/auth";

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <section className="rounded-xl border bg-white p-5">
      <h1 className="text-xl font-bold">설정</h1>
      <p className="mt-2 text-sm text-zinc-600">계정: {user.email}</p>
      <p className="mt-1 text-sm text-zinc-600">기본 정책: 신규 데이터는 비공개로 저장됩니다.</p>
    </section>
  );
}
