---
slug: 1-45-0-champions-seo
title: '[1.45.0] 챔피언스 SEO 종합 점검 + 시맨틱/접근성 개선 + SubNav 수정'
description: 'seo-specialist 에이전트로 챔피언스 전체 페이지 SEO 종합 점검 후 우선순위별 수정 적용. title 중첩 제거, JSON-LD URL 정확성, sitemap 폼 라우트 + BSS 추가, 시맨틱 HTML/접근성, ChampionsSubNav 활성화 로직 갱신.'
authors: [jsg3121, claude]
tags: [seo, a11y, champions, refactor]
---

# 1.45.0 — 챔피언스 SEO 종합 점검 + 시맨틱/접근성 개선

> **작업 일자**: 2026-06-05
> **작업 브랜치**: `feature/1.45.0-champions-seo`

## 📋 작업 개요

**작업 유형**: SEO 점검 + 시맨틱 HTML / 접근성 / 버그 수정
**담당**: jsg3121 + Claude

Phase 1~4 완료 후 Phase 5 진입 전 챔피언스 영역 SEO 부채를 정리하기 위해
seo-specialist 에이전트로 종합 점검 → 우선순위(High/Medium/Low) 별 권장 사항을
사용자와 합의 후 모두 적용했다.

부가로 ChampionsSubNav 의 활성화 매칭 로직이 Phase 1~4 의 URL 변경 (`/champions/list` →
`/champions/[format]/list`) 으로 깨진 상태를 함께 수정.

<!-- truncate -->

## 🔍 SEO 점검 흐름

1. `seo-specialist` 에이전트로 챔피언스 8개 라우트 전체 점검
2. 점검 결과를 High / Medium / Low 로 분류한 보고서 수령
3. 사용자가 보고서 검토 후 모두 적용 결정 (거다이맥스 케이스만 유지 — 챔피언스 영역에 거다이맥스 없음)
4. 작업 단위별로 커밋 분리 (SubNav / title 중첩 / JSON-LD / sitemap / 시맨틱+접근성 / changelog)

## ✅ 수정 사항 — 우선순위별

### High (SEO 영향 큼)

| # | 항목 | 변경 |
| --- | --- | --- |
| **title** | 폼 정보 중첩 제거 | `getFormSuffix` 함수 폐기. 백엔드 응답 `pokemon.name` 그대로 사용 (예: "메가리자몽X (메가리자몽X)" → "메가리자몽X") |
| H1 | 리스트 ItemList JSON-LD URL | `formatSlug` 누락 → 추가 (`/champions/{format}/list/{id}`) |
| H2 | 상세 BreadcrumbList 폼 라우트 반영 | 마지막 항목이 항상 BASE URL 가리키던 문제 → 실제 폼 URL (mega/region 등) 로 변경 |
| H4 | sitemap 챔피언스 폼 라우트 추가 | 기존 BASE URL 만 → 폼 라우트 (mega/region/gigantamax/form) 모두 색인 대상 추가 |
| H5 | sitemap BSS 포맷 쿼리 추가 | VGC 만 조회하던 챔피언스 쿼리 → VGC + BSS 분리 조회 (BSS 전용 포켓몬 누락 방지) |

### Medium (개선 권장)

| # | 항목 | 변경 |
| --- | --- | --- |
| M1 | 홈 페이지 `<main>` 태그 추가 | view 컴포넌트를 `<main>` 으로 감싸기 |
| M2 | `<ul>` 의 `role="region"` 제거 4곳 | landmark 요소에만 사용 가능. `<ul>` 에 부여 시 list 역할 덮어쓰기 |
| M3 | `aria-description` 비표준 속성 제거 5곳 | `aria-hidden="true"` 또는 `aria-label` 로 교체 |
| M4 | 티어 ItemList 에 실제 포켓몬 URL 포함 | 티어 그룹만 나열 → S/A/B 상위 20개 포켓몬 URL 노출 |
| M5 | 리스트 카드 그리드 `<ul>`/`<li>` 적용 | div.grid → `<ul role="list">` (스크린 리더 "N개 항목" 안내) |
| M6 | `ChampionsPartnerList` 이미지 교체 | `<img>` → `ImageComponent` (densities + loading=lazy) |

### Low (선택 사항도 모두 적용)

| # | 항목 | 변경 |
| --- | --- | --- |
| L1, L2 | 이미지 alt 텍스트 개선 | "pokemon_id_{N} {name}" → "{name} 포켓몬 이미지" |
| L3 | `<i>` → `<span aria-hidden="true">` | 의미 없는 장식 래퍼 정리 |
| L4 | SITE_NAME / SITE_URL 공통 상수 추출 | `src/constants/seo.constant.ts` 신설 |
| L5 | sitemap shinyPages 제거 | `?shinyMode=shiny` 쿼리 변형 URL — Google 크롤링 예산 낭비 |
| L6 | `ChampionsTopCard` lazy placeholder 크기 통일 | `w-36` → `w-40` (실제 이미지 160px 와 일치) |

### 유지된 항목 (의도적)

- **거다이맥스 케이스**: 챔피언스 영역에 거다이맥스 폼이 등장하지 않으므로 `buildCanonicalPath` 의 GIGANTAMAX 처리 추가 불필요 (utils 함수 `buildChampionsDetailHref` 에는 GIGANTAMAX 도 포함되어 있어 영향 없음)

## 🛠 추가 수정 — ChampionsSubNav 활성화 로직

Phase 1~4 의 URL 변경으로 SubNav 의 활성화 매칭이 깨진 상태였다.

### 기존 (Phase 0)

```typescript
{ href: '/champions/list', ... }
pathname.startsWith('/champions/list') // 새 URL '/champions/vgc/list' 와 불일치
```

→ Phase 1~4 작업 후 어느 페이지에서도 SubNav 가 활성 상태로 표시되지 않음.

### 변경 후

```typescript
const isActive = (section: SubNavSection) => {
  const segments = pathname.split('/').filter(Boolean) // ['champions', 'vgc', 'list', ...]
  if (segments[0] !== 'champions') return false
  const sectionSegment = segments[2] // 'list' | 'tier' | undefined
  if (section === 'home') return !sectionSegment
  return sectionSegment === section
}
```

- URL `segments[2]` 로 section 식별 (포맷 무관)
- href 는 `CHAMPIONS_DEFAULT_FORMAT_SLUG` (vgc) 기반 기본 URL
- `aria-current="page"` 추가 (접근성)

## 🔧 검증

- `npx tsc --noEmit`: 통과
- `npm run build`: 성공
- 모든 챔피언스 페이지 (홈/리스트/티어/상세/폼 라우트 7종) 정상 빌드
- 브라우저 dev tools 로 sitemap.xml 신규 URL 확인

## 🔜 후속

| Phase | 작업 | 상태 |
| --- | --- | --- |
| Phase 5 | 대회 페이지 신규 작성 | 다음 진입 |
