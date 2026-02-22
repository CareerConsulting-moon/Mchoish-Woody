"use client";

import { motion } from "framer-motion";
import { Building2, Landmark, Warehouse } from "lucide-react";
import { services } from "@/data/portfolio";
import { fadeUp, staggerContainer } from "@/lib/animations";

const iconMap = {
  Building2,
  Warehouse,
  Landmark,
} as const;

export function Services() {
  return (
    <section id="services" className="wood-grain bg-[#f5f0e8] py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10">
          <p className="text-sm tracking-[0.18em] text-[#d4a84b]">SERVICES</p>
          <h2 className="mt-3 font-woody-serif text-3xl font-bold md:text-4xl">
            나무로 할 수 있는 모든 것
          </h2>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="grid gap-6 md:grid-cols-3"
        >
          {services.map((service) => {
            const Icon = iconMap[service.icon];
            return (
              <motion.article
                key={service.id}
                variants={fadeUp}
                className="group rounded-xl border border-[#e8e3db] bg-white p-8 transition duration-300 hover:border-t-[#d4a84b] hover:shadow-lg hover:[border-top-width:4px]"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#2e4a3e]/10 text-[#2e4a3e]">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="font-woody-serif text-xl font-bold text-[#1a1a1a]">{service.title}</h3>
                <p className="mt-4 leading-8 text-[#4a4a4a]">{service.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#e8e3db] bg-[#f5f0e8] px-3 py-1 text-xs text-[#4a4a4a]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
