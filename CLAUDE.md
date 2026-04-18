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
- **CRITICAL**: 문서 작성은 다음 조건에서만 수행하고, 작성 전 반드시 사용자에게 확인을 받을 것:
  - 에이전트(market-intelligence, business-analyst, strategy-planner 등)를 사용한 경우
  - `/biz-strategy`, `/research` 등 분석 스킬을 사용한 경우
  - 사용자가 명시적으로 문서화를 요청한 경우
  - 단순 조사나 질문 답변은 문서로 작성하지 않음
- **IMPORTANT**: 에이전트나 스킬을 사용하기 전에 반드시 어떤 에이전트/스킬을 사용할 것인지, 왜 사용하는지를 먼저 사용자에게 안내할 것. 예: "이 작업은 `market-intelligence` 에이전트를 사용하여 시장 조사를 진행하겠습니다."

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
├── conventions/               # 코딩/워크플로우 규칙
│   └── guides/
│       ├── coding.md          #   코딩 컨벤션 (네이밍, 경로 별칭, 컴포넌트 계층)
│       ├── styling.md         #   스타일링 (Tailwind, 색상 체계, 브레이크포인트)
│       ├── linting.md         #   린팅 (ESLint, Prettier 설정)
│       ├── workflow.md        #   워크플로우 (브랜치 전략, 버전 관리)
│       ├── rendering.md       #   렌더링 (SSR/ISR, Apollo, GraphQL 연동)
│       └── changelog.md       #   Changelog 관리 (Docusaurus 블로그)
├── decisions/                 # ADR (의사결정 기록)
│   ├── template.md            #   ADR 작성 템플릿
│   └── records/               #   ADR 기록
├── specs/                     # 서비스/비즈니스 분석 스펙
│   ├── service-overview.md    #   서비스 현황 (현재 지표 포함)
│   ├── metrics-baseline.md    #   핵심 지표 기준값
│   ├── target-segment.md      #   타겟 사용자 정의
│   └── competitor-map.md      #   경쟁사 목록 및 포지셔닝
├── skills/                    # 커스텀 스킬 (폴더/SKILL.md 구조)
│   ├── create-pr/             #   /create-pr (조건부 검증 포함)
│   ├── lint-check/            #   /lint-check
│   ├── seo-audit/             #   /seo-audit
│   ├── a11y-check/            #   /a11y-check (WCAG 접근성 검사)
│   ├── code-review/           #   /code-review
│   ├── component-builder/     #   /component-builder
│   ├── research/              #   /research (자동 트리거)
│   ├── test-writer/           #   /test-writer (Vitest 단위 테스트)
│   ├── e2e-test/              #   /e2e-test (Playwright E2E 테스트)
│   └── biz-strategy/          #   /biz-strategy (비즈니스 전략 파이프라인, references/ 포함)
├── agents/                    # 에이전트 정의
│   ├── index.md               #   에이전트 목록 및 활용 패턴
│   ├── product-planner.md     #   기획서(SPEC) 작성/관리
│   ├── config-maker.md        #   설정 파일 스키마/옵션/생성 로직
│   ├── seo-specialist.md      #   SEO 설계/구현 (메타태그, JSON-LD, hreflang)
│   ├── ui-publisher.md        #   Astro/Svelte 컴포넌트 구현
│   ├── ux-designer.md         #   사용자 플로우, 레이아웃, 인터랙션 설계
│   ├── qa-agent.md            #   QA 오케스트레이터 (서브에이전트 조율)
│   ├── unit-tester.md         #   Vitest 단위 테스트 실행/분석 (qa-agent 전용)
│   ├── e2e-tester.md          #   Playwright E2E 테스트 실행/분석 (qa-agent 전용)
│   ├── static-analyzer.md     #   ESLint/Prettier/TS 정적 분석 (qa-agent 전용)
│   ├── market-intelligence.md #   시장/경쟁사/트렌드 조사
│   ├── business-analyst.md    #   서비스 경쟁력/포지셔닝 분석
│   └── strategy-planner.md    #   MI+BA 종합 후 전략 방향 도출
├── research/                  # 리서치 보고서 저장
│   └── reports/               #   MI-/BA-/STR- 보고서
├── playwright/                # Playwright 스크린샷/스크립트
│   ├── index.md               #   사용법 및 가이드
│   ├── capture-screenshots.js #   스크린샷 캡처 스크립트
│   └── screenshots/           #   캡처된 스크린샷 (gitignore)
└── analyzer/                  # 분석 데이터/보고서
    └── index.md               #   분석 데이터 가이드
```

### 상세 문서 참조 가이드

| 작업 유형      | 참조할 문서                                                                     |
| -------------- | ------------------------------------------------------------------------------- |
| 코드 작성      | `.claude/conventions/guides/coding.md`, `.claude/conventions/guides/styling.md` |
| 린트/포맷      | `.claude/conventions/guides/linting.md`                                         |
| 브랜치/PR      | `.claude/conventions/guides/workflow.md`                                        |
| Changelog      | `.claude/conventions/guides/changelog.md`                                       |
| 렌더링/API     | `.claude/conventions/guides/rendering.md`                                       |
| 의사결정       | `.claude/decisions/template.md`                                                 |
| 비즈니스 분석  | `.claude/specs/`, `.claude/skills/biz-strategy/`                                |
| 경쟁사 분석    | `.claude/specs/competitor-map.md`                                               |

## 하네스 컨벤션

### 1. Why-First 원칙

규칙만 나열하지 말고 "왜 그런지"를 설명한다. 이유를 이해한 에이전트는 엣지 케이스에서도 올바르게 판단할 수 있다.

### 2. Progressive Disclosure

SKILL.md와 가이드 문서는 500줄 이하로 유지한다. 상세 내용은 `references/`로 분리하여 필요할 때만 로드한다. 이는 컨텍스트 윈도우를 효율적으로 사용하기 위함이다.

### 3. Description 공격적 작성

스킬과 에이전트의 description은 트리거 조건을 넓게 작성한다. Claude가 보수적으로 트리거하는 경향이 있으므로, 이를 보상하기 위해 관련 키워드와 상황을 적극적으로 포함한다.

### 4. index.md 기반 탐색

모든 `.claude/` 하위 폴더에는 `index.md`가 있다. 이 파일은 폴더의 역할, 하위 구조, 주요 문서 목록을 설명한다. 에이전트는 새로운 폴더를 탐색할 때 항상 `index.md`부터 읽는다.

## 에이전트 실행 규칙

### 실행 모드

- **에이전트 팀**: 멤버 간 소통이 필요한 복잡한 작업 (Fan-out/Fan-in, Producer-Reviewer 등)
- **서브 에이전트**: 소통 불필요한 독립 하위 작업 (조사, 분석 등)
- 1단계는 에이전트 팀, 2단계는 서브 에이전트로 구성 가능 (중첩 팀 불가)
- 활용 패턴 상세는 `.claude/agents/index.md` 참조

### 작업 전 확인 사항

1. 이 CLAUDE.md를 읽고 프로젝트 맥락을 파악한다
2. **메모리에서 프로젝트 진행 현황을 확인한다** — 이전 세션에서의 작업 상태, 다음 작업 등을 파악

아래는 **작업 내용과 관련된 경우에만** 참조한다. 매번 전부 읽지 않는다:

- **의사결정 관련** 작업 시: `.claude/decisions/index.md`
- **코드 작성** 작업 시: `.claude/conventions/index.md` (해당 가이드만 선택 로드)
- **비즈니스 분석** 작업 시: `.claude/specs/`, `.claude/skills/biz-strategy/`

### 근거 기반 논의

의사결정이나 기술 논의 시, 반드시 공식 문서나 신뢰도 높은 자료를 근거로 제시한다. 근거 없는 주장이나 추측만으로 의사결정을 유도하지 않는다.

- 기술 비교/추천 시: 공식 문서, 벤치마크, 신뢰할 수 있는 기술 블로그 등의 링크를 함께 제시한다
- ADR 작성 시: 참고 자료(References) 섹션에 근거 링크를 반드시 포함한다
- 컨벤션/가이드라인 작성 시: 해당 규칙의 출처(공식 스타일 가이드, RFC 등)를 명시한다

### 이슈 수정 보고

코드 수정이 필요한 이슈(경고, 에러, 린트 위반 등)를 발견하면 다음 구조로 보고한다. 수정부터 하지 않고 먼저 설명한다.

1. **문제**: 어떤 경고/에러가 발생하는지
2. **원인**: 왜 발생하는지 코드 레벨에서 설명
3. **수정 방안**: 가능한 선택지를 제시하고 각각의 장단점 설명

> **Why:** 단순히 "수정할까요?"만 묻으면 사용자가 맥락을 파악하기 어렵고, 왜 수정이 필요한지 이해 없이 승인하게 된다. 선택지를 제시하면 사용자가 프로젝트 방향에 맞는 판단을 내릴 수 있다.

### 수정 근거 제시

이슈를 파악하고 해결 방법을 제시할 때, 해당 방법을 선택한 **기술적 근거**를 반드시 함께 제시한다. 근거는 반드시 공식 문서, 기술 사양, 또는 검증된 기술 자료를 기반으로 한다.

1. **문제 분석**: 이슈의 원인을 기술적으로 정확하게 파악한다
2. **해결 방법 제시**: 가능한 선택지를 나열한다
3. **근거**: 각 선택지에 대해 공식 문서나 기술 사양을 조사하고, 해당 방법이 적절한 이유를 구체적으로 설명한다. 추측이나 경험적 판단만으로는 부족하다

> **Why:** 기술적 근거 없이 수정하면 잘못된 방향으로 코드가 변경될 수 있다. 공식 문서 기반의 근거를 제시하면 사용자가 해결 방법의 정확성을 검증할 수 있고, 유사한 문제 발생 시 참고 자료로 활용할 수 있다.

### 의사결정 기록

새로운 기술적 의사결정이 발생하면 ADR로 기록한다. `.claude/decisions/template.md`를 기반으로 작성하며, 반드시 참고 자료(공식 문서, 신뢰할 수 있는 블로그 등) 링크를 포함한다.

### 지침 변경 관리

개발 진행이나 논의 과정에서 기존에 명시된 지침, 규칙, 계획과 어긋나는 상황이 발생할 수 있다. 이 경우 다음 절차를 따른다.

1. **기존 지침 확인**: 변경하려는 영역의 관련 ADR, 컨벤션, 가이드라인을 먼저 읽고 현재 규칙이 무엇인지 파악한다
2. **충돌 지점 명시**: 기존 지침의 어떤 부분이 현재 상황과 맞지 않는지 구체적으로 식별한다
3. **변경 논의**: 왜 변경이 필요한지 근거를 제시하고, 사용자와 합의한다
4. **ADR 기록**: 변경 사항을 새로운 ADR로 작성한다. 기존 ADR을 대체하는 경우, 기존 ADR의 상태를 `대체됨`으로 변경하고 새 ADR 번호를 명시한다
5. **관련 문서 동기화**: 변경이 반영되어야 하는 모든 문서(CLAUDE.md, 컨벤션, 가이드라인 등)를 함께 업데이트한다

### 지침 저장 우선순위

새로운 지침이나 규칙이 생길 때, 저장 위치의 우선순위를 따른다.

1. **하네스 문서 먼저**: 코딩 규칙은 `conventions/`, 워크플로우는 `workflow.md` 등 해당 하네스 문서에 먼저 추가한다
2. **메모리는 보조**: 하네스에 저장할 수 없는 정보(사용자 선호, 외부 참조, 프로젝트 진행 맥락 등)만 메모리에 저장한다. 사용자 확인 후 저장한다
3. **중복 금지**: 하네스에 이미 있는 내용을 메모리에 중복 저장하지 않는다

> **Why:** 하네스 문서는 코드와 함께 버전 관리되고, 모든 세션에서 자동으로 로드된다. 메모리는 보조 수단이며, 하네스가 권위 있는 원본(single source of truth)이다.
