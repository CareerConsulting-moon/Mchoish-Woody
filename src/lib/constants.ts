export const MILESTONE_STATUSES = ["TODO", "DOING", "DONE"] as const;
export type MilestoneStatus = (typeof MILESTONE_STATUSES)[number];

export const ARTIFACT_TYPES = [
  "STUDY",
  "PROJECT",
  "CERT",
  "CONTEST",
  "INTERNSHIP",
  "CLUB",
  "VOLUNTEER",
  "OTHER",
] as const;
export type ArtifactType = (typeof ARTIFACT_TYPES)[number];

export const VISIBILITIES = ["PRIVATE", "PUBLIC"] as const;
export type Visibility = (typeof VISIBILITIES)[number];

export const PROJECT_CATEGORIES = ["INTERIOR", "WOOD_ARCHITECTURE", "TRADITIONAL_RELIGIOUS", "OTHER"] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const JOB_ROLE_TEMPLATES = ["IT 웹개발", "디자인 시각디자인", "기계 가공", "전기 설비", "조리"] as const;

export const TAG_PRESETS = [
  "NCS",
  "직무기초",
  "포트폴리오",
  "자소서",
  "면접",
  "현장실습",
  "자격증",
  "대회",
  "독학",
  "독서",
] as const;

export const artifactTypeLabels: Record<ArtifactType, string> = {
  STUDY: "학업/수업",
  PROJECT: "프로젝트",
  CERT: "자격증",
  CONTEST: "대회",
  INTERNSHIP: "현장실습/인턴",
  CLUB: "동아리",
  VOLUNTEER: "봉사",
  OTHER: "기타",
};

export const milestoneStatusLabels: Record<MilestoneStatus, string> = {
  TODO: "할 일",
  DOING: "진행 중",
  DONE: "완료",
};

export const visibilityLabels: Record<Visibility, string> = {
  PRIVATE: "비공개",
  PUBLIC: "공개",
};

export const projectCategoryLabels: Record<ProjectCategory, string> = {
  INTERIOR: "상업 · 주거 인테리어",
  WOOD_ARCHITECTURE: "목조 건축",
  TRADITIONAL_RELIGIOUS: "전통 · 종교 목공",
  OTHER: "기타",
};
