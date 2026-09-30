---
slug: convention-overhaul
title: '컨벤션 전면 개편 — 지침과 코드의 어긋남을 실측으로 좁히다'
description: '지침이 규정하는 구조와 실제 코드가 어긋나 있었습니다. 가이드 6개를 10개로 재편하고 ADR 5건으로 배치·네이밍·타입·정렬·브레이크포인트 기준을 실측 근거 위에 다시 세웠습니다.'
authors: [jsg3121, claude]
tags: [docs, refactoring, css, nextjs]
---

# 컨벤션 전면 개편 (Phase 0: 문서)

> **작업 날짜**: 2026-09-17
> **브랜치**: `feature/1.61.0-conventions`

## 📋 작업 개요

**작업 유형**: 문서 개편 (컨벤션 재정의 + ADR 기록)
**담당**: jsg3121, claude

`.claude/conventions/guides/`의 가이드 6개를 10개로 재편하고, 그 과정에서 갈린 판단을 ADR-0016~0020으로 기록했다. 코드 변경은 포함하지 않는다.

## 🎯 작업 목표

지침을 **"코드를 읽고 쓸 때 실제로 참조할 수 있는 기준"**으로 되돌린다.

기존 가이드는 설정 파일을 표로 옮겨 적거나, 이미 폐기된 구조를 여전히 규정하고 있었다. 지침을 믿고 따르면 틀린 코드가 나오는 상태였다. 규칙 하나하나를 **실제 코드에서 개수를 세어** 검증하고, 사실과 어긋난 것은 고치거나 지웠다.

<!-- truncate -->

## 📉 왜 필요했나

점검은 컴포넌트 복잡도를 보다가 시작했는데, 파고들수록 "지침이 현실을 설명하지 못한다"는 같은 문제가 층마다 반복됐다.

### 1. 폐기된 구조를 여전히 규정하고 있었다

`coding.md`는 `.desktop.tsx`·`.mobile.tsx` 네이밍과 `views/desktop/`·`views/mobile/` 폴더를 규정한다. 그런데 해당 파일과 폴더는 **하나도 없다**. ADR-0007(`.claude/decisions/records/ADR-0007-responsive-rendering-strategy.md`)로 폐기된 구조인데 문서만 남은 것이다.

더 나쁜 건 `isMobile ? <Mobile/> : <Desktop/>` 예시까지 남아 있었다는 점이다. 같은 폴더의 `styling.md`는 ADR-0007을 반영해 "모드별 2벌 분리 금지"를 명시하고 있었다. **두 문서가 정반대 규칙을 담고 있었다.**

계층 책임 표도 "views는 components 직접 호출 금지"로 적혀 있어, 실제 구조인 "상위는 모든 하위를 참조할 수 있다"와 충돌했다.

### 2. 배치 기준이 아예 없었다

`coding.md`는 파일 네이밍과 계층 책임만 다루고, **"어느 폴더에 두는가"를 규정하지 않았다.** 기준이 없으니 판단이 사람마다 갈리고, 애매한 파일이 루트에 쌓였다.

| 증상                    | 실측                                                                           |
| ----------------------- | ------------------------------------------------------------------------------ |
| `components/` 루트 방치 | 7개 파일                                                                       |
| 같은 이름 중복          | `Tag.component.tsx`가 루트·`tag/` 두 곳, 둘 다 `TagComponent`로 import         |
| 폴더명 표기 혼재        | `pokemonCard/` 일반 표기 vs `detail.summary/summary.shinyRate/…` 점 표기 4단계 |
| 최상위 폴더 단복수 혼재 | `views/` 복수 vs `hook/`·`module/`·`container/` 단수                           |

### 3. 동작하지 않는 설정을 규칙으로 적어놨다

`.prettierrc`에 `importOrder`가 정의돼 있으나 이를 처리할 플러그인이 설치되지 않았다. Prettier는 실행할 때마다 경고를 낸다.

```text
[warn] Ignored unknown option { importOrder: ["^react", "<THIRD_PARTY_MODULES>", "^[./]"] }
```

문서는 이 설정을 유효한 규칙처럼 표에 적어놨다. 지침을 읽고 "import는 자동 정렬된다"고 판단하면 사실과 다르다. 게다가 이 설정에는 `~/` 경로 그룹이 없어, 플러그인을 설치하더라도 내부 모듈이 서드파티 그룹에 섞인다.

### 4. 쓰지 않는 브레이크포인트가 함정을 만들고 있었다

문서는 브레이크포인트를 2종으로 규정하는데 `tailwind.config.js`에는 4종이 있었다.

| 이름          | 조건               | 문서 |
| ------------- | ------------------ | ---- |
| `mobile`      | `max-width: 768px` | ✅   |
| `desktop`     | `min-width: 769px` | ✅   |
| `desktop-970` | `max-width: 970px` | ❌   |
| `desktop-639` | `max-width: 639px` | ❌   |

`desktop-970`은 이름에 `desktop`이 있지만 `max-width`라 **모바일 구간까지 포함**한다. 데스크톱 전용으로 오해하고 쓰면 모바일 스타일을 덮어쓴다. **두 브레이크포인트 모두 클래스로 사용된 곳이 0곳**이었고, 유일한 등장은 "쓰려 했으나 포기했다"는 주석이었다.

## ✨ 주요 변경사항

### 변경 1: 가이드 6개 → 10개 재편

성격이 다른 규칙이 한 문서에 섞여 있던 것을 축별로 분리했다.

| 신설 문서       | 담당                                      | 근거     |
| --------------- | ----------------------------------------- | -------- |
| `structure.md`  | 어느 **폴더**에 두는가                    | ADR-0016 |
| `naming.md`     | 어떤 **이름**을 붙이는가                  | ADR-0017 |
| `comments.md`   | 주석 3원칙, JSDoc/TSDoc, 인라인 허용 범위 | —        |
| `formatting.md` | Prettier — 표기 형식, import **정렬**     | ADR-0019 |
| `nextjs.md`     | 캐시 정책, `next.config` 의사결정         | —        |

기존 `coding.md`는 "어떻게 **작성**하는가"(계층 책임, 타입, Context, 핸들러)로 범위를 좁혔고, `linting.md`는 ESLint 전담(코드 품질, 미사용 import **제거**)으로 재정의했다.

### 변경 2: `rendering.md` 해체

`rendering.md`는 성격이 다른 내용이 한데 묶여 있어 참조할 때마다 전체를 읽어야 했다. 내용을 성격별로 귀속시키고 문서 자체를 없앴다.

| 기존 내용   | 귀속처             |
| ----------- | ------------------ |
| 라우트 구조 | `structure.md`     |
| 데이터 패칭 | `coding.md`        |
| 검증 절차   | `workflow.md`      |
| 캐시·config | `nextjs.md` (신설) |

### 변경 3: 배치를 "사용 도메인 수"로 결정 (ADR-0016)

"공용 같으니 전역에 두자"는 판단은 사람마다 다르다. **개수는 세면 되는 값이라 판정이 흔들리지 않는다.**

| 사용 범위            | 위치                                                        |
| -------------------- | ----------------------------------------------------------- |
| 한 컴포넌트에서만    | 그 파일 안 (분리하지 않음)                                  |
| 한 도메인 안 여러 곳 | `<도메인>/shared/`                                          |
| 2개 이상 도메인      | 전역 (`components/common/`, `modules/`, `hooks/`, `utils/`) |

규칙을 루트 방치 파일 7개에 적용하니 판정이 바로 갈렸다.

| 파일             | 사용 도메인    | 판정             |
| ---------------- | -------------- | ---------------- |
| `Image`          | 12개           | 전역             |
| `SectionHeading` | 2개            | 전역             |
| `Portal`         | 1개 (`filter`) | `filter/` 안으로 |
| `RadioGroup`     | 1개 (`filter`) | `filter/` 안으로 |

전역 자격을 갖춘 것은 2개뿐이었고, 나머지는 분류되지 않은 채 방치된 상태였음이 규칙만으로 드러난다.

함께 확정한 부수 규칙 — 도메인 간 직접 참조 금지(위반 4건 발견, 모두 `champions/` 참조), 최상위 도메인 폴더 복수형, 폴더명에 점 금지, 중첩 3단계 상한.

### 변경 4: 네이밍 접미사 체계 정리 (ADR-0017)

파일명 접미사는 **유지**한다. 도메인 폴더 구조에서는 `components/champions/`와 `containers/champions/`에 각각 `ChampionsCard`가 있을 수 있는데, 에디터 탭에 경로가 표시되지 않으므로 접미사가 유일한 단서다.

반대로 **컴포넌트 export 이름에는 접미사를 붙이지 않는다.**

```tsx
// components/tag/Tag.component.tsx
interface TagProps { ... }
const Tag = ({ ... }: TagProps) => { ... }
```

접미사가 붙은 export가 140개(Component 58 · Container 53 · View 25 · Organism 4)이고, 이를 물려받은 타입명이 `SectionHeadingComponentProps`처럼 `Component`를 두 번 담고 있었다.

이벤트 핸들러는 props 콜백 `on{이벤트}{동작}`(`onClickClose`), 내부 정의 `handle{이벤트}{동작}`으로 고정했다.

### 변경 5: 타입 엄격도 상향 (ADR-0018)

`strict: true`에 더해 켤 옵션을 확정했다. 각 옵션의 현재 에러 수를 먼저 측정했다.

| 옵션                                    | 현재 코드 에러 | 채택 |
| --------------------------------------- | -------------- | ---- |
| `noUncheckedIndexedAccess`              | 45건           | ✅   |
| `noImplicitReturns`                     | 0건            | ✅   |
| `noFallthroughCasesInSwitch`            | 0건            | ✅   |
| `noUnusedLocals` · `noUnusedParameters` | 0건            | ✅   |
| `exactOptionalPropertyTypes`            | 86건           | ❌   |

외부 입력(URL 파라미터·API 응답)은 `as` 단언 대신 타입 가드로 좁히기로 했다(단언 사용처 7곳 확인). Context는 `createContext<T | null>(null)` + 커스텀 훅 + Provider 밖 가드로 통일한다 — 기존에는 11개 중 5개만 커스텀 훅을 제공했다.

### 변경 6: import 계층 정렬 도입 (ADR-0019)

`@ianvs/prettier-plugin-sort-imports`를 도입하고 순서를 **의존 방향과 일치**시킨다. 추상적인 것(타입·상수)에서 구체적인 것(컴포넌트·뷰)으로 내려가므로, import 목록만 봐도 이 파일이 어느 계층에 의존하는지 읽힌다.

```json
"importOrder": [
  "^react$", "^next(/.*)?$", "<THIRD_PARTY_MODULES>", "",
  "^~/types/(.*)$", "^~/constants/(.*)$", "^~/graphql/(.*)$",
  "^~/utils/(.*)$", "^~/modules/(.*)$", "^~/hooks/(.*)$",
  "^~/context/(.*)$", "^~/components/(.*)$", "^~/containers/(.*)$",
  "^~/views/(.*)$", "", "^[./]"
]
```

ADR-0016의 "하위는 상위를 참조하지 않는다"를 어긴 경우도 눈에 띈다 — `components`가 `containers`를 import하면 순서상 아래쪽에 나타나 이질적으로 보인다.

미사용 import는 `eslint-plugin-unused-imports`가 자동 제거한다. 기존 `@typescript-eslint/no-unused-vars`(error)는 **`--fix`를 지원하지 않아** 매번 손으로 지워야 했다.

### 변경 7: 브레이크포인트 2종 고정 (ADR-0020)

`desktop-970`·`desktop-639`를 제거하고 `mobile`·`desktop` 2종만 유지한다. 중간 구간이 필요해 보이면 **레이아웃을 먼저 조정**한다 — 열 수나 고정 폭을 바꿔 한 구간이 전 폭을 커버하게 만든다.

타입 칩 그리드가 970px 이하에서 깨지던 문제는 구간을 나누는 대신 6열로 줄여 해결했다. 6열이면 769px에서도 글자 여유가 남아 전 구간에서 안전하다.

### 변경 8: `.claude/` 하네스 재배치

문서가 늘면서 폴더 진입 시 무엇을 먼저 읽어야 할지 알 수 없는 상태였다. 유형별 폴더로 나누고 `index.md`를 신설했다.

| 폴더                | 재배치                                                               |
| ------------------- | -------------------------------------------------------------------- |
| `.claude/specs/`    | `service/` · `features/` · `plans/` · `incidents/` 4개 폴더로 분류   |
| `.claude/research/` | `business/` · `market/` · `seo/` · `strategy/` · `tech/` · `ux/` 6개 |

`specs/index.md`·`research/index.md`·`hooks/index.md`를 신설하고, CLAUDE.md를 실제 상태에 맞춰 갱신했다.

## ⚠️ 구현 시 고려한 점

### `.organism` 접미사를 폐기한 이유

`.organism.tsx` 4개가 쓰이고 있었으나 **판정 기준이 없었다.** `FilterBar`는 organism인데 `MoveTable`(164줄, 내부 컴포넌트 보유)은 component인 이유를 설명할 수 없다. `structure.md`의 폴더 체계에도 organism 층이 없어, 파일명만 Atomic Design을 따르고 폴더는 도메인 기준인 혼재 상태가 된다.

ADR-0010은 "원자부터 만들자"는 **빌드 순서** 결정이지 파일명 규칙이 아니다. 4개 중 `ChampionsFormatTab.organism`은 사용처가 0곳인 죽은 파일이었다.

### `exactOptionalPropertyTypes`를 켜지 않은 이유

에러 86건으로, 다른 옵션(최대 45건)보다 수정 부담이 크다. 대부분 `prop?: T`에 `undefined`를 명시적으로 넘기는 패턴이라 타입 안전성 향상 대비 수정량이 크지 않다고 판단했다.

### 브레이크포인트를 "이름만 고치기"로 끝내지 않은 이유

`desktop-970`을 `narrow-970`으로 바꾸면 `max-width`임은 드러나지만, **중첩 변형 문제는 그대로 남는다.** Tailwind는 `desktop:desktop-970:` 조합에 대해 CSS 규칙을 생성하지 않아, 두 브레이크포인트가 서로를 좁힐 수 없다. 이름을 고쳐도 쓸 수 없는 건 마찬가지라 제거를 택했다.

### `source.organizeImports`를 켜지 않는 이유

VSCode 내장 정리 기능은 자체 방식으로 정렬해 계층 순서를 덮어쓴다. Prettier 플러그인과 충돌하므로 끈 상태로 둔다.

## 🔍 검증

문서 작업이므로 런타임 검증은 없다. 대신 **규칙마다 실제 코드에서 개수를 세어** 사실 여부를 확인했다.

- 루트 방치 파일 7개, 각각의 사용 도메인 수 집계 → 전역 자격 2개 확인
- `.desktop.tsx`·`.mobile.tsx` 파일 검색 → 0개 확인
- 접미사 없는 파일 48개, 접미사 붙은 export 140개 집계
- tsconfig 옵션 5종을 실제로 켜고 `tsc` 에러 수 측정
- `desktop-970`·`desktop-639` 클래스 사용처 검색 → 0곳 확인
- 도메인 간 직접 참조 전수 조사 → 위반 4건 확인

**확인하지 않은 것**: 새 지침을 적용한 코드가 실제로 빌드되는지는 검증하지 않았다. 코드 변경이 없으므로 이번 범위 밖이다.

## 📊 변경 결과

| 항목                       | 변경 전 | 변경 후 |
| -------------------------- | ------- | ------- |
| `conventions/guides/`      | 6개     | 10개    |
| ADR 기록                   | 15건    | 20건    |
| `.claude/` 하위 `index.md` | 4개     | 7개     |

## 📌 후속 관찰 대상

**이 작업은 문서만 바꿨다. 지침과 코드는 아직 어긋나 있다.** 새로 쓰는 코드는 새 지침을 따르되, 기존 코드는 아래 작업이 끝나야 정합해진다.

**구조 개선** — `useOutSideClick` 훅 2벌 통합 · `SearchResultList` 2벌 통합 · useEffect 의존성 3건 · 검색 로직 `useSearchPokemon` 훅 추출 · `MovesFilterBar`·`DetailMovesHero` 정리

**지침 적용** — 폴더 복수형화(import 약 400곳) · 파일명 접미사 48개 · 컴포넌트 export 접미사 제거 140개 · tsconfig 엄격 옵션 적용(`noUncheckedIndexedAccess` 45건) · `@ianvs` 정렬 플러그인 + `unused-imports` 설치 · 크롬을 layout으로 이동(29개 `page.tsx`) · 주석 정리(324파일)

각 ADR의 "결과" 절에 항목별 상세 목록이 있다.
