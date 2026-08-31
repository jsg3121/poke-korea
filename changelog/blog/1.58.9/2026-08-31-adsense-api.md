---
slug: adsense-api
title: '애드센스 지표 API 연동 — 수동 CSV 탈피'
description: 'AdSense Management API를 연동해 수익·RPM·페이지별 실적을 조회 시점 기준 최신 데이터로 확인할 수 있게 했습니다. 애드센스는 서비스 계정을 지원하지 않아 OAuth 사용자 인증을 별도 경로로 구현했습니다.'
authors: [jsg3121, claude]
tags: [chore]
---

# 애드센스 지표 API 연동

> **작업 날짜**: 2026-08-31
> **브랜치**: `feature/1.58.9`

## 📋 작업 개요

**작업 유형**: 개발 환경 개선
**담당**: jsg3121, claude

## 🎯 작업 목표

GA4·Search Console에 이어 애드센스도 API로 조회한다.

<!-- truncate -->

## 📉 왜 필요했나

1.58.0에서 GA4·Search Console을 API로 옮겼지만 애드센스만 수동 CSV로 남아 있었다. 그 결과 `.claude/analyzer/`의 애드센스 데이터는 **7월 26일 기준에서 멈춰 있었다.**

세 지표의 기준 시점이 어긋나면 교차 분석이 불가능하다. `index.md`에 적힌 활용 사례 세 가지(배치 최적화, 트래픽 기반 우선순위, A/B 기준 RPM 비교)가 전부 애드센스 × GA4 조인을 전제로 하는데, 한쪽만 최신이면 성립하지 않는다.

## 🔨 작업 내용

### 애드센스만 인증 방식이 다르다

서비스 계정을 그대로 쓸 수 없었다. 공식 문서가 명시한다.

> "Note that AdSense doesn't support Service Accounts, instead you must use the Installed Application flow."
> — [Make direct requests](https://developers.google.com/adsense/management/direct_requests)

GA4·Search Console은 속성에 서비스 계정 이메일을 사용자로 추가할 수 있다. 반면 애드센스 계정은 소유자 1인에게 귀속되는 수익 계정이라 제3자 주체를 추가하는 개념 자체가 없다. 그래서 본인이 브라우저에서 한 번 동의한 리프레시 토큰으로만 접근한다.

두 방식을 나란히 두는 구조로 만들었다.

```text
google-auth.js
├── getAccessToken()                  → search-console.js, ga4.js  (기존, 무수정)
└── getAccessTokenFromRefreshToken()  → adsense.js                  (신규)
```

### 신규 파일

| 파일 | 역할 |
| --- | --- |
| `.claude/analyzer/scripts/adsense-authorize.js` | OAuth 최초 인증 (1회용) |
| `.claude/analyzer/scripts/adsense.js` | 리포트 조회 |

`google-auth.js`에는 함수를 추가만 했다. 기존 두 스크립트는 손대지 않았고, 실제 GA4 조회로 회귀를 확인했다.

## ⚠️ 구현 시 고려한 점

### 루프백 방식만 쓸 수 있다

수동 복사/붙여넣기(OOB, `urn:ietf:wg:oauth:2.0:oob`)는 구글이 폐기했다.

> "The manual copy/paste option, also referred to as an out of band (OOB) redirect method, is no longer supported."
> — [OAuth 2.0 for Mobile & Desktop Apps](https://developers.google.com/identity/protocols/oauth2/native-app)

그래서 `adsense-authorize.js`는 로컬에 임시 HTTP 서버를 띄워 인가 코드를 받는다. 포트는 0으로 열어 OS가 빈 포트를 고르게 했다 — 고정 포트는 이미 점유된 환경에서 실패하고, 데스크톱 앱 유형은 임의 루프백 포트를 허용한다.

PKCE(S256)와 `state` 검증을 넣었다. 루프백은 같은 기기의 다른 프로세스가 인가 코드를 가로챌 수 있어 공식 문서가 권장하는 방어다.

### 리프레시 토큰 7일 만료

GCP 동의 화면이 '테스트 중'이면 리프레시 토큰이 7일 후 만료된다.

> "A Google Cloud Platform project with an OAuth consent screen configured for an external user type and a publishing status of 'Testing' is issued a refresh token expiring in 7 days"

이걸 놓치면 일주일 뒤 `invalid_grant`로 조용히 깨진다. 프로덕션 게시로 해제했고, 오류 메시지에 이 원인을 안내하도록 했다.

### 종료일 기본값은 어제

`ESTIMATED_EARNINGS`는 문서상 "earnings up to yesterday are accurate"다. 당일을 포함하면 과소 집계된 값을 보게 되므로 Search Console의 3일 지연과 같은 이유로 기본 종료일을 어제로 잡았다.

### `--contains`는 응답 후 필터

애드센스 API의 `filters` 문법이 차원별로 제각각이라 받아온 뒤 거른다. 행 수가 많지 않아 성능 문제가 없고, 차원이 바뀌어도 동작이 깨지지 않는다.

단 필터를 걸면 합계 표시를 생략한다. API가 주는 `totals`는 필터 전 전체 기준이라 필터된 행과 함께 보여주면 오독을 유발한다.

## ✅ 검증

실제 조회로 확인했다.

**최근 30일 (2026-08-01 ~ 08-30)** — 예상 수입 $42.17 / 페이지뷰 180,451 / 노출 412,890 / 클릭 546

**어제 (2026-08-30)** — 예상 수입 $1.66 / 페이지뷰 4,354 / 노출 15,357 / 클릭 23 / 페이지 RPM $0.38

기존 GA4 스크립트도 정상 동작을 확인해 회귀가 없음을 검증했다.

## 📌 후속 관찰 대상

일자별 데이터에서 **8월 10일 전후 페이지뷰가 약 70% 급감**(12,000~13,000 → 3,500~4,000)한 것이 확인됐다. 그런데 광고 노출수는 12,000~15,000대를 유지하고 수익도 $1.2~1.7대로 큰 변화가 없다.

페이지뷰와 노출수가 따로 움직인다는 뜻이라 원인 파악이 필요하다. 이번 작업 범위를 벗어나므로 기록만 남긴다 — Search Console·GA4와 교차 분석해 별도로 볼 것.
