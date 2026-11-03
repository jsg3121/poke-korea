---
slug: content-link-prefetch
title: '포켓몬 카드는 누르려 할 때만, 타입 상세 링크는 prefetch 없이'
description: 'RSC 요청의 가장 큰 발생원이던 포켓몬 카드를 터치·hover 시점 prefetch로 바꾸고, 거의 열리지 않는 타입 상세 링크의 prefetch를 꺼 CloudFront 요청을 줄였다.'
authors: [jsg3121, claude]
tags: [performance, nextjs]
---

# 포켓몬 카드는 누르려 할 때만, 타입 상세 링크는 prefetch 없이

> **작업 날짜**: 2026-11-03
> **브랜치**: `feature/1.62.4-content-link-prefetch`

## 📋 작업 개요

**작업 유형**: 성능 개선 (패치)
**담당**: jsg3121, Claude

## 🎯 작업 목표

본문 링크가 만드는 RSC prefetch 요청 중 버려지는 요청을 없애 CloudFront 요청 비용과 오리진 부하를 줄인다. 도감 탐색의 체감 속도는 유지한다.

<!-- truncate -->

## 📉 왜 필요했나

1.62.3에서 공통 메뉴 링크의 prefetch를 껐다. 그 뒤 RSC 요청을 목적지별로 다시 집계하니, 메뉴 목적지는 전체 요청의 약 6%에 그쳤고 더 큰 발생원은 본문 링크였다.

| 목적지 (2026-10-28)          | RSC 요청 | 전체 요청 대비 | 실제 HTML 조회 |
| ---------------------------- | -------- | -------------- | -------------- |
| `/detail/{n}` (포켓몬 상세)  | 135,734  | 31%            | 8,471          |
| `/type-effectiveness/{type}` | 19,904   | 5%             | 148            |
| 메뉴 목적지 7곳 (1.62.3 대상) | 약 27,600 | 약 6%         | —              |

- **포켓몬 카드**: 도감 목록을 무한 스크롤하면 화면에 들어온 카드마다 상세 페이지를 미리 받는다. 같은 카드 컴포넌트가 기술·특성·타입 상세의 포켓몬 목록, 챔피언스, 홈에도 쓰인다.
- **타입 상세 링크**: 상성 계산기의 표·빠른 링크·설명 본문과 타입 상세 하단 목록에 타입 링크가 반복된다. 실제로 열린 건 148번인데 RSC는 2만 건 가까이 나갔다.

결정 근거는 [ADR-0025](https://github.com/jsg3121/poke-korea/blob/main/.claude/decisions/records/ADR-0025-layout-link-prefetch-off.md)에 개정해 정리했다.

## ✨ 주요 변경사항

### 변경 1: 포켓몬 카드를 의도 기반 prefetch로 전환

`src/components/pokemonCard/PokemonCardShell.component.tsx`의 `<Link>`가 화면에 보일 때가 아니라 **누르려 할 때** prefetch한다. 터치 시작·마우스 올림·키보드 포커스 시점에 `router.prefetch()`를 호출한다.

**변경 전**:

```tsx
<Link href={href} className={`block mx-auto ${POKEMON_CARD_SIZE.width}`}>
```

**변경 후**:

```tsx
const router = useRouter()
const prefetchOnIntent = () => router.prefetch(href)

<Link
  href={href}
  prefetch={false}
  onMouseEnter={prefetchOnIntent}
  onTouchStart={prefetchOnIntent}
  onFocus={prefetchOnIntent}
  className={`block mx-auto ${POKEMON_CARD_SIZE.width}`}
>
```

카드 셸 한 곳만 바꿔 이 셸을 쓰는 모든 카드에 적용된다.

### 변경 2: 타입 상세 링크의 prefetch 끄기

`/type-effectiveness/{type}`로 가는 링크에 `prefetch={false}`를 추가했다.

| 파일                                 | 위치                         |
| ------------------------------------ | ---------------------------- |
| `TypeEffectivenessTable.container.tsx` | 상성 표의 공격 타입          |
| `TypeQuickLinks.container.tsx`       | 빠른 링크                    |
| `TypeNameLink.component.tsx`         | 설명 본문의 타입 이름        |
| `TypeEffectivenessCta.container.tsx` | 선택 타입 상세 CTA           |
| `TypeDetailNav.container.tsx`        | 타입 상세 하단 타입 목록     |

같은 컴포넌트 안의 `/list?type=…`, `/champions/list`, `/quiz/type-effectiveness` 링크는 그대로 두었다.

### 변경 3: 카드 story에 App Router 설정 추가

카드 셸이 `next/navigation`의 `useRouter`를 쓰게 되어, 카드를 렌더링하는 `PokemonCard.stories.tsx`와 `HorizontalScrollList.stories.tsx`의 meta에 `nextjs: { appDirectory: true }`를 추가했다. Storybook Next.js 프레임워크 문서는 `next/navigation`을 쓰는 컴포넌트의 story에 이 설정을 요구한다.

## 🔍 검증

- 변경한 파일 대상 `prettier` 통과
- 변경한 파일 대상 `eslint`: 생성 파일 미존재로 나는 `import/no-unresolved`를 제외하면 통과
- `tsc --noEmit`: 변경한 파일의 타입 에러를 변경 전(`origin/main`)과 비교해 **새로 생긴 에러 없음**(16건 모두 생성 파일 미존재로 인한 기존 에러)
- **전체 `npm run lint`·`tsc`·`build`와 Storybook 실행은 작업 환경에서 확인하지 못했다**: GraphQL 생성 파일(`src/graphql/gqlGenerated.ts`·`typeGenerated.ts`)이 없어 이를 import하는 파일 전체에서 에러가 난다. `npm run codegen` 후 확인이 필요하다.
- prefetch는 프로덕션 빌드에서만 동작한다. 배포 후 Network 탭에서 아래를 확인해야 한다.
  - 도감 목록을 스크롤할 때 `/detail/{n}?_rsc=` 요청이 나가지 않고, 카드를 터치·hover할 때 나가는지
  - 상성 계산기 페이지 진입 시 `/type-effectiveness/{type}?_rsc=` 요청이 나가지 않는지

## 📌 참고 사항

- 포켓몬 카드는 터치 시작부터 클릭 확정까지의 짧은 시간 동안 미리 받기 시작한다. 네트워크가 느리면 이전보다 상세 진입이 조금 늦게 느껴질 수 있다.
- `/moves/*`(9%), `/champions/*`(6%) 카드는 이번 범위에서 제외했다.
- **후속 관찰 대상** (1~2주):
  - CloudFront `Requests`(`E3TRB0VXGC6JWI`)와 Cost Explorer `AP-Requests-Tier2-HTTPS`
  - ALB `TargetResponseTime`(`poke-korea-group`), EC2 메모리 사용률
  - Search Console Core Web Vitals
