---
slug: header-search-dropdown
title: '상단 검색 결과 선택 후 드롭다운이 남는 문제 수정'
description: '상단 검색바에서 포켓몬을 골라 상세 페이지로 이동해도 결과 드롭다운이 계속 열려 있던 문제를 고쳐, 이동 후에는 드롭다운이 닫히고 입력한 검색어만 남도록 했습니다.'
authors: [jsg3121, claude]
tags: [bug-fix, ux]
---

# 상단 검색 결과 선택 후 드롭다운이 남는 문제 수정

> **작업 날짜**: 2026-10-01
> **브랜치**: `feature/1.61.1-header-search-dropdown`

## 📋 작업 개요

**작업 유형**: 버그 수정
**담당**: Claude Code

## 🎯 작업 목표

도감(`/list`)을 제외한 페이지의 상단 검색바에서 결과를 눌러 이동하면, 드롭다운은 닫히고 입력창에는 검색어가 남게 한다.

<!-- truncate -->

## 📉 왜 필요했나

데스크톱에서 결과를 눌러 상세 페이지로 이동해도 검색 결과 드롭다운이 열린 채로 남았다.

- 헤더는 layout에 있어서 App Router가 페이지를 이동해도 다시 마운트되지 않는다. 그래서 `isShowSearchResult`가 `true`로 남는다.
- 드롭다운이 닫히는 경우는 바깥 클릭(`useOutSideClick`)과 검색어 비우기, 두 가지뿐이다. 결과 링크는 검색 영역 **안쪽**에 있어서 눌러도 바깥 클릭으로 잡히지 않는다.

원래는 데스크톱·모바일 모두 `key={pathname}`으로 페이지 이동 때마다 검색 컴포넌트를 다시 마운트해 상태를 초기화했다(2025-06-04, `c8168c85`). 2025-09-29 PC 헤더 통일(`9de59c28`) 때 데스크톱의 `key`가 빠지면서 이 문제가 다시 생겼다.

모바일은 `key`가 남아 있어 드롭다운은 닫혔지만, 다시 마운트되면서 입력한 검색어까지 지워졌다.

## ✨ 주요 변경사항

### 결과를 클릭하면 드롭다운 닫기

`useSearchPokemon`이 닫기 함수 `handleHideSearchResult`를 반환하게 했다. 이 함수를 `SearchResultList`의 `onSelectPokemon`을 거쳐 각 결과 링크의 `onClick`으로 전달한다.

```tsx
<SearchResultList
  pokemonList={pokemonList}
  loading={loading}
  onSelectPokemon={handleHideSearchResult}
/>
```

### 모바일 `key={pathname}` 제거

```tsx
// 변경 전
<HeaderSearch key={`search-key-${pathname}`} />
// 변경 후
<HeaderSearch />
```

드롭다운은 클릭으로 닫히므로, 다시 마운트해서 초기화할 필요가 없다. 입력창은 비제어(uncontrolled) 상태라 마운트가 유지되면 검색어도 그대로 남는다.

## ⚠️ 구현 시 고려한 점

| 방안 | 판단 |
| --- | --- |
| **결과 클릭 시 닫기 (채택)** | 지금 보고 있는 페이지의 포켓몬을 눌러 경로가 바뀌지 않아도 닫힌다. 닫는 이유가 클릭 위치에 그대로 드러난다. |
| `usePathname` 변경 시 닫기 | 훅 한 곳만 고치면 되지만, 같은 경로를 누르면 닫히지 않고 뒤로 가기 같은 다른 이동에도 반응한다. |
| 데스크톱에 `key={pathname}` 복원 | 원래 방식이지만 다시 마운트되면서 검색어가 지워진다. 요구사항과 맞지 않는다. |

## 🔍 검증

- `eslint`, `prettier`, `tsc --noEmit` 통과
- 바뀐 컴포넌트를 쓰는 Storybook 스토리가 없음을 확인
- 실제 화면 동작은 확인하지 않았다.

## 📌 참고 사항

- 드롭다운이 닫힌 뒤 같은 검색어 그대로 입력창을 다시 눌러도 드롭다운은 열리지 않는다. 디바운스된 검색어가 바뀌어야 다시 조회하고 열기 때문이다. 이전 동작(바깥 클릭으로 닫은 뒤)과 같다.
