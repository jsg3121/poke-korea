---
slug: layout-chrome
title: '전역 크롬을 layout으로 — 페이지마다 최대 60kB가 줄었다'
description: '39개 page가 각자 UA를 감지하고 헤더·푸터·탭바를 렌더하던 구조를 layout 한 곳으로 모았습니다. First Load JS가 페이지당 18~60kB 감소했습니다.'
authors: [jsg3121, claude]
tags: [refactoring, performance, nextjs]
---

# 전역 크롬 layout 승격 (Phase 2-4)

> **작업 날짜**: 2026-09-18
> **브랜치**: `feature/1.61.0-layout-chrome`

## 📋 작업 개요

**작업 유형**: 리팩토링 (구조 개선) + 성능 개선
**담당**: jsg3121, claude

[컨벤션 개편](/convention-overhaul)의 후속 작업 중 마지막 구조 항목이다. [타입 엄격도 상향](/strict-types)에 이은 Phase 2의 네 번째 항목.

## 🎯 작업 목표

**전역 크롬을 한 곳에서만 그린다.**

헤더·푸터·탭바는 모든 페이지에 동일하게 나타나는데, 39개 `page.tsx`가 각자 렌더하고 있었다. 같은 코드가 39벌 존재하는 것도 문제지만, 번들에 39번 들어가는 것이 더 큰 비용이었다.

<!-- truncate -->

## 📉 왜 필요했나

### UA 감지가 layout과 39개 page에서 중복 실행됐다

```tsx
// layout.tsx — 이미 계산하고 있었다
const isMobile = detectUserAgent(userAgent)
<DeviceProvider isMobile={isMobile}>{children}</DeviceProvider>

// 그런데 39개 page가 각자 또 계산한다
const headersList = await headers()
const userAgent = headersList.get('user-agent') || ''
const isMobile = detectUserAgent(userAgent)
```

layout이 이미 정확한 값을 Context로 내려주고 있는데도, 각 페이지가 `headers()`를 다시 읽었다.

### `<main>`이 크롬을 감싸고 있었다

```tsx
<main className="pt-30">
  <DesktopHeader />
  <List />
  <DesktopFooter />
</main>
```

시맨틱상 `<main>`은 "이 문서의 주 콘텐츠"를 뜻한다. 헤더와 푸터가 그 안에 들어가면 의미가 뒤집힌다.

### fixed 헤더 높이를 39개 페이지가 각자 선언했다

데스크톱 헤더는 `fixed`라 문서 흐름에서 빠지므로, 가려지는 만큼을 페이지가 보정해야 했다. 그런데 그 값이 세 종류로 갈렸다.

| 값                          | 페이지 수 | 이유                                   |
| --------------------------- | --------- | -------------------------------------- |
| `pt-30` (120px)             | 24        | 기본 헤더 높이                         |
| `h-40` 스페이서 div (160px) | 13        | champions는 헤더 안에 SubNav 40px 추가 |
| `pt-40` + `max-w-[1280px]`  | 1 (홈)    | 단독 예외                              |

**차이의 원인인 SubNav 유무는 헤더만 아는 정보다.** 헤더 구성이 바뀌면 39개 페이지를 전부 따라 고쳐야 하는 결합이었다.

## ✨ 주요 변경사항

### 변경 1: 헤더가 자기 높이를 소유한다

```tsx
const hasSubNav = pathname.includes('/champions')

return (
  <Fragment>
    <header className="w-full h-30 bg-primary-2 fixed left-0 top-0 z-50 pt-3">
      ...
      {hasSubNav && <ChampionsSubNav />}
    </header>
    <div aria-hidden="true" className={hasSubNav ? 'h-40' : 'h-30'} />
  </Fragment>
)
```

헤더가 스페이서를 함께 반환하므로 호출부는 높이를 알 필요가 없다. 별도 컴포넌트로 분리하지 않은 이유는, 둘을 짝지어 쓰게 하면 **스페이서를 빠뜨릴 여지**가 생기기 때문이다.

이 변경으로 `pt-30`·`h-40`·`pt-40`이 전부 사라졌다.

### 변경 2: 크롬을 layout으로

```tsx
<DeviceProvider isMobile={isMobile}>
  {isMobile ? <MobileHeader /> : <DesktopHeader />}
  <main className="w-full min-h-screen">{children}</main>
  {isMobile ? <MobileFooter /> : <DesktopFooter />}
  {isMobile && <MobileTabBar />}
</DeviceProvider>
```

`<main>`이 헤더와 푸터 사이로 들어가면서 시맨틱 역전도 함께 해소됐다. 39개 page에서 UA 감지 3줄과 `isMobile` 삼항 블록이 사라진다.

### 변경 3: 홈 배너를 한 벌로

홈만 디바이스별로 배너 컴포넌트가 2벌이었고, 페이지가 골라서 prop으로 주입했다.

```tsx
// 변경 전
topBanner={isMobile ? <MobileHomeTopBanner /> : <DesktopHomeTopBanner />}

// 변경 후
topBanner={<HomeTopBanner />}
```

`adSlot/` 18개는 이미 내부에서 `useDevice()`로 갈리는 방식이었다. 홈만 예외였던 것을 표준에 맞췄다.

**슬롯 ID·크기·포맷은 그대로다.**

| 위치   | 모바일                  | 데스크톱             |
| ------ | ----------------------- | -------------------- |
| Top    | `4766781521` 320×100    | `3998737170` 728×90  |
| Bottom | `3812792500` in-article | `7641917377` 970×250 |

이 변경으로 홈에서 `isMobile`이 완전히 사라졌다.

### 변경 4: error·not-found의 중복 크롬 제거

두 파일은 layout 안쪽에서 렌더된다. 크롬을 남겨두면 **헤더가 두 번 그려진다.**

`error.tsx`에는 별도 문제도 있었다.

```tsx
// 제거된 코드
const isMobile = typeof window !== 'undefined'
  ? /mobile|android|iphone|ipad|ipod/i.test(navigator.userAgent)
  : false
const MobileHeader = dynamic(() => import('...'), { ssr: false })
```

**클라이언트에서 정규식으로 UA를 따로 판정**하고 있었다. 서버의 `detectUserAgent`와 다른 로직이라 판정이 어긋날 수 있고, SSR 시엔 항상 데스크톱으로 시작한다. 디바이스 분기를 CSS(`desktop:`)로 옮기면서 이 코드와 `dynamic` import 3개가 함께 사라졌다.

## 📊 변경 결과

### First Load JS — 페이지당 18~60kB 감소

크롬 5개가 39개 페이지 **각각의 번들에 포함**돼 있었다. 헤더는 `'use client'`이고 검색(Apollo `useLazyQuery`)·SubNav까지 끌고 오므로 덩치가 크다.

| 페이지                     | 변경 전 | 변경 후    | 감소   |
| -------------------------- | ------- | ---------- | ------ |
| `/champions/tournaments`   | 167 kB  | **107 kB** | −60 kB |
| `/detail/[pokemonId]`      | 186 kB  | **127 kB** | −59 kB |
| `/quiz`                    | 166 kB  | **107 kB** | −59 kB |
| `/privacy`                 | 165 kB  | **106 kB** | −59 kB |
| `/` (홈)                   | 172 kB  | **117 kB** | −55 kB |
| `/ability`                 | 202 kB  | **176 kB** | −26 kB |
| `/champions/[format]/list` | 205 kB  | **179 kB** | −26 kB |
| `/moves`                   | 205 kB  | **180 kB** | −25 kB |
| `/list`                    | 207 kB  | **189 kB** | −18 kB |

`/privacy`·`/quiz`처럼 가벼운 페이지에서 감소폭이 큰 것은, 원래 콘텐츠보다 크롬이 더 무거웠기 때문이다.

**공유 청크(102 kB)는 변하지 않았다.** 크롬이 shared로 들어간 것이 아니라 layout 전용 청크로 분리됐고, 페이지 이동 시 재다운로드되지 않는다.

### 코드량

| 항목                      | 변경 전              | 변경 후               |
| ------------------------- | -------------------- | --------------------- |
| UA 감지 수행 지점         | layout + 39개 page   | **layout 1곳**        |
| 데스크톱 상단 오프셋 종류 | 3종                  | **0종** (헤더가 소유) |
| 홈 배너 컴포넌트          | 4개 (디바이스별 2벌) | **2개**               |

38개 파일에서 1011줄이 사라지고 199줄이 추가됐다.

## 🔍 검증

### 크롬 중복 렌더 확인

layout과 페이지가 모두 크롬을 그리면 헤더가 두 번 나온다. 렌더된 HTML을 직접 세어 확인했다.

| 경로                | 전역 헤더 | `<main>` |
| ------------------- | --------- | -------- |
| `/list`             | 1         | 1        |
| `/champions/double` | 1         | 1        |
| `/`                 | 1         | 1        |
| 404 페이지          | 1         | 1        |

### 정적 검사와 라우트

| 항목                   | 결과      |
| ---------------------- | --------- |
| `tsc --noEmit`         | 0건       |
| ESLint 에러            | 0건       |
| 프로덕션 빌드          | 성공      |
| 라우트 10개 (404 포함) | 전부 정상 |

**확인하지 않은 것**: 실제 화면의 여백·정렬은 브라우저로 확인했으나 자동화 검증은 없다. sticky 요소(`desktop:top-30`/`top-40`)는 뷰포트 기준이라 부모 구조 변경에 영향받지 않는다.

## ⚠️ 구현 시 고려한 점

### sticky 좌표는 건드리지 않았다

`<main>` 재배치가 sticky 기준을 바꿀 것으로 우려했으나, `position: sticky`의 `top`은 **뷰포트 기준**이라 부모가 달라져도 값이 그대로 유효하다. 헤더 역시 `fixed`라 문서 흐름 밖에 있어 `<main>` 안팎 어디에 있든 렌더 위치가 같다.

### Providers 중첩은 남겨뒀다

5개 페이지가 `<Providers initialApolloState={...}>`로 SSR 캐시를 주입한다. 크롬이 layout으로 올라가면서 **헤더는 바깥 Apollo 인스턴스**를 쓰게 된다.

헤더 검색은 `useLazyQuery` + `cache-and-network`라 초기 캐시에 의존하지 않으므로 기능은 정상이다. 다만 헤더 검색 캐시와 페이지 캐시가 공유되지 않는다. `initialApolloState`가 페이지마다 다르므로 layout으로 올릴 수 없고, 해소하려면 Providers 구조 자체를 재설계해야 한다 — 이번 범위 밖으로 둔다.

## 📌 참고 사항

작업 중 앱 내부 changelog 페이지를 만들다 만 **미추적 파일 14개**를 발견해 삭제했다. `~/module/`·`views/desktop/` 같은 구 경로와 ADR-0007·0017이 폐기한 `.desktop`/`.mobile` 구조를 쓰고 있었고, 어떤 커밋에도 포함된 적이 없었다. changelog는 루트 폴더를 Docusaurus로 서빙하므로 앱 페이지는 불필요하다.

### 남은 Phase 2 항목

- 주석 정리(324파일) — 별도 PR로 분리
- `noUncheckedIndexedAccess` 26건 — ADR-0018의 재개 조건 참조
