<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/assets/image/logo.svg">
  <source media="(prefers-color-scheme: light)" srcset="public/assets/image/logo-dark.svg">
  <img alt="Poke Korea" src="public/assets/image/logo-dark.svg" width="300">
</picture>

### 한국어 포켓몬 정보 웹사이트

[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![GraphQL](https://img.shields.io/badge/GraphQL-E10098?logo=graphql&logoColor=white)](https://graphql.org/)

[poke-korea.com](https://poke-korea.com)

</div>

---

## 소개

Poke Korea는 한국 트레이너를 위한 포켓몬 정보 웹사이트입니다. 포켓몬 도감, 기술, 특성, 타입 상성 등 게임 플레이에 필요한 데이터를 한국어로 제공합니다.

## 주요 기능

- **포켓몬 도감** - 전 세대 포켓몬 정보 (폼체인지, 메가진화, 리전폼, 거다이맥스 포함)
- **기술 도감** - 세대별 기술 데이터 및 습득 포켓몬 목록
- **특성 도감** - 특성 효과 및 보유 포켓몬 목록
- **타입 상성 계산기** - 공격/방어 타입 상성 계산
- **포켓몬 퀴즈** - 실루엣, 특성, 타입, 타입 상성 퀴즈

## 기술 스택

| 영역        | 기술                      |
| ----------- | ------------------------- |
| 프레임워크  | Next.js (App Router)      |
| 언어        | TypeScript (strict)       |
| 스타일링    | Tailwind CSS              |
| 데이터 페칭 | Apollo Client + GraphQL   |
| 폼 관리     | React Hook Form           |
| 차트        | Chart.js                  |
| 상태 관리   | React Context API + Immer |
| 코드 생성   | GraphQL Code Generator    |

## 주요 특징

- Server Components 기반 SSR/SSG 최적화
- 모바일/데스크톱 이중 레이아웃 구조 (User Agent 기반 서버 사이드 감지)
- 5,000개 이상 URL 동적 사이트맵 및 SEO 메타데이터
- JSON-LD 구조화 데이터 적용
- 무한 스크롤 기반 대용량 리스트 처리

## 시작하기

### 요구사항

- Node.js 18+
- GraphQL API 서버 (`localhost:4000/graphql`)

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# GraphQL 타입 생성
npm run codegen
```

## 프로젝트 구조

```
src/
├── app/               # Next.js App Router 페이지
├── views/             # 디바이스별 페이지 뷰 (desktop/mobile)
├── container/         # 비즈니스 로직 컨테이너 (desktop/mobile)
├── components/        # 공용 UI 컴포넌트
├── context/           # React Context 상태 관리
├── hook/              # 커스텀 React 훅
├── gql/               # GraphQL 쿼리/프래그먼트 원본
├── graphql/           # 자동 생성된 GraphQL 타입 (수정 금지)
├── module/            # 유틸리티 모듈
├── constants/         # 상수 정의
├── types/             # TypeScript 타입 정의
└── styles/            # 전역 스타일
```

## Claude Code 하네스

`.claude/` 디렉토리를 중심으로 Claude Code의 에이전트, 스킬, 자동화를 관리합니다.

```
.claude/
├── settings.json          # 권한 설정 및 hooks 등록
├── hooks/                 # 자동화 스크립트
├── conventions/guides/    # 코딩/스타일링/린팅/워크플로우 규칙
├── seo/guides/            # SEO 가이드라인
├── decisions/             # ADR (아키텍처 의사결정 기록)
├── skills/                # 슬래시 커맨드 (9개)
└── agents/                # 도메인 전문 에이전트 (3개)
```

### 에이전트

| 에이전트 | 역할 |
| -------- | ---- |
| `seo-specialist` | 메타태그, JSON-LD, OG 이미지, sitemap |
| `ui-publisher` | 컴포넌트 구현, desktop/mobile 분리 패턴 |
| `graphql-specialist` | 쿼리/스키마 변경, codegen 관리 |

### 스킬

| 명령어 | 설명 |
| ------ | ---- |
| `/create-branch` | 신규 버전 브랜치 생성 |
| `/create-pr` | Pull Request 생성 |
| `/review-pr` | PR 리뷰 코멘트 분석 |
| `/reply-review` | PR 리뷰 답글 작성 |
| `/lint-check` | Prettier + ESLint 전체 검사 |
| `/seo-audit` | SEO 감사 |
| `/code-review` | 서브에이전트 기반 코드 리뷰 |
| `/component-builder` | desktop/mobile 컴포넌트 스캐폴딩 |
| `/research` | 외부 정보 조사 |

### Hooks

| Hook | 시점 | 동작 |
| ---- | ---- | ---- |
| `post-edit-format.sh` | 파일 수정 후 | 자동 prettier 포맷팅 |
| `pre-bash-guard.sh` | 명령어 실행 전 | 위험 명령어 차단 (`rm -rf`, `git push --force` 등) |
| `stop-changelog-check.sh` | 작업 완료 시 | changelog 파일 존재 여부 검증 |
| `notify.sh` | 입력 대기 시 | macOS 데스크톱 알림 |

## Changelog

개발 변경사항은 [Changelog 블로그](https://poke-korea.com/changelog)에서 확인할 수 있습니다.

## 라이선스

이 프로젝트는 개인 프로젝트로, 포켓몬 관련 모든 이미지 및 데이터의 저작권은 Nintendo / Creatures Inc. / GAME FREAK inc.에 있습니다.
