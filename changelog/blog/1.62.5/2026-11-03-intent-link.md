---
slug: intent-link
title: '모든 내부 링크를 누르려 할 때만 prefetch하는 IntentLink로 통일'
description: '화면에 보이기만 한 링크까지 RSC로 미리 받던 Next.js 기본 prefetch를, 터치·hover·포커스 시점에만 받는 공통 IntentLink 컴포넌트로 바꾸고 58개 파일에 적용해 린트로 강제했다.'
authors: [jsg3121, claude]
tags: [performance, nextjs, refactoring]
---

# 모든 내부 링크를 누르려 할 때만 prefetch하는 IntentLink로 통일

> **작업 날짜**: 2026-11-03
> **브랜치**: `feature/1.62.5-intent-link`

## 📋 작업 개요

**작업 유형**: 성능 개선 / 리팩토링
**담당**: jsg3121, Claude

## 🎯 작업 목표

사이트의 모든 내부 링크가 "화면에 보일 때"가 아니라 "누르려 할 때" RSC를 받게 해, 버려지는 prefetch 요청을 없앤다. 실제로 이동하는 링크의 체감 속도는 유지한다.

<!-- truncate -->

## 📉 왜 필요했나

1.62.3·1.62.4에서 공통 메뉴, 포켓몬 카드, 타입 상세 링크의 prefetch를 조정했다. 그 뒤 2026-10-27~11-02 로그를 집계하니 전체 요청 3,209,017건 중 RSC가 **69.7%**였고, 그때까지 손댄 범위는 약 40%였다.

남은 약 29%는 트래픽 상위권 페이지로 가는 링크였다.

| 목적지                         | RSC 요청 (7일) | 전체 요청 대비 |
| ------------------------------ | -------------- | -------------- |
| `/moves/…` (기술 상세)         | 340,676        | 10.6%          |
| `/detail/{n}/…` (상세 하위 탭) | 263,002        | 8.2%           |
| `/champions/…`                 | 198,734        | 6.2%           |
| `/ability/{n}`                 | 79,866         | 2.5%           |
| `/quiz/…`, `/privacy`          | 57,667         | 1.8%           |

이 동선들은 실제 이동이 많아 prefetch를 끄기보다 **누르려 할 때 받는** 방식이 맞다. 1.62.4의 포켓몬 카드에서 쓴 방식을 공통 컴포넌트로 만들어 전체에 적용했다.

## ✨ 주요 변경사항

### 변경 1: `IntentLink` 공통 컴포넌트 추가

`src/components/link/IntentLink.component.tsx`를 추가했다. `next/link`와 사용법이 같고, prefetch 시점만 다르다.

```tsx
const IntentLink = ({ href, onMouseEnter, onTouchStart, onFocus, ...props }: IntentLinkProps) => {
  const router = useRouter()

  const prefetchOnIntent = () => router.prefetch(href)

  const handleMouseEnter = (event: MouseEvent<HTMLAnchorElement>) => {
    prefetchOnIntent()
    onMouseEnter?.(event)
  }
  // handleTouchStart, handleFocus도 같은 형태

  return (
    <Link
      href={href}
      prefetch={false}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleTouchStart}
      onFocus={handleFocus}
      {...props}
    />
  )
}
```

- 호출하는 쪽이 넘긴 `onMouseEnter`·`onTouchStart`·`onFocus`도 함께 실행된다.
- `href`는 문자열만 받는다. 저장소에 객체 형태 `href`를 쓰는 곳이 없음을 확인했다.

### 변경 2: `next/link`를 쓰던 58개 파일을 `IntentLink`로 교체

import와 JSX를 `IntentLink`로 바꾸고, 1.62.3·1.62.4에서 넣었던 `prefetch={false}`를 제거했다. `PokemonCardShell`에 직접 넣었던 의도 기반 prefetch 로직도 `IntentLink`로 대체했다.

| 영역                  | 파일 | 대표 컴포넌트                                   |
| --------------------- | ---- | ----------------------------------------------- |
| 챔피언스              | 13   | 형식·폼 탭, 티어 항목, 대회 카드                |
| 기술                  | 5    | 기술 목록 카드, 버전 선택(`MovesVersionNav`)    |
| 포켓몬 상세           | 6    | 이전·다음, 진화, 폼 행                          |
| 공통                  | 4    | `TabItem`, `LinkButton`, `HubLinkCard`, `MoveTable` |
| 메뉴·헤더·푸터·검색  | 9    | 탭바, 헤더 메뉴·로고, 푸터, 검색 결과           |
| 포켓몬 카드 셸        | 1    | `PokemonCardShell` (1.62.4의 수동 로직 대체)    |
| 타입·퀴즈·특성·기타  | 20   | 타입 링크, 퀴즈 CTA, 특성 카드, 404 페이지       |

### 변경 3: 재발 방지

- `.eslintrc`에 `no-restricted-imports`로 `next/link` 직접 import를 막았다. `IntentLink` 파일만 `overrides`로 예외 처리했다.
- `.claude/conventions/guides/coding.md`에 "링크" 절을 추가했다.
- `IntentLink`가 `useRouter`를 써서, `.storybook/preview.tsx`에 `nextjs: { appDirectory: true }`를 전역으로 켰다. 1.62.4에서 story 두 개에 따로 넣은 설정은 제거했다.
- ADR-0025를 2차 개정했다.

## 🔍 검증

백엔드 리졸버에서 GraphQL 스키마를 직접 생성해 `npm run codegen`과 같은 생성 파일을 만든 뒤 검증했다.

| 항목                                 | 결과                                                                                         |
| ------------------------------------ | -------------------------------------------------------------------------------------------- |
| `tsc --noEmit` (프로젝트 전체)        | 에러 0건                                                                                     |
| `eslint src`                         | 통과                                                                                         |
| 린트 규칙 동작                       | 임시 파일에서 `next/link`를 import하면 `no-restricted-imports` 에러, `IntentLink` 파일은 통과 |
| `npm run build`                      | 성공 (정적 페이지 17개 생성)                                                                 |

빌드 결과를 `next start`로 띄우고 헤드리스 Chromium으로 `?_rsc=` 요청을 기록했다.

| 시나리오                                          | RSC 요청                              |
| ------------------------------------------------- | ------------------------------------- |
| 모바일 `/list` 진입 → 스크롤 5회                  | 0건                                   |
| 모바일 `/detail/25/moves` 진입 → 스크롤 5회       | 0건                                   |
| 모바일 `/moves/85` 진입 → 스크롤 5회              | 0건                                   |
| 데스크톱 `/champions/double` 진입 → 스크롤 5회    | 0건                                   |
| 모바일 `/type-effectiveness` 진입 → 스크롤 5회    | 0건                                   |
| 모바일 탭바 "기술" 터치 시작 → 실제 탭            | 터치 시 1건, 탭(이동) 시 추가 0건 — 미리 받은 데이터로 `/moves` 이동 |
| 데스크톱 상세 탭 링크 hover                       | hover 시 1건                          |

## 📌 참고 사항

- 메뉴·타입 링크는 1.62.3·1.62.4에서 prefetch를 아예 끈 상태였는데, 이번에 의도 기반으로 바뀌어 누를 때 미리 받는다.
- 모바일에서 링크 위에 손가락을 대고 스크롤을 시작해도 `touchstart`가 발생해 일부 prefetch는 남는다.
- 페이지별 Lighthouse 변화와 CloudFront 요청 변화는 1.62.5 성능 측정 글에서 비교한다.
