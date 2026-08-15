---
slug: move-detail-shell-dedupe
title: '기술 상세 두 라우트의 렌더 블록 중복 제거'
description: '기술 상세와 버전별 기술 상세가 prop 하나를 빼고 47줄이 동일한 렌더 코드를 각자 갖고 있던 것을, 공용 셸 컴포넌트로 합쳤습니다.'
authors: [jsg3121, claude]
tags: [refactoring]
---

# 기술 상세 두 라우트의 렌더 블록 중복 제거

> **작업 날짜**: 2026-08-15
> **브랜치**: `feature/1.56.0-skills-expansion`

## 📋 작업 개요

**작업 유형**: 리팩토링
**담당**: jsg3121, claude

## 🎯 작업 목표

`/moves/[id]`와 `/moves/[id]/version/[versionGroupId]`가 **렌더 블록 47줄을 각자 복제**해 갖고 있었다. 한쪽만 고치면 다른 쪽이 조용히 어긋나는 구조다.

<!-- truncate -->

## ✨ 주요 변경사항

### 문제: prop 하나 빼고 동일

두 페이지의 `return` 블록을 diff하면 실질 차이가 이것뿐이었다.

```diff
  <MoveDetailView
    skillId={skillId}
    initialSkill={skill}
    initialPokemonList={pokemonList}
    totalCount={totalCount}
+   selectedVersionGroupId={versionGroupId}
    versionGroups={versionGroups}
  />
```

나머지 — 크롬(헤더/푸터/탭바) UA 분기, `Providers` 하이드레이션, `main` 레이아웃 클래스, JSON-LD script 태그 — 는 완전히 같았다. 데스크톱 `pt-30` 같은 레이아웃 값도 두 곳에 각각 적혀 있어, 한쪽만 바뀌면 두 화면이 달라진다.

### 변경: 공용 셸로 통합

`_components/MoveDetailPageShell.tsx`를 만들어 두 라우트가 공유한다. 페이지는 데이터 준비와 JSON-LD 생성만 하고, 조립은 셸이 맡는다.

```tsx
<MoveDetailPageShell
  isMobile={isMobile}
  initialApolloState={initialApolloState}
  skillId={skillId}
  skill={skill}
  pokemonList={pokemonList}
  totalCount={totalCount}
  versionGroups={versionGroups}
  selectedVersionGroupId={versionGroupId}  // 버전 라우트만
  jsonLd={jsonLd}
  jsonLdId="move-detail-version-webpage-jsonLd"
/>
```

JSON-LD는 최신/버전별로 스키마가 달라 페이지가 만들어 넘긴다. script `id`도 페이지마다 고유해야 해서 함께 받는다.

## 📊 변경 요약

| 파일 | 변경 전 | 변경 후 |
| --- | ---: | ---: |
| `[id]/page.tsx` | 146줄 | **108줄** |
| `[versionGroupId]/page.tsx` | 176줄 | **137줄** |
| `_components/MoveDetailPageShell.tsx` | — | 98줄 (신규) |

## 🔧 기술적 세부사항

**`/moves` 목록은 그대로 두었다**

`_fetch` 이관 후보였으나 **쿼리 1개·라우트 1개**라 분리해도 파일만 늘고 얻는 게 없다. 컨벤션에 명문화한 "공유되면 분리" 기준과도 일치한다.

**`_components/` 컨벤션 추가**

`src/components/`(도메인 무관 DS)와 구분이 필요해 `coding.md`에 규칙을 넣었다. 이 셸은 `initialApolloState` 하이드레이션 같은 **라우트 맥락**을 담으므로 DS로 올리면 그 맥락이 전역 컴포넌트에 새어 들어간다.

**검증**

렌더 구조를 통째로 옮겼으므로 실제 출력이 같은지 확인했다.

| 확인 | `/moves/7` | `/moves/7/version/18` |
| --- | --- | --- |
| HTTP | 200 | 200 |
| JSON-LD id | `move-detail-webpage-jsonLd` | `move-detail-version-webpage-jsonLd` |
| `main` 태그 | 1개 | 1개 |
| active 버전 칩 | — | **18** (정상 전달) |

`selectedVersionGroupId`가 셸을 거쳐 제대로 전달되는 것을 active 칩으로 확인했다.

## 📌 참고 사항

- 검증: `tsc --noEmit` 에러 0 / `npm run lint` 에러 0 / 렌더 결과 실측
- 두 페이지에서 더 이상 쓰지 않는 import 8개씩(크롬 컴포넌트·`Providers`·`Fragment` 등)도 함께 제거했다.
