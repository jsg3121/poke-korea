---
slug: form-z-moves
title: 'Z기술이 없는 노말폼에 base 전용 Z기술이 표시되던 문제 수정'
description: '옷갈아입기·파트너 피카츄처럼 Z기술을 쓸 수 없는 노말폼 상세에 기본 피카츄의 필살피카슛이 표시되던 문제를, 노말폼이 있으면 폼의 Z기술만 쓰도록 고쳐 해결했다.'
authors: [jsg3121, claude]
tags: [bug-fix]
---

# Z기술이 없는 노말폼에 base 전용 Z기술이 표시되던 문제 수정

> **작업 날짜**: 2026-10-30
> **브랜치**: `feature/1.62.1-form-z-moves`

## 📋 작업 개요

**작업 유형**: 버그 수정 (핫픽스)
**담당**: jsg3121, Claude

## 🎯 작업 목표

포켓몬 상세의 전용 Z기술 영역이 현재 보고 있는 폼의 Z기술만 보여주게 한다.

<!-- truncate -->

## 📉 왜 필요했나

`DetailExclusiveMoves`는 노말폼의 Z기술 목록이 비어 있으면 base 포켓몬의 Z기술로 대신 채웠다. 그래서 Z기술을 쓸 수 없는 폼(옷갈아입기 피카츄, 하드록 피카츄 등)에도 기본 피카츄 전용 Z기술인 필살피카슛이 표시됐다.

빈 목록은 "데이터 없음"이 아니라 "Z기술 없음"이라는 뜻이었는데, 이를 폴백 조건으로 써서 생긴 문제다.

## ✨ 주요 변경사항

### 변경 1: 노말폼이 있으면 폼의 Z기술만 사용

**변경 전**:

```tsx
const formZMoves = normalForm?.[0]?.exclusiveZMoves
return formZMoves && formZMoves.length > 0
  ? formZMoves
  : (pokemonBaseInfo?.exclusiveZMoves ?? [])
```

**변경 후**:

```tsx
if (normalForm && normalForm.length > 0) {
  return normalForm[0]?.exclusiveZMoves ?? []
}
return pokemonBaseInfo?.exclusiveZMoves ?? []
```

base로 폴백하는 경우는 노말폼 데이터가 아예 없는 종(기본 페이지)으로 한정했다.

## 🔍 검증

운영 배포 후 실제 페이지를 요청해 HTML 본문(스크립트 제외)에 렌더된 Z기술을 확인했다.

| 페이지                      | 전용 Z기술 영역       |
| --------------------------- | --------------------- |
| `/detail/25` (피카츄)       | 필살피카슛            |
| `/detail/25/form/1` (옷갈아입기) | 영역 없음        |
| `/detail/25/form/2` (하드록)     | 영역 없음        |
| `/detail/25/form/8` (오리지널캡) | 1000만볼트만 표시 |

폼 페이지의 RSC 페이로드에는 base 데이터가 직렬화돼 필살피카슛 문자열이 남아 있지만, 화면에는 렌더되지 않는다.
