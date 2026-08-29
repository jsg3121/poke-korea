---
slug: font-cache
title: '웹폰트 캐싱 헤더 추가 — 매 요청 600KB 재전송 제거'
description: '캐시 정책이 없어 방문마다 CloudFront를 거쳐 오리진에서 새로 내려받던 웹폰트 2종(약 600KB)에 Cache-Control을 부여했습니다. 브라우저 1일·CloudFront 1년 캐싱입니다.'
authors: [jsg3121, claude]
tags: [performance, nextjs]
---

# 웹폰트 캐싱 헤더 추가

> **작업 날짜**: 2026-08-30
> **브랜치**: `hotfix/1.58.3`

## 📋 작업 개요

**작업 유형**: 성능 개선
**담당**: jsg3121, claude

## 🎯 작업 목표

`/fonts/` 하위 웹폰트에 캐시 정책이 없어 CloudFront가 전혀 캐싱하지 못하고 매 요청이 오리진까지 도달하고 있었다. 직전 버전(1.58.2)의 파비콘 캐싱 작업과 같은 원인이며, 실제 영향은 이쪽이 훨씬 크다.

<!-- truncate -->

## 📉 왜 필요했나

1.58.2 배포 후 파비콘 캐싱을 검증하는 과정에서 `public/` 루트의 다른 정적 자산도 함께 확인했고, 웹폰트가 같은 문제를 겪고 있는 것을 발견했다.

| 자산 | 크기 | `cache-control` | `x-cache` |
| --- | --- | --- | --- |
| `GmarketSansBold.subset.woff2` | 301KB | `public, max-age=0` | Miss |
| `GmarketSansMedium.subset.woff2` | 299KB | `public, max-age=0` | Miss |

`x-cache`에 `age`조차 없다는 건 CloudFront가 객체를 보관하지 않고 매번 오리진으로 되묻는다는 뜻이다. **합계 약 600KB가 방문마다 오리진에서 새로 나가고 있었다.**

원인은 파비콘과 동일하다. `public/` 하위 자산의 Next.js 기본 응답 헤더는 `Cache-Control: public, max-age=0`이고, `next.config.js`의 정적 자산 규칙이 `/assets/:all*.(svg|png)`와 `/favicon.ico`뿐이라 `/fonts/*`는 어디에도 매칭되지 않았다.

웹폰트는 첫 화면 렌더를 직접 막는 자원이라, 15KB짜리 파비콘보다 체감 영향이 크다.

## ✨ 주요 변경사항

### `/fonts/*` 캐시 규칙 추가

**변경 전**: 규칙 없음 → Next.js 기본값 `public, max-age=0` 적용

**변경 후**:

```js
{
  // 웹폰트 - 브라우저 1일 / CloudFront 1년 캐싱
  // 파일명에 해시가 없어 immutable은 붙이지 않는다. 서브셋을 다시 뜨면
  // 같은 파일명으로 내용만 바뀔 수 있어, 하루마다 재검증할 여지를 남긴다.
  // 교체 시 CloudFront /fonts/* 경로를 수동 무효화한다.
  source: '/fonts/:path*',
  headers: [
    {
      key: 'Cache-Control',
      value: 'public, max-age=86400, s-maxage=31536000',
    },
  ],
}
```

## 📊 적용 결과

| 항목 | 변경 전 | 변경 후 |
| --- | --- | --- |
| 브라우저 캐시 (`max-age`) | 0초 (매번 재검증) | 86,400초 (1일) |
| CloudFront 캐시 (`s-maxage`) | 미지정 (캐싱 안 됨) | 31,536,000초 (1년) |
| 재방문 시 폰트 전송량 | 약 600KB | 0 (캐시 히트) |

## 🔧 기술적 세부사항

### `immutable`을 쓰지 않은 이유

`/assets/*` 규칙은 `public, max-age=31536000, immutable`을 쓴다. 폰트에 같은 값을 적용하지 않은 건 **URL에 해시가 없기 때문**이다.

`immutable`은 "이 URL의 응답 본문은 앞으로 절대 바뀌지 않는다"는 선언이라, 이를 받은 브라우저는 만료 전까지 조건부 요청조차 보내지 않는다. 파일명이 내용에 따라 바뀌는 해시 URL에만 안전하다.

`GmarketSansBold.subset.woff2`는 고정 파일명이다. 서브셋 대상 글자를 다시 뽑으면 **같은 파일명으로 내용만 바뀔 수 있다.** 이때 `immutable`이 붙어 있으면 기존 방문자는 최대 1년간 옛 폰트를 계속 쓴다. 파비콘과 동일한 판단으로 보수적인 값을 택했다.

### 경로 패턴 검증

폰트 파일명에는 점이 2개 들어간다(`GmarketSansBold.subset.woff2`). 패턴이 이를 실제로 매칭하는지, 그리고 `/favicon.ico` 규칙을 침범하지 않는지 Next.js가 내부적으로 쓰는 `path-to-regexp`로 직접 확인했다.

| 경로 | 매칭 |
| --- | --- |
| `/fonts/GmarketSansBold.subset.woff2` | O |
| `/fonts/GmarketSansMedium.subset.woff2` | O |
| `/fonts/sub/dir/x.woff2` | O |
| `/favicon.ico` | X (침범 없음) |

`:path*`는 슬래시를 포함한 다중 세그먼트를 받으므로 하위 디렉터리를 추가해도 규칙을 고칠 필요가 없다.

### 검증

`next.config.js`를 직접 로드해 규칙 반환을 확인했다.

```bash
node -e "require('./next.config.js').headers().then(h =>
  h.filter(x => /favicon|fonts/.test(x.source))
   .forEach(x => console.log(x.source, '->', x.headers[0].value)))"
```

전체 헤더 규칙은 21건에서 22건이 됐다. Prettier 포맷 검사도 통과했다.

## 📌 참고 사항

- **CloudFront에 `/fonts/*` 전용 동작(Behavior) 추가가 함께 필요하다.** 코드 배포만으로는 완결되지 않는다. 현재 `/fonts/*`는 기본값(`*`) 동작의 `poke-korea-cloudfront` 정책을 타는데, 이 정책의 Max TTL이 31536000 미만이면 `s-maxage`가 그 값으로 잘린다.
- 폰트 파일 교체 시 CloudFront `/fonts/*` 경로 수동 무효화가 필요하다.
- woff2는 이미 자체 압축된 포맷이라 전송 단계 재압축(gzip/brotli) 이득이 거의 없다. 응답에 `Vary: Accept-Encoding`이 붙으면 압축 방식별로 캐시 객체가 쪼개져 히트율이 떨어지므로, CloudFront 동작 설정 시 압축 옵션을 끄는 편이 유리하다.
- 이번 작업 범위는 `/fonts/*`로 한정했다. `public/` 루트의 `next.svg`·`lltms.txt` 등도 같은 상태이나, 실제 트래픽 유무와 갱신 주기 판단이 별도로 필요해 포함하지 않았다.

## 🔗 참고 자료

- [Next.js — Static Assets in `public`](https://nextjs.org/docs/app/building-your-application/optimizing/static-assets)
- [Next.js — `headers` 설정](https://nextjs.org/docs/app/api-reference/next-config-js/headers)
- [RFC 8246 — HTTP Immutable Responses](https://datatracker.ietf.org/doc/html/rfc8246)
- [AWS — Managing how long content stays in the CloudFront cache](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html)
- [web.dev — Best practices for fonts](https://web.dev/articles/font-best-practices)
