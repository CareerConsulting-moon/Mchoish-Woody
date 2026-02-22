import { Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1a2e24] py-10 text-[#e8e3db]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-woody-serif text-2xl font-bold text-white">WOODY</p>
          <p className="mt-2 text-sm text-[#e8e3db]/80">2026 WOODY. All rights reserved.</p>
          <p className="mt-2 text-sm text-[#d4a84b]">나무로 공간의 의미를 짓다</p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="인스타그램"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/90 transition hover:border-[#d4a84b] hover:text-[#d4a84b]"
          >
            <Instagram className="h-4 w-4" />
          </a>
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noreferrer"
            aria-label="유튜브"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/90 transition hover:border-[#d4a84b] hover:text-[#d4a84b]"
          >
            <Youtube className="h-4 w-4" />
          </a>
          <a
            href="https://blog.naver.com/woody416"
            target="_blank"
            rel="noreferrer"
            aria-label="네이버 블로그"
            className="inline-flex h-10 items-center justify-center rounded-full border border-white/15 px-4 text-sm text-white/90 transition hover:border-[#d4a84b] hover:text-[#d4a84b]"
          >
            BLOG
          </a>
        </div>
      </div>
    </footer>
  );
}
