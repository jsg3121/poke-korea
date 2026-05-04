---
slug: meta-optimization
title: '메타 description 네이버 가이드라인 최적화'
description: 'layout.tsx, homeMetadata.ts, typeEffectivenessMetadata.ts의 description을 네이버 80자 가이드라인에 맞춰 압축하고 핵심 키워드를 앞에 배치했습니다. 사이트맵의 챔피언스 priority도 0.8로 상향했습니다.'
authors: [jsg3121, claude]
tags: [seo, meta-optimization]
---

# 메타 description 네이버 가이드라인 최적화

> **작업 날짜**: 2026-05-05
> **브랜치**: `feature/1.39.0-meta-optimization`

## 작업 개요

**작업 유형**: SEO 개선
**담당**: Claude
**연관 분석**: `.claude/research/reports/STR-2026-05-04-poke-korea-traffic-growth.md` (단계 A — 즉시 실행)

## 작업 목표

네이버 서치어드바이저 실측 데이터(/type-effectiveness 노출 7,431/CTR 2.0%, /detail/902 노출 7,959/CTR 2.4%)에서 핵심 페이지의 CTR이 검색 순위(평균 6.8) 대비 비정상적으로 낮은 점이 확인되었습니다. 동일 사이트 내 /quiz/type-effectiveness가 CTR 22.2%를 기록하는 것과 비교해 페이지별 격차가 11배 이상이며, 이는 메타 description 품질이 직접 원인으로 추정됩니다. 네이버 가이드라인(한글 80자) 및 Google 가이드라인(처음 90자 가중)에 맞춰 핵심 페이지의 description을 압축하고 키워드를 앞배치합니다.

<!-- truncate -->

## 주요 변경사항

### 1. layout.tsx 기본 description 폴백 교체

페이지별 메타가 없을 때 표출되는 폴백을 의미 있는 키워드 포함 문구로 교체했습니다.

**변경 전** (35자, 키워드 부재):

```text
언제, 어디서든, 포켓몬의 정보를 빠르고 편리하게 확인하실 수 있습니다.
```

**변경 후** (47자, 핵심 키워드 앞배치):

```text
한국어 포켓몬 도감과 타입 상성 계산기, 기술·특성 도구를 무료로 제공하는 포켓몬 백과사전.
```

### 2. homeMetadata.ts description 80자 압축

description / openGraph.description / twitter.description 3곳 동기화.

**변경 전** (89자, 네이버 80자 초과):

```text
1025마리 포켓몬 도감, 타입 상성 계산기, 800개 이상 기술 정보, 300개 이상 특성 정보, 매일 새로운 포켓몬 퀴즈! 빠르고 정확한 포켓몬 백과사전.
```

**변경 후** (56자, "한국어 포켓몬 도감" 앞배치):

```text
한국어 포켓몬 도감 1025마리, 타입 상성 계산기, 기술·특성 도감, 매일 포켓몬 퀴즈. 무료 포켓몬 백과사전.
```

### 3. typeEffectivenessMetadata.ts description 재작성

네이버 SC 데이터에서 가장 큰 개선 기회로 식별된 페이지(노출 7,431/CTR 2.0%).

**변경 전** (130자, 모바일 SERP에서 잘림):

```text
포켓몬 타입 상성표와 계산기로 상대의 약점을 빠르게 찾으세요! 포켓몬 타입 상성표와 계산기를 통해 불꽃, 물, 풀 등 각 타입의 약점과 강점을 한눈에 확인하고, 2배, 0.5배 데미지 계산부터 타입별 상태이상 면역 정보까지 한 번에 확인할 수 있어요.
```

**변경 후** (66자, "포켓몬 타입 상성 계산기" 맨 앞):

```text
포켓몬 타입 상성 계산기. 공격·방어 타입을 선택하면 2배·0.5배 데미지 배율을 즉시 확인할 수 있는 한국어 무료 도구.
```

### 4. 사이트맵 챔피언스 priority 0.7 → 0.8 상향

`src/app/sitemap.ts`의 `championsDetailPages`의 priority를 본편 detail과 동일한 0.7에서 0.8로 상향했습니다. 2026년 여름 챔피언스 모바일 출시 대비 크롤링 우선순위를 확보하기 위함입니다.

## 기술적 세부사항

### 수정된 파일

| 파일 | 변경 내용 |
| --- | --- |
| `src/app/layout.tsx` | 폴백 description 47자로 교체 |
| `src/app/_metadata/homeMetadata.ts` | description/OG/Twitter 3곳 56자로 압축 |
| `src/app/type-effectiveness/_metadata/typeEffectivenessMetadata.ts` | description 66자로 재작성 |
| `src/app/sitemap.ts` | 챔피언스 priority 0.7 → 0.8 |

### 적용한 메타 description 가이드라인

| 출처 | 권장 길이 (한글) |
| --- | --- |
| Google 공식 | 처음 90자까지 가중 |
| 일반 SEO 가이드 | 80자 이내 |
| 본 작업 적용 | 80자 이내 + 키워드 앞배치 |

> 출처: [InterAd — 메타 디스크립션 가이드라인](https://www.interad.com/insights/meta-description)

### 기대 효과 (추정)

- 네이버 핵심 페이지 CTR 2~2.4% → 5%+ (4~8주 후 측정)
- 주간 클릭 수 +800~1,200 가능성
- 챔피언스 detail 페이지 크롤링 빈도 증가 → 모바일 출시 시기 인덱싱 품질 개선

## 후속 작업 (프로덕션 배포 후)

- **A-5 SC 인덱싱 요청**: 구글 서치 콘솔 + 네이버 서치어드바이저 콘솔에서 변경된 페이지(/, /type-effectiveness, 챔피언스 상세) URL 검사 및 재인덱싱 요청 (사용자 수동 작업)
  - **선행 조건**: `feature/1.39.0` → main 릴리즈 PR 머지 후 프로덕션 배포 완료
  - **검증**: 배포된 페이지의 메타 태그가 실제로 변경되었는지 확인 (예: `curl -s https://poke-korea.com/type-effectiveness | grep description`)
  - **이유**: PR 머지만으로는 `feature/1.39.0`에만 반영되며 프로덕션은 그대로다. 이 시점에 SC가 크롤링하면 변경 전 description이 다시 인덱싱되어 무의미함
- **효과 측정**: 프로덕션 배포 후 4~8주 동안 네이버 SC + 구글 SC에서 CTR 변화 모니터링

## 참고 사항

- 본 작업은 메타 description 품질 개선이며, 검색 랭킹 자체에는 영향이 없음
- CTR(클릭률) 개선이 목표이며 4~8주 후 정량 측정 가능
- 후속 작업: 단계 B (메타 다양화) → `generateChampionsDetailMetadata.ts` boilerplate 다양화
