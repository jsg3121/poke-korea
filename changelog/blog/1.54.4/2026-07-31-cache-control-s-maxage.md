---
slug: cache-control-s-maxage
title: '페이지 캐시 정책 개선 — s-maxage 분리로 배포 즉시 반영'
description: '페이지 HTML의 Cache-Control을 max-age 단일에서 브라우저(max-age)·CDN(s-maxage) 분리 구조로 바꿨습니다. CloudFront 무효화 후 사용자에게 변경이 빠르게 반영되도록 개선하고, type-effectiveness 페이지의 immutable도 제거했습니다.'
authors: [jsg3121, claude]
tags: [performance, nextjs]
---

# 페이지 캐시 정책 개선 — s-maxage 분리로 배포 즉시 반영

> **작업 날짜**: 2026-07-31
> **브랜치**: `feature/1.54.4`

## 📋 작업 개요

**작업 유형**: 성능 개선 · 배포 안정성
**담당**: jsg3121, claude

## 🎯 작업 목표

상용 배포 후 CDN 캐시를 무효화(invalidation)해도, 사용자 브라우저에 남아 있는 캐시 때문에 변경이 즉시 반영되지 않고 수동 새로고침이 필요하던 문제를 해결한다.

기존 페이지 HTML은 `Cache-Control: public, max-age=31536000`(1년) 단일 정책이었다. `max-age`는 브라우저와 공유 캐시(CDN)에 **모두** 적용되므로, 브라우저가 1년간 서버에 재요청조차 하지 않아 CDN을 비워도 사용자는 옛 페이지를 계속 보게 된다. 이를 브라우저용 `max-age`와 CDN용 `s-maxage`로 분리해 해결한다.

<!-- truncate -->

## ✨ 주요 변경사항

### 변경 1: 페이지 HTML 캐시 정책을 max-age·s-maxage 분리 구조로 전환

`next.config.js`의 `headers()`에서 페이지 HTML 17곳의 `Cache-Control`을 교체했다. 리스트·상세·메가진화·리전폼·기본폼·기술 페이지·버전별 기술·기술 도감 등이 대상이다.

**변경 전**:

```text
public, max-age=31536000
```

**변경 후**:

```text
public, max-age=10800, s-maxage=31536000, stale-while-revalidate=60
```

- `max-age=10800`(3시간): 브라우저 로컬 캐시 유효 기간. 3시간 후 CDN에 재검증 → 배포 반영 지연이 최대 3시간으로 축소(기존 1년)
- `s-maxage=31536000`(1년): CloudFront는 여전히 1년 캐싱 → 오리진 부하 최소 유지. 배포 시 CloudFront 무효화로 즉시 갱신
- `stale-while-revalidate=60`: `max-age` 만료 직후에도 옛 캐시를 즉시 응답하며 백그라운드로 새 버전을 받아와 체감 지연 제거

### 변경 2: type-effectiveness 페이지의 immutable 제거 및 정책 통일

타입 상성 계산기 페이지(`/type-effectiveness`)는 페이지 HTML임에도 정적 자산용 `immutable`이 붙어 있었다. `immutable`은 `max-age` 유효 기간 동안 새로고침(F5)을 눌러도 브라우저가 재검증 요청조차 보내지 않아, "새로고침해도 안 바뀜" 증상을 가장 강하게 유발한다. 다른 페이지 HTML과 동일 정책으로 통일했다.

**변경 전**:

```text
public, max-age=31536000, immutable
```

**변경 후**:

```text
public, max-age=10800, s-maxage=31536000, stale-while-revalidate=60
```

## 📊 변경 요약

| 대상 | 변경 전 | 변경 후 |
| --- | --- | --- |
| 페이지 HTML 17곳 | `max-age=31536000` | `max-age=10800, s-maxage=31536000, stale-while-revalidate=60` |
| `/type-effectiveness` | `max-age=31536000, immutable` | `max-age=10800, s-maxage=31536000, stale-while-revalidate=60` |
| 메인 페이지 `/` | `max-age=0, s-maxage=86400, stale-while-revalidate=600` | 유지 (변경 없음) |
| `/assets/*.(svg\|png)` | `max-age=31536000, immutable` | 유지 (변경 없음) |

| 항목 | 변경 전 | 변경 후 |
| --- | --- | --- |
| 브라우저 캐시 유효 기간 | 1년 | 3시간 |
| CDN 캐시 유효 기간 | (max-age 따름) | 1년 |
| 배포 반영 지연(최대) | 강제 새로고침 전까지 | 3시간 |

## 🔧 기술적 세부사항

- 수정 파일: `next.config.js` (`headers()` 콜백)
- `immutable`이 유지되어야 하는 정적 파일 자산(`/assets/*.svg`, `/assets/*.png`)은 URL 변경 시 파일명이 함께 바뀌므로 그대로 두었다.
- `s-maxage`는 공유 캐시(CDN/프록시)에만 적용되며 `max-age`를 재정의한다. CloudFront 무효화(invalidation)는 엣지 캐시를 강제로 비우는 별개 동작으로, 무효화 시 CDN은 즉시 오리진에서 새 페이지를 가져온다.

## 📌 참고 사항

- CloudFront 무효화를 수행해도, 이미 브라우저에 캐시된 사용자는 `max-age=10800`(3시간)이 만료되기 전까지 옛 페이지를 볼 수 있다. 다만 기존 1년 대비 크게 완화되며, `stale-while-revalidate`로 만료 후 다음 방문 시 백그라운드 갱신된다.
- 근거: [MDN — Cache-Control `s-maxage`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control#s-maxage), [MDN — Cache-Control `immutable`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control#immutable)
</content>
</invoke>
