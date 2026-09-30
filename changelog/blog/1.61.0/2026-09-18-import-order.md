---
slug: import-order
title: 'import 계층 정렬 — 동작하지 않던 설정을 실제로 켜다'
description: 'Prettier가 매번 경고를 내던 importOrder 설정에 플러그인을 붙이고, 최상위 폴더 3개를 복수형으로 옮겼습니다. import 381곳을 갱신하고 268개 파일을 계층 순서로 재정렬했습니다.'
authors: [jsg3121, claude]
tags: [refactoring, docs]
---

# import 계층 정렬과 폴더 복수형화 (Phase 2-1)

> **작업 날짜**: 2026-09-18
> **브랜치**: `feature/1.61.0-import-order`

## 📋 작업 개요

**작업 유형**: 리팩토링 (도구 도입 + 폴더 재배치)
**담당**: jsg3121, claude

[컨벤션 개편](/convention-overhaul)이 규정한 지침 중 **도구·폴더에 해당하는 것**을 코드에 적용한다. [구조 개선](/structure-cleanup)에 이은 두 번째 적용 단계다.

## 🎯 작업 목표

**지침이 규정한 import 순서를 실제로 강제한다.**

`.prettierrc`에 `importOrder`가 적혀 있었지만 이를 처리할 플러그인이 없어 아무 효과가 없었다. 문서는 이 설정을 유효한 규칙처럼 설명하고 있었다. 플러그인을 붙여 설정이 실제로 동작하게 만들고, 그 과정에서 순서 기준이 되는 폴더명도 지침에 맞췄다.

<!-- truncate -->

## 📉 왜 필요했나

### 설정이 있는데 동작하지 않았다

Prettier를 실행할 때마다 경고가 나왔다.

```text
[warn] Ignored unknown option { importOrder: ["^react", "<THIRD_PARTY_MODULES>", "^[./]"] }
```

`importOrder`는 Prettier 내장 옵션이 아니라 플러그인이 해석하는 값이다. 플러그인이 없으니 Prettier는 이 키를 모르는 옵션으로 보고 무시했다. **지침을 읽고 "import는 자동 정렬된다"고 판단하면 사실과 달랐다.**

기존 설정에는 `~/` 경로를 위한 그룹도 없었다. 플러그인을 설치하더라도 내부 모듈 전체가 서드파티 그룹에 섞인다.

### 미사용 import를 손으로 지워야 했다

미사용 import는 `@typescript-eslint/no-unused-vars`(error)에 걸린다. 그런데 **이 규칙은 `--fix`를 지원하지 않는다.** 에러는 나는데 자동 수정이 안 되니 매번 손으로 지웠다.

### 폴더명 단복수가 섞여 있었다

최상위 폴더에서 `views/`는 복수인데 `hook/`·`module/`·`container/`는 단수였다. 정렬 순서를 폴더 경로로 지정하는 이상, 이름이 흔들리면 패턴도 흔들린다.

## ✨ 주요 변경사항

### 변경 1: 정렬 플러그인 도입

`@ianvs/prettier-plugin-sort-imports`를 설치하고 순서를 **의존 방향과 일치**시켰다.

```json
"plugins": ["@ianvs/prettier-plugin-sort-imports"],
"importOrder": [
  "^react$", "^next(/.*)?$", "<THIRD_PARTY_MODULES>", "",
  "^~/assets/(.*)$", "^~/types/(.*)$", "^~/constants/(.*)$",
  "^~/graphql/(.*)$", "^~/utils/(.*)$", "^~/modules?/(.*)$",
  "^~/hooks?/(.*)$", "^~/context/(.*)$", "^~/components/(.*)$",
  "^~/containers?/(.*)$", "^~/views/(.*)$", "^~/app/(.*)$", "",
  "^[./]"
]
```

추상적인 것(타입·상수)에서 구체적인 것(컴포넌트·뷰)으로 내려간다. import 목록만 봐도 이 파일이 어느 계층에 의존하는지 읽히고, **하위가 상위를 참조하는 위반도 눈에 띈다** — `components`가 `containers`를 import하면 순서상 아래쪽에 나타나 이질적으로 보인다.

### 변경 2: 미사용 import 자동 제거

`eslint-plugin-unused-imports`를 도입했다. 역할을 둘로 나눈다.

| 규칙                                | 담당              | `--fix` |
| ----------------------------------- | ----------------- | ------- |
| `unused-imports/no-unused-imports`  | 미사용 **import** | ✅      |
| `@typescript-eslint/no-unused-vars` | 미사용 **변수**   | ❌      |

### 변경 3: 최상위 폴더 복수형화

| 변경 전          | 변경 후           | import 갱신 |
| ---------------- | ----------------- | ----------- |
| `src/hook/`      | `src/hooks/`      | 56건        |
| `src/container/` | `src/containers/` | 170건       |
| `src/module/`    | `src/modules/`    | 155건       |

총 **381건**을 갱신했다. `tailwind.config.js`의 `content` 경로도 함께 고쳤다.

## 🔧 기술적 세부사항

### 단수·복수를 함께 매칭하는 이유

지침의 패턴은 복수형(`^~/hooks/`)으로 적혀 있는데, 이 작업 전까지 폴더는 단수였다. 패턴을 그대로 넣으면 세 폴더의 import가 **어느 계층 그룹에도 걸리지 않아** 기본 그룹으로 밀린다.

```json
"^~/modules?/(.*)$",
"^~/hooks?/(.*)$",
"^~/containers?/(.*)$"
```

`s?`로 두 형태를 모두 받는다. 폴더를 옮긴 지금도, 혹시 남은 단수 참조가 생겨도 그룹이 어긋나지 않는다. 설정을 두 번 고칠 일이 없다.

### 패턴에 `assets`·`app`을 추가했다

지침의 예시 패턴은 폴더 11개를 나열하는데, 실제 import 대상을 세어보니 `~/assets/`와 `~/app/`이 빠져 있었다. 두 폴더는 서드파티 그룹으로 밀려 계층 정렬이 깨졌다.

```tsx
// 추가 전 — assets가 next 바로 밑에 붙는다
import Link from 'next/link'
import FeedbackIcon from '~/assets/icons/feedback.svg'

// 추가 후 — 그룹이 분리된다
import Link from 'next/link'

import FeedbackIcon from '~/assets/icons/feedback.svg'
import { useSearchPokemon } from '~/hooks/useSearchPokemon'
```

`assets`는 SVG·이미지라 의존 계층상 가장 추상적이고(타입·상수와 동급), `app`은 라우트라 가장 구체적이다. 각각 양 끝에 배치했다.

## 🐛 버그 수정

### 폴더를 넘는 상대 경로 참조

폴더 이동 후 `tsc`가 한 건을 잡았다.

```tsx
// src/components/quiz.modal/CountdownModal.component.tsx
import { useCountdown } from '../../hook/useCountdown'
```

`components/`에서 `hook/`으로 두 단계를 거슬러 올라가는 상대 경로였다. 별칭(`~/hooks/useCountdown`)으로 바꿨다. 폴더 경계를 넘는 참조는 상대 경로로 쓰면 이동에 취약하다.

## 🔍 검증

| 항목                        | 결과                            |
| --------------------------- | ------------------------------- |
| `tsc --noEmit`              | 0건                             |
| ESLint 에러                 | 0건                             |
| Prettier `importOrder` 경고 | **사라짐** (플러그인 인식 확인) |
| 주요 라우트 7개 (`curl`)    | 전부 정상                       |

### `unused-imports` 동작 확인

설정만 넣고 "될 것"이라 보지 않았다. 미사용 import를 일부러 주입해 규칙이 잡는지, `--fix`가 지우는지 확인한 뒤 원본을 복구했다.

### 라우트 확인

재포맷 범위가 268개 파일이라 실제 페이지를 요청했다. `/`, `/list`, `/moves`, `/type-effectiveness`, `/detail/6`, `/detail/6/moves`, `/champions` 모두 정상이다. `/champions`의 308은 `[format]` 동적 라우트로 가는 기존 설계이며 최종 200이다.

**확인하지 않은 것**: 프로덕션 빌드는 실행하지 않았다. dev 서버가 떠 있는 상태에서 빌드하면 `.next`를 공유해 서버가 죽는다.

## 📊 변경 결과

| 항목                    | 변경 전  | 변경 후  |
| ----------------------- | -------- | -------- |
| Prettier 실행 시 경고   | 매번 1건 | **0건**  |
| 미사용 import 자동 제거 | 불가     | **가능** |
| 단수형 최상위 폴더      | 3개      | **0개**  |

전체 317개 파일이 바뀌었다(설정·폴더 이동 244 + 재포맷 268, 일부 중복).

## 📌 참고 사항

폴더명이 바뀌면 `.next` 캐시가 옛 경로를 들고 있어 **실행 중인 dev 서버가 죽는다.** 이 브랜치를 오갈 때는 서버를 다시 띄워야 한다.

### 남은 Phase 2 항목

- 파일명 접미사 48개 · 컴포넌트 export 접미사 제거 140개
- tsconfig 엄격 옵션 — `noUncheckedIndexedAccess` 45건 (`useInfiniteScroll`의 `Array<any>` 포함)
- 크롬을 layout으로 이동(29개 `page.tsx`) — 렌더 구조가 바뀌므로 단독 브랜치 권장
- 주석 정리(324파일)
