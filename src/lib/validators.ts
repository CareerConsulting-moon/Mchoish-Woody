import { z } from "zod";
import { ARTIFACT_TYPES, MILESTONE_STATUSES, VISIBILITIES } from "@/lib/constants";

export const loginSchema = z.object({
  email: z.email("이메일 형식이 올바르지 않습니다."),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
});

export const roadmapSchema = z.object({
  title: z.string().min(2).max(80),
  targetRole: z.string().min(2).max(80),
  targetIndustry: z.string().min(2).max(80),
});

export const milestoneSchema = z.object({
  roadmapId: z.string().min(1),
  title: z.string().min(2).max(100),
  description: z.string().max(1000).default(""),
  dueDate: z.string().optional(),
  status: z.enum(MILESTONE_STATUSES),
  order: z.coerce.number().int().nonnegative(),
  competencyTags: z.string().default(""),
});

export const reorderMilestoneSchema = z.object({
  roadmapId: z.string().min(1),
  orderedMilestoneIds: z.array(z.string().min(1)).min(1),
});

export const dailyPlanSchema = z.object({
  date: z.string().min(1),
  reflection: z.string().max(1000).default(""),
  mood: z.coerce.number().int().min(1).max(5).optional(),
});

export const dailyGoalSchema = z.object({
  dailyPlanId: z.string().min(1),
  title: z.string().min(2).max(120),
  category: z.string().max(40).optional(),
});

export const artifactSchema = z.object({
  type: z.enum(ARTIFACT_TYPES),
  title: z.string().min(2).max(120),
  summary: z.string().min(2).max(200),
  contentMd: z.string().max(5000).default(""),
  date: z.string().min(1),
  tags: z.string().default(""),
  linkUrl: z.url().optional().or(z.literal("")),
  visibility: z.enum(VISIBILITIES),
  milestoneIds: z.array(z.string()).default([]),
  dailyGoalIds: z.array(z.string()).default([]),
});

export const projectSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().min(2).max(2000),
  role: z.string().min(2).max(120),
  periodStart: z.string().optional(),
  periodEnd: z.string().optional(),
  techStack: z.string().default(""),
  repoUrl: z.url().optional().or(z.literal("")),
  demoUrl: z.url().optional().or(z.literal("")),
  visibility: z.enum(VISIBILITIES),
  artifactIds: z.array(z.string()).default([]),
});
