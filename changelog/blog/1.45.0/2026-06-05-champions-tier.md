---
slug: 1-45-0-champions-tier
title: '[1.45.0] 챔피언스 티어 페이지 Phase 3 — 포맷 분리 + 인기 조합 + 카드 보강'
description: '/champions/tier 를 포맷별(/champions/[format]/tier) 라우트로 전환, 인기 조합 섹션(페어/트리오/스쿼드 TOP 3) 신규 도입, 티어 카드 정보 보강(폼 뱃지·순위·타입·승률), C/D 티어 아코디언 처리, FormatTab 칩 스타일 통일.'
authors: [jsg3121, claude]
tags: [feature, champions, breaking-change]
---

# 1.45.0 — 챔피언스 티어 페이지 Phase 3

> **작업 일자**: 2026-06-05
> **작업 브랜치**: `feature/1.45.0-champions-tier`
> **연결 SPEC**: `.claude/specs/champions-frontend-implementation-plan.md` (Phase 3)

## 📋 작업 개요

**작업 유형**: 라우트 구조 변경 + 신규 섹션 도입 + 카드 컴포넌트 보강 + 포맷 탭 디자인 갱신
**담당**: jsg3121 + Claude

`champions-frontend-implementation-plan.md` Phase 3 (티어) 단계. Phase 1/2 의 포맷 분리 패턴을
티어 라우트에도 동일하게 적용하고, 리스트 페이지와의 **차별점**을 명확히 하기 위해 사용자
피드백을 반영하여 "**인기 조합 섹션**" 을 도입했다.

ux-designer 에이전트로 정보 위계 진단 → ui-publisher 에이전트로 정적 시안 작성 →
사용자 피드백 반영 사이클 (3회) 을 거쳐 본 구현 진입했다.

<!-- truncate -->

## 🎯 라우트 구조 변경

| 변경 | 처리 |
| --- | --- |
| 신규 라우트 | `/champions/[format]/tier/page.tsx` (format = `vgc` \| `bss`) |
| 기존 라우트 삭제 | `/champions/tier/page.tsx` 제거 |
| 영구 리다이렉트 | `next.config.js` redirects: `/champions/tier` → `/champions/vgc/tier` (301) |
| sitemap | `/champions/vgc/tier`, `/champions/bss/tier` 추가, `/champions/tier` 제거 |
| metadata | `generateChampionsTierMetadata` canonical URL 포맷별 분기 |

## ⭐ 신규 섹션 — 최신 인기 조합

리스트 페이지와 티어 페이지의 차별점 명확화를 위해 도입. Phase 1 홈의
`championsTeamCores` 쿼리를 재활용해서 페어/트리오/스쿼드 TOP 3 노출.

### 페이지 구조

```
[페이지 헤더 — FormatTab + h1 + 갱신 시각 + 출처]
[최신 인기 조합 — 페어 TOP 3 / 트리오 TOP 3 / 스쿼드 TOP 3]   ← 신규
[광고]
[티어 그룹 — S/A/B/C/D]
```

### 데스크탑 1:1:1 그리드

데스크탑에서 페어/트리오/스쿼드 3개 섹션이 **가로 3열**로 배치되어 9개 카드가
한 화면에서 동시에 비교됨. 모바일은 세로 1열.

```
[페어 TOP 3]   [트리오 TOP 3]   [스쿼드 TOP 3]
 - 코어 1       - 코어 1         - 코어 1
 - 코어 2       - 코어 2         - 코어 2
 - 코어 3       - 코어 3         - 코어 3
```

### `ChampionsTierTeamCoreCard` 신규 컴포넌트

Phase 1 의 `ChampionsTeamCoreCard` (홈 페이지 큰 가로 카드) 와 분리해 티어 전용 컴팩트 카드 작성.

- **헤더 인라인 순위 뱃지 + 조합명** (옵션 C 디자인)
- 순위 뱃지에 **티어 색상 적용**:
  - `#1`: `bg-emerald-500` (S 티어와 동일)
  - `#2`: `bg-amber-500` (A 티어와 동일)
  - `#3`: `bg-blue-500` (B 티어와 동일)
- 이미지 크기 통일 (모든 사이즈 64px)
- 포켓몬 이미지 클릭 시 상세 페이지 진입 (Phase 4 라우트 확정 시 갱신 예정)
- 통계 (사용률 + 채용팀) 하단 2x1 그리드

## 🧩 티어 카드 정보 보강 — `ChampionsTierPokemonItem`

기존 카드는 "이미지 + 이름 + 사용률 + 사용률 바" 만 노출 → 백엔드 데이터를 폭넓게 활용.

### 변경 사항

| 항목 | 변경 |
| --- | --- |
| `displayName` 합성 로직 제거 | 백엔드 `name` 그대로 사용 (Phase 2 결정 잔존 정리) |
| `region`/`formName` 서브텍스트 제거 | 백엔드 `name` 에 이미 포함 → 중복 노출 방지 |
| **폼 뱃지 추가** (좌상단) | 메가(amber) / 리전(teal) |
| **순위 뱃지 추가** (우상단) | `#N` (usageRank) |
| **타입 뱃지 추가** | Phase 1 `TagComponent` 재사용 |
| **이름 → 타입 순서** | 이름이 타입 위로 (사용자 요구 반영) |
| **승률 진행 바 추가** | 사용률과 동일하게 `emerald-500` 게이지 |
| `winRate` null 처리 | 해당 줄 자체 미표시 (Pikalytics Top 50 외) |

### Phase 2 도감 카드와의 관계

티어 카드는 271종 그리드 시각 스캔 목적이므로 Phase 2 도감 카드(h-80) 가 아닌
**컴팩트 카드 유지**. 정보만 보강하는 방식으로 진행.

## 🎛 ChampionsFormatTab 칩 스타일 (Phase 1/2 카드 동시 갱신)

기존 하단 border 강조 방식 → **솔리드 칩** 스타일로 전환. 사용자 피드백:
"모바일에서 BSS 싱글 탭이 너무 흐릿하다".

```tsx
// 변경 전
isActive
  ? 'text-primary-4 font-bold border-b-2 border-primary-4'
  : 'text-primary-3 hover:text-primary-4'

// 변경 후
isActive
  ? 'bg-primary-1 text-white border-primary-1'
  : 'bg-primary-4 text-primary-1 border-primary-1 hover:bg-primary-3'
```

- 데스크탑/모바일 모두 동일 적용 (홈/리스트/티어 페이지 전체 영향)
- `rounded-full` 알약 모양 + `border-2` 외곽
- 활성/비활성 대비 명확

## 📂 C/D 티어 아코디언 처리

D 티어가 171종(전체 271종 중 63%) 으로 압도적이라 페이지 진입 시 스크롤 폭탄 + 이미지 로드
폭탄이 발생. 사용자 멘탈 모델(상위 티어 우선) 에 맞춰 아코디언 처리.

### 정책

| 티어 | 기본 상태 |
| --- | --- |
| S/A/B | 펼침 (즉시 노출) |
| C/D | 접힘 (헤더만 노출, 클릭 시 펼침) |

### 조건부 마운트

`isOpen` 상태에서만 카드 DOM 렌더링 → 펼치기 전에는 이미지 0장 로드.
171종 + 69종 = 240종 이미지가 진입 시점에 동시 로드되는 문제 해소.

```tsx
{isOpen && (
  <div id={`tier-group-${tier}-content`} className="grid ...">
    {sortedPokemons.map((pokemon) => (
      <ChampionsTierPokemonItem ... />
    ))}
  </div>
)}
```

### 접근성

- `<button>` 으로 헤더 감싸기 (키보드 포커스 가능)
- `aria-expanded` / `aria-controls` 적용

## 📊 GraphQL Fragment 변경

`ChampionsMetaSummary` Fragment 에 `updatedAt` 필드 추가:

```graphql
fragment ChampionsMetaSummary on ChampionsMetaStats {
  # ... 기존 필드
  updatedAt   # 신규
}
```

페이지 헤더에 "**YYYY-MM-DD 갱신**" 형태로 노출. 응답 중 가장 최신 `updatedAt` 사용.

## 🛠 기타 개선

### 디자인 일관성

- 인기 조합 카드의 외곽: `bg-primary-4 + border-[2px] border-primary-1 + 이중 그림자` (자사 표준 카드 무드)
- 티어 페이지 헤더: `bg-primary-4 rounded-xl p-6` (Phase 1/2 와 일관)
- 모바일 헤더는 `p-4` 로 작게 조정

### 검증 단계에서 발견 + 해결

1. **카드 높이 불일치** — 페어/트리오/스쿼드의 이미지 크기 분기(`48/44/40px`) 로 카드 높이가 달라짐 → 모든 사이즈 동일 크기(64px) 로 통일
2. **포맷 탭 모바일 흐림** — 비활성 탭 `text-primary-3` 가 다크 배경과 대비 부족 → 솔리드 칩 스타일로 전환
3. **티어 네비게이션 불필요** — 초기 META SUMMARY BAR (S/A/B/C/D 종수) 추가했으나, "스크롤 조금만 해도 보이니까" 사용자 판단으로 제거

## 🤖 사용한 에이전트 / 스킬

| 에이전트 | 사용 시점 | 산출물 |
| --- | --- | --- |
| `ux-designer` | 정보 위계 진단 + 컨텐츠 보강안 검토 | D 티어 처리 / 카드 보강 / 헤더 강화 옵션 보고서 |
| `ui-publisher` (시안 모드) | 정적 HTML/CSS 시안 (4개 파일) | `mockups/champions-tier/` (작업 완료 후 폐기) |

### 시안 사이클

1. UX 보고서 검토 → "리스트와의 차별점이 모호함" 사용자 지적 → **인기 조합 섹션** 도입 결정
2. v1 시안 — META SUMMARY BAR + 인기 조합(세로 스택) + 카드 변형 비교
3. 사용자 피드백 → 데스크탑 인기 조합을 **1:1:1 그리드** 로 변경
4. 본 구현 진입 후 카드 디자인 추가 보강 (코어 카드 분리, 순위 색상, 이미지 클릭)

## 🔧 검증

- `npm run lint`: 챔피언스 관련 신규 경고 없음
- `npx tsc --noEmit`: 통과
- `npm run build`: 성공 (`/champions/[format]/tier` 신규 라우트 정상 생성)
- dev 서버에서 VGC/BSS 진입 + 인기 조합 + C/D 아코디언 + 폼 뱃지 모두 확인

## 🔜 후속 작업 (Phase 4~5)

| Phase | 작업 브랜치 | 내용 |
| --- | --- | --- |
| Phase 4 | `feature/1.45.0-champions-detail` | 챔피언스 상세 (EV/카운터/사용률 신규 섹션, 폼 라우트 5개) + 출처 캡션 본격 노출 |
| Phase 5 | `feature/1.45.0-champions-tournaments` | 대회 신규 페이지 |

특히 Phase 4 에서 상세 라우트를 `/champions/[format]/list/[pokemonId]` 로 분리하여
지금 임시 유지 중인 `/champions/list/{externalDexId}` 링크들 (티어 카드, 인기 조합 카드) 을
일괄 정리한다.
