---
slug: detail-meta
title: '본편 포켓몬 상세 페이지 메타 description 폼별 다양화'
description: '107~114자 라벨식 boilerplate description을 56~71자 자연어 패턴으로 전환하고, 메가/거다이맥스/리전폼/이로치별로 description 키워드를 자동 분기하도록 변경했습니다.'
authors: [jsg3121, claude]
tags: [seo, meta-optimization]
---

# 본편 포켓몬 상세 페이지 메타 description 폼별 다양화

> **작업 날짜**: 2026-05-05
> **브랜치**: `feature/1.39.0-detail-meta`

## 작업 개요

**작업 유형**: SEO 개선
**담당**: Claude
**연관 분석**: `.claude/research/reports/STR-2026-05-04-poke-korea-traffic-growth.md` (단계 B-2)

## 작업 목표

본편 포켓몬 상세 페이지(`/detail/[pokemonId]`)의 메타 description이 다음 두 가지 문제를 가지고 있었습니다:

1. **107~114자로 네이버 80자 가이드라인을 30자 이상 초과** — 모바일 SERP에서 잘림
2. **라벨식 나열 패턴** ("전국 도감번호 : 902 | 포켓몬명 : 대쓰여너 | 타입 : [악, 격투] | 등장세대 : 8세대") — 자연어 검색 의도와 동떨어짐
3. **모든 포켓몬에 절반 이상이 동일 boilerplate** ("습득 기술을 포함한 포켓몬의 자세한 정보를 빠르고 간편하게 포케코리아에서 바로 확인해보세요") — thin content 위험

네이버 SC에서 노출 7,959회/CTR 2.4%인 `/detail/902` (대쓰여너) 같은 페이지의 CTR 저조 원인으로 추정되어, 자연어 패턴 + 폼/이로치별 다양화로 변경합니다.

<!-- truncate -->

## 주요 변경사항

### 변경 전 (라벨식, 109자)

```text
전국 도감번호 : 902 | 포켓몬명 : 대쓰여너 | 타입 : [악, 격투] | 등장세대 : 8세대 | 습득 기술을 포함한 포켓몬의 자세한 정보를 빠르고 간편하게 포케코리아에서 바로 확인해보세요.
```

### 변경 후 (자연어 + 폼별 다양화, 60자)

```text
대쓰여너 (No. 902, 8세대, 악·격투 타입). 진화·종족값, 기술, 특성 정보를 포케코리아에서 확인.
```

### 폼/이로치별 description 키워드 분기

| 활성 폼 | 적용 키워드 | 예시 |
| --- | --- | --- |
| 이로치 (최우선) | "색이 다른 모습" | "대쓰여너 이로치 (...). 색이 다른 모습, 기술, 특성 정보를 포케코리아에서 확인." |
| 메가진화 | "강화된 종족값" | "메가리자몽X (...). 강화된 종족값, 기술, 특성 정보를 포케코리아에서 확인." |
| 거다이맥스 | "거다이맥스 형태" | "거다이맥스 리자몽 (...). 거다이맥스 형태, 기술, 특성 정보를 포케코리아에서 확인." |
| 리전폼 | "리전 한정 모습" | "꼬렛 알로라 리전폼 (...). 리전 한정 모습, 기술, 특성 정보를 포케코리아에서 확인." |
| 기본 | "진화·종족값" | "리자몽 (...). 진화·종족값, 기술, 특성 정보를 포케코리아에서 확인." |

복합 폼(메가 이로치 등)은 **이로치 우선**으로 단일 키워드만 적용해 80자 이내 유지.

## 길이 검증 (9개 케이스)

네이버 80자 가이드라인 충족:

| 케이스 | 변경 전 | 변경 후 |
| --- | --- | --- |
| 대쓰여너 (기본) | 109자 | **60자** ✅ |
| 리자몽 (기본) | 107자 | **58자** ✅ |
| 메가리자몽X | 111자 | **63자** ✅ |
| 꼬렛 알로라 리전폼 | 114자 | **67자** ✅ |
| 거다이맥스 리자몽 | 113자 | **66자** ✅ |
| 대쓰여너 이로치 | 113자 | **66자** ✅ |
| 메가리자몽X 이로치 (이로치 우선) | — | **68자** ✅ |
| 피카츄 (단일 타입) | — | **56자** ✅ |
| 꼬렛 알로라 리전폼 이로치 (최장) | — | **71자** ✅ |

최장 71자 — 80자 마진 9자 확보.

## 기술적 세부사항

### 수정된 파일

| 파일 | 변경 |
| --- | --- |
| `src/module/generateDetailSeoMetaData.ts` | `getSeoDescription` 시그니처 확장 (`activeType`, `isShiny` 추가), 자연어 패턴 + 폼별 키워드 분기 |
| `src/app/detail/[pokemonId]/(form)/modules/generateMetadata.ts` | 호출 시 `activeType`, `isShiny` 전달 |

### 추가된 헬퍼 함수

| 함수 | 역할 |
| --- | --- |
| `getDetailFormKeyword` | activeType + isShiny → 폼별 자연어 키워드 반환 (이로치 우선) |

### 인터페이스 변경

```typescript
// Before
type GetSeoDescriptionParams = {
  pokemonNumber: number
  pokemonName: string
  generation: number
  types: Array<PokemonType>
}

// After
type GetSeoDescriptionParams = {
  pokemonNumber: number
  pokemonName: string
  generation: number
  types: Array<PokemonType>
  activeType: TActiveType
  isShiny: boolean
}
```

호출처는 1곳뿐이며 같은 PR에서 함께 수정.

## 기대 효과 (추정)

- 모바일 SERP에서 description이 잘리지 않고 완전히 표시 → CTR 개선
- 폼/이로치별 다양화로 검색 매칭 정확도 상승 (예: "메가 리자몽 스탯" 검색 시 "강화된 종족값" 키워드 매칭)
- 네이버 SC 핵심 페이지(/detail/902, /detail/952/mega 등) CTR 2~2.4% → 5%+ 가능성
- 효과 측정은 프로덕션 배포 후 4~8주 동안 네이버 SC + 구글 SC에서 모니터링

## 후속 작업

- **A-5 SC 인덱싱 요청**: 프로덕션 배포 후 사용자 수동 진행
- **단계 B 종결**: B-1 ✅, B-2 ✅, B-3 ⏭️ 스킵 — 메타 다양화 단계 모두 종료
- **단계 C 시작**: TypeResultChip 링크화, 결과 하단 CTA 등 UI/구조 개선

## 참고 사항

- 본 작업은 검색 랭킹 자체에는 영향 없음. CTR 개선이 목표
- 폼별 키워드는 의도적으로 단순한 자연어로 작성 (검색 의도와 직접 매칭)
- B-1(챔피언스 detail)과 B-2(본편 detail)가 모두 완료되어, 사이트 내 모든 포켓몬 상세 페이지가 동적·다양화된 description을 갖게 됨
