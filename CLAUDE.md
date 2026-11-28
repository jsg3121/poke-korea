# CLAUDE.md

이 파일은 Claude Code(claude.ai/code)가 본 저장소의 코드를 다룰 때 참고하는 지침 문서입니다.
상세 규칙은 `.claude/` 하위 문서에서 관리합니다. 이 파일에는 핵심 요약만 둡니다.

---

## 응답 규칙

### 작업을 시작하기 전

- **브랜치 확인이 최우선.** `main`에서는 **어떠한 파일 수정·생성·삭제도 하지 않는다** — 문서·코드·changelog·설정 모두 예외 없다. 작업 요청을 받으면 가장 먼저 `git branch --show-current`를 실행하고, `main`이면 새 브랜치 생성을 제안한 뒤 분기 완료 후에만 시작한다.
  - "진행해줘" 같은 일반 승인은 main 직접 작업 승인이 **아니다**. "main에서 그대로 작업"이라는 명시적 지시가 없는 한 분기를 우선한다.
  - 브랜치 네이밍·버전 결정은 `.claude/conventions/guides/workflow.md`가 권위 원본이다.
- **에이전트·스킬을 호출하기 전에 해당 정의 문서(`.claude/agents/*.md`, `.claude/skills/*/SKILL.md`)를 `Read`로 확인**하고 그 규칙대로 프롬프트를 작성한다.
  - "이전에 써봐서 안다"는 이유로 건너뛰지 않는다 — 세션이 바뀌면 그 기억은 없고, **정의 문서가 유일한 권위 원본**이다. 짧은 description만으로는 산출물 저장 경로를 알 수 없다.
  - 프롬프트에 저장 경로·파일명·출력 형식을 **임의로 지정하지 않는다.** 에이전트가 이미 가진 올바른 기본값을 잘못된 값으로 덮어쓸 수 있다. 경로 지정이 필요하면 정의 문서에 규정된 값을 그대로 인용한다.
- **어떤 에이전트/스킬을 왜 사용할지 먼저 안내**한 뒤 호출한다. 예: "이 작업은 `market-intelligence` 에이전트로 시장 조사를 진행하겠습니다."

### 답변 방식

- 답변은 항상 **한국어**를 최우선으로 사용한다. 무게·거리·통화 기준도 한국 기준을 우선 적용한다.
- 코드 수정 요청에는 **먼저 수정 방안을 제안**하고, 이어지는 요청에서 코드를 직접 작성해달라고 할 때만 수정한다.
- **복잡한 기능은 단계를 나누어 진행**하고 각 단계마다 확인을 받는다. 한 번에 여러 파일을 수정하지 않는다.

### 코드를 작성할 때

- `.eslintrc`, `.prettierrc` 설정에 맞춰 작성한다.
- 해당 기능이 동작하는 **최소한의 구현**을 한다.
- 이슈 발생 가능성을 검토하되, **개선이 필요한 부분은 답변으로만 명시**하고 임의로 고치지 않는다.
- 코드 작업 완료 후에는 **반드시 해당 버전의 changelog를 작성**한다. changelog 없이 작업 완료를 보고하지 않는다.

### 문서를 작성할 때

다음 경우에만 작성하고, **작성 전 사용자 확인을 받는다.**

- 에이전트(market-intelligence, business-analyst 등)를 사용한 경우
- `/biz-strategy`, `/research` 등 분석 스킬을 사용한 경우
- 사용자가 명시적으로 문서화를 요청한 경우

단순 조사나 질문 답변은 문서로 만들지 않는다.

---

## 개발 명령어

| 명령어                 | 설명                                                                         |
| ---------------------- | ---------------------------------------------------------------------------- |
| `npm run dev`          | 개발 서버 실행 (`http://localhost:3000`) — **사용자가 직접 실행한다**        |
| `npm run build`        | 프로덕션 빌드                                                                |
| `npm run start`        | 프로덕션 서버 실행                                                           |
| `npm run start:local`  | 로컬에서 빌드 후 프로덕션 서버 실행                                          |
| `npm run lint`         | ESLint 코드 품질 검사 (`lint:fix`로 자동 수정)                               |
| `npm run format:check` | Prettier 포맷 검사 (`format`으로 자동 정리)                                  |
| `npm run codegen`      | GraphQL 스키마로부터 TypeScript 타입 생성 (localhost:4000/graphql 서버 필요) |
| `npm run test:e2e`     | `e2e/`의 Playwright spec 실행 — spec은 `/e2e-check`가 매번 작성 후 삭제      |
| `npm run storybook`    | Storybook 실행 (컴포넌트 카탈로그)                                           |
| `npm run analyze`      | 번들 크기 분석 (ANALYZE=true 빌드)                                           |
| `npm run build:docs`   | changelog(Docusaurus) 빌드                                                   |

> **주의:** 개발 서버가 떠 있을 때 `npm run build`를 실행하지 않는다. `.next` 디렉터리를 공유해 실행 중인 dev 서버가 죽는다.

---

## 기술 스택

**버전은 `package.json`이 권위 원본이다.** 여기에는 무엇을 쓰는지만 적는다 — 버전을 옮겨 적으면 업그레이드 때 어긋난다.

| 영역          | 기술                             |
| ------------- | -------------------------------- |
| 프레임워크    | Next.js (App Router)             |
| 언어          | TypeScript (strict 모드)         |
| UI 라이브러리 | React                            |
| 스타일링      | Tailwind CSS                     |
| 데이터 페칭   | Apollo Client + GraphQL          |
| 차트          | Chart.js + react-chartjs-2       |
| 상태 관리     | React Context API + Immer        |
| SVG 처리      | @svgr/webpack                    |
| 코드 생성     | GraphQL Code Generator           |
| 디자인 시스템 | Storybook                        |
| CSS 최적화    | PostCSS + Autoprefixer + cssnano |
| 프로세스 관리 | PM2 (ecosystem.config.js)        |

### 브라우저 지원 범위

- **프로덕션**: Chrome ≥114, Edge ≥114, Firefox ≥115, Safari ≥15.4, iOS ≥15.4, Samsung ≥17
- **개발**: 각 브라우저 최신 1개 버전

---

## 폴더 구조

**`.claude/conventions/guides/structure.md`가 권위 원본이다** — `src/` 계층·도메인 배치와 `.claude/` 하네스 구조를 모두 담는다. 폴더를 새로 만들거나 파일 위치를 고민할 때 이 문서를 읽는다.

핵심만 옮기면:

```text
layout.tsx  →  page.tsx  →  views  →  container  →  components
   크롬        라우트 계약    조립        로직          UI
```

상위는 모든 하위를 참조할 수 있고, 하위는 상위를 참조하지 않는다.

`.claude/`는 기획·의사결정·컨벤션·스킬·에이전트의 중심 허브다. **각 폴더의 `index.md`가 그 폴더의 권위 원본**이므로, 폴더에 진입할 때 `index.md`를 먼저 읽는다.

### 상세 문서 참조 가이드

| 작업 유형     | 참조할 문서                                                                     |
| ------------- | ------------------------------------------------------------------------------- |
| 폴더 배치     | `.claude/conventions/guides/structure.md`                                       |
| 이름 짓기     | `.claude/conventions/guides/naming.md`                                          |
| 코드 작성     | `.claude/conventions/guides/coding.md`, `.claude/conventions/guides/styling.md` |
| 주석 작성     | `.claude/conventions/guides/comments.md`                                        |
| 린트          | `.claude/conventions/guides/linting.md`                                         |
| 포맷          | `.claude/conventions/guides/formatting.md`                                      |
| E2E 테스트    | `.claude/conventions/guides/testing.md`, `/e2e-check` 스킬                      |
| 브랜치/PR     | `.claude/conventions/guides/workflow.md`                                        |
| Changelog     | `.claude/conventions/guides/changelog.md`                                       |
| 캐시/빌드설정 | `.claude/conventions/guides/nextjs.md`                                          |
| 구조 결정     | `.claude/decisions/architecture.md` (현재 상태), `.claude/decisions/index.md` (기록 방법) |
| 비즈니스 분석 | `.claude/specs/`, `.claude/skills/biz-strategy/`                                |
| 경쟁사 분석   | `.claude/specs/service/competitor-map.md`                                       |
| SEO 검사      | `/seo-audit` 스킬, `.claude/skills/seo-audit/`                                  |
| 지표 분석     | `/metrics-analysis` 스킬 (항상 그 시점에 조회, 문서 수치 인용 금지)             |
| 조회 스크립트 | `.claude/analyzer/index.md` (GA4·Search Console·애드센스·BigQuery API)          |
| SEO 설계/구현 | `seo-specialist` 에이전트, `.claude/agents/seo-specialist.md`                   |

## 하네스 컨벤션

### 1. Why-First 원칙

규칙만 나열하지 말고 "왜 그런지"를 설명한다. 이유를 이해한 에이전트는 엣지 케이스에서도 올바르게 판단할 수 있다.

이 원칙은 **`.claude/` 하네스 문서에만 적용**한다. `src/` 코드 주석은 `.claude/conventions/guides/comments.md`를 따른다 — 설계 근거는 `architecture.md`·SPEC·PR·changelog가 담당하므로 코드에 중복 기록하지 않는다.

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
2. **진행 현황은 GitHub에서 확인한다** — 남은 작업은 `gh issue list`, 진행 중인 작업은 `gh pr list`와 `git branch`로 파악한다. 기획서·계획서의 `상태`·체크박스는 근거로 쓰지 않는다(`.claude/specs/index.md`)

아래는 **작업 내용과 관련된 경우에만** 참조한다. 매번 전부 읽지 않는다:

- **구조 결정 관련** 작업 시: `.claude/decisions/architecture.md`, `.claude/decisions/index.md`
- **코드 작성** 작업 시: `.claude/conventions/index.md` (해당 가이드만 선택 로드)
- **비즈니스 분석** 작업 시: `.claude/specs/`, `.claude/skills/biz-strategy/`

### 근거 기반 논의

기술 비교·추천, 의사결정, 이슈 수정 방안에는 공식 문서·기술 사양·신뢰도 높은 기술 자료를 근거로 제시하고 링크를 붙인다. 추측이나 경험적 판단만으로 결정을 유도하지 않는다. 컨벤션·가이드라인을 쓸 때는 규칙의 출처(공식 스타일 가이드, RFC 등)를 명시한다.

> **Why:** 근거 없이 정하면 잘못된 방향으로 코드가 바뀔 수 있다. 근거 링크가 있으면 사용자가 정확성을 검증할 수 있고, 비슷한 문제가 생겼을 때 다시 참고할 수 있다.

### 이슈 수정 보고

코드 수정이 필요한 이슈(경고, 에러, 린트 위반 등)를 발견하면 고치기 전에 다음 구조로 보고한다.

1. **문제**: 어떤 경고/에러가 발생하는지
2. **원인**: 왜 발생하는지 코드 레벨에서 설명
3. **수정 방안**: 가능한 선택지와 각각의 장단점, 선택지별 근거

> **Why:** 단순히 "수정할까요?"만 물으면 사용자가 맥락을 파악하기 어렵고, 왜 수정이 필요한지 이해 없이 승인하게 된다. 선택지를 제시하면 사용자가 프로젝트 방향에 맞는 판단을 내릴 수 있다.

### 구조 결정 기록

지금 유효한 구조 결정은 `.claude/decisions/architecture.md` 한 곳에만 둔다. 구조 결정이 바뀌면 그 작업 PR에서 이 문서를 현재 상태로 고치고, 검토한 대안·기각 사유는 PR 본문에 남긴다. 기록 방법과 지침 변경 절차는 `.claude/decisions/index.md`가 원본이다.

구조 결정에서 해결 후보 2개 이상 비교, 트레이드오프, 검토 후 기각이 나오면 논의가 끝나기를 기다리지 말고 그 시점에 후보와 기각 사유를 정리해 사용자에게 보여준다. 이 정리가 PR 본문의 "검토한 대안"이 된다.

### 지침 저장 우선순위

새로운 지침이나 규칙이 생길 때, 저장 위치의 우선순위를 따른다.

1. **하네스 문서 먼저**: 코딩 규칙은 `conventions/`, 워크플로우는 `workflow.md` 등 해당 하네스 문서에 먼저 추가한다
2. **메모리는 보조**: 하네스에 저장할 수 없는 정보(사용자 선호, 외부 참조, 프로젝트 진행 맥락 등)만 메모리에 저장한다. 사용자 확인 후 저장한다
3. **중복 금지**: 하네스에 이미 있는 내용을 메모리에 중복 저장하지 않는다

> **Why:** 하네스 문서는 코드와 함께 버전 관리되고, 모든 세션에서 자동으로 로드된다. 메모리는 보조 수단이며, 하네스가 권위 있는 원본(single source of truth)이다.
