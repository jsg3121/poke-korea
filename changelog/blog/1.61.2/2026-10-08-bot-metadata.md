---
slug: bot-metadata
title: '크롤러가 받는 HTML에서 canonical이 head 밖으로 밀리던 문제 수정'
description: 'CDN이 사람용 스트리밍 응답을 캐시해 네이버 봇에 전달하면서 canonical이 body로 밀리던 문제를, 모든 요청에 메타데이터를 head로 렌더하도록 바꿔 해결했습니다.'
authors: [jsg3121, claude]
tags: [bug-fix, seo, nextjs]
---

# 크롤러가 받는 HTML에서 canonical이 head 밖으로 밀리던 문제 수정

> **작업 날짜**: 2026-10-08
> **브랜치**: `feature/1.61.2-bot-metadata`

## 📋 작업 개요

**작업 유형**: 버그 수정 / SEO
**담당**: Claude Code

## 🎯 작업 목표

어떤 User-Agent로 요청하든, 그리고 CDN이 어떤 응답을 캐시하든 `canonical`·`title`·`robots` 등 메타데이터가 항상 `<head>` 안에 들어가게 한다.

<!-- truncate -->

## 📉 왜 필요했나

10/4부터 네이버 검색 유입 중 상세 페이지(`/detail`)가 하루 평균 789 → 229 세션(-71%)으로 줄었다. 네이버 유입이 있는 상세 페이지 수도 1,241개 → 409개로 함께 줄었다. 서치어드바이저에서는 여러 포켓몬의 대표 URL이 `https://poke-korea.com/detail/1`로 표시됐다.

원인을 추적하다 다음 구조를 재현했다.

1. Next.js 15.2부터 메타데이터를 **스트리밍**한다. 기본 봇 목록(`HTML_LIMITED_BOT_UA_RE`, Yeti 포함)에 맞지 않는 요청에는 `<head>`를 먼저 보내고 메타데이터는 나중에 body 쪽에 붙인다.
2. CloudFront는 상세 페이지 HTML을 `s-maxage=86400`으로 캐시한다. 캐시 키가 봇과 사람을 구분하지 않는다.
3. 그래서 사람이 먼저 요청해 캐시된 응답을 봇이 그대로 받는다. 실제로 네이버 모바일 봇 UA로 `/detail/542`를 요청하자 `x-cache: Hit`이었고, canonical이 `</head>`보다 한참 뒤(약 14만 번째 문자)에 있었다.

`<head>` 밖의 canonical은 검색엔진이 무시한다. 그러면 검색엔진은 대표 URL을 스스로 고르게 된다.

## ✨ 주요 변경사항

### 모든 UA에 메타데이터 블로킹 렌더

**변경 전**: `htmlLimitedBots` 미지정 → 기본 봇 목록에 맞는 UA만 블로킹 렌더하고, 나머지는 스트리밍

**변경 후**:

```js
// next.config.js
htmlLimitedBots: /.*/,
```

UA가 있는 모든 요청이 같은 HTML을 받는다. CDN이 어떤 응답을 캐시하든 메타데이터는 `<head>` 안에 있다.

## 🔍 검증

- `npm run build` 통과
- `.next/required-server-files.json`의 `config.htmlLimitedBots`가 `".*"`로 반영된 것 확인
- Prettier 통과 (`next.config.js`는 ESLint ignore 대상)
- **아직 확인하지 않은 것**: 로컬 서버에서 일반 브라우저 UA로 요청했을 때 canonical이 `<head>` 안에 있는지. 배포 후 CloudFront 캐시가 갱신된 뒤 서치어드바이저 대표 URL이 정상으로 돌아오는지

## ⚠️ 구현 시 고려한 점

- **CloudFront 캐시 키에 봇 여부를 넣는 방안은 기각했다.** 인프라 설정 변경이 필요하고, 캐시가 쪼개진다. 봇 판별 규칙도 Next.js와 CloudFront 두 곳에서 맞춰 관리해야 한다.
- 대가로 사람에게도 메타데이터 계산이 끝난 뒤 첫 바이트가 나간다. 상세 페이지 메타데이터는 본문과 같은 조회를 쓰므로 지연은 작을 것으로 본다.
- UA 헤더가 아예 없는 요청은 Next.js 구현상 여전히 스트리밍된다.

## 📌 참고 사항

- 배포 직후에는 기존 CloudFront 캐시(최대 24시간)가 남아 있다. 바로 반영하려면 `/detail/*` 무효화가 필요하다.
- 네이버가 대표 URL을 `/detail/1`로 고른 정확한 기준은 확인하지 못했다. 이 수정 뒤에도 회복되지 않으면, 상세 페이지 간 공통 텍스트 비율(약 58~68%)을 다음 후보로 본다.
- 근거: [Next.js `htmlLimitedBots`](https://nextjs.org/docs/app/api-reference/config/next-config-js/htmlLimitedBots), [Streaming metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#streaming-metadata), [Google — 중복 URL 통합](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
