---
slug: robots-ai-crawler
title: 'AI 학습은 거부하고 인용은 남긴다 — robots.txt 크롤러 분리'
description: '8일간 로그에서 AI 크롤러 17종을 분류했다. 학습 전용 6종을 차단하고 검색 색인·실시간 인용 6종은 허용해, 요청 33만 건을 줄이면서 ChatGPT·Claude 답변 인용 경로는 유지한다.'
authors: [jsg3121, claude]
tags: [seo, infra]
---

# robots.txt AI 크롤러 정책 분리

> **작업 날짜**: 2026-09-30
> **브랜치**: `feature/1.61.0-robots-ai`

## 📋 작업 개요

**작업 유형**: SEO 정책 (robots.txt)
**담당**: jsg3121, claude

CloudFront 함수로 위장 크롤러를 차단한 데 이어, 신원을 밝히는 AI 크롤러를 `robots.txt`로 다룬다.

## 🎯 작업 목표

**AI 학습 데이터 수집은 거부하되, 생성형 검색의 인용 경로는 지킨다.**

트래픽만 보고 AI 크롤러를 일괄 차단하면 ChatGPT·Claude 답변에서 사이트가 사라진다. 두 목적을 분리해야 한다.

<!-- truncate -->

## 📉 왜 필요했나

CloudFront 액세스 로그 8일치(09-22~09-29)에서 AI 크롤러 17종이 확인됐다.

| 크롤러 | 요청 수 |
| --- | --- |
| GPTBot | 178,917 |
| Meta-ExternalAgent | 136,771 |
| Bingbot | 44,849 |
| OAI-SearchBot | 27,260 |
| Bytespider | 22,136 |
| Googlebot | 12,231 |
| Amazonbot | 2,692 |
| PerplexityBot | 1,249 |
| ClaudeBot | 701 |
| ChatGPT-User | 596 |
| Claude-User | 268 |

GPTBot 한 종이 178,917건으로 최대였다. 그러나 이 숫자만 보고 OpenAI 크롤러를 전부 막으면 손해가 생긴다.

### 이미 AI 답변에 인용되고 있었다

실시간 조회 크롤러(`ChatGPT-User`·`Claude-User`·`Perplexity-User`) 870건이 고유 경로 503개를 읽어갔고, 응답 200이 812건이었다.

```
89  /
13  /list
12  /detail/795
 8  /detail/247
 8  /type-effectiveness
```

`/detail/*` 개별 포켓몬 페이지가 다수다. 사용자가 AI에 구체적인 질문을 했고 사이트가 답변 근거로 읽혔다는 기록이다. 이 크롤러를 막으면 그 인용이 즉시 끊긴다.

`/robots.txt` 자체도 35건 요청됐다 — 정책을 넣으면 실제로 읽힌다.

## ✨ 주요 변경사항

### 변경 1: 크롤러를 목적별로 3분류

각 사 공식 문서로 용도를 확인했다.

**학습 전용 — 차단해도 검색 노출에 영향 없음**

| UA | 근거 |
| --- | --- |
| GPTBot | OpenAI: 차단이 검색 노출에 영향 없음 |
| ClaudeBot | Anthropic: 학습 전용 |
| Google-Extended | Google: 일반 검색 포함·순위에 영향 없음 |
| Meta-ExternalAgent | Meta: 학습·제품 개선, robots.txt 준수 |
| Bytespider | 검색 유입 없음 |
| CCBot | Common Crawl |

**검색 색인·실시간 인용 — 차단하면 생성형 검색에서 사라짐**

| UA | 근거 |
| --- | --- |
| OAI-SearchBot | OpenAI: 차단 시 ChatGPT 검색 답변에서 제외 |
| ChatGPT-User | 사용자 요청 기반 조회 |
| Claude-SearchBot | Anthropic: 차단 시 검색 가시성 감소 |
| Claude-User | Anthropic: 차단 시 응답에서 콘텐츠 회수 불가 |
| PerplexityBot | Perplexity: 검색 결과 노출용 |
| Perplexity-User | 사용자 요청 기반 조회 |

같은 회사가 목적별로 UA를 나눠 운영한다. OpenAI 문서는 이 조합을 직접 권한다 — OAI-SearchBot을 허용해 검색에 노출되면서 GPTBot을 막아 학습을 거부하는 방식이다.

### 변경 2: rules를 배열로 전환하고 그룹을 4개로 나눴다

기존 `rules`는 객체 하나여서 `*` 규칙만 표현할 수 있었다.

```ts
rules: [
  { userAgent: '*', allow: ['/'], disallow: SHARED_DISALLOW },
  { userAgent: AI_SEARCH_AGENTS, allow: ['/'], disallow: SHARED_DISALLOW },
  { userAgent: AI_USER_AGENTS, allow: ['/'] },
  { userAgent: AI_TRAINING_AGENTS, disallow: ['/'] },
]
```

AI 허용 대상을 **검색 색인**(`OAI-SearchBot`·`Claude-SearchBot`·`PerplexityBot`)과 **사용자 요청 기반**(`ChatGPT-User`·`Claude-User`·`Perplexity-User`)으로 분리했다.

후자는 각 사 문서에 robots.txt를 무시할 수 있다고 명시돼 있어 `SHARED_DISALLOW`가 의미를 갖지 못한다. 접근 허용 의사만 `Allow: /`로 표현한다.

### 변경 3: `/image` 차단을 제거했다

존재하지 않는 경로였다.

| 확인 항목 | 결과 |
| --- | --- |
| `src/app` 하위 `image` 라우트 | 없음 |
| `public/image` 디렉토리 | 없음 |
| 코드 내 `/image` 참조 | `robots.ts` 자신뿐 |

실제 이미지는 `/assets/type/*`(53,664건), `/assets/image/*`(6,797건), `/assets/icons/*`(4,001건)로 서비스된다. `/assets/image/`는 `/image`와 다른 경로여서 애초에 차단되지 않았다.

포켓몬 이미지는 별도 서브도메인 `image.poke-korea.com`에서 제공된다. robots.txt는 도메인 단위로 적용되므로 이 파일의 관할이 아니다.

로그에 남은 `/image*` 요청 36건은 전부 스캐너였다.

```
7  /images.php
2  /images/preupload.php
1  /image_data/%252eenv
```

응답은 404 16건, 301 20건. 차단 규칙으로 남겨두면 스캔 대상을 알려주는 효과만 있다.

## 🔍 검증

| 항목 | 결과 |
| --- | --- |
| `tsc --noEmit` | 0건 |
| ESLint | 0건 |
| Prettier | 통과 |
| `/robots.txt` 응답 | 200, `text/plain` |

생성된 출력을 `urllib.robotparser`로 파싱해 UA 21종의 접근 판정을 확인했다.

| 분류 | UA | `/` | `/detail/25` | `/assets/type/*` |
| --- | --- | --- | --- | --- |
| 학습 | GPTBot, ClaudeBot, Google-Extended, Meta-ExternalAgent, Bytespider, CCBot | 차단 | 차단 | 차단 |
| AI 검색 | OAI-SearchBot, Claude-SearchBot, PerplexityBot | 허용 | 허용 | 허용 |
| 사용자 요청 | ChatGPT-User, Claude-User, Perplexity-User | 허용 | 허용 | 허용 |
| 일반 | Googlebot, Googlebot-Image, bingbot, Yeti, Mediapartners-Google, AdsBot-Google, Applebot, Amazonbot, 일반 브라우저 | 허용 | 허용 | 허용 |

`Disallow: /`가 학습 그룹에만 적용되고 다른 그룹으로 새지 않는다. 변경 전 출력과 `*` 그룹 동작을 경로별로 대조해 기존 규칙이 그대로 유지됨도 확인했다.

## ⚠️ 구현 시 고려한 점

### Bingbot은 차단 대상에서 제외했다

Copilot을 겸하지만 Bing 일반 검색과 동일 크롤러다. 44,849건으로 두 번째 규모지만 막으면 Bing 검색 자체가 사라진다.

### Google-Extended는 AI Overviews 영향이 문서에 없다

Google 문서는 일반 검색 포함·순위에 영향이 없다고 명시하지만, AI Overviews는 언급하지 않는다. AI Overviews가 Googlebot 색인 기반으로 동작하는 점을 고려해 포함했다.

### robots.txt를 무시하는 크롤러가 있다

`ChatGPT-User`·`Perplexity-User`는 사용자 요청으로 발생하는 접근이라 robots.txt가 적용되지 않을 수 있다고 각 사 문서에 명시돼 있다. 허용 대상이라 실무상 문제는 없지만, 이 그룹의 `Allow: /`는 강제력이 아니라 의사 표시에 가깝다.

그래서 GEO 노출을 좌우하는 설정은 `ChatGPT-User`가 아니라 `OAI-SearchBot`이다. 차단 시 ChatGPT 검색 답변에서 제외된다고 명시된 쪽이 후자다.

`Meta-ExternalFetcher`도 robots.txt를 우회할 수 있지만 로그에 나타나지 않았다.

### 기존 Disallow 4개는 Allow에 덮인다

`Allow: /`와 `Disallow: /src/`가 같은 그룹에 있으면 파서에 따라 판정이 갈린다. Python `robotparser`는 먼저 매칭된 `Allow: /`를 적용해 4개 경로 전부 허용으로 판정한다.

실제 응답을 확인하고 그대로 두기로 했다.

| 경로 | 응답 |
| --- | --- |
| `/src/` | 308 |
| `/package.json` | 404 |
| `/CLAUDE.md` | 404 |
| `/changelog/*.md` | 404 |

노출되는 파일이 없고, 로그에 남은 요청도 `/src/.env`·`/src/config/stripe%252ets` 같은 스캐너 탐색뿐이었다. 차단이 실효를 갖지 않는 대신 잃는 것도 없어, 이번 작업 범위(AI 크롤러 정책)를 넘는 변경은 하지 않았다.

## 📊 변경 결과

| 항목 | 값 |
| --- | --- |
| 차단 대상 (8일 기준) | 약 338,500건 |
| 유지되는 AI 검색·인용 | 29,375건 |
| robots.txt 그룹 | 1개 → 4개 |
| 제거된 죽은 규칙 | `Disallow: /image` |

## 📌 참고 사항

### 선행 작업

CloudFront 함수로 UA를 위장한 크롤러를 이미 차단했다. `robots.txt`를 지키지 않는 대상이라 엣지에서 끊어야 했다.

| 대상 | 차단 전 (일) | 차단 후 (일) |
| --- | --- | --- |
| ACEVILLE 위장 크롤러 | 27,904 | 3 |
| Bytespider | 5,082 | 126 |

Bytespider는 양쪽에 모두 넣었다 — 엣지에서 이미 막히지만 `robots.txt`에도 의사를 명시한다.

### robots.txt는 GEO의 전제 조건일 뿐이다

AI 검색봇을 허용한다고 인용이 늘지 않는다. OpenAI 문서도 차단 시 노출되지 않을 수 있다고만 말하며, 허용이 상위 노출을 보장한다고 하지 않는다.

관측된 인용 870건은 "이미 읽히고 있다"는 증거이고, 이 파일은 그 경로를 끊지 않겠다는 선언이다. 실질적인 다음 단계는 질문에 답하기 좋은 페이지 구조 — 명확한 엔티티·속성과 인용 가능한 문장 — 이며 별도 과제로 둔다.

### 이미지 크롤링은 서브도메인 소관

포켓몬 이미지는 `image.poke-korea.com`에서 서비스된다. 해당 도메인의 robots.txt는 `User-Agent: *` / `Allow: /`로 전체 허용 상태여서 Google 이미지 검색·Discover 경로는 열려 있다.

이 파일을 어떻게 바꿔도 그쪽 크롤링에는 영향이 없다.
