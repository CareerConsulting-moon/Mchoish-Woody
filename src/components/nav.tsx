import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export async function SiteNav() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-zinc-200 bg-white/90">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold text-zinc-900">
          취업 로드맵 포트폴리오
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/portfolio">포트폴리오</Link>
          <Link href="/projects">프로젝트</Link>
          <Link href="/about">소개</Link>
          {user ? <Link href="/dashboard">대시보드</Link> : <Link href="/login">로그인</Link>}
        </div>
      </nav>
    </header>
  );
}
