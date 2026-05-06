---
slug: type-effectiveness-links
title: '타입 상성 결과 영역 인터랙션·CTA 강화'
description: '타입 상성 결과 칩을 클릭 가능한 도감 링크로 변경하고, 결과 영역 하단에 다음 행동을 유도하는 CTA 카드 섹션을 추가했습니다.'
authors: [jsg3121, claude]
tags: [seo, ux-improvement, traffic-growth]
---

# 타입 상성 결과 영역 인터랙션·CTA 강화

> **작업 날짜**: 2026-05-06
> **브랜치**: `feature/1.40.0-type-effectiveness-links`

## 작업 개요

**작업 유형**: SEO / UX 개선
**담당**: Claude
**연관 분석**: `.claude/research/reports/STR-2026-05-04-poke-korea-traffic-growth.md` (단계 C-1, C-2)

## 작업 목표

`/type-effectiveness` 페이지가 30일 UV 26,228명으로 사이트 전체 MAU(23,047)를 초과하는 단일 페이지 의존 구조를 해소합니다. BA 보고서 병목 4 진단에 따르면 결과 영역의 타입 칩이 단순 `<span>` 요소라 사용자가 다른 페이지로 이동할 단서가 없었습니다. 본 작업은 결과 영역 안의 칩과 결과 영역 하단의 별도 CTA 섹션 두 곳에서 다음 행동 경로를 제공합니다.

<!-- truncate -->

## 주요 변경사항

### 1. C-1: 타입 결과 칩을 도감 링크로 변경

기존 `<span>` 요소였던 `TypeResultChip`을 Next `<Link>`로 교체했습니다.

**변경 전**:

```tsx
<span style={{ backgroundColor: CardColor[typeValue] }} className="...">
  <i>아이콘</i>
  {typeLabel}
</span>
```

**변경 후**:

```tsx
<Link
  href={`/list?type=${typeValue}`}
  aria-label={`${typeLabel} 타입 포켓몬 도감 보기`}
  style={{ backgroundColor: CardColor[typeValue] }}
  className="... transition-opacity hover:opacity-80 focus-visible:..."
>
  <i>아이콘</i>
  {typeLabel}
</Link>
```

기존 `/list` 페이지가 이미 `type` 쿼리 파라미터를 처리하고 있어 추가 백엔드 작업 없이 바로 작동합니다.

### 2. C-1 보완: 결과 섹션 안내 문구

칩이 클릭 가능한 링크로 변경되어도 사용자가 그 기능을 인지하기 어려운 점을 보완했습니다. 결과 섹션 최상단(h2 바로 아래)에 한 번만 노출되는 안내 문구를 추가합니다.

```text
{선택타입} 타입은 이렇게 상대하세요!
─────────────────────────────────────
타입을 누르면 해당 타입 포켓몬을 도감에서 볼 수 있어요.

[이런 타입을 쓰면 좋아요!]
[4배 데미지 칩 그룹]
[2배 데미지 칩 그룹]
...
```

위치: 각 article 내부가 아닌 **결과 섹션 전체에 1회만** 노출 (시각적 중복 회피).

### 3. C-2: 결과 하단 크로스링크 CTA 섹션 신설

결과 영역 마지막에 다음 행동을 유도하는 CTA 카드 섹션을 추가했습니다.

**카드 구성** (선택한 타입에 따라 분기):

| 카드 | 표시 조건 | 링크 | 목적 |
| --- | --- | --- | --- |
| {타입} 타입 포켓몬 도감 보기 | 단일 타입 선택 시 | `/list?type={type}` | 선택 타입 도감 진입 (C-1 칩과 다른 의도) |
| 포켓몬 챔피언스 도감 보기 | 항상 | `/champions/list` | 챔피언스 인입 경로 추가 |
| 타입 상성 퀴즈 도전 | 항상 | `/quiz/type-effectiveness` | 퀴즈 페이지(CTR 22.2%) 리텐션 활용 |

**표시 조건**: 사용자가 타입을 1개 이상 선택했을 때만 (`selectTypeList.length > 0`)

**디자인**: 결과 article과 동일 톤(`bg-primary-2`, `rounded-2xl`)으로 시각적 일관성 유지.

## 기술적 세부사항

### 신규 파일

| 파일 | 역할 |
| --- | --- |
| `src/container/desktop/typeEffectiveness/typeEffectiveness.cta/TypeEffectivenessCta.component.tsx` | 데스크톱 CTA 섹션 (2열 그리드) |
| `src/container/mobile/typeEffectiveness/typeEffectiveness.cta/TypeEffectivenessCta.component.tsx` | 모바일 CTA 섹션 (세로 스택) |

### 수정 파일

| 파일 | 변경 |
| --- | --- |
| `src/container/desktop/.../TypeResultChip.components.tsx` | span → Link 교체, 호버/포커스/aria-label 추가 |
| `src/container/mobile/.../TypeResultChip.components.tsx` | 동일 적용 |
| `src/container/desktop/.../TypeEffectivenessResult.component.tsx` | 안내 문구 + CTA 통합 |
| `src/container/mobile/.../TypeEffectivenessResult.component.tsx` | 동일 적용 |

### C-1과 C-2의 차이점

| 항목 | C-1 (칩) | C-2 (CTA 섹션) |
| --- | --- | --- |
| 위치 | 결과 영역 **안** (각 칩) | 결과 영역 **밖** (하단 별도 섹션) |
| 링크 대상 | 약점/내성 타입의 도감 (선택 타입 외) | 선택한 타입 도감 + 챔피언스 + 퀴즈 |
| 사용자 의도 | "이 약점 타입에 어떤 포켓몬이 있지?" | "이 작업 끝나고 다음에 뭐 할까?" |

두 작업이 다른 사용자 의도를 커버하므로 시너지가 있습니다.

## 기대 효과 (추정)

- /type-effectiveness 30일 UV 26,228명의 단일 페이지 이탈 분산
- 세션당 PV 9.3 → 11~12 개선 가능성
- DAU/MAU 4.2% → 5~6% 단기 개선 가능성
- /list 페이지 30일 UV 8,948 → 10,000~12,000 (15~30% 증가, 추정)
- 챔피언스 페이지군 인입 경로 추가 (챔피언스 모바일 출시 대비)
- 효과 측정은 프로덕션 배포 후 4~8주 동안 GA4 (참여도/경로 탐색)에서 모니터링

## 참고 사항

- 본 작업은 검색 랭킹 자체에는 영향 없음. 사이트 내 트래픽 분산과 리텐션 개선이 목표
- 기존 `/list` 페이지의 타입 필터 기능을 재활용하므로 백엔드 변경 없음
- C-1 칩 변경과 C-2 CTA 추가는 다른 사용자 의도를 커버하지만 같은 페이지 영역이라 한 PR로 묶음

## 후속 작업

- **C-3**: 메인 페이지 → 챔피언스 인입 링크 추가
- **C-4**: 퀴즈 가시성 개선 (상위 트래픽 페이지에 배너)
- **C-5**: 메가진화 일람 페이지 신설
