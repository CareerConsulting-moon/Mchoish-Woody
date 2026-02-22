"use client";

import { motion } from "framer-motion";
import { Hammer, MessageSquare, PenTool, ShieldCheck, TreePine } from "lucide-react";
import { processSteps } from "@/data/portfolio";
import { fadeUp, staggerContainer } from "@/lib/animations";

const iconMap = {
  MessageSquare,
  PenTool,
  TreePine,
  Hammer,
  ShieldCheck,
} as const;

export function Process() {
  return (
    <section id="process" className="bg-[#fefdfb] py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12">
          <p className="text-sm tracking-[0.18em] text-[#d4a84b]">PROCESS</p>
          <h2 className="mt-3 font-woody-serif text-3xl font-bold md:text-4xl">
            처음 상담부터 완공까지
          </h2>
        </div>

        <div className="relative">
          <motion.div
            className="absolute left-6 top-0 h-full w-0.5 origin-top bg-[#d4a84b] md:left-1/2"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="space-y-10"
          >
            {processSteps.map((step, index) => {
              const Icon = iconMap[step.icon];
              const isRight = index % 2 === 1;

              return (
                <motion.div
                  key={step.id}
                  variants={fadeUp}
                  className="relative grid md:grid-cols-2 md:gap-12"
                >
                  <div
                    className={`pl-20 md:pl-0 ${isRight ? "md:col-start-2" : "md:text-right"}`}
                  >
                    <div className="rounded-2xl border border-[#e8e3db] bg-white p-6 shadow-sm">
                      <p className="text-sm font-medium tracking-[0.12em] text-[#d4a84b]">{step.step}</p>
                      <h3 className="mt-2 text-xl font-semibold text-[#1a1a1a]">{step.title}</h3>
                      <p className="mt-3 leading-8 text-[#4a4a4a]">{step.description}</p>
                    </div>
                  </div>

                  <div className="pointer-events-none absolute left-0 top-4 md:left-1/2 md:-translate-x-1/2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2e4a3e] text-white shadow-lg">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
