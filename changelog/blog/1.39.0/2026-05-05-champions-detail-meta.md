---
slug: champions-detail-meta
title: '챔피언스 상세 페이지 메타 description 다양화'
description: '모든 챔피언스 포켓몬에 동일하게 적용되던 boilerplate description을 타입·스탯·인기 기술·특성 데이터를 활용해 포켓몬마다 다른 내용으로 동적 생성하도록 변경했습니다.'
authors: [jsg3121, claude]
tags: [seo, meta-optimization]
---

# 챔피언스 상세 페이지 메타 description 다양화

> **작업 날짜**: 2026-05-05
> **브랜치**: `feature/1.39.0-champions-meta`

## 작업 개요

**작업 유형**: SEO 개선
**담당**: Claude
**연관 분석**: `.claude/research/reports/STR-2026-05-04-poke-korea-traffic-growth.md` (단계 B-1)

## 작업 목표

챔피언스 상세 페이지(/champions/list/[pokemonId])의 메타 description이 모든 포켓몬에 대해 이름만 다르고 나머지 100% 동일한 boilerplate 패턴이었습니다. 검색엔진은 이런 동일 패턴을 thin content로 인식하여 인덱싱 후순위 또는 미노출 처리하는 경향이 있어, 실제 페이지가 구현되어 있음에도 30일 UV 3,494명에 그치는 원인으로 추정되었습니다. 본 작업은 API에서 이미 제공되는 필드(타입, 스탯, 메타 통계)를 활용해 포켓몬마다 다른 description이 생성되도록 변경합니다.

<!-- truncate -->

## 주요 변경사항

### 변경 전 (boilerplate)

```typescript
const title = `${pokemon.name} 챔피언스 정보 | 포케코리아`
const description = `${pokemon.name}의 포켓몬 챔피언스 사용률, 인기 기술, 아이템, 특성, 추천 파트너 정보를 확인하세요.`
```

모든 포켓몬에 동일하게 적용 — 이름만 다른 boilerplate.

### 변경 후 (동적 생성)

#### Title 패턴

폼/리전이 있을 때 괄호로 명시:

- 기본: `리자몽 챔피언스 도감 - 스탯·기술·특성 | 포케코리아`
- 리전폼: `나인테일 (알로라) 챔피언스 도감 - 스탯·기술·특성 | 포케코리아`
- 노말폼: `롱카이트 (노말폼) 챔피언스 도감 - 스탯·기술·특성 | 포케코리아`

#### Description 패턴 (메타 데이터 유무에 따른 분기)

**케이스 A: 메타 통계가 있는 경우 (인기 기술·특성 활용)**

```text
불꽃·비행 타입 리자몽 챔피언스 정보. 인기 기술 화염방사, 맹화 특성, 추천 파트너·스탯 확인.
```

**케이스 B: 메타 데이터가 없는 경우 (스탯 상위 2개로 폴백)**

```text
전기 타입 피카츄 챔피언스 정보. 스피드 90, 공격 55 등 스탯·기술·특성 확인.
```

#### 길이 검증 결과 (네이버 80자 가이드라인)

| 케이스 | description 길이 |
| --- | --- |
| 리자몽 (메타 풀) | 54자 |
| 피카츄 (메타 없음, 폴백) | 47자 |
| 대쓰여너 (폴백) | 52자 |
| 나인테일 (알로라 리전폼) | 64자 |
| 롱카이트 (노말폼, 가상 케이스) | 54자 |

모든 케이스 80자 이내 충족.

## 기술적 세부사항

### 추가된 헬퍼 함수

| 함수 | 역할 |
| --- | --- |
| `getFormSuffix` | region 또는 formName을 한국어 표기로 반환 (메가/거다이맥스는 챔피언스 데이터에 존재하지 않음) |
| `getKoreanTypesText` | PokemonType enum을 한국어로 변환 (예: `['FIRE', 'DRAGON']` → `'불꽃·드래곤'`) |
| `getStatHighlights` | 6스탯 중 상위 2개를 라벨과 값으로 반환 (메타 폴백 시 사용) |
| `getMetaHighlight` | 메타 통계의 인기 기술·특성을 한 줄로 조합 |
| `buildDetailTitle` | title 동적 생성 |
| `buildDetailDescription` | description 동적 생성 (메타 유무 분기) |

### 수정된 파일

| 파일 | 변경 |
| --- | --- |
| `src/app/champions/list/[pokemonId]/_metadata/generateChampionsDetailMetadata.ts` | 헬퍼 6개 추가, title/description 동적 생성 로직 적용 |

### 명시적으로 제외한 항목

작업 진행 중 사용자 피드백을 반영해 다음 두 가지를 제외했습니다:

1. **티어(`meta.tier`) 표기 제외**: 공식 티어가 아닌 내부 임의 분류이므로 description에 노출 시 사용자 오인 가능
2. **메가/거다이맥스 키워드**: `ChampionsFormType` enum이 BASE/NORMAL/REGION만 정의되어 챔피언스 데이터에 메가/거다이맥스가 존재하지 않음. 자연스럽게 description에 등장하지 않음

리전폼·노말폼 표기는 도감 페이지에서 별도 카드로 구분되어 있으므로 그대로 유지했습니다.

### 활용한 GraphQL 필드

```graphql
fragment ChampionsPokemonDetail on ChampionsPokemonDetail {
  pokemon {
    name
    formName
    region
    types
    stats { hp attack defense specialAttack specialDefense speed }
  }
  meta {
    topMoves { name }
    topAbilities { name }
  }
}
```

기존 쿼리에서 이미 제공되던 필드만 활용 — 백엔드 변경 없음.

## 기대 효과 (추정)

- 검색엔진의 thin content 인식 해소 → 챔피언스 detail 페이지 인덱싱 품질 개선
- 포켓몬마다 다른 description으로 SERP에서 페이지별 차별화
- 챔피언스 페이지군 30일 UV 3,494 → 모바일 출시 시기에 8,000~15,000 가능성
- 효과 측정은 프로덕션 배포 후 4~8주 동안 네이버 SC + 구글 SC에서 모니터링

## 후속 작업

- **B-3 (챔피언스 홈/도감/티어 description 갱신)**: 스킵 결정
  - 기존 description이 이미 60~70자로 가이드라인 충족
  - 원래 권고했던 모바일 출시 키워드는 페이지 콘텐츠 불일치 위험으로 제외
- **B-2 (/detail 메타 폼별 강화)**: 별도 PR로 진행 예정
- **C 단계 (UI/구조)**: TypeResultChip 링크화, 결과 하단 CTA 등

## 참고 사항

- 본 작업은 검색 랭킹 자체에는 영향 없음. 인덱싱 품질 + CTR(클릭률) 개선이 목표
- 사용자 피드백 반영으로 **티어/메가진화 키워드는 의도적으로 제외**
- 헬퍼 함수가 모듈 내부에 격리되어 있어 향후 본편 detail 페이지 메타 다양화 시 패턴 참조 가능
