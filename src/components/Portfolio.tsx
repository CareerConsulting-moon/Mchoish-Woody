"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { portfolioItems, type PortfolioCategory } from "@/data/portfolio";
import { fadeUp, staggerContainer } from "@/lib/animations";

const tabs: Array<{ key: PortfolioCategory; label: string }> = [
  { key: "interior", label: "상업 · 주거 인테리어" },
  { key: "architecture", label: "목조 건축" },
  { key: "traditional", label: "전통 · 종교 목공" },
];

export function Portfolio() {
  const [activeTab, setActiveTab] = useState<PortfolioCategory>("interior");

  const filteredItems = portfolioItems.filter((item) => item.category === activeTab);

  return (
    <section id="portfolio" className="bg-[#fefdfb] py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10">
          <p className="text-sm tracking-[0.18em] text-[#d4a84b]">PORTFOLIO</p>
          <h2 className="mt-3 font-woody-serif text-3xl font-bold md:text-4xl">
            공간에 생명을 불어넣다
          </h2>
        </div>

        <div
          role="tablist"
          aria-label="포트폴리오 분류"
          className="mb-8 flex flex-wrap gap-6 border-b border-[#e8e3db]"
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative pb-3 text-sm font-medium transition ${
                activeTab === tab.key ? "text-[#1a1a1a]" : "text-[#4a4a4a]"
              }`}
            >
              {tab.label}
              <span
                className={`absolute bottom-0 left-0 h-0.5 w-full origin-left bg-[#d4a84b] transition ${
                  activeTab === tab.key ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
            variants={staggerContainer}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3"
          >
            {filteredItems.map((item) => (
              <motion.article
                key={item.id}
                variants={fadeUp}
                className="group overflow-hidden rounded-xl border border-[#e8e3db] bg-white shadow-sm"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={`${item.title} 현장 이미지`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-end bg-[#2e4a3e]/0 p-5 text-white opacity-0 transition duration-300 group-hover:bg-[#2e4a3e]/70 group-hover:opacity-100">
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="mt-1 text-sm text-white/85">자세히 보기 →</p>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-[#1a1a1a]">{item.title}</h3>
                  <p className="mt-1 text-sm text-[#4a4a4a]">
                    {item.location}, {item.year}
                  </p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
