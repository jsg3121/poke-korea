---
slug: analytics-events
title: 'GA4 커스텀 이벤트 전송 유틸과 1.62.0 이벤트 정의'
description: '1.62.0 기능의 효과를 이벤트로 측정하기 위해 타입으로 검사되는 공통 전송 유틸 trackEvent와 이벤트 3종(use_name_search, use_type_calc, stats_tab_status)의 정의를 추가했습니다.'
authors: [jsg3121, claude]
tags: [feature]
---

# GA4 커스텀 이벤트 전송 유틸과 1.62.0 이벤트 정의

> **작업 날짜**: 2026-10-19
> **브랜치**: `feature/1.62.0-analytics-events`

## 📋 작업 개요

**작업 유형**: 기능 추가
**담당**: jsg3121, claude

## 🎯 작업 목표

1.62.0에 들어갈 상성 계산기 이름 입력과 상세 능력치 탭의 사용량을 GA4 이벤트로 측정할 수 있도록, 공통 전송 유틸과 이벤트 정의를 먼저 만든다.

<!-- truncate -->

## 📉 왜 필요했나

- 지금까지 GA4는 `layout.tsx`의 기본 설정(페이지뷰)만 수집했다. 커스텀 이벤트를 보내는 코드가 없었다.
- 1.62.0부터는 기능마다 착수와 유지를 이벤트 지표로 판단한다. 페이지뷰는 필터 변경(`router.replace`)으로 부풀려져 있어 기능 효과를 판단할 근거가 되지 못한다.
- 이벤트가 늘수록 이름 오타, 파라미터 불일치, 맞춤 측정기준 등록 누락이 생기기 쉽다. 타입으로 이벤트 목록을 한 곳에 묶어 이를 막는다(`coding.md` "분석 이벤트 전송").

## ✨ 주요 변경사항

### 변경 1: 이벤트 정의 — `src/types/analyticsEvent.types.ts`

이 타입이 곧 이벤트 목록이다. GA4 콘솔의 맞춤 측정기준 등록도 이 목록과 맞춘다.

| 이벤트 | 기능 | 파라미터 |
| --- | --- | --- |
| `use_name_search` | 상성 계산기 이름 입력. 포켓몬을 선택할 때마다 | `source`, `query`, `pokemon_number`, `form_type`, `is_first_search` |
| `use_type_calc` | 상성 계산기 계산 실행 | `input_method`, `types` |
| `stats_tab_status` | 상세 능력치 탭 전환 | `tab`, `form_type`, `pokemon_number` |

- 이벤트 이름, 파라미터 이름, 열거형 값은 모두 소문자 스네이크 케이스다.
- `form_type`은 두 기능이 같은 값 집합(`default` / `mega` / `form` / `region` / `gigantamax`)을 쓴다. 이름 입력은 거다이맥스를 고를 수 없어 `gigantamax`를 뺐다.

### 변경 2: 전송 유틸 — `src/modules/analytics.module.ts`

**변경 전**: 전송 코드 없음

**변경 후**:

```ts
export const trackEvent = <K extends keyof AnalyticsEventMap>(
  eventName: K,
  params: AnalyticsEventMap[K],
): void => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return
  }
  window.gtag('event', eventName, params)
}
```

- 정의되지 않은 이벤트 이름이나 맞지 않는 파라미터는 타입 오류가 된다.
- gtag는 운영 환경에서만 `afterInteractive`로 불러온다. 개발 환경, 스크립트 로드 전, 서버 렌더에서는 아무것도 하지 않는다.

### 변경 3: 전역 타입 — `window.d.ts`

`Window`에 `gtag?`를 추가했다. 쓰는 명령은 `event`뿐이라 그 형태만 정의했다.

## 🔍 검증

- `tsc --noEmit` 통과, 변경 파일 ESLint·Prettier 통과
- **확인하지 않은 것**: 아직 호출하는 곳이 없어 실제 전송은 확인하지 않았다. 기능을 연결한 뒤 운영 배포 후 GA4 DebugView로 확인한다.

## ⚠️ 구현 시 고려한 점

- 백엔드 `formType` 값 변환, `types` 정렬, `query` 20자 자르기, 칩 1.5초 안정화 로직은 쓰는 곳이 생길 때 각 기능 작업에서 만든다.
- 이벤트 이름에 페이지를 넣지 않았다. gtag가 모든 이벤트에 `page_location`을 자동으로 붙인다.
- 채택하지 않은 이벤트(`type_name_search_no_result` 등)와 사유는 상성 계산기 이름 입력 기획서 9.1에 남겼다.

## 📌 참고 사항

- 파라미터로 보고서를 나눠 보려면 GA4 콘솔에서 맞춤 측정기준 등록이 필요하다. 각 기능 배포 시 등록한다.
