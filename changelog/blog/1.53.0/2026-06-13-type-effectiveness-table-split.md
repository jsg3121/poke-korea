---
slug: 1-53-0-type-effectiveness-table-split
title: '[1.53.0] 번들 최적화 Phase 3 — 타입 상성표 데이터-주도 렌더링'
description: '1000줄 하드코딩 18×18 상성표를 데이터 매트릭스로 추출하고 동적 렌더링으로 전환. /type-effectiveness page 전용 청크를 raw 173.9KB→62.2KB(-64%)로 절감, First Load JS 180→177KB. 원본 마크업 버그도 수정.'
authors: [jsg3121, claude]
tags: [performance, refactoring, nextjs]
---

# 1.53.0 — 번들 최적화 Phase 3

> **작업 일자**: 2026-06-13
> **작업 브랜치**: `feature/1.53.0-type-effectiveness-split`

## 📋 작업 개요

**작업 유형**: 데이터-주도 렌더링 리팩토링 + 번들 청크 분할
**담당**: jsg3121 + Claude

전 라우트 중 First Load JS가 가장 무거웠던 `/type-effectiveness`(180KB)를 개선했다.
원인은 18×18 타입 상성표가 **JSX로 완전히 하드코딩**(desktop·mobile 각 ~1000줄)되어
있던 것이었다. 상성 데이터를 매트릭스로 추출하고 테이블을 동적 렌더링으로 전환했다.

<!-- truncate -->

## 🎯 작업 목표

- `/type-effectiveness` 라우트의 page 전용 청크 감소 (전 라우트 중 최대)
- 1000줄 하드코딩 테이블을 데이터-주도 렌더링으로 전환 (유지보수성 확보)
- 시각적 결과는 픽셀 단위로 동일하게 유지 (회귀 없음)

## 🔍 문제 분석

| 항목 | 값 |
| --- | --- |
| `/type-effectiveness` First Load JS | 180 KB (전 라우트 최대) |
| page 전용 청크 (raw) | 173.9 KB |
| desktop `TypeEffectivenessTable` | 1,041줄 |
| mobile `TypeEffectivenessTable` | 1,043줄 |

근본 원인: 18×18 상성표를 JSX로 하드코딩. `<td>` 323개, `.map()`은 2회뿐.
각 셀마다 긴 Tailwind className + `activeType` 조건부 클래스가 반복 인라인되어
번들이 비대했다. **데이터를 코드로 표현**한 구조였다.

## ✨ 주요 변경사항

### 1. 상성 데이터 매트릭스 추출

`src/constants/typeEffectivenessChart.ts` 신규 생성.

- 18×18 = 324개 상성값을 기존 JSX에서 **파싱으로 자동 추출**(수작업 오류 차단)
- `TYPE_EFFECTIVENESS_CHART[공격타입][방어타입]` → 배율(`0 | 0.5 | 1 | 2`) 조회
- desktop·mobile이 **동일 데이터를 공유**

### 2. 테이블 동적 렌더링 전환

desktop/mobile `TypeEffectivenessTable.component.tsx`를 `TYPE_ORDER.map()` 2중 루프로 재작성.

- 셀 렌더링을 `renderCell` + `VALUE_STYLE`로 통합 → 반복 className 제거
- 헤더·caption 등 비-데이터 영역은 기존 마크업 그대로 보존
- **표시 방식은 플랫폼별 분리**: desktop은 `0.5배`/`text-yellow-600`,
  mobile은 `½`/`text-[#c78e23]` 등 각자의 라벨·색상 유지

### 3. 원본 마크업 버그 수정

데이터 추출 검증 중, desktop·mobile 양쪽 **GHOST 공격 행에 `<td>`가 1개 누락**
(17셀)된 것을 발견했다. 페어리 칸(1배=빈칸)을 보정하여 18셀로 정상화했다.

## 📊 최적화 결과 (빌드 실측)

| 측정 항목 | 개선 전 | 개선 후 | 절감 |
| --- | --- | --- | --- |
| page 전용 청크 (raw) | 173,931 B | 62,181 B | **-111,750 B (-64%)** |
| page 전용 청크 (gzip) | 16,934 B | 13,179 B | **-3,755 B** |
| First Load JS | 180 KB | 177 KB | **-3 KB** |
| 소스 (desktop+mobile) | 2,084줄 | 299줄 (+데이터 388줄) | **-67%** |

- raw 감소폭(-111.7KB)이 gzip(-3.8KB)보다 큰 이유: 반복 className이 gzip으로 잘
  압축됐었기 때문. 단 raw 감소는 파싱·메모리·압축 해제 비용을 직접 줄인다.

## ✅ 검증

- `npm run build` — 성공, page 청크 감소 확인
- `npm run lint` — 신규 파일 경고 없음 (기존 경고만 잔존)
- **데이터 정합성** — 값 셀(0.5/0/2배) desktop·mobile 모두 원본과 100% 일치
  (자동 추출 + 런타임 대조 324셀 검증)
- **시각 검증** — 상용과 동일 노출 + 포인터 강조/흐림 동작 확인 (사용자 확인 완료)

## 🎁 1.53.0 번들 최적화 총정리

| Phase | 작업 | 효과 |
| --- | --- | --- |
| 1 | chart.js 동적 임포트 | 상세·챔피언스 13개 라우트 각 -65KB |
| 2 | cross-fetch 제거 | 전 페이지 raw -10.3KB / gzip -3.2KB |
| 3 | 타입 상성표 데이터-주도 | page 청크 raw -64%, First Load -3KB |
