---
slug: skill-card-form-index
title: '기술·특성 상세의 폼 카드 링크를 백엔드 formIndex로 생성'
description: '기술·특성 상세의 포켓몬 카드가 imagePath에서 폼 인덱스를 추측해 비비용·실버디·마휘핑 등 75개 폼이 기본 페이지로 연결되던 문제를, 백엔드가 내려주는 formIndex로 링크를 만들어 해결했다.'
authors: [jsg3121, claude]
tags: [bug-fix, graphql]
---

# 기술·특성 상세의 폼 카드 링크를 백엔드 formIndex로 생성

> **작업 날짜**: 2026-10-30
> **브랜치**: `feature/1.62.1-skill-card-form-index`

## 📋 작업 개요

**작업 유형**: 버그 수정 (핫픽스)
**담당**: jsg3121, Claude

## 🎯 작업 목표

기술 상세(`/moves/[id]`)와 특성 상세(`/ability/[id]`)의 포켓몬 카드가 해당 폼의 상세 페이지로 정확히 연결되게 한다.

<!-- truncate -->

## 📉 왜 필요했나

`PokemonBySkillCard`와 `PokemonByAbilityCard`는 카드 링크의 폼 인덱스를 `imagePath` 문자열에서 파싱했다.

- 메가·리전폼: `imagePath`의 마지막 글자를 숫자로 변환
- 노말폼: `imagePath`를 `_`로 나눈 두 번째 조각을 숫자로 변환

그런데 노말폼 `imagePath`에는 `773-fire`처럼 인덱스 없이 이름만 붙은 값이 섞여 있다. 이 경우 파싱 결과가 `NaN`이 되어 인덱스가 0 이하로 판정되고, 비비용·실버디·마휘핑 등 **75개 폼이 기본 페이지로 연결**됐다.

`imagePath`는 이미지 파일 이름이지 상세 페이지 정렬 순서가 아니므로, 링크 인덱스의 근거로 쓸 수 없었다.

## ✨ 주요 변경사항

### 변경 1: GraphQL 조회 필드에 `formIndex` 추가

백엔드가 상세 페이지와 같은 정렬 기준으로 계산한 `formIndex`를 함께 조회한다.

- `PokemonWithAbilityInfo` fragment (특성 상세)
- `GetPokemonsBySkill` query (기술 상세)

### 변경 2: 카드 링크를 `formIndex`로 생성

**변경 전**:

```tsx
if (pokemonData.formType === 'NORMAL') {
  const formIndex = pokemonData.imagePath
    ? parseInt(pokemonData.imagePath.split('_')[1], 10)
    : 0
  return formIndex > 0 ? `${baseUrl}/form/${formIndex}` : baseUrl
}
```

**변경 후**:

```tsx
const formIndex = pokemonData.formIndex ?? 0

if (pokemonData.formType === 'NORMAL') {
  return formIndex > 0 ? `${baseUrl}/form/${formIndex}` : baseUrl
}
```

메가·리전폼 분기도 같은 `formIndex`를 쓰도록 바꿨고, `useMemo` 의존성을 `imagePath`에서 `formIndex`로 교체했다.

## 🔍 검증

운영 배포 후 실제 페이지를 요청해 확인했다.

- `/ability/225`(AR시스템)과 `/ability/121`(멀티타입)에서 실버디·아르세우스 폼 17개가 모두 `/form/1`~`/form/17`로 연결된다.
- 카드에 표시된 폼 이름과 링크 대상 페이지의 제목을 표본 대조했고 모두 일치했다. 예: 실버디 드래곤 타입 → `/detail/773/form/14`, 실버디 풀 타입 → `/detail/773/form/4`
- `/moves/33`(몸통박치기)의 리전폼 카드(가라르 야돈·야도란, 알로라 텅구리)가 각 리전폼 페이지로 연결된다.

## 📌 참고 사항

- 이 변경은 백엔드가 `PokemonWithAbility`·`PokemonLearnInfo`에 `formIndex`를 추가한 배포에 의존한다. 백엔드를 되돌리면 `formIndex`가 없어져 모든 폼 카드가 기본 페이지로 연결된다.
