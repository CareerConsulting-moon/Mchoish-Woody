"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { testimonials } from "@/data/portfolio";
import { fadeUp, staggerContainer } from "@/lib/animations";

export function Testimonials() {
  return (
    <section id="testimonials" className="wood-grain bg-[#f5f0e8] py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10">
          <p className="text-sm tracking-[0.18em] text-[#d4a84b]">TESTIMONIALS</p>
          <h2 className="mt-3 font-woody-serif text-3xl font-bold md:text-4xl">고객의 이야기</h2>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((item) => (
            <motion.article
              key={item.id}
              variants={fadeUp}
              className="min-w-[85%] snap-start rounded-xl bg-white p-8 shadow-sm sm:min-w-[70%] lg:min-w-[calc(50%-12px)]"
            >
              <Quote className="h-10 w-10 text-[#d4a84b]" aria-hidden="true" />
              <div className="mt-5 flex gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className="h-4 w-4 fill-[#d4a84b] text-[#d4a84b]"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="mt-5 leading-8 text-[#4a4a4a]">{item.quote}</p>
              <div className="mt-6 border-t border-[#e8e3db] pt-4">
                <p className="font-semibold text-[#1a1a1a]">{item.author}</p>
                <p className="text-sm text-[#4a4a4a]">{item.role}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
