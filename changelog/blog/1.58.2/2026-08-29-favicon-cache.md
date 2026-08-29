---
slug: favicon-cache
title: '파비콘 캐싱 헤더 추가 — 매 요청 재검증 제거'
description: '캐시 규칙이 없어 매 요청마다 재검증되던 /favicon.ico에 Cache-Control을 부여했습니다. 브라우저 1일·CloudFront 1년 캐싱이며, 교체 여지를 남기기 위해 immutable은 사용하지 않았습니다.'
authors: [jsg3121, claude]
tags: [performance, nextjs]
---

# 파비콘 캐싱 헤더 추가

> **작업 날짜**: 2026-08-29
> **브랜치**: `hotfix/1.58.2`

## 📋 작업 개요

**작업 유형**: 성능 개선
**담당**: jsg3121, claude

## 🎯 작업 목표

`/favicon.ico`에 캐시 정책이 지정돼 있지 않아 매 요청마다 서버 재검증이 발생하고 있었다. 파비콘은 페이지를 열 때마다 브라우저가 요청하는 자원이라, 캐시 헤더를 부여해 불필요한 왕복을 없앤다.

<!-- truncate -->

## 📉 왜 필요했나

`public/favicon.ico`는 Next.js가 정적 파일로 서빙하는데, `public/` 하위 자산의 기본 응답 헤더는 `Cache-Control: public, max-age=0`이다. 즉 브라우저가 파일을 보관하더라도 **사용 전에 매번 서버에 물어봐야 한다.**

`next.config.js`의 `headers()`에는 이미 여러 캐시 규칙이 있었지만, 정적 자산 규칙은 `/assets/:all*.(svg|png)` 하나뿐이라 루트에 있는 `/favicon.ico`는 어떤 규칙에도 매칭되지 않았다.

응답 본문 자체는 304로 끝나 전송량은 작지만, 요청 왕복은 그대로 발생한다. 파비콘은 탭 아이콘·북마크·검색 결과에서 반복 요청되는 자원이라 누적되면 무시할 수 없다.

## ✨ 주요 변경사항

### `/favicon.ico` 캐시 규칙 추가

**변경 전**: 규칙 없음 → Next.js 기본값 `public, max-age=0` 적용

**변경 후**:

```js
{
  // 파비콘 - 브라우저 1일 / CloudFront 1년 캐싱
  // URL에 해시가 없는 고정 경로라 immutable은 붙이지 않는다.
  // 브라우저가 하루마다 재검증할 여지를 남겨야 교체분이 반영된다.
  // CloudFront는 /favicon.ico 전용 동작으로 분리돼 있으며,
  // 파비콘 교체 시 해당 경로를 수동 무효화한다.
  source: '/favicon.ico',
  headers: [
    {
      key: 'Cache-Control',
      value: 'public, max-age=86400, s-maxage=31536000',
    },
  ],
}
```

### CloudFront 동작 추가

`/favicon.ico` 전용 동작(Behavior)을 신설했다. 이 작업 전에는 경로 패턴이 `/_next/static`·`/assets/*`·`/detail/*/opengraph-image*` 중 어디에도 매칭되지 않아 기본값(`*`) 동작으로 떨어졌고, SSR 페이지용 캐시 정책을 함께 쓰고 있었다. 전용 동작으로 분리해 오리진이 보내는 `s-maxage`가 페이지 캐시 정책의 TTL 범위에 맞춰 잘리지 않도록 했다.

## 📊 적용 결과

| 항목 | 변경 전 | 변경 후 |
| --- | --- | --- |
| 브라우저 캐시 (`max-age`) | 0초 (매번 재검증) | 86,400초 (1일) |
| CloudFront 캐시 (`s-maxage`) | 미지정 | 31,536,000초 (1년) |
| CloudFront 동작 | 기본값(`*`)에 포함 | `/favicon.ico` 전용 동작 |
| 반복 방문 시 요청 | 매번 조건부 요청 | 캐시 히트 |

## 🔧 기술적 세부사항

### `immutable`을 쓰지 않은 이유

`/assets/:all*.(svg|png)` 규칙은 `public, max-age=31536000, immutable`을 쓴다. 여기에 같은 값을 적용하지 않은 건 **URL 구조가 다르기 때문**이다.

`immutable`은 "이 URL의 응답 본문은 앞으로 절대 바뀌지 않는다"는 선언이다. 이를 받은 브라우저는 만료 전까지 조건부 요청조차 보내지 않는다. 따라서 파일명에 해시가 붙어 내용이 바뀌면 URL도 함께 바뀌는 자산에만 안전하다.

`/favicon.ico`는 해시 없는 고정 경로다. 여기에 `immutable`을 붙이면 나중에 파비콘을 교체해도 이미 방문한 사용자의 브라우저는 최대 1년간 새 파일을 가져가지 않는다. 강제 반영 수단이 사실상 없어진다.

대신 브라우저는 1일, CloudFront는 1년으로 계층을 나눴다. 파비콘 교체 시 CloudFront 무효화를 수행하면 엣지는 즉시, 브라우저는 최대 하루 안에 새 아이콘을 받는다. `immutable`이 없어야 이 하루짜리 재검증이 동작한다.

### 검증

`next.config.js`를 직접 로드해 `headers()` 반환값에 규칙이 포함되는지 확인했다.

```bash
node -e "require('./next.config.js').headers().then(h =>
  console.log(h.filter(x => x.source.includes('favicon'))))"
```

규칙 1건이 정상 반환되며, 전체 헤더 규칙은 20건에서 21건이 됐다. Prettier 포맷 검사도 통과했다.

## 📌 참고 사항

- **파비콘 교체 시 CloudFront `/favicon.ico` 무효화가 필수 절차다.** `s-maxage`가 1년이라 무효화를 빠뜨리면 엣지 캐시가 갱신되지 않는다.
- 루트 `/favicon.ico` 경로는 그대로 유지했다. Google은 파비콘 수집 시 HTML의 `icons` 선언과 별개로 이 관습 경로를 폴백으로 사용하므로, `app/icon.ico` 파일 컨벤션으로 옮겨 경로를 없애는 방식은 채택하지 않았다.
- `stale-while-revalidate`는 넣지 않았다. CloudFront가 이 지시자를 지원하지 않고(엣지의 stale 서빙은 `Error Caching Minimum TTL` 기반의 오류 응답에 한정된다), 브라우저 쪽은 `max-age=86400`이 이미 커버해 실제로 동작하는 구간이 없다.
- 배포 후 실제 응답 헤더 확인이 필요하다: `curl -sI https://poke-korea.com/favicon.ico | grep -i 'cache-control\|x-cache'`

## 🔗 참고 자료

- [Next.js — Static Assets in `public`](https://nextjs.org/docs/app/building-your-application/optimizing/static-assets)
- [Next.js — `headers` 설정](https://nextjs.org/docs/app/api-reference/next-config-js/headers)
- [RFC 8246 — HTTP Immutable Responses](https://datatracker.ietf.org/doc/html/rfc8246)
- [RFC 9111 §5.2.2.10 — `s-maxage`](https://www.rfc-editor.org/rfc/rfc9111.html#name-s-maxage)
- [AWS — Managing how long content stays in the CloudFront cache](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html)
- [Google Search Central — 검색결과 파비콘 정의](https://developers.google.com/search/docs/appearance/favicon-in-search)
