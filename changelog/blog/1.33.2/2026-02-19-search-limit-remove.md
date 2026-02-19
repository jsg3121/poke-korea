---
slug: search-limit-remove
title: '포켓몬 검색 최소 글자 수 제한 제거'
description: '포켓몬 검색 시 2글자 이상 입력해야 하던 제한을 제거하여 1글자부터 검색이 가능하도록 개선'
authors: [jsg3121, claude]
tags: [ux, feature-improvement]
---

# 포켓몬 검색 최소 글자 수 제한 제거

> **작업 날짜**: 2026-02-19
> **브랜치**: `feature/1.33.2-search-limit-remove`

## 📋 작업 개요

**작업 유형**: 기능 개선
**담당**: jsg3121, claude

## 🎯 작업 목표

포켓몬 검색 입력 시 기존에 적용되어 있던 2글자 이상 입력 제한을 제거하여, 한 글자만 입력해도 검색 결과를 표시하도록 개선합니다. 한글 특성상 초성이나 한 글자(`피`, `리` 등)로도 유의미한 검색이 가능하므로 UX를 개선합니다.

<!-- truncate -->

## ✨ 주요 변경사항

### 변경 1: 검색 조건에서 글자 수 제한 제거

모바일과 데스크톱 검색 컴포넌트에서 `searchKeyword.length >= 2` 조건을 제거했습니다.

**변경 전**:
```tsx
if (searchKeyword !== '' && searchKeyword.length >= 2) {
  searchPokemon()
}
```

**변경 후**:
```tsx
if (searchKeyword !== '') {
  searchPokemon()
}
```

### 변경 2: placeholder 텍스트 업데이트

글자 수 제한 안내 문구를 제거하여 간결한 placeholder로 변경했습니다.

| 위치 | 변경 전 | 변경 후 |
| --- | --- | --- |
| 모바일 | `포켓몬 검색 (2글자 이상)` | `포켓몬 검색` |
| 데스크톱 | `포켓몬 검색 (2글자 이상 입력 필수)` | `포켓몬 검색` |

## 🔧 기술적 세부사항

| 수정 파일 | 변경 내용 |
| --- | --- |
| `src/container/mobile/header/header.search/HeaderSearchContainer.tsx` | 검색 조건 변경, placeholder 수정 |
| `src/container/desktop/header/header.search/DetailSearch.tsx` | 검색 조건 변경, placeholder 수정 |

- 기존 `useDebounce` 훅이 적용되어 있어 1글자 검색 시에도 디바운스가 동작하므로 과도한 API 호출은 방지됩니다.
- 데스크톱 메인 검색(`MainSearch.tsx`)은 폼 submit 방식으로 동작하며 기존에 글자 수 제한이 없어 수정 대상에서 제외했습니다.

## 📌 참고 사항

- 서버 측 `searchPokemonWithAllForms` 쿼리가 1글자 검색을 정상적으로 처리하는지 확인이 필요합니다.
- 검색 결과가 너무 많이 반환되는 경우 서버 측에서 결과 수 제한을 고려할 수 있습니다.
