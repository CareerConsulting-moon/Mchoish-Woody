"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { heroImages } from "@/data/portfolio";

export function Hero() {
  return (
    <section id="hero" className="relative min-h-screen overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      >
        <Image
          src={heroImages.hero}
          alt="목조 건축 시공 현장 전경"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/60" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-4 py-24">
        <motion.div
          className="max-w-3xl text-[#fefdfb]"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={fadeUp}
            className="mb-5 text-sm tracking-[0.2em] text-[#d4a84b]"
          >
            ARCHITECTURE · INTERIOR · WOODCRAFT
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="font-woody-serif text-5xl font-bold leading-tight text-white md:text-7xl"
          >
            나무로 공간의 의미를 짓다
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 text-lg leading-8 text-[#e8e3db]">
            건축, 인테리어, 종교 목공의 기록
          </motion.p>
          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-3">
            <a
              href="#portfolio"
              className="inline-flex items-center justify-center rounded-full bg-[#d4a84b] px-6 py-3 text-sm font-semibold text-[#1a1a1a] transition hover:bg-[#c49a3e]"
            >
              포트폴리오 보기
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full border border-white/70 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              무료 상담 신청
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
