# 특성화고 취업 준비 개인 사이트 (MVP)

성과(포트폴리오) + 과정(로드맵/데일리/증빙)을 함께 관리/공유하는 Next.js 기반 개인 웹사이트입니다.

## 기술 스택
- Next.js (App Router) + TypeScript (strict)
- Tailwind CSS
- Prisma + SQLite
- 세션 기반 인증 (단일 Owner 계정)
- zod 검증
- Vitest 테스트

## 주요 기능
- 인증/권한: `/dashboard/*` 보호, 공개 페이지는 비로그인 접근
- 로드맵/마일스톤 CRUD + 상태(TODO/DOING/DONE)
- 데일리 플랜/목표 CRUD + 완료 체크 + 회고/컨디션
- 증빙 CRUD + 공개/비공개 + 필터 + 이미지 업로드(최대 3장)
- 프로젝트 CRUD + 증빙 연결
- 공개 페이지(`/`, `/portfolio`, `/projects`, `/projects/[id]`)에서 PUBLIC 데이터만 노출

## 라우트
### Public
- `/`
- `/portfolio`
- `/projects`
- `/projects/[id]`
- `/about`

### Private
- `/login`
- `/dashboard`
- `/dashboard/roadmap`
- `/dashboard/daily`
- `/dashboard/artifacts`
- `/dashboard/projects`
- `/dashboard/settings`

## 설치/실행
```bash
npm install
npx prisma generate
npm run db:setup
npm run dev
```

### 기본 로그인 계정 (seed)
- email: `owner@example.com`
- password: `password1234`

## DB 초기화
이 환경에서는 `npx prisma migrate dev`가 Prisma schema engine 오류를 내는 경우가 있어,
MVP에서는 SQL diff 기반 초기화 스크립트를 제공합니다.

```bash
npm run db:setup
```

동작:
1. `prisma migrate diff --from-empty ... --script`로 SQL 생성
2. sqlite 파일(`/tmp/specialized_job_mvp.db`)에 적용
3. seed 실행

## 품질 확인
```bash
npm run lint
npm run test
npm run build
```

## 배포 힌트
- Vercel/Render/Railway 배포 시 로컬 업로드(`public/uploads`)는 영속 스토리지 제약이 있습니다.
- 운영 환경에서는 S3/R2 같은 외부 스토리지로 교체를 권장합니다.
- SQLite 대신 Postgres 전환 시 Prisma datasource만 교체하면 됩니다.
