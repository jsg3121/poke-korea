---
slug: 1-54-0-legacy-view-cleanup
title: '[1.54.0] 구버전 데/모 2벌 뷰·컨테이너 일괄 제거 (dead code cleanup)'
description: '반응형 단일 개편(A~F 전 그룹)이 완료되어 참조가 끊긴 구버전 desktop/mobile 페이지 뷰·컨테이너와 그에 딸린 orphan 컴포넌트·유틸 230개를 일괄 제거했다. knip 정적 분석과 import 그래프 조사 2건으로 외부 참조 0건을 3중 교차검증했고, 전 라우트 공용 크롬(header/footer)과 3단계에서 재검토할 광고 슬롯은 보존했다.'
authors: [jsg3121, claude]
tags: [refactor, cleanup, dead-code]
---

# 1.54.0 — 구버전 데/모 2벌 뷰·컨테이너 일괄 제거

> **작업 일자**: 2026-07-27
> **작업 브랜치**: `feature/1.54.0-legacy-cleanup`
> **선행 작업**: A~F 전 그룹 반응형 단일 개편 완료 (PR #182~#191)

## 📋 작업 개요

**작업 유형**: dead code 정리 (반응형 단일 개편 마무리)
**담당**: jsg3121 + Claude

홈·리스트·상세·습득기술(A)·특성(B)·기술 도감(C)·타입 상성(D)·챔피언스(E)·
퀴즈(F)까지 전 페이지의 반응형 단일 개편이 완료되면서, `detectUserAgent`
UA 분기로 desktop/mobile 화면을 2벌 렌더하던 **구버전 뷰·컨테이너가 전부
참조를 잃었다.** 각 라우트의 `page.tsx`는 이미 신규 반응형 뷰(`~/views/{feature}`)
만 import하고 있어, 구버전 파일들은 자기들끼리만 참조하는 고립된 섬(island)으로
남아 있었다.

이번 작업은 그 dead code를 일괄 제거하는 정리 작업이다.

## 🔍 삭제 대상 검증 (3중 교차검증)

"참조 0건"을 단정하기 전에 세 가지 방법으로 교차검증하여, 동적 import·문자열
경로 참조 등 정적 grep이 놓칠 수 있는 케이스까지 확인했다.

1. **knip 정적 분석** — App Router 진입점(`page/layout/...`)을 기준으로 미사용
   파일(unused files)을 산출. 구버전 뷰/컨테이너뿐 아니라 그에 딸린 orphan
   컴포넌트·차트·유틸까지 함께 검출.
2. **import 그래프 조사 (페이지 뷰/컨테이너)** — 전 라우트 `page.tsx`가 신규
   뷰를 쓰는지 확인. 결과: 구버전을 import하는 `page.tsx`는 **0건**.
3. **import 그래프 조사 (공용 크롬)** — header/footer/search/nav가 여전히
   살아있는지 확인. 결과: 크롬은 33개 `page.tsx`가 UA 분기로 계속 사용 중 →
   **삭제 대상에서 제외.**

세 방법의 결론이 모두 일치했다.

## 🗑️ 삭제 내역 (총 230개 파일)

| 분류 | 개수 |
| --- | --- |
| `src/views/desktop/**` (구버전 데스크톱 뷰) | 16 |
| `src/views/mobile/**` (구버전 모바일 뷰) | 43 |
| `src/container/desktop/**` (크롬 제외 구버전 컨테이너) | 82 |
| `src/container/mobile/**` (크롬 제외 구버전 컨테이너) | 54 |
| `src/components/**` (구버전 전용 orphan 컴포넌트) | 31 |
| `src/hook/useHeaderScroll.ts` | 1 |
| `src/module/**` (구버전 전용 유틸 3종) | 3 |

`components` orphan 31개에는 구버전 전용 `RadarChart`·`StatChart`(신규 상세는
`StatBar` 사용), 구 필터 5종(신규 `~/components/filter/`로 대체됨), 구
`PokemonCard`(desktop/mobile 2벌, 신규는 `PokemonCardShell` 셸 공유), 구
`PageHeader`(신규 `PageHeaderComponent`로 대체됨) 등이 포함된다.

`src/module`에서 제거한 유틸은 `changeType.ts`·`getTextSize.module.ts`·
`variablesCheck.ts`로, 모두 구버전 뷰/컨테이너에서만 참조되던 파일이다.

## ✅ 보존한 것

- **전 라우트 공용 크롬**: `container/desktop`·`container/mobile`의
  `header/**`·`footer/**`. 크롬은 아직 각 `page.tsx`의 UA 분기로 데/모 2벌이
  살아있어 이번 삭제 대상이 아니다(향후 별도 통합 트랙).
- **광고 슬롯**: `src/components/adSlot/**`(34개)·`src/constants/adSense.ts`.
  현재 참조는 끊겼으나, 광고 노출 방식·유닛 배치 재검토(반응형 유닛 재도입)
  트랙에서 기존 유닛 ID와 노출 위치를 근거 자료로 참고해야 하므로 보존한다.

## 🧪 검증 결과

삭제 후 다음 3단계 검증을 모두 통과했다.

- `tsc --noEmit` — 타입 에러 0
- `npm run lint` — 에러 0 (기존 경고만, 삭제로 신규 발생분 없음)
- `npm run build` — 프로덕션 빌드 성공

삭제 후 `src/views/desktop`·`src/views/mobile`은 완전히 비워져 제거됐고,
`src/container`의 desktop/mobile에는 공용 크롬(`header`·`footer`)만 남았다.

## 📌 남은 정리 트랙

- 공용 크롬(header/footer) 반응형 단일 통합 → 완료 시 `container/desktop`·
  `container/mobile` 디렉토리 완전 제거
- 광고 유닛 노출 방식·배치 재검토 (반응형 유닛 재도입) → 이후 `adSlot`·
  `adSense.ts` 정리 여부 확정
