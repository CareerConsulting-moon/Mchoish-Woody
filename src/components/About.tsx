"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { fadeUp } from "@/lib/animations";
import { heroImages } from "@/data/portfolio";

type CounterProps = {
  target: number;
  suffix?: string;
  label: string;
};

function Counter({ target, suffix = "", label }: CounterProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ref.current || started) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setStarted(true);
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let frame = 0;
    const duration = 1000;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [started, target]);

  return (
    <div ref={ref} className="rounded-xl border border-[#e8e3db] bg-white/80 p-5">
      <p className="font-woody-serif text-3xl font-bold text-[#2e4a3e]">
        {value}
        {suffix}
      </p>
      <p className="mt-1 text-sm text-[#4a4a4a]">{label}</p>
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="wood-grain bg-[#f5f0e8] py-24 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl"
        >
          <Image
            src={heroImages.about}
            alt="장인이 목재를 다루는 작업 장면"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="text-[#1a1a1a]"
        >
          <motion.p variants={fadeUp} className="text-sm tracking-[0.18em] text-[#d4a84b]">
            ABOUT US
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-4 font-woody-serif text-3xl font-bold leading-tight md:text-4xl"
          >
            30년, 나무와 함께한 시간
          </motion.h2>
          <motion.div variants={fadeUp} className="mt-6 space-y-4 text-base leading-8 text-[#4a4a4a]">
            <p>
              WOODY는 목조 건축과 인테리어, 전통 목공의 현장에서 축적한 경험을 바탕으로 공간의 본질을 설계하고 시공합니다.
              재료의 결을 읽고, 쓰임에 맞는 구조를 고민하는 일에서 출발합니다.
            </p>
            <p>
              전통 기술의 정교함과 현대적 설계 감각을 결합해, 오래 사용할수록 가치가 깊어지는 공간을 만듭니다.
              눈에 보이는 마감뿐 아니라 보이지 않는 구조까지 책임지는 방식으로 작업합니다.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 grid gap-4 sm:grid-cols-3">
            <Counter target={30} suffix="+" label="경력 년수" />
            <Counter target={500} suffix="+" label="시공 프로젝트" />
            <Counter target={98} suffix="%" label="고객 만족도" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
