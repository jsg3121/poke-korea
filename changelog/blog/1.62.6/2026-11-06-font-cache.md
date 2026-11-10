---
slug: font-cache
title: '웹폰트 브라우저 캐시를 1일에서 1년(immutable)으로'
description: '교체 계획이 없는 Gmarket Sans 서브셋 폰트의 브라우저 캐시를 1일에서 1년 immutable로 늘려, 재방문 시 재검증 왕복과 배포 때마다 폰트를 다시 받던 문제를 없앴다.'
authors: [jsg3121, claude]
tags: [performance]
---

# 웹폰트 브라우저 캐시를 1일에서 1년(immutable)으로

> **작업 날짜**: 2026-11-06
> **브랜치**: `feature/1.62.6-font-cache`

## 📋 작업 개요

**작업 유형**: 성능 개선 (패치)
**담당**: jsg3121, Claude

## 🎯 작업 목표

재방문자가 웹폰트를 다시 확인하거나 다시 받지 않도록, `/fonts/*`의 브라우저 캐시를 Lighthouse 권장값인 1년으로 늘린다.

<!-- truncate -->

## 📉 왜 필요했나

`/fonts/*`는 `public, max-age=86400, s-maxage=31536000`(브라우저 1일, CloudFront 1년)이었다. 파일 이름에 해시가 없어, 서브셋을 다시 만들 때를 대비해 브라우저 캐시를 짧게 둔 설정이었다.

이 설정에는 두 가지 비용이 있었다.

- **재검증 왕복**: 1일이 지나면 브라우저가 서버에 변경 여부를 묻는다. 응답은 `304`라 다운로드는 없지만 왕복 한 번이 든다.
- **배포마다 다시 받기**: `ETag`가 파일 내용이 아니라 크기와 수정 시각으로 만들어진다(`W/"1a2e0-1a1a1cb7391"`). 배포로 파일이 새로 놓이면 내용이 같아도 `ETag`가 바뀌어, 재검증 순간 폰트 약 200KB를 통째로 다시 받는다. `Last-Modified`가 배포 시각과 같았다.

1.62.5 배포 후 Lighthouse 모바일 측정(13개 페이지 × 5회)에서 "효율적인 캐시 정책" 항목에 걸린 사이트 자체 파일은 이 폰트 두 개(캐시 24시간)뿐이었다. `/_next/static`, `/assets`는 이미 1년이다.

폰트는 1.62.5에서 다시 서브셋한 뒤 **교체 계획이 없어**, 같은 파일 이름으로 오래 캐싱해도 된다고 판단했다.

## ✨ 주요 변경사항

### 변경 1: `/fonts/*` 캐시 헤더를 1년 immutable로

`next.config.js`의 `/fonts/:path*` 헤더를 바꿨다.

**변경 전**:

```js
value: 'public, max-age=86400, s-maxage=31536000',
```

**변경 후**:

```js
value: 'public, max-age=31536000, immutable',
```

- `max-age=31536000`: 브라우저와 CloudFront 모두 1년 보관한다. CloudFront `/fonts/*` 동작은 원본 `Cache-Control`을 따르는 캐시 정책(`UseOriginCacheControlHeaders`)이라 CloudFront 설정은 바꾸지 않았다.
- `immutable`: 새로고침할 때도 재검증하지 않는다.

주석에 "교체가 필요하면 반드시 파일 이름을 바꾼다"를 남겼다. 같은 이름으로 내용만 바꾸면 이미 받은 브라우저는 최대 1년간 재검증 없이 예전 파일을 쓴다.

## 🔍 검증

- `prettier --check next.config.js` 통과
- `npm run build` 성공 후 `next start`로 확인
  - `/fonts/GmarketSansMedium.subset.woff2`, `/fonts/GmarketSansBold.subset.woff2`: `Cache-Control: public, max-age=31536000, immutable`
  - 다른 경로(`/favicon.ico`)는 기존 값 그대로
- 배포 후 확인 필요: 운영 응답 헤더가 위 값인지, Lighthouse 캐시 항목에서 폰트가 빠지는지

## 📌 참고 사항

- 효과는 **재방문자**에게만 있다. 첫 방문은 폰트를 받아야 하므로 Lighthouse 성능 점수 자체는 바뀌지 않는다.
- 근거: [Lighthouse — Serve static assets with an efficient cache policy](https://developer.chrome.com/docs/lighthouse/performance/uses-long-cache-ttl), [web.dev — HTTP 캐시](https://web.dev/articles/http-cache), [MDN — Cache-Control immutable](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control#immutable)
