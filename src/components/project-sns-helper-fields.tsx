"use client";

import { useState } from "react";
import { PROJECT_CATEGORIES, projectCategoryLabels, type ProjectCategory } from "@/lib/constants";

type ProjectSnsHelperFieldsProps = {
  defaults?: {
    category?: string | null;
    topic?: string | null;
    imageUrl?: string | null;
    workDate?: string | null;
    publishedAt?: string | null;
    snsPromoText?: string | null;
  };
};

type FormValues = {
  category: string;
  topic: string;
  title: string;
  description: string;
  imageUrl: string;
  workDate: string;
  publishedAt: string;
  role: string;
};

function normalizeCategory(input: string | null | undefined): ProjectCategory {
  if (PROJECT_CATEGORIES.includes(input as ProjectCategory)) {
    return input as ProjectCategory;
  }
  return "OTHER";
}

function buildGemsPrompt(values: FormValues): string {
  return [
    "다음 프로젝트 실적 정보를 바탕으로 SNS 홍보용 글을 한국어로 재작성해줘.",
    "톤앤매너: 전문적이지만 친근함, 과장 금지, 신뢰감 강조",
    "출력 형식:",
    "1) 인스타그램용 본문 (짧은 버전 120~180자)",
    "2) 블로그/카카오채널용 본문 (중간 버전 350~600자)",
    "3) 해시태그 10개",
    "4) CTA 문구 3개",
    "",
    `[카테고리] ${projectCategoryLabels[normalizeCategory(values.category)]}`,
    `[주제] ${values.topic}`,
    `[프로젝트명] ${values.title}`,
    `[작업 일자] ${values.workDate}`,
    `[게시 날짜] ${values.publishedAt}`,
    `[역할/서비스] ${values.role}`,
    `[대표 사진 URL] ${values.imageUrl}`,
    `[설명] ${values.description}`,
    "",
    "주의사항:",
    "- 허위 표현 금지",
    "- 고객 개인정보/민감정보 추정 금지",
    "- 문장 안에 이모지 사용 금지",
    "- 문장 마지막에 상담 유도 문구 포함",
  ].join("\n");
}

function buildLocalDraft(values: FormValues): string {
  const categoryLabel = projectCategoryLabels[normalizeCategory(values.category)];
  return [
    `[${categoryLabel}] ${values.topic}`,
    `${values.title} 작업을 진행했습니다.`,
    `${values.description}`,
    `작업 일자: ${values.workDate} / 게시일: ${values.publishedAt}`,
    "상담 및 시공 문의는 편하게 연락 주세요.",
    "#목조건축 #인테리어 #목공 #시공사례 #포트폴리오",
  ].join("\n");
}

export function ProjectSnsHelperFields({ defaults }: ProjectSnsHelperFieldsProps) {
  const [gemsPrompt, setGemsPrompt] = useState("");

  const generatePrompt = (button: HTMLButtonElement) => {
    const form = button.closest("form");
    if (!form) return;
    const formData = new FormData(form);
    const values: FormValues = {
      category: String(formData.get("category") ?? ""),
      topic: String(formData.get("topic") ?? ""),
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      imageUrl: String(formData.get("imageUrl") ?? ""),
      workDate: String(formData.get("workDate") ?? ""),
      publishedAt: String(formData.get("publishedAt") ?? ""),
      role: String(formData.get("role") ?? ""),
    };

    setGemsPrompt(buildGemsPrompt(values));

    const promoField = form.querySelector<HTMLTextAreaElement>('textarea[name="snsPromoText"]');
    if (promoField && !promoField.value.trim()) {
      promoField.value = buildLocalDraft(values);
    }
  };

  return (
    <>
      <label className="text-sm">
        카테고리
        <select
          name="category"
          defaultValue={normalizeCategory(defaults?.category)}
          className="mt-1 w-full"
          required
        >
          {PROJECT_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {projectCategoryLabels[category]}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm md:col-span-2">
        주제
        <input
          name="topic"
          required
          defaultValue={defaults?.topic ?? ""}
          className="mt-1 w-full"
          placeholder="예: 양평 목조주택 외부 데크 시공"
        />
      </label>
      <label className="text-sm md:col-span-2">
        대표 사진 업로드
        <input name="imageFile" type="file" accept="image/*" className="mt-1 w-full" />
      </label>
      <label className="text-sm md:col-span-2">
        대표 사진 URL (선택)
        <input
          name="imageUrl"
          type="url"
          defaultValue={defaults?.imageUrl ?? ""}
          className="mt-1 w-full"
          placeholder="https://..."
        />
      </label>
      <label className="text-sm">
        작업 일자
        <input
          name="workDate"
          type="date"
          required
          defaultValue={defaults?.workDate ?? ""}
          className="mt-1 w-full"
        />
      </label>
      <label className="text-sm">
        게시 날짜
        <input
          name="publishedAt"
          type="date"
          required
          defaultValue={defaults?.publishedAt ?? ""}
          className="mt-1 w-full"
        />
      </label>
      <div className="text-sm md:col-span-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={(event) => generatePrompt(event.currentTarget)}
            className="bg-emerald-700 hover:bg-emerald-600"
          >
            Gems용 홍보 프롬프트 생성
          </button>
          <span className="text-xs text-zinc-500">
            ChatGPT Gems에 아래 프롬프트를 붙여넣고 결과를 `SNS 홍보문`에 저장하세요.
          </span>
        </div>
        <p className="mt-2 text-xs text-zinc-500">
          파일 업로드를 사용하면 대표 사진 URL은 자동 저장됩니다. 외부 이미지인 경우만 URL을 직접 입력하세요.
        </p>
        <textarea
          value={gemsPrompt}
          onChange={(event) => setGemsPrompt(event.target.value)}
          className="mt-2 h-40 w-full rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 text-xs"
          placeholder="프롬프트 생성 버튼을 누르면 ChatGPT Gems에 붙여넣을 요청문이 생성됩니다."
        />
      </div>
      <label className="text-sm md:col-span-3">
        SNS 홍보문 (재작성 결과 저장)
        <textarea
          name="snsPromoText"
          defaultValue={defaults?.snsPromoText ?? ""}
          className="mt-1 h-32 w-full"
          placeholder="ChatGPT Gems에서 재작성한 SNS 홍보용 글을 여기에 저장"
        />
      </label>
    </>
  );
}
