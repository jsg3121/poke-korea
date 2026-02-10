# CLAUDE.md

이 파일은 Claude Code(claude.ai/code)가 본 저장소의 코드를 다룰 때 참고하는 지침 문서입니다.

---

## 응답 규칙

- 답변은 항상 한국어를 최우선으로 사용
- 무게, 거리, 통화 기준도 한국을 기준으로 우선하여 적용
- 모든 답변엔 먼저 코드를 어떻게 수정하면 좋을지에 대한 제안
- 두 번째 질문을 통해 코드를 작성해달라는 요청이 있을 때만 코드를 직접 수정
- 코드 작성시엔 프로젝트 폴더 내에 있는 `.eslintrc`, `.prettierrc`에 맞춰서 작성해줘
- 코드를 작성할 때 해당 기능이 동작될 수 있는 최소한의 구현을 실행
- 모든 코드에 대해선 반드시 이슈가 발생할 가능성이 있는지 테스트를 진행하고, 어떤 부분을 개선해야할 지는 답변으로만 명시
- **IMPORTANT**: 모든 작업을 진행하기 전에 반드시 현재 브랜치를 확인하고, 적절한 브랜치에서 작업 중인지 검증할 것. 신규 작업 시작 시 적절한 브랜치 생성 여부를 확인할 것.
- **CRITICAL**: 모든 코드 작업을 완료한 후에는 반드시 해당 버전의 changelog 파일을 작성할 것. changelog 작성 없이 작업을 완료했다고 보고하지 말 것.
- **CRITICAL**: 복잡한 기능 구현 시 각 작업 단계를 나누어 진행하고, 각 단계마다 사용자에게 확인을 받을 것. 한 번에 여러 파일을 수정하지 말고, 단계별로 검토 후 진행할 것.

---

## 개발 명령어

| 명령어                | 설명                                                                         |
| --------------------- | ---------------------------------------------------------------------------- |
| `npm run dev`         | 개발 서버 실행 (`http://localhost:3000`)                                     |
| `npm run build`       | 프로덕션 빌드                                                                |
| `npm run start`       | 프로덕션 서버 실행                                                           |
| `npm run start:local` | 로컬에서 빌드 후 프로덕션 서버 실행                                          |
| `npm run lint`        | ESLint 코드 품질 검사                                                        |
| `npm run codegen`     | GraphQL 스키마로부터 TypeScript 타입 생성 (localhost:4000/graphql 서버 필요) |

---

## 기술 스택

| 영역          | 기술                             | 버전              |
| ------------- | -------------------------------- | ----------------- |
| 프레임워크    | Next.js (App Router)             | ^14.2.35          |
| 언어          | TypeScript (strict 모드)         | ^5.7.2            |
| UI 라이브러리 | React                            | ^18.3.1           |
| 스타일링      | Tailwind CSS                     | ^3.4.17           |
| 데이터 페칭   | Apollo Client + GraphQL          | ^3.11.8 / ^16.9.0 |
| 폼 관리       | React Hook Form                  | ^7.53.2           |
| 차트          | Chart.js + react-chartjs-2       | ^4.4.6 / ^5.2.0   |
| 상태 관리     | React Context API + Immer        | ^10.1.1           |
| SVG 처리      | @svgr/webpack                    | ^8.1.0            |
| 코드 생성     | GraphQL Code Generator           | ^5.0.3            |
| CSS 최적화    | PostCSS + Autoprefixer + cssnano | -                 |
| 프로세스 관리 | PM2 (ecosystem.config.js)        | -                 |

### 브라우저 지원 범위

- **프로덕션**: Chrome ≥114, Edge ≥114, Firefox ≥115, Safari ≥15.4, iOS ≥15.4, Samsung ≥17
- **개발**: 각 브라우저 최신 1개 버전

---

## 프로젝트 폴더 구조

```text
poke-korea/
├── public/                          # 정적 자산
│   ├── fonts/                       #   서브셋 웹폰트 (GmarketSans woff2)
│   └── assets/                      #   아이콘, 이미지, 타입 SVG(18종)
├── changelog/                       # Docusaurus 개발 블로그 (별도 빌드)
│   ├── blog/                        #   블로그 포스트 (버전별 폴더)
│   │   ├── 1.28.0/ ~ 1.33.0/       #     버전별 마크다운 파일
│   │   ├── authors.yml              #     작성자 정의
│   │   └── tags.yml                 #     태그 정의
│   ├── docusaurus.config.ts         #   Docusaurus 설정
│   └── package.json                 #   별도 의존성 관리
├── src/
│   ├── app/                         # Next.js App Router 페이지 (라우트)
│   ├── assets/                      # SVG 컴포넌트용 원본 자산
│   ├── components/                  # 공유 UI 컴포넌트
│   │   ├── ability/                 #   특성 관련 컴포넌트 (5개)
│   │   ├── adSlot/                  #   광고 배너 컴포넌트 (48개, device별)
│   │   ├── detail/                  #   상세 페이지 UI (인디케이터, 폼 전환 버튼)
│   │   ├── detail.summary/          #   이로치 확률·툴팁 관련 (10개)
│   │   ├── home/                    #   홈 퀴즈 팝업·버튼 (3개)
│   │   ├── mobile/                  #   모바일 전용 컴포넌트
│   │   ├── moves/                   #   기술 관련 컴포넌트 (11개)
│   │   ├── pokemonCard/             #   포켓몬 카드 (desktop/mobile 분리)
│   │   ├── quiz.modal/              #   퀴즈 카운트다운 모달
│   │   └── *.component.tsx          #   공용 컴포넌트 (Ball, Checkbox, Image, Portal, Radio, Tag 등)
│   ├── constants/                   # 상수 정의
│   │   ├── *JsonLd.ts               #   JSON-LD 구조화 데이터 (7개)
│   │   ├── seoMetaData.ts           #   SEO 메타데이터 상수
│   │   ├── adSense.ts               #   Google AdSense 설정
│   │   └── quiz.constants.ts        #   퀴즈 상수
│   ├── container/                   # 컨테이너 컴포넌트 (비즈니스 로직 담당)
│   │   ├── desktop/                 #   데스크톱 전용 (header, footer, detail, list, home 등)
│   │   └── mobile/                  #   모바일 전용 (동일 구조)
│   ├── context/                     # React Context (10개)
│   │   ├── Device.context.tsx       #   기기 감지 (mobile/desktop)
│   │   ├── Detail.context.tsx       #   포켓몬 상세 상태
│   │   ├── List.context.tsx         #   도감 리스트 상태
│   │   ├── Moves.context.tsx        #   기술 도감 상태
│   │   ├── TypeEffectiveness.context.tsx  #   타입 상성 상태
│   │   └── *Quiz.context.tsx        #   퀴즈 상태 (4종)
│   ├── gql/                         # GraphQL 원본 파일
│   │   ├── fragment.graphql         #   프래그먼트 정의
│   │   └── query.graphql            #   쿼리 정의
│   ├── graphql/                     # GraphQL 코드 생성 결과 (자동 생성, 직접 수정 금지)
│   │   ├── schema.graphql           #   스키마 AST
│   │   ├── gqlGenerated.ts          #   React Apollo 훅
│   │   └── typeGenerated.ts         #   TypeScript 타입
│   ├── hook/                        # 커스텀 React 훅 (14개)
│   │   ├── useInfiniteScroll.ts     #   무한 스크롤
│   │   ├── useDebounce.ts           #   디바운스
│   │   ├── useLazyImage.ts          #   이미지 지연 로딩
│   │   ├── useBodyScrollLock.ts     #   스크롤 잠금
│   │   ├── useOutSideClick.ts       #   외부 클릭 감지
│   │   ├── useQuizTimer.ts          #   퀴즈 타이머
│   │   └── ...                      #   그 외 (useCountdown, useHeaderScroll 등)
│   ├── module/                      # 유틸리티 모듈 (19개)
│   │   ├── apolloClient.ts          #   Apollo Client 설정 (SSR/SSG 지원)
│   │   ├── generateDetailSeoMetaData.ts  #   상세 페이지 SEO 메타데이터 생성
│   │   ├── metadata.module.ts       #   robots 설정 등 공통 메타데이터
│   │   ├── ogImage.module.ts        #   OG 이미지 생성
│   │   ├── filter.module.ts         #   필터 로직
│   │   ├── changeType.ts            #   타입 변환
│   │   ├── changeColor.ts           #   색상 변환
│   │   └── ...                      #   그 외 (image, list, quiz, device 등)
│   ├── styles/                      # 전역 스타일
│   │   └── globals.css              #   Tailwind 지시문 + 전역 CSS
│   ├── types/                       # TypeScript 타입 정의 (5개)
│   │   ├── common.types.d.ts        #   공통 타입
│   │   ├── global.d.ts              #   전역 타입 (SVG 모듈 등)
│   │   ├── pokemonTypes.types.ts    #   포켓몬 타입 정의
│   │   ├── detailContext.type.ts    #   상세 Context 타입
│   │   └── quiz.type.ts             #   퀴즈 타입
│   ├── utils/                       # 유틸리티 함수 (3개)
│   │   ├── getCssFiles.ts           #   CSS 파일 경로 추출
│   │   ├── quiz.util.ts             #   퀴즈 유틸
│   │   └── skill.util.ts            #   기술 유틸
│   └── views/                       # 페이지 뷰 컴포넌트
│       ├── desktop/                 #   데스크톱 뷰 (*.desktop.tsx)
│       └── mobile/                  #   모바일 뷰 (*.mobile.tsx)
├── .eslintrc                        # ESLint 설정
├── .prettierrc                      # Prettier 설정
├── codegen.ts                       # GraphQL Code Generator 설정
├── ecosystem.config.js              # PM2 배포 설정
├── next.config.js                   # Next.js 설정 (리다이렉트, 캐싱, webpack)
├── postcss.config.js                # PostCSS 설정
├── tailwind.config.js               # Tailwind CSS 설정
└── tsconfig.json                    # TypeScript 설정
```

---

## 페이지 라우트 맵

```text
src/app/
├── layout.tsx                                  # 루트 레이아웃 (공통 메타·프로바이더·GA·폰트)
├── page.tsx                                    # 홈 (/)
├── providers.tsx                               # 전역 프로바이더 (Apollo, Device 등)
├── error.tsx                                   # 에러 페이지
├── not-found.tsx                               # 404 페이지
├── robots.ts                                   # robots.txt 동적 생성
├── sitemap.ts                                  # sitemap.xml 동적 생성 (5,000+ URL)
│
├── list/
│   └── page.tsx                                # 포켓몬 도감 리스트 (/list)
│
├── detail/[pokemonId]/
│   ├── opengraph-image.tsx                     # 동적 OG 이미지 생성
│   ├── (form)/                                 # 라우트 그룹: 폼별 상세
│   │   ├── page.tsx                            #   기본 상세 (/detail/:id)
│   │   ├── form/[[...index]]/page.tsx          #   폼체인지 (/detail/:id/form/:index?)
│   │   ├── mega/[[...index]]/page.tsx          #   메가진화 (/detail/:id/mega/:index?)
│   │   ├── region/[[...index]]/page.tsx        #   리전폼 (/detail/:id/region/:index?)
│   │   └── gigantamax/[[...index]]/page.tsx    #   거다이맥스 (/detail/:id/gigantamax)
│   └── moves/                                  # 습득 기술
│       ├── page.tsx                            #   기본 기술 (/detail/:id/moves)
│       ├── form/[[...index]]/page.tsx          #   폼체인지 기술
│       └── region/[[...index]]/page.tsx        #   리전폼 기술
│
├── ability/
│   ├── page.tsx                                # 특성 도감 (/ability)
│   └── [id]/page.tsx                           # 특성 상세 (/ability/:id)
│
├── moves/
│   ├── page.tsx                                # 기술 도감 (/moves)
│   ├── [id]/page.tsx                           # 기술 상세 (/moves/:id)
│   └── [id]/generation/[generationId]/page.tsx # 세대별 기술 (/moves/:id/generation/:gen)
│
├── type-effectiveness/
│   └── page.tsx                                # 타입 상성 계산기 (/type-effectiveness)
│
└── quiz/
    ├── page.tsx                                # 퀴즈 메인 (/quiz)
    ├── silhouette/page.tsx                     # 실루엣 퀴즈
    ├── ability/page.tsx                        # 특성 퀴즈
    ├── pokemon-type/page.tsx                   # 타입 퀴즈
    └── type-effectiveness/page.tsx             # 타입 상성 퀴즈
```

---

## 아키텍처 패턴

### 디바이스 반응형 구조

모바일/데스크톱 레이아웃을 이중 컨테이너 패턴으로 분리합니다:

- `src/container/desktop/` — 데스크톱 전용 컨테이너
- `src/container/mobile/` — 모바일 전용 컨테이너
- `src/views/desktop/` / `src/views/mobile/` — 디바이스별 페이지 뷰
- `DeviceProvider` 컨텍스트에서 서버 사이드 User Agent 기반 기기 감지

```tsx
const { isMobile } = useDevice()
return isMobile ? <MobileComponent /> : <DesktopComponent />
```

### GraphQL 연동

| 항목              | 설명                                                                                        |
| ----------------- | ------------------------------------------------------------------------------------------- |
| 스키마 엔드포인트 | `http://localhost:4000/graphql` (개발) / `https://api.poke-korea.com` (프로덕션)            |
| 원본 파일         | `src/gql/fragment.graphql`, `src/gql/query.graphql`                                         |
| 생성 파일         | `src/graphql/schema.graphql`, `src/graphql/gqlGenerated.ts`, `src/graphql/typeGenerated.ts` |
| Apollo 설정       | `src/module/apolloClient.ts` (SSR/SSG 지원)                                                 |
| 코드 생성 설정    | `codegen.ts`                                                                                |

`src/gql/` 파일 수정 후 반드시 `npm run codegen` 실행하여 타입을 재생성해야 합니다.
`src/graphql/` 내 파일은 자동 생성되므로 직접 수정하지 않습니다.

### 컴포넌트 계층 구조

```text
page.tsx (라우트) → views (페이지 뷰) → container (비즈니스 로직) → components (UI)
```

- **page.tsx**: 라우트 엔트리, 메타데이터 설정, 데이터 패칭
- **views**: 디바이스별 페이지 레이아웃 조합
- **container**: 상태 관리·로직 처리, desktop/mobile 분리
- **components**: 재사용 가능한 순수 UI 컴포넌트

---

## 코딩 컨벤션

### 파일 네이밍

| 유형          | 패턴                                | 예시                    |
| ------------- | ----------------------------------- | ----------------------- |
| 컴포넌트      | `이름.component.tsx`                | `Tag.component.tsx`     |
| 컨테이너      | `이름.container.tsx`                | `List.container.tsx`    |
| 컨텍스트      | `이름.context.tsx`                  | `Device.context.tsx`    |
| 커스텀 훅     | `use이름.ts`                        | `useDebounce.ts`        |
| 타입 정의     | `이름.type.ts` 또는 `이름.types.ts` | `detailContext.type.ts` |
| 모듈          | `이름.module.ts`                    | `metadata.module.ts`    |
| 뷰 (데스크톱) | `이름.desktop.tsx`                  | `Home.desktop.tsx`      |
| 뷰 (모바일)   | `이름.mobile.tsx`                   | `Home.mobile.tsx`       |

### 경로 별칭

- `~/` 접두어로 모든 내부 모듈 import (`tsconfig.json`에서 `src/*`에 매핑)

```tsx
import { useDevice } from '~/context/Device.context'
```

### 스타일링

- Tailwind CSS 유틸리티 클래스 우선 사용
- 전역 스타일: `src/styles/globals.css`
- SVG는 `@svgr/webpack`을 통해 React 컴포넌트로 import
- 커스텀 브레이크포인트: `mobile` (max: 768px), `desktop` (min: 769px)
- 포켓몬 타입별 커스텀 색상: `type-fire`, `type-water` 등 18종 정의
- 프로젝트 색상 체계: `primary-1` ~ `primary-4`, `white-1` ~ `white-3`, `black-1` ~ `black-2`

### 코드 포맷팅 (Prettier)

| 규칙             | 설정값                             |
| ---------------- | ---------------------------------- |
| 세미콜론         | 사용 안 함 (`semi: false`)         |
| 따옴표           | 작은따옴표 (`singleQuote: true`)   |
| JSX 따옴표       | 큰따옴표 (`jsxSingleQuote: false`) |
| 탭 크기          | 2칸 (`tabWidth: 2`)                |
| 줄 길이          | 80자 (`printWidth: 80`)            |
| 후행 쉼표        | 모든 곳 (`trailingComma: all`)     |
| 화살표 함수 괄호 | 항상 (`arrowParens: always`)       |
| 줄 끝            | LF (`endOfLine: lf`)               |

### ESLint 주요 규칙

- TypeScript strict 규칙 적용 (`@typescript-eslint/recommended`)
- React Hooks 규칙 적용 (`react-hooks/rules-of-hooks`: warn)
- 미사용 변수 에러 (`@typescript-eslint/no-unused-vars`: error, `_` 접두어 예외)
- `any` 타입 경고 (`@typescript-eslint/no-explicit-any`: warn)
- import/export 유효성 검사
- Prettier 연동 (`prettier/prettier`: warn)
- 접근성 규칙 (`jsx-a11y/aria-role`)
- `.js`, `.jsx` 파일은 lint 무시 (`ignorePatterns`)

---

## SEO 구성 개요

### 적용 기법

| 기법                     | 설명                                                              | 관련 파일                                            |
| ------------------------ | ----------------------------------------------------------------- | ---------------------------------------------------- |
| Next.js Metadata API     | 각 페이지별 `metadata` export 또는 `generateMetadata()` 동적 생성 | 각 `page.tsx`                                        |
| JSON-LD 구조화 데이터    | WebSite, WebPage, BreadcrumbList, ItemList, FAQPage, Thing 스키마 | `src/constants/*JsonLd.ts` (7개)                     |
| 동적 사이트맵            | GraphQL 데이터 기반 5,000+ URL 동적 생성                          | `src/app/sitemap.ts`                                 |
| Robots 설정              | 환경별 분기 (프로덕션: index/follow, 개발: noindex)               | `src/app/robots.ts`, `src/module/metadata.module.ts` |
| Canonical URL            | 모든 페이지에 Path 기반 canonical URL 설정                        | 각 `page.tsx`                                        |
| OpenGraph / Twitter Card | 모든 주요 페이지에 OG 태그 + Twitter `summary_large_image`        | 각 `page.tsx`                                        |
| 동적 OG 이미지           | 포켓몬 상세 페이지별 개별 OG 이미지 생성                          | `src/app/detail/[pokemonId]/opengraph-image.tsx`     |
| SEO 메타데이터 모듈      | 포켓몬명·타입·능력치 기반 동적 title/description 생성             | `src/module/generateDetailSeoMetaData.ts`            |

### SEO 적용 현황

- **메타데이터 커버리지**: title, description, OG, Twitter Card, canonical — 전 페이지 100%
- **JSON-LD**: 포켓몬 상세(능력치·특성 포함), 특성, 기술, 퀴즈, 타입 상성 등 주요 페이지 적용
- **리다이렉트**: 레거시 쿼리 파라미터 URL → Path 기반 URL 영구 리다이렉트 (`next.config.js`)

---

## Next.js 설정 (`next.config.js`) 주요 항목

| 항목              | 설명                                                                       |
| ----------------- | -------------------------------------------------------------------------- |
| `reactStrictMode` | `true`                                                                     |
| `removeConsole`   | 프로덕션에서 console 제거                                                  |
| `poweredByHeader` | `false` (X-Powered-By 헤더 비활성화)                                       |
| `redirects`       | 레거시 쿼리 파라미터 → Path URL 영구 리다이렉트 (메가진화, 리전폼, 기본폼) |
| `headers`         | 페이지별 Cache-Control 설정 (상세·리스트: 1년 캐시, 홈: SWR)               |
| `webpack`         | SVG → React 컴포넌트 변환, 프로덕션 CSS 분리 최적화, ES2022 타겟           |

---

## 버전 관리 및 릴리즈

### 브랜치 전략

#### 브랜치 네이밍 규칙

```text
feature/{version}
예: feature/1.25.0, feature/1.26.0
```

- 모든 새로운 작업은 `feature/{version}` 형식의 브랜치에서 진행
- 버전 번호는 [Semantic Versioning](https://semver.org/lang/ko/) 준수
  - **Major (X.0.0)**: 대규모 변경, Breaking Changes
  - **Minor (1.X.0)**: 새로운 기능 추가, 하위 호환성 유지
  - **Patch (1.26.X)**: 버그 수정, 소규모 개선
- 브랜치는 사용자가 직접 생성하므로, 새로운 작업 시작 시 브랜치 생성 여부 확인 필요

#### 워크플로우

1. 사용자가 main에서 신규 버전 루트 브랜치 생성 (예: `feature/1.28.0`)
2. 해당 신규 버전의 루트 브랜치에서 작업 브랜치를 생성 (예: `feature/1.28.0-{작업기능명}`)
3. 기능 작업이 완료되면 루트 버전 브랜치를 향하는 PR 생성
   - Base: `feature/1.28.0`
   - Compare: `feature/1.28.0-refactor`
   - PR 제목: `[1.28.0] {작업명}` (예: `[1.28.0] CSS 패턴 추출 및 최적화`)
4. 코드 리뷰 후 루트 브랜치로 머지 (`feature/1.28.0-refactor` → `feature/1.28.0`)
5. 2~4번 작업이 반복되다 해당 버전의 모든 작업이 완료됐을 때 main을 향하는 릴리즈 PR 생성
6. 릴리즈 PR을 통해 배포

### Changelog 관리 (Docusaurus 블로그)

`changelog/` 폴더는 Docusaurus 기반 개발 블로그 프로젝트입니다. 마크다운 파일을 추가하면 자동으로 블로그 포스트가 생성됩니다.

#### 폴더 및 파일 구조

```text
changelog/blog/{version}/{날짜}-{작업기능명}.md
예: changelog/blog/1.28.0/2026-01-02-css-refactor.md
예: changelog/blog/1.34.0/2026-02-15-new-feature.md
```

- **Docusaurus 프로젝트 루트**: `changelog/`
- **블로그 콘텐츠 폴더**: `changelog/blog/`
- **버전 폴더**: `changelog/blog/{version}/` — 신규 버전 루트 브랜치명과 동일
- **작업 파일**: `{YYYY-MM-DD}-{작업기능명}.md` — Docusaurus가 날짜를 자동 파싱
- **작성자 정의**: `changelog/blog/authors.yml`
- **태그 정의**: `changelog/blog/tags.yml`

#### Docusaurus frontmatter 필수 항목

모든 블로그 포스트 파일 최상단에 다음 frontmatter를 포함해야 합니다:

```yaml
---
slug: { 작업기능명 }
title: '{작업 제목}'
description: '{작업 목표를 기반으로 한 80~120자 내외의 요약}'
authors: [jsg3121, claude]
tags: [{ 태그1 }, { 태그2 }]
---
```

- **slug**: URL 경로 (`/{slug}`)
- **description**: 검색 결과 스니펫에 표시될 한 줄 요약 (80~120자, 작업 목표 기반)
- **authors**: `authors.yml`에 정의된 작성자 ID (`jsg3121`, `claude`)
- **tags**: `tags.yml`에 정의된 태그 (`refactoring`, `performance`, `bug-fix`, `seo`, `ux`, `feature`, `feature-improvement`, `docs`, `css`, `nextjs`, `graphql`)

#### truncate 마커

본문 중 목록 페이지에서 보여줄 요약과 상세 내용의 경계에 `<!-- truncate -->` 마커를 삽입합니다. 일반적으로 작업 목표 섹션 아래에 배치합니다.

#### MDX 주의사항

Docusaurus는 MDX를 사용하므로 코드블록 밖에서 다음 문법을 주의해야 합니다:

- `{변수}` → JSX expression으로 해석됨 → 백틱으로 감싸기: `` `{변수}` ``
- `<숫자` → JSX 태그로 해석됨 → `&lt;숫자`로 이스케이프
- `{ key: value }` → 백틱으로 감싸기: `` `{ key: value }` ``

#### 로그 작성 시점

1. **작업 브랜치 생성 시**: 해당 버전 폴더에 작업 파일 생성
2. **주요 변경사항 발생 시**: 실시간으로 로그 업데이트
3. **루트 브랜치 PR 생성 전**: 최종 검토 및 완성

#### 로그 필수 섹션

- 📋 **작업 개요**: 브랜치명, 작업 유형, 작업 기간, 담당자
- 🎯 **작업 목표**: 이 작업의 목적과 해결하려는 문제
- ✨ **주요 변경사항**: 구체적인 변경 내용을 패턴별/기능별로 정리
- 📊 **최적화 결과**: 통계, 감소량, 개선율 등 정량적 지표
- 🔧 **기술적 세부사항**: 수정된 파일, 추가된 코드, 기술 스택
- 📌 **참고 사항**: 주의사항, 특이사항

#### 로그 선택 섹션 (해당 시)

- 🐛 **버그 수정**: 수정된 버그 목록
- 🔍 **SEO 개선**: SEO 관련 변경사항
- 🚀 **성능 개선**: 성능 최적화 결과
- 🎨 **디자인 변경**: UI/UX 변경사항

#### 로그 작성 가이드라인

1. **명확한 제목**: 각 섹션의 제목은 명확하고 구체적으로
2. **코드 예시**: 변경사항은 Before/After 코드 블록으로 명확히 설명
3. **통계 제공**: 정량적 지표 포함 (파일 수, 변경 횟수, 문자 수 감소율 등)
4. **테이블 활용**: 비교 데이터는 마크다운 테이블로 정리

### 새 작업 시작 시 체크리스트

Claude가 새로운 작업 요청을 받았을 때:

1. **브랜치 확인**:

   - 현재 작업 중인 브랜치 형식 확인 (`git branch --show-current`)
   - 루트 브랜치: `feature/{version}` (예: `feature/1.28.0`)
   - 작업 브랜치: `feature/{version}-{작업기능명}` (예: `feature/1.28.0-refactor`)

2. **브랜치 생성 필요 시**: 사용자에게 새 브랜치 생성 여부 확인

   ```text
   "이 작업을 위한 새 feature 브랜치를 생성하시겠습니까?
   예: feature/1.28.0-{작업기능명}"
   ```

3. **Changelog 폴더 확인**:

   - `changelog/blog/{version}/` 폴더 존재 여부 확인
   - 없으면 생성: `mkdir -p changelog/blog/{version}`

4. **Changelog 파일 생성**:

   - 작업 브랜치명에서 작업 기능명 추출
   - `changelog/blog/{version}/{YYYY-MM-DD}-{작업기능명}.md` 파일 생성
   - Docusaurus frontmatter + 템플릿에 따라 초기 구조 작성

5. **로그 실시간 업데이트**:

   - 주요 변경사항 발생 시 해당 changelog 파일 업데이트
   - 통계 정보 업데이트 (파일 수, 변경 횟수, 감소율 등)

6. **작업 완료 시**:
   - Changelog 최종 검토 및 완성
   - MDX 파싱 이슈 없는지 확인 (코드블록 밖 `{}`, `<숫자` 등)

### Changelog 자동화 가이드

#### 작업 시작 시

```bash
# 1. 현재 브랜치 확인
git branch --show-current
# 출력 예: feature/1.28.0-refactor

# 2. 버전 및 작업명 추출
VERSION="1.28.0"
WORK_NAME="refactor"
TODAY=$(date +%Y-%m-%d)

# 3. Changelog 폴더 생성
mkdir -p changelog/blog/${VERSION}

# 4. Changelog 파일 생성
touch changelog/blog/${VERSION}/${TODAY}-${WORK_NAME}.md
```

#### 로그 작성 템플릿

```markdown
---
slug: { 작업기능명 }
title: '{작업 제목}'
description: '{작업 목표를 기반으로 한 80~120자 내외의 요약}'
authors: [jsg3121, claude]
tags: [{ 태그1 }, { 태그2 }]
---

# {작업명}

> **작업 날짜**: YYYY-MM-DD
> **브랜치**: `feature/{version}-{작업기능명}`

## 📋 작업 개요

**작업 유형**: [기능 추가/버그 수정/리팩토링/성능 개선/SEO/디자인]
**담당**: [담당자명 또는 작업 주체]

## 🎯 작업 목표

[이 작업의 목적과 해결하려는 문제를 명확히 기술]

<!-- truncate -->

## ✨ 주요 변경사항

### 변경 1: [변경 항목명]

**변경 전**:
\`\`\`[언어]
// 기존 코드
\`\`\`

**변경 후**:
\`\`\`[언어]
// 새 코드
\`\`\`

## 📊 최적화 결과

| 항목 | 변경 전 | 변경 후 | 개선율 |
| ---- | ------- | ------- | ------ |
| 예시 | 100     | 50      | 50%    |

## 🔧 기술적 세부사항

[상세한 기술 설명]

## 📌 참고 사항

[주의사항, 특이사항]
```

#### 사용 가능한 태그 목록

`changelog/blog/tags.yml`에 정의된 태그만 사용:

| 태그 ID               | 설명         |
| --------------------- | ------------ |
| `refactoring`         | 리팩토링     |
| `performance`         | 성능 최적화  |
| `bug-fix`             | 버그 수정    |
| `seo`                 | SEO 개선     |
| `ux`                  | UX/UI 개선   |
| `feature`             | 신규 기능    |
| `feature-improvement` | 기능 개선    |
| `docs`                | 문서         |
| `css`                 | CSS/스타일링 |
| `nextjs`              | Next.js 관련 |
| `graphql`             | GraphQL 관련 |

새로운 태그가 필요한 경우 `changelog/blog/tags.yml`에 추가 후 사용합니다.

### 참고 문서

- Changelog 예시: [changelog/blog/1.28.0/2026-01-02-css-refactor.md](changelog/blog/1.28.0/2026-01-02-css-refactor.md)
