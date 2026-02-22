# AGENTS.md

## Project Summary
특성화고 학생 개인용 취업 준비 사이트 MVP.
핵심은 결과(포트폴리오)와 과정(로드맵/데일리/증빙)을 함께 관리하고 공개 가능한 형태로 제공하는 것.

## Terms
- Owner: 단일 사용자(1계정)
- Roadmap: 진로 계획
- Milestone: 로드맵 단계(TODO/DOING/DONE)
- DailyPlan: 날짜별 계획/회고
- DailyGoal: 데일리 목표 항목
- Artifact: 학업/프로젝트/자격증/대회/실습 등 증빙 기록
- Project: 공개 가능한 포트폴리오 프로젝트
- Visibility: PRIVATE/PUBLIC

## Rules
- 한국어 UI, 영어 코드/주석
- TypeScript strict 유지
- 폼/서버 입력 검증은 zod 사용
- 기본 데이터는 PRIVATE
- 공개 페이지는 PUBLIC 데이터만 노출
- /dashboard 하위 라우트는 인증 필요
- 비밀번호는 해시 저장, 세션 기반 인증

## Tech Stack
- Next.js App Router + TypeScript + Tailwind CSS
- Prisma + SQLite
- Auth.js Credentials (세션 기반)
- Zod

## Routes
### Public
- /
- /portfolio
- /projects
- /projects/[id]
- /about

### Private
- /login
- /dashboard
- /dashboard/roadmap
- /dashboard/daily
- /dashboard/artifacts
- /dashboard/projects
- /dashboard/settings

## Validation & Quality
- lint: `npm run lint`
- test: `npm run test`
- db migrate: `npx prisma migrate dev`
- dev server: `npm run dev`

## Build Order
1. Scaffold app and base layout
2. Prisma schema and migration
3. Auth and protected routes
4. Roadmap/Milestone CRUD
5. DailyPlan/DailyGoal CRUD
6. Artifact CRUD + visibility/filter
7. Project CRUD + Artifact link
8. Public filtered pages
9. Tests (validation/auth/public filter)
10. README update
