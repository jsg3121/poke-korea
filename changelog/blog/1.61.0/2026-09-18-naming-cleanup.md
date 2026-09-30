---
slug: naming-cleanup
title: '네이밍 정리 — 접미사가 가리고 있던 이름의 빈자리'
description: '파일명 접미사 57건을 부여하고 export 이름에서 접미사 199건을 걷어냈습니다. 접미사를 떼자 view와 container가 같은 이름이던 8쌍이 드러나 역할에 맞게 다시 지었습니다.'
authors: [jsg3121, claude]
tags: [refactoring, docs]
---

# 네이밍 정리 (Phase 2-2)

> **작업 날짜**: 2026-09-18
> **브랜치**: `feature/1.61.0-naming`

## 📋 작업 개요

**작업 유형**: 리팩토링 (네이밍 규칙 적용)
**담당**: jsg3121, claude

[컨벤션 개편](/convention-overhaul)이 규정한 네이밍 지침을 코드에 적용한다. [import 계층 정렬](/import-order)에 이은 Phase 2의 두 번째 항목이다.

## 🎯 작업 목표

**계층 정보를 파일명 한 곳에만 둔다.**

같은 정보가 파일명과 식별자에 이중으로 적혀 있었다. `SectionHeading.component.tsx` 안에 `SectionHeadingComponent`가 있고, 그 props 타입은 `SectionHeadingComponentProps`였다. 한 파일에서 "Component"를 세 번 읽게 된다.

<!-- truncate -->

## 📉 왜 필요했나

### 접미사가 폴더 단위로 빠져 있었다

파일명 접미사는 계층을 구분하기 위한 것인데, 규칙이 지켜지지 않은 폴더가 있었다.

| 폴더                 | 접미사 없는 파일 |
| -------------------- | ---------------- |
| `components/adSlot/` | 18개             |
| `views/quiz/`        | 12개             |
| 기타                 | 27개             |

폴더 전체가 일관되게 빠져 있어 관행처럼 굳은 상태였다.

### 폐기된 접미사가 남아 있었다

`.organism` 4건이 쓰이고 있었다. 이 접미사는 판정 기준이 없어 폐기됐다 — `FilterBar`는 organism인데 `MoveTable`(164줄, 내부 컴포넌트 보유)은 component인 이유를 설명할 수 없다.

그중 `ChampionsFormatTab.organism.tsx`는 **stories에서만 참조되는 죽은 파일**이었다. 같은 이름의 `.component` 버전이 이미 실사용 중이었다.

### 접미사가 이름의 역할을 대신하고 있었다

이게 이번 작업에서 가장 중요한 발견이다.

```tsx
// ChampionsPokedex.view.tsx
const ChampionsPokedexView = ...             // Provider 래핑만 한다
import ChampionsPokedexContainer from ...    // 화면 내용 전부를 그린다
```

접미사가 붙어 있을 때는 구분되는 것처럼 보였다. 그런데 **접미사를 떼자 둘 다 `ChampionsPokedex`가 됐다.** 두 파일 모두 도메인 이름만 갖고 있었고, 역할은 이름에 담겨 있지 않았다.

같은 구조가 **8쌍**에 있었다.

## ✨ 주요 변경사항

### 변경 1: 파일명 접미사 57건 부여

`components/adSlot/` 18개, `views/quiz/` 12개를 포함해 접미사가 없던 파일에 계층 접미사를 붙였다.

`.organism` 3건은 `.component`로 바꾸고, 죽은 파일 1건과 그 stories는 삭제했다.

**훅에는 접미사를 붙이지 않는다.** `use` 접두사가 React 공식 규격으로 이미 성격을 말하므로 `useSearchPokemon.hook.ts`는 중복이다.

### 변경 2: export 이름에서 접미사 제거

| 대상                             | 건수 |
| -------------------------------- | ---- |
| `export default XxxComponent` 등 | 140  |
| `XxxComponentProps` 타입명       | 59   |

```tsx
// 변경 전
interface SectionHeadingComponentProps { ... }
const SectionHeadingComponent = ({ ... }: SectionHeadingComponentProps) => { ... }
export default SectionHeadingComponent

// 변경 후
interface SectionHeadingProps { ... }
const SectionHeading = ({ ... }: SectionHeadingProps) => { ... }
export default SectionHeading
```

### 변경 3: view/container 8쌍의 이름 재설계

접미사를 떼자 드러난 충돌이다. 두 파일 모두 도메인명만 갖고 있어 역할 구분이 없었다.

실제 역할은 이렇게 갈린다.

| 계층      | 하는 일                                                |
| --------- | ------------------------------------------------------ |
| view      | Provider로 감싸고 컨테이너 하나를 배치                 |
| container | 헤더·필터·카드 그리드·광고·무한스크롤 — 화면 내용 전부 |

container 주석 다수가 이미 스스로를 "본문"이라 부르고 있었다. 그 역할을 이름에 담아 `Content`를 붙였다.

| 도메인                                                               | container 새 이름 |
| -------------------------------------------------------------------- | ----------------- |
| MovesList · AbilityList                                              | `…Content`        |
| ChampionsPokedex · ChampionsDetail · ChampionsTier                   | `…Content`        |
| ChampionsTournamentsList · ChampionsTournamentDetail · ChampionsHome | `…Content`        |

파일명도 함께 바꿨다 — 이름과 파일명이 어긋나면 접미사 규칙의 취지에서 벗어난다.

### 변경 4: 스타일 파일 3종을 소비자 수로 갈랐다

`chipStyle.ts` 같은 파일은 접미사 규칙 대상이 아니라 **배치 자체를 판단**해야 했다. 기준은 소비자 수다.

| 파일              | 소비자                           | 처리                                   |
| ----------------- | -------------------------------- | -------------------------------------- |
| `tabItemStyle.ts` | 1곳                              | `TabItem.component.tsx`로 흡수         |
| `chipStyle.ts`    | 1곳 (단 `ChipColor`는 7곳)       | 컴포넌트로 흡수 + `chip.types.ts` 분리 |
| `buttonStyle.ts`  | **2곳** (Button·LinkButton 공유) | `button.util.ts`로 이름만 변경         |

`getChipClass`는 클래스 상수 5개를 전부 사용하므로 상수와 분리할 수 없고, 소비자도 컴포넌트 하나뿐이라 함께 흡수했다. 반면 `ChipColor`는 `utils`·`containers` 등 여러 계층이 공유하므로 컴포넌트 안에 두면 **유틸이 컴포넌트를 참조**하게 된다. 그래서 타입만 별도 파일로 뺐다.

`buttonStyle`은 Button과 LinkButton이 시각 스타일을 공유해 소비자가 2곳이다. 한쪽에 흡수하면 형제 간 의존이 생기므로 분리를 유지하고 이름만 규칙에 맞췄다.

## 🔧 기술적 세부사항

### 대량 치환에서 `tsc`가 잡아낸 과잉 매칭 3건

600건이 넘는 식별자를 일괄 치환했다. 패턴 매칭이라 의도치 않은 곳까지 바뀔 수 있어 타입 검사가 안전망이 됐다.

| 사례                                  | 원인                                      | 처리                   |
| ------------------------------------- | ----------------------------------------- | ---------------------- |
| `FunctionComponent` → `Function`      | React 내장 타입이 `Component` 패턴에 걸림 | 복구                   |
| `DetailMovesList.container` 경로      | `MovesList` 패턴에 부분 매칭              | 복구                   |
| `HeaderSearchContainer.container.tsx` | 파일명에 `Container` 중복                 | **파일명 정리**로 해결 |

세 번째는 되돌리는 대신 `HeaderSearch.container.tsx`로 고쳤다. 원래 이름이 `Container`를 두 번 담고 있었다.

### 충돌 검사 방법을 한 번 바꿨다

처음에는 "새 이름이 파일에서 이미 몇 번 쓰였나"를 셌는데, **import 이름과 선언 이름이 둘 다 접미사를 가진 경우**를 놓쳐 8쌍 중 1쌍만 잡혔다.

파일마다 등장하는 접미사 식별자를 모두 모아 접미사를 떼고 **중복이 생기는지 직접 확인**하는 방식으로 바꾸자 8쌍이 전부 나왔다.

### Storybook의 제네릭 별칭은 제외했다

```tsx
const SelectInput = SelectInputComponent<'usage' | 'dex'>
```

접미사가 아니라 **제네릭을 고정한 별도 심볼**이다. 치환하면 `const SelectInput = SelectInput`이 되어 깨진다.

## 🔍 검증

| 항목                            | 결과      |
| ------------------------------- | --------- |
| `tsc --noEmit`                  | 0건       |
| ESLint 에러                     | 0건       |
| `export default` 접미사 잔여    | **0건**   |
| `XxxComponentProps` 타입명 잔여 | **0건**   |
| 파일명 중복 접미사 잔여         | **0건**   |
| 라우트 9개 (`curl`)             | 전부 정상 |

`/`, `/list`, `/moves`, `/ability`, `/type-effectiveness`, `/detail/6`, `/detail/6/moves`, `/quiz`, `/champions/double`을 실제로 요청해 확인했다.

**확인하지 않은 것**: 프로덕션 빌드와 Storybook 실행은 검증하지 않았다. stories 파일도 함께 이름이 바뀌었으므로 Storybook 기동 확인이 남아 있다.

## 📊 변경 결과

| 항목                         | 변경 전 | 변경 후 |
| ---------------------------- | ------- | ------- |
| 접미사 없는 파일             | 57개    | **0개** |
| 접미사 붙은 export           | 140개   | **0개** |
| 중복 접미사 타입명           | 59개    | **0개** |
| 폐기된 `.organism`           | 4개     | **0개** |
| 이름이 겹치던 view/container | 8쌍     | **0쌍** |

294개 파일이 바뀌었다.

## 📌 참고 사항

파일명이 대량으로 바뀌면 `.next` 캐시가 옛 경로를 들고 있어 **실행 중인 dev 서버가 죽는다.** 이 브랜치를 오갈 때는 서버를 다시 띄워야 한다.

### 남은 Phase 2 항목

- tsconfig 엄격 옵션 — `noUncheckedIndexedAccess` 45건 (`useInfiniteScroll`의 `Array<any>` 포함)
- 크롬을 layout으로 이동(29개 `page.tsx`) — 렌더 구조가 바뀌므로 단독 브랜치 권장
- 주석 정리(324파일) — 별도 PR로 분리
