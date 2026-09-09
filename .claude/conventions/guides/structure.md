# 폴더 구조 가이드

파일을 **어느 폴더에 두는가**를 규정한다. 파일 안의 규칙(네이밍 접미사, 계층별 책임)은 `coding.md`가 담당한다.

이 저장소는 두 개의 트리를 갖는다. 분류 축이 다르므로 규칙도 나눈다.

| 트리       | 분류 축           | 질문                                    |
| ---------- | ----------------- | --------------------------------------- |
| `src/`     | **계층 + 도메인** | 이 파일은 무엇을 하고, 어디서 쓰이는가? |
| `.claude/` | **목적**          | 이 문서는 왜 존재하는가?                |

---

## 배치 규칙 — 사용 도메인 수로 결정한다

이 문서에서 **도메인**은 하나의 기능 영역을 뜻한다. 대체로 페이지 단위와 일치한다 — `champions`, `detail`, `list`, `ability`, `moves`, `quiz`, `home`, `typeEffectiveness`.

배치는 **그 코드를 쓰는 도메인이 몇 개인가**로 정한다. 이 규칙 하나가 `components`·`modules`·`hooks`·`utils`에 똑같이 적용된다.

| 사용 범위            | 위치                                                             |
| -------------------- | ---------------------------------------------------------------- |
| 한 컴포넌트에서만    | 그 파일 안에 둔다 (분리하지 않는다)                              |
| 한 도메인 안 여러 곳 | `<도메인>/shared/`                                               |
| **2개 이상 도메인**  | 전역 폴더 (`components/common/`, `modules/`, `hooks/`, `utils/`) |

```text
src/components/
├── common/                    # 2개 이상 도메인이 쓰는 것
│   └── Image.component.tsx    #   실제 12개 도메인에서 사용
├── champions/
│   ├── shared/                # champions 안에서만 공용
│   └── ChampionsCard.component.tsx
└── button/                    # DS 원자 — 도메인 무관
```

> **Why:** "공용 같으니 전역에 두자"는 판단은 사람마다 갈리고, 시간이 지나면 전역 폴더가 분류 실패한 파일의 보관함이 된다. 사용처 개수는 세면 되는 값이라 판정이 흔들리지 않는다. 실제로 `Portal`·`RadioGroup`은 `components/` 루트에 있었지만 사용처가 `filter/` 하나뿐이었다 — 규칙을 적용하면 `filter/` 안으로 들어간다.

**승격은 실적으로 한다.** 두 번째 도메인이 실제로 쓰기 시작할 때 전역으로 올린다. "나중에 쓸 것 같아서" 미리 올리지 않는다.

---

## 공통 원칙

### 폴더명

- **최상위 도메인 폴더는 복수형** — `components/`, `containers/`, `modules/`, `hooks/`, `utils/`, `views/`
- **DS 원자 폴더는 단수** — `button/`, `chip/`, `tag/` (폴더 하나가 컴포넌트 하나를 담는다)
- **하이픈을 쓰고 점(`.`)을 쓰지 않는다** — `shiny-rate/` (O), `shinyRate.modal/` (X)

> **Why 점 금지:** 점 표기는 파일명 접미사 규칙(`Tag.component.tsx`)과 충돌해, 폴더에서 점을 보면 접미사인지 계층 구분인지 알 수 없다.

### 중첩은 3단계까지

`components/<도메인>/shared/`까지가 상한이다. 더 깊어지면 도메인 분리를 잘못한 것이다.

> **Why:** 깊은 중첩은 import 경로를 길게 만들고 파일 이동 시 연쇄 수정을 부른다. 실제로 `components/detail.summary/summary.shinyRate/shinyRate.modal/modal.footer/`(4단계)가 만들어져 있고, 폴더명이 부모를 반복하는 형태로 길어졌다.

### 같은 이름의 컴포넌트를 두지 않는다

경로만 다르고 이름이 같으면 import에서 구분되지 않아 잘못 가져다 쓴다.

> **Why:** `components/Tag.component.tsx`와 `components/tag/Tag.component.tsx`가 동시에 존재하고 전자를 2곳·후자를 20곳이 쓰는 상태가 실재한다. 둘 다 `TagComponent`로 import되므로 경로를 봐야만 어느 쪽인지 알 수 있다.

---

## `src/` 구조

### 최상위 폴더

| 폴더                  | 역할                                       |
| --------------------- | ------------------------------------------ |
| `app/`                | 라우트 (Next.js App Router 규약)           |
| `views/`              | 페이지 조립 — 그 페이지의 화면 전체를 구성 |
| `containers/`         | 비즈니스 로직 — 상태·컨텍스트를 다룬다     |
| `components/`         | 재사용 UI — props 기반                     |
| `context/`            | React Context                              |
| `hooks/`              | 커스텀 훅                                  |
| `modules/`            | API 연동·비즈니스 로직                     |
| `utils/`              | 단순 계산·포맷 헬퍼                        |
| `constants/`          | 정적 데이터                                |
| `types/`              | 공유 타입                                  |
| `graphql/`            | GraphQL 원본(`.graphql`) + codegen 생성물  |
| `assets/` · `styles/` | SVG 원본, 전역 CSS                         |

### 계층별 책임

```text
layout.tsx  →  page.tsx  →  views  →  containers  →  components
   크롬          라우트 계약    조립        로직          UI
```

| 계층          | 책임                                             | 하지 않는 것          |
| ------------- | ------------------------------------------------ | --------------------- |
| `layout.tsx`  | 헤더·푸터·탭바 등 **크롬**, Providers            | 페이지별 내용         |
| `page.tsx`    | **라우트 계약** — 메타데이터, 서버 패칭, JSON-LD | 크롬 조립, UI 렌더    |
| `views/`      | **페이지 조립** — 화면 구성                      | 서버 패칭, 메타데이터 |
| `containers/` | 비즈니스 로직, 상태 관리                         | 서버 패칭             |
| `components/` | props 기반 순수 UI                               | 비즈니스 로직         |

> **Why 크롬을 layout에 두는가:** 크롬을 `page.tsx`가 조립하면 라우트마다 같은 코드가 복제된다. 실제로 헤더·푸터·탭바 import가 **29개 `page.tsx`에 반복**돼 있어, 크롬을 한 번 바꾸면 29곳을 고쳐야 한다. App Router의 `layout.tsx`는 이 목적의 계층이며, 라우트 전환 시 재렌더되지 않는 이점도 있다.

### 계층 참조 규칙

- **상위는 모든 하위를 참조할 수 있다.** 깊이는 상관없다 — `views`가 `containers`를 건너뛰고 `components`를 직접 써도 된다.
- **하위는 상위를 참조할 수 없다.** `components`는 `containers`를 import하지 않는다.

> **Why:** 컴포넌트는 재사용 가능한 최소 단위이고, 이것이 모여 컨테이너가, 컨테이너가 모여 뷰가 된다. 단방향 참조를 지키면 하위 컴포넌트를 어느 맥락에나 가져다 쓸 수 있다. 반대로 "views는 반드시 containers를 거쳐야 한다"고 강제하면, 로직 없이 UI만 있는 페이지에 의미 없는 컨테이너를 만들게 된다(예: 약관 페이지).

### 도메인끼리 직접 참조하지 않는다

같은 계층의 도메인 폴더는 서로를 import하지 않는다. `champions/`가 `detail/`을 참조하는 식은 금지한다.

두 도메인이 같은 코드를 필요로 한다면 **참조가 아니라 승격으로 해결한다** — 위의 배치 규칙대로 전역(`components/common/`, `modules/`, `utils/`)으로 올린 뒤 양쪽이 그것을 쓴다.

```text
❌ containers/home/  →  components/champions/ChampionsTopCard
✅ components/common/TopCard  ←  containers/home, containers/champions
```

> **Why:** 도메인 간 직접 참조를 허용하면 의존이 그물처럼 얽혀, 한 도메인을 수정할 때 영향 범위를 예측할 수 없다. 승격을 강제하면 "2개 이상이 쓰는 코드는 전역에 있다"는 상태가 유지돼, 전역 폴더만 봐도 공용 자산을 파악할 수 있다. 이 규칙은 배치 규칙(사용 도메인 수)의 자연스러운 귀결이다 — 두 도메인이 쓰는 순간 이미 전역 대상이므로, 직접 참조는 승격을 건너뛴 상태를 뜻한다.

**예외: 페이지 성격의 조립.** `views/`와 `app/`은 여러 도메인을 조합하는 것이 본래 역할이므로 이 규칙을 적용하지 않는다.

### `modules/`와 `utils/`의 구분

| 폴더       | 기준                       | 예시                                            |
| ---------- | -------------------------- | ----------------------------------------------- |
| `modules/` | **API 연동·비즈니스 로직** | Apollo 클라이언트, 타입 상성 계산, 폼 경로 조립 |
| `utils/`   | **단순 계산·포맷**         | 숫자 자릿수 맞추기, 정규식 치환, 문자열 가공    |

판단이 어려우면 "이 함수가 서비스의 규칙을 알아야 하는가"를 묻는다. 알아야 하면 `modules/`다.

### GraphQL

원본과 생성물을 `graphql/` 한 폴더에서 관리한다. 생성물(`gqlGenerated.ts`, `typeGenerated.ts`, `schema.graphql`)은 **직접 수정하지 않는다.** 원본 수정 후 `npm run codegen`을 실행한다.

### 디바이스별 분리를 새로 만들지 않는다

`containers/desktop/`·`containers/mobile/`처럼 디바이스로 나눈 폴더는 UA 분기 시대의 잔재이며 점진 제거 대상이다([ADR-0007](../../decisions/records/ADR-0007-responsive-rendering-strategy.md)).

신규 코드는 도메인 폴더에 단일 컴포넌트로 두고, 폭 대응은 CSS(`desktop:`)로 처리한다.

---

## `.claude/` 구조

### 폴더별 역할

| 폴더           | 역할                 | 산출물                              |
| -------------- | -------------------- | ----------------------------------- |
| `conventions/` | 코딩·워크플로우 규칙 | `guides/*.md`                       |
| `decisions/`   | 의사결정 기록(ADR)   | `records/ADR-NNNN-*.md`             |
| `specs/`       | 기획서·계획서        | 아래 분류 참조                      |
| `research/`    | 조사 보고서          | 유형별 폴더                         |
| `agents/`      | 에이전트 정의        | `<name>.md`                         |
| `skills/`      | 스킬 정의            | `<name>/SKILL.md` (+ `references/`) |
| `hooks/`       | 자동 가드 스크립트   | `*.sh`                              |
| `analyzer/`    | 분석 데이터·스크립트 | `scripts/`, 데이터 폴더             |
| `playwright/`  | 캡처 도구            | `capture.js`, `screenshots/`        |

### 모든 폴더에 `index.md`를 둔다

각 폴더의 역할·하위 구조·주요 문서 목록을 서술한다. 에이전트는 새 폴더를 탐색할 때 `index.md`부터 읽는다.

예외는 `hooks/`다 — 셸 스크립트만 있고 각 파일 상단 주석이 그 역할을 한다.

### `specs/` 하위 분류

| 폴더         | 담는 것                                  |
| ------------ | ---------------------------------------- |
| `service/`   | 서비스 현황·지표·타겟·경쟁사 (지속 갱신) |
| `features/`  | 기능별 기획서(SPEC)                      |
| `plans/`     | 실행 계획서 (완료 후에도 근거로 남긴다)  |
| `incidents/` | 장애·사고 기록                           |

> **Why:** 분류 없이 쌓으면 "지속 갱신되는 현황"과 "완료된 일회성 계획"이 섞여, 어느 것이 현재 유효한지 알 수 없다.

### `research/` 하위 분류

스킬과 같은 방식으로 **유형별 폴더**를 둔다. 중간에 `reports/` 같은 단일 폴더를 끼우지 않는다.

| 폴더        | 담는 것                                 |
| ----------- | --------------------------------------- |
| `market/`   | 시장·경쟁사 조사 (market-intelligence)  |
| `business/` | 경쟁력·포지셔닝 분석 (business-analyst) |
| `strategy/` | 전략·실행 우선순위 (strategy-planner)   |
| `ux/`       | UX 설계·디자인 비평                     |
| `tech/`     | 기술 리서치                             |
| `seo/`      | SEO 감사                                |

**파일명은 `YYYY-MM-DD-<주제>.md`로 통일한다.** 순번(`-001`)은 다음 번호를 알려면 전체 목록을 봐야 하고, 두 세션이 같은 번호를 쓸 수 있다.

### 시안 HTML은 `.claude/`에 두지 않는다

UI 시안은 `public/preview/`에 둔다. `.claude/` 하위 `.html` 생성은 훅(`block-claude-html.sh`)이 차단한다.

> **Why:** `.claude/`는 문서와 도구를 담는 곳이고, 시안은 브라우저로 열어 확인하는 산출물이다. `public/`에 있어야 개발 서버로 바로 열린다.

---

## 요약

| 상황                             | 배치                              |
| -------------------------------- | --------------------------------- |
| 한 컴포넌트에서만 쓰는 하위 요소 | 같은 파일 안                      |
| 한 도메인 안에서 공용            | `<도메인>/shared/`                |
| 2개 이상 도메인에서 공용 (UI)    | `components/common/`              |
| 2개 이상 도메인에서 공용 (로직)  | `modules/` 또는 `utils/`          |
| 다른 도메인의 코드가 필요할 때   | 직접 참조 금지 — 전역으로 승격    |
| 도메인 무관 DS 원자              | `components/<원자명>/`            |
| 헤더·푸터·탭바                   | `app/layout.tsx`                  |
| 기능 기획서                      | `specs/features/`                 |
| 실행 계획서                      | `specs/plans/`                    |
| 조사 보고서                      | `research/<유형>/YYYY-MM-DD-*.md` |
| UI 시안 HTML                     | `public/preview/`                 |
