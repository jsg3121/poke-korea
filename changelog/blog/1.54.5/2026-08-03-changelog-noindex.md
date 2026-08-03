---
slug: changelog-noindex
title: 'changelog 색인 제외 1단계 — 전체 noindex 적용'
description: '검색 수요가 없는 개발 블로그(changelog)가 크롤링 예산을 낭비하는 문제를 해결하기 위해, 전체 페이지에 noindex를 적용했습니다. 색인 제거 확인 후 robots 차단(2단계)으로 이어집니다.'
authors: [jsg3121, claude]
tags: [seo, bug-fix]
---

# changelog 색인 제외 1단계 — 전체 noindex 적용

> **작업 날짜**: 2026-08-03
> **브랜치**: `feature/1.54.5-changelog-noindex`

## 📋 작업 개요

**작업 유형**: SEO / 버그 수정
**담당**: jsg3121, claude

## 🎯 작업 목표

Google Search Console 지표상 changelog(개발 블로그)는 하루 노출이 10회를 넘지 못하고 클릭은 대부분 0이다. changelog는 개발 의사결정 기록이라 포케코리아의 검색 타겟(포켓몬 도감·기술·특성·챔피언스 메타)과 검색 의도가 겹치지 않아, 애초에 검색 수요가 없는 콘텐츠다.

그럼에도 현재 구조는 changelog를 **적극적으로 색인 유도**하고 있었다.

- 메인 sitemap에 `changelog/sitemap.xml`을 명시적으로 등록
- changelog sitemap에는 약 180개 URL(포스트 28 + 태그 페이지 약 60 + 페이지네이션 약 12 등)이 포함
- 그중 절반 이상이 태그·페이지네이션 등 검색 가치가 없는 thin content

신규·저트래픽 사이트에서 Googlebot의 크롤링 예산은 한정적인데, 그 예산이 가치 없는 changelog 목록 페이지로 새면 실제 수익 페이지(포켓몬 상세)의 크롤·재크롤이 지연될 수 있다. 이를 해소하기 위해 changelog를 검색 색인에서 제외한다.

<!-- truncate -->

## 🔍 SEO 개선

### 2단계 색인 제외 전략

색인 제거는 `robots.txt` 차단이 아니라 `noindex`로 수행해야 한다. `robots.txt`로 크롤을 먼저 막으면 Googlebot이 페이지에 접근하지 못해 `noindex` 규칙을 읽지 못하고, 이미 색인된 URL이 검색 결과에 계속 남는다.

> "You must not block the page from crawling if you want the noindex rule to be effective."
> — [Google Search Central: Block Search indexing with noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing)

따라서 다음 순서로 진행한다.

| 단계 | 작업 | 목적 |
|------|------|------|
| **1단계 (이번 작업)** | changelog 전체 `noindex` + 크롤 허용·sitemap 유지 | 구글이 크롤 → noindex 확인 → 색인 제거 |
| **2단계 (후속)** | 색인 제거 확인 후 메인 robots에 `Disallow: /changelog/` + 메인 sitemap에서 changelog 제거 | 크롤링 예산 자체 차단 |

1단계에서 sitemap을 그대로 두는 이유: sitemap에 URL이 남아 있으면 구글이 해당 URL을 더 자주 방문해 `noindex`를 더 빨리 발견하므로, 색인 제거가 앞당겨진다.

## ✨ 주요 변경사항

### 변경 1: changelog 전체 페이지 noindex 적용

Docusaurus의 `noIndex` 옵션은 빌드 시 모든 생성 페이지의 `<head>`에 `<meta name="robots" content="noindex, nofollow">`를 자동 주입한다.

**변경 전** (`changelog/docusaurus.config.ts`):

```ts
favicon: 'img/favicon.ico',

future: {
  v4: true,
},
```

**변경 후**:

```ts
favicon: 'img/favicon.ico',

// [1단계] changelog 전체 색인 제외.
noIndex: true,

future: {
  v4: true,
},
```

> 근거: [Docusaurus docs — `noIndex`](https://docusaurus.io/docs/api/docusaurus-config#noIndex)

### 변경 2: 빌드 실패 유발 MDX 오염 파일 정리 (버그 수정)

`noIndex` 적용을 위해 재빌드하던 중, 기존 changelog 파일이 MDX 파싱 에러(`Unexpected closing slash`)로 빌드를 실패시키고 있음을 확인했다. `1.54.4/2026-07-31-cache-control-s-maxage.md` 파일 하단에 도구 호출 마크업 잔여물(`</content>`, `</invoke>`)이 본문에 섞여 저장돼 있었고, MDX가 이를 여는 태그 없는 JSX 닫는 태그로 해석해 발생한 문제다.

해당 2줄을 제거하여 빌드를 정상화했다(실제 콘텐츠 손실 없음).

## 📊 최적화 결과

| 항목 | 변경 전 | 변경 후 |
|------|---------|---------|
| noindex 적용 changelog HTML | 0개 | 188개 (전체) |
| 주입 메타 태그 | 없음 | `<meta name="robots" content="noindex, nofollow">` |
| changelog 빌드 | 실패(MDX 에러) | 성공 |

## 🔧 기술적 세부사항

- 수정 파일:
  - `changelog/docusaurus.config.ts` (`noIndex: true` 추가)
  - `changelog/blog/1.54.4/2026-07-31-cache-control-s-maxage.md` (오염 태그 2줄 제거)
- 검증: `npm run build` 후 `build/**/*.html` 188개 전부에 `noindex, nofollow` 메타 주입 확인
- 이 단계에서는 **메인 `robots.ts`·`sitemap.ts`를 수정하지 않는다** — 크롤이 허용돼야 구글이 noindex를 읽기 때문. changelog 관련 robots 차단·sitemap 제거는 2단계에서 진행한다.

## 📌 참고 사항

- **2단계는 반드시 분리 배포**하며, GSC 색인 커버리지 리포트에서 changelog URL이 실제로 제외된 것을 확인한 뒤 진행한다. 성급하게 `Disallow`를 걸면 색인 제거가 오히려 지연된다.
- 기존 `/changelog/*.md` disallow(원본 마크다운 차단)는 HTML 크롤을 막지 않으므로 1단계에서 그대로 둔다.
- changelog 포스트 본문 자체는 "AI 코딩으로 만든 서비스"라는 서사·잠재 백링크 자산이므로 사이트에서 삭제하지 않고 접근은 유지한다. 검색 색인에서만 제외한다.
