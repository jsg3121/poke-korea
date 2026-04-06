# CLAUDE.md

이 파일은 Claude Code(claude.ai/code)가 본 저장소의 코드를 다룰 때 참고하는 지침 문서입니다.
상세 규칙은 `.claude/` 하위 문서에서 관리합니다. 이 파일에는 핵심 요약만 둡니다.

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

## 프로젝트 폴더 구조 (요약)

```text
poke-korea/
├── public/                 # 정적 자산 (폰트, 아이콘, 이미지, 타입 SVG)
├── changelog/              # Docusaurus 개발 블로그 (별도 빌드)
├── src/
│   ├── app/                # Next.js App Router 페이지 (라우트)
│   ├── assets/             # SVG 컴포넌트용 원본 자산
│   ├── components/         # 공유 UI 컴포넌트
│   ├── constants/          # 상수 정의 (JSON-LD, SEO, AdSense, 퀴즈)
│   ├── container/          # 컨테이너 컴포넌트 (desktop/mobile 분리)
│   ├── context/            # React Context (10개)
│   ├── gql/                # GraphQL 원본 파일 (수정 후 codegen 필수)
│   ├── graphql/            # GraphQL 코드 생성 결과 (자동 생성, 직접 수정 금지)
│   ├── hook/               # 커스텀 React 훅 (14개)
│   ├── module/             # 유틸리티 모듈 (19개)
│   ├── styles/             # 전역 스타일
│   ├── types/              # TypeScript 타입 정의
│   ├── utils/              # 유틸리티 함수
│   └── views/              # 페이지 뷰 컴포넌트 (desktop/mobile 분리)
└── .claude/                # 하네스 중심 허브 (아래 참조)
```

### 컴포넌트 계층 구조

```text
page.tsx (라우트) → views (페이지 뷰) → container (비즈니스 로직) → components (UI)
```

---

## .claude/ 하네스 구조

`.claude/` 디렉토리가 기획, 의사결정, 컨벤션, 스킬, 에이전트의 중심 허브입니다.
각 폴더에 `index.md`가 있어 진입 시 먼저 읽으면 됩니다.

```text
.claude/
├── settings.json              # Claude Code 권한 설정 (프로젝트 공유용)
├── settings.local.json        # 로컬 권한 오버라이드
├── hooks/                     # Hook 스크립트
│   ├── post-edit-format.sh    #   파일 수정 후 자동 prettier 포맷팅
│   ├── pre-bash-guard.sh      #   위험 명령어 차단
│   ├── stop-changelog-check.sh #  작업 완료 시 changelog 검증
│   └── notify.sh              #   작업 대기 알림
├── conventions/               # 코딩/워크플로우 규칙
│   └── guides/
│       ├── coding.md          #   코딩 컨벤션 (네이밍, 경로 별칭, 컴포넌트 계층)
│       ├── styling.md         #   스타일링 (Tailwind, 색상 체계, 브레이크포인트)
│       ├── linting.md         #   린팅 (ESLint, Prettier 설정)
│       ├── workflow.md        #   워크플로우 (브랜치 전략, 버전 관리)
│       ├── rendering.md       #   렌더링 (SSR/ISR, Apollo, GraphQL 연동)
│       └── changelog.md       #   Changelog 관리 (Docusaurus 블로그)
├── seo/
│   └── guides/
│       └── seo.md             #   SEO 구성 (메타태그, JSON-LD, 사이트맵)
├── decisions/                 # ADR (의사결정 기록)
│   ├── template.md            #   ADR 작성 템플릿
│   └── records/               #   ADR 기록
├── skills/                    # 커스텀 스킬 (슬래시 커맨드)
│   ├── create-branch.md       #   /create-branch
│   ├── create-pr.md           #   /create-pr
│   ├── review-pr.md           #   /review-pr
│   ├── reply-review.md        #   /reply-review
│   ├── lint-check.md          #   /lint-check
│   ├── seo-audit.md           #   /seo-audit
│   ├── code-review.md         #   /code-review
│   ├── component-builder.md   #   /component-builder
│   └── research.md            #   /research (자동 트리거)
└── agents/                    # 에이전트 정의
    ├── seo-specialist.md      #   SEO 전문가
    ├── ui-publisher.md        #   UI 구현 전문가
    └── graphql-specialist.md  #   GraphQL 전문가
```

### 상세 문서 참조 가이드

| 작업 유형 | 참조할 문서 |
| --------- | ----------- |
| 코드 작성 | `.claude/conventions/guides/coding.md`, `.claude/conventions/guides/styling.md` |
| 린트/포맷 | `.claude/conventions/guides/linting.md` |
| 브랜치/PR | `.claude/conventions/guides/workflow.md` |
| SEO 작업  | `.claude/seo/guides/seo.md` |
| Changelog | `.claude/conventions/guides/changelog.md` |
| 렌더링/API | `.claude/conventions/guides/rendering.md` |
| 의사결정  | `.claude/decisions/template.md` |
