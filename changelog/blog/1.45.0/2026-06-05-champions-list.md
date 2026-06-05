---
slug: 1-45-0-champions-list
title: '[1.45.0] 챔피언스 리스트 페이지 Phase 2 — 포맷 분리 + 메타 카드 + 정렬'
description: '/champions/list 를 포맷별(/champions/[format]/list) 라우트로 전환, 도감 카드를 메타 카드로 재설계(종족값/사용률/승률), 정렬 셀렉트박스 + sticky 필터 블록 도입, 백엔드 ChampionsPokemon 메타 필드/폼별 id 변경 대응.'
authors: [jsg3121, claude]
tags: [feature, champions, breaking-change]
---

# 1.45.0 — 챔피언스 리스트 페이지 Phase 2

> **작업 일자**: 2026-06-04 ~ 2026-06-05
> **작업 브랜치**: `feature/1.45.0-champions-list`
> **연결 SPEC**: `.claude/specs/champions-frontend-implementation-plan.md` (Phase 2)

## 📋 작업 개요

**작업 유형**: 라우트 구조 변경 + 카드 컴포넌트 재설계 + 필터/정렬 UI + 백엔드 스키마 변경 대응
**담당**: jsg3121 + Claude

`champions-frontend-implementation-plan.md` Phase 2 (리스트) 단계. Phase 1 의 포맷 분리 패턴을
리스트 라우트에도 동일하게 적용하고, 카드를 "도감"이 아닌 **"메타 분석 카드"** 로 재설계했다.

ux-designer 에이전트로 정보 위계 검토 → ui-publisher 에이전트로 정적 시안(`mockups/champions-list-v2/`)
작성 → 사용자 피드백 4회 반영 사이클을 거쳐 카드 변경/필터 위치/sticky 동작을 합의한 뒤
본 구현 진입했다.

<!-- truncate -->

## 🎯 라우트 구조 변경

| 변경 | 처리 |
| --- | --- |
| 신규 라우트 | `/champions/[format]/list/page.tsx` (format = `vgc` \| `bss`) |
| 기존 라우트 삭제 | `/champions/list/page.tsx` 제거 |
| 영구 리다이렉트 | `next.config.js` redirects: `/champions/list` → `/champions/vgc/list` (301) |
| sitemap | `/champions/vgc/list`, `/champions/bss/list` 추가, `/champions/list` 제거 |
| metadata | `generateChampionsPokedexMetadata` canonical URL 포맷별 분기 |

## 🧩 카드 컴포넌트 재설계 — 도감 → 메타 카드

### 카드 외곽 보존 원칙

사용자 요구: **"카드 형태를 수정할 때 전체적인 카드 모양의 레이아웃은 유지했으면 좋겠어,
나름 다른 페이지들과 동일하게 통일성을 준 거라서"**

다음 요소를 **그대로 보존**해 도감 카드와의 통일감을 유지했다.

- 타입 배경 그라데이션 (`linear-gradient(135deg, ${type1} 35%, ${type2} 65%)`)
- 외곽: `border border-solid border-black-2 rounded-[10px]` + `outline-[0.25rem] outline outline-white`
- 카드 모서리 fold (`card-corner-fold` 의사 요소)
- 좌측 inset 그림자: `shadow-[inset_10px_0_0_0_rgb(51_65_80)]`
- 좌상단 몬스터볼, 우상단 `No.{번호}` + 이름, 중앙 이미지, 타입 태그

### 스탯 영역만 교체

| 이전 (Phase 0) | 신규 (Phase 2) |
| --- | --- |
| 6개 스탯 grid (체력/공격/방어/특수공격/특수방어/스피드) | 세로 스택 (종족값/사용률/승률) |

```html
<dl class="grid grid-rows-3">
  <div class="flex justify-between">
    <dt>종족값</dt><dd>{stats.total}</dd>
  </div>
  <div class="flex justify-between">
    <dt>사용률</dt><dd>{usageRate ?? '-'}%</dd>
  </div>
  <div class="flex justify-between">
    <dt>승률</dt><dd>{winRate ?? '-'}%</dd>
  </div>
</dl>
```

- `winRate` null 시 `-` 표시 (Pikalytics Top 50 외 케이스)
- 카드 높이 `h-80` 유지 — 시안 진행 중 `h-72` 로 축소했다가 승률 줄 잘림 발생해 원복
- hover: `hover:scale-[1.2]` → `hover:scale-105` (Phase 1 표준 통일)

### 모바일/데스크탑 디자인 완전 동일

사용자 요구: **"카드 디자인도 모바일이랑 동일해야 해 카드 사이즈만 작은 거고"**

- 노출 정보 동일 (3줄)
- 외곽/스탯 그리드 구조 100% 동일
- 사이즈만 다름 (이미지 데스크탑 160px / 모바일 108px, 카드 5열 / 2열)

### 표시하지 않는 정보 (시안 결정 사항)

- ❌ 티어 뱃지 (S/A/B/C) — 리스트 페이지에서는 카드/필터 모두 제외
- ❌ usageRank (#1, #5 등) — 표시 안 함

## 📊 GraphQL Fragment + 쿼리 변경

### Fragment 갱신

```graphql
fragment ChampionsPokemonCard on ChampionsPokemon {
  # ... 기존 필드
  usageRate   # 신규
  winRate     # 신규
}
```

### `getChampionsPokemonList` 정렬 인자

백엔드의 신규 `ChampionsPokemonSort` enum 활용:
- `DEX`: 도감번호순
- `USAGE`: 사용률 내림차순 (기본값)

URL searchParam `?sort=dex` 로 동기화. 신규 컴포넌트 `ChampionsPokedexSortSelect` 에서 라우터 갱신.

## 🎛 필터 / 정렬 UI

### sticky 필터 블록

- 페이지 헤더(h1 + FormatTab) 아래 → 정렬 셀렉트박스 + TypeFilter 묶음을 sticky 처리
- 스크롤 시 헤더는 흐르고 필터만 상단 고정
- 컨테이너 레벨에서 `position: sticky; top: ...; z-index: 20;`

### `ChampionsPokedexSortSelect` 신규 컴포넌트

- `<select>` 기반, URL searchParam 갱신 (`router.push(pathname?sort=...)`)
- 옵션: 사용률순(기본) / 도감번호순
- 자사 셀렉트박스 패턴 (`bg-primary-4 + border-primary-1 + rounded-md`)

### `ChampionsTypeFilter` 모바일 대응

- 가로 스크롤 (`overflow-x-auto` + `flex-shrink-0`) 추가
- 스크롤바 hidden 처리 (`[&::-webkit-scrollbar]:hidden`)
- 데스크탑은 기존 `justify-between` 균등 배치 유지
- "초기화" 버튼 데스크탑 마진 (`desktop:ml-4`) 추가 — 마지막 타입과 시각적 간격

### `ChampionsFormatTab` 확장

- `suffix` prop 추가 — `basePath/{slug}{suffix}` 패턴
- 리스트 페이지에서 `suffix="/list"` → `/champions/vgc/list`, `/champions/bss/list`

## ⚠️ 백엔드 의존 변경 대응

### 1. `ChampionsPokemon` 에 메타 필드 추가 (백엔드 요청 → 반영 완료)

기존 `ChampionsPokemon` 은 기본 정보만 가져서 카드에 사용률/승률 노출 불가능했음.
백엔드에 다음 필드 노출 요청 후 반영:

- `usageRate: Float` (Top 50: Pikalytics / 51위 이하: Smogon)
- `winRate: Float?` (Pikalytics Top 50만 값 보유)
- `usageRank: Int?`
- `tier: String?`

### 2. 폼별 고유 `id` 변경 (Apollo 캐시 정규화 충돌 해소)

**발견된 이슈**: 스크롤로 추가 페이지 로딩 시 메가프테라/일반 프테라가 같은 카드(메가프테라)로 표시됨.

**근본 원인**: Apollo InMemoryCache 는 `__typename + id` 로 객체를 flat 정규화하는데,
이전 백엔드 응답에서 두 폼이 동일한 `id="142"` 를 가져 같은 캐시 객체로 머지됨.

**해결**: 백엔드의 `ChampionsPokemon.id` 를 폼별 고유값으로 변경:
- 일반 프테라: `id="142:BASE:"`
- 메가프테라: `id="142:MEGA:M0142013"`

→ Apollo 캐시가 자동으로 별도 객체로 인식하여 충돌 해소.

### 3. 백엔드 응답 `name` 그대로 사용 — 프론트 합성 로직 제거

기존: 프론트에서 `${name} (${region} ${formName})` 형태로 합성.
백엔드가 완성된 `name` 응답 시작 → 프론트 `getDisplayName()` 함수 폐기.

- `ChampionsPokemonCard` (Phase 2) — 합성 로직 제거, `pokemonData.name` 그대로 사용
- `ChampionsTopCard` (Phase 1 카드, 동시 정리) — 동일하게 제거, `pokemonData.name ?? ''` (nullable 폴백)

## 🛠 기타 개선

### 광고 슬롯 그리드 정렬 보존

- 데스크탑: 첫 행(5개) 직후 광고에 `col-span-5` 적용 — 5열 그리드 깨지지 않음
- 모바일: 5번째 카드 직후 광고에 `col-span-2` 적용 — 2열 그리드 깨지지 않음

### Partner nullable 폴백 확인

SPEC Phase 2 의 "Partner null 폴백" 항목은 `ChampionsPartnerList` 컴포넌트에 이미 처리 완료
(`item.name || item.rawName || ''` + `item.pokemonId != null` 가드) — 추가 작업 불필요.

## 🤖 사용한 에이전트 / 스킬

| 에이전트 | 사용 시점 | 산출물 |
| --- | --- | --- |
| `ux-designer` | 정보 위계 검토 (Phase 0 카드의 한계 파악) | 카드 무드 옵션 비교 + 권장안 보고서 |
| `ui-publisher` (시안 모드) | 정적 HTML/CSS 시안 작성 | `mockups/champions-list-v2/` 4개 파일 (사용자 합의 후 폐기) |

### 시안 사이클 (피드백 4회 반영)

1. v1 시안 — 카드 우상단 오버레이 메타 띠 + 보조 필터 바 (정렬/티어/검색)
2. 사용자 피드백 → 메타 정보를 카드 하단 스탯 영역으로 이동 + 티어/검색 제거
3. v2 시안 재작성 — 2x2 그리드 + sticky 필터 블록 + TypeFilter 위치 이동
4. 사용자 피드백 → 스탯 영역 가로 줄(종족값/사용률/승률) + 카드 사이즈 축소 시도
5. 본 구현 진입 후 카드 높이 잘림 발생 → `h-80` 원복

> 시안 사이클은 본 구현 진입 전 무드/정보 위계 합의를 위한 비용 효율적 도구.
> Phase 1 의 시안 폐기 경험에서 정착시킨 패턴 (`ui-publisher` 의 자사 무드 재현 의무) 유지.

## 🔧 검증

- `npm run lint`: 챔피언스 관련 신규 경고 없음
- `npx tsc --noEmit`: 통과
- `npm run build`: 성공
- dev 서버에서 VGC/BSS 진입 + 정렬 셀렉트 + 모바일 필터 + 무한 스크롤 + 메가/일반 폼 카드 분리 모두 확인

## 🔜 후속 작업 (Phase 3~5)

| Phase | 작업 브랜치 | 내용 |
| --- | --- | --- |
| Phase 3 | `feature/1.45.0-champions-tier` | 챔피언스 티어 (폼별 분리 노출) |
| Phase 4 | `feature/1.45.0-champions-detail` | 챔피언스 상세 (EV/카운터/사용률 신규 섹션, 폼 라우트 5개) + 출처 캡션 본격 노출 |
| Phase 5 | `feature/1.45.0-champions-tournaments` | 대회 신규 페이지 |

특히 Phase 4 에서는 상세 라우트를 폼별로 분리해 (`/champions/[format]/list/[pokemonId]`)
지금 임시 유지 중인 `/champions/list/{externalDexId}` 링크를 일괄 정리한다.
