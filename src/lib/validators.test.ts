import { describe, expect, it } from "vitest";
import { artifactSchema, reorderMilestoneSchema } from "./validators";

describe("artifactSchema", () => {
  it("accepts valid artifact payload", () => {
    const parsed = artifactSchema.safeParse({
      type: "PROJECT",
      title: "포트폴리오 개선",
      summary: "README 정리",
      contentMd: "내용",
      date: "2026-02-14",
      tags: "NCS, 포트폴리오",
      linkUrl: "https://example.com",
      visibility: "PRIVATE",
      milestoneIds: [],
      dailyGoalIds: [],
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects invalid url", () => {
    const parsed = artifactSchema.safeParse({
      type: "PROJECT",
      title: "제목",
      summary: "요약",
      contentMd: "",
      date: "2026-02-14",
      tags: "",
      linkUrl: "not-a-url",
      visibility: "PUBLIC",
      milestoneIds: [],
      dailyGoalIds: [],
    });

    expect(parsed.success).toBe(false);
  });
});

describe("reorderMilestoneSchema", () => {
  it("accepts valid reorder payload", () => {
    const parsed = reorderMilestoneSchema.safeParse({
      roadmapId: "roadmap_1",
      orderedMilestoneIds: ["m1", "m2"],
    });

    expect(parsed.success).toBe(true);
  });
});
