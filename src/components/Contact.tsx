"use client";

import { FormEvent, useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="relative bg-[#2e4a3e] py-24 text-white md:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2 md:gap-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.p variants={fadeUp} className="text-sm tracking-[0.18em] text-[#d4a84b]">
            CONTACT
          </motion.p>
          <motion.h2 variants={fadeUp} className="mt-4 font-woody-serif text-3xl font-bold md:text-4xl">
            무료 상담을 신청하세요
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-5 leading-8 text-white/85">
            전화, 카카오톡, 또는 아래 폼을 통해 편하게 연락 주세요.
          </motion.p>

          <motion.ul variants={fadeUp} className="mt-8 space-y-4 text-white/90">
            <li>Phone: 010-1234-5678</li>
            <li>Email: woody416@naver.com</li>
            <li>KakaoTalk: woody416</li>
            <li>Address: 경기도 OO시 OO구 OO로 123</li>
          </motion.ul>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onSubmit={handleSubmit}
          className="rounded-xl border border-white/15 bg-white/10 p-8 backdrop-blur"
          aria-label="무료 상담 신청 폼"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-2 block text-white/85">이름</span>
              <input
                required
                name="name"
                aria-label="이름"
                placeholder="홍길동"
                className="h-11 w-full rounded-md border border-white/20 bg-white/5 px-3 text-white placeholder:text-white/50"
              />
            </label>
            <label className="text-sm">
              <span className="mb-2 block text-white/85">연락처</span>
              <input
                required
                name="phone"
                aria-label="연락처"
                placeholder="010-0000-0000"
                className="h-11 w-full rounded-md border border-white/20 bg-white/5 px-3 text-white placeholder:text-white/50"
              />
            </label>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-2 block text-white/85">이메일</span>
              <input
                type="email"
                name="email"
                aria-label="이메일"
                placeholder="example@domain.com"
                className="h-11 w-full rounded-md border border-white/20 bg-white/5 px-3 text-white placeholder:text-white/50"
              />
            </label>
            <label className="text-sm">
              <span className="mb-2 block text-white/85">서비스 유형</span>
              <select
                name="serviceType"
                aria-label="서비스 유형"
                defaultValue=""
                className="h-11 w-full rounded-md border border-white/20 bg-[#2e4a3e] px-3 text-white"
              >
                <option value="" disabled>
                  선택해 주세요
                </option>
                <option value="interior">인테리어</option>
                <option value="architecture">목조건축</option>
                <option value="traditional">전통목공</option>
                <option value="etc">기타</option>
              </select>
            </label>
          </div>

          <label className="mt-4 block text-sm">
            <span className="mb-2 block text-white/85">문의 내용</span>
            <textarea
              required
              name="message"
              aria-label="문의 내용"
              rows={5}
              placeholder="현장 위치, 희망 일정, 예산 범위를 함께 남겨주시면 상담이 빠릅니다."
              className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/50"
            />
          </label>

          <button
            type="submit"
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-md bg-[#d4a84b] px-4 text-sm font-semibold text-[#1a1a1a] transition hover:bg-[#c49a3e]"
          >
            상담 신청하기
          </button>

          {submitted ? (
            <p className="mt-3 text-sm text-[#e8e3db]">
              샘플 폼입니다. 실제 운영 시 서버 연동(이메일/DB 저장)을 연결하면 됩니다.
            </p>
          ) : null}
        </motion.form>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-white/10 bg-[#1a2e24]/95 p-2 backdrop-blur md:hidden">
        <a
          href="tel:01012345678"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#2e4a3e] text-sm font-medium text-white"
          aria-label="전화 상담"
        >
          <Phone className="h-4 w-4" />
          전화 문의
        </a>
        <a
          href="#contact"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#d4a84b] text-sm font-semibold text-[#1a1a1a]"
          aria-label="카카오톡 상담 문의"
        >
          <MessageCircle className="h-4 w-4" />
          카카오톡 문의
        </a>
      </div>
    </section>
  );
}
