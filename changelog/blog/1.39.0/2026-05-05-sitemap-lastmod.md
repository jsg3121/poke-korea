---
slug: sitemap-lastmod
title: '사이트맵 lastmod 정확화 — BUILD_TIME + 챔피언스 외부 데이터 갱신 시각'
description: '모든 sitemap URL이 매 요청마다 new Date()로 갱신되던 문제를 빌드 시점 고정값(BUILD_TIME)과 챔피언스 외부 데이터 갱신 시각(updatedAt)으로 분리하여, 구글이 lastmod 신호를 신뢰하도록 정확화했습니다.'
authors: [jsg3121, claude]
tags: [seo, sitemap, discover]
---

# 사이트맵 lastmod 정확화 — BUILD_TIME + 챔피언스 외부 데이터 갱신 시각

> **작업 날짜**: 2026-05-05
> **브랜치**: `feature/1.39.0-sitemap-lastmod`

## 작업 개요

**작업 유형**: SEO 개선
**담당**: Claude
**연관**: 구글 디스커버 노출 가능성 향상

## 작업 배경

구글 서치콘솔에 디스커버 노출을 노리는 과정에서 사이트맵의 `<lastmod>` 신호가 잘못 발신되고 있음을 발견했습니다.

### 문제

[`src/app/sitemap.ts`](https://github.com/jsg3121/poke-korea/blob/main/src/app/sitemap.ts)는 `export const revalidate = 0`로 매 요청마다 재생성되었고, 모든 URL의 `lastModified` 값이 `new Date()`로 설정되어 있었습니다. 결과적으로:

- 1,300+ 개 URL **전체**가 매 요청마다 "방금 수정됨"으로 표시
- 실제 콘텐츠 변경 여부와 무관하게 lastmod가 갱신
- 구글이 "거짓 신선도(fake freshness)"로 판단해 신호 자체를 무시할 위험

### 근거

[Google Search Central 공식 블로그(2023)](https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping):

> Many sitemaps' `lastmod` is just the date the sitemap was generated, **which is essentially useless to us**. We may stop trusting it entirely if we see this pattern.

[Google Search Central 사이트맵 가이드](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap#additional-notes-about-xml-sitemaps):

> The `<lastmod>` date should reflect the date and time of the **last significant modification of the page**. ... **Do not artificially update the date** if the content didn't change.

## 작업 목표

페이지 카테고리별로 정확한 갱신 시각을 사용한다:

- **정적/도감/특성/기술 페이지**: 빌드 시점 고정 (배포 시에만 갱신)
- **챔피언스 페이지**: 외부 데이터(`battle_meta.json`) 갱신 시각

<!-- truncate -->

## 변경 사항

### 1. GraphQL Query 확장

[`src/gql/query.graphql`](https://github.com/jsg3121/poke-korea/blob/main/src/gql/query.graphql) — `GetChampionsPokemonList`에 `updatedAt` 필드 추가.

```graphql
query GetChampionsPokemonList($input: ChampionsPokemonListInput) {
  getChampionsPokemonList(input: $input) {
    totalCount
    updatedAt          # 추가됨 — battle_meta.json의 외부 데이터 갱신 시각
    pageInfo { ... }
    edges { ... }
  }
}
```

백엔드에서 `PaginatedChampionsPokemonList.updatedAt: String!` (Non-null, ISO 8601 UTC) 필드를 추가 배포 완료. 외부 fetch 실패 시 fallback이 보장되어 null이 발생하지 않음.

### 2. 빌드 시점 환경변수 주입

[`next.config.js`](https://github.com/jsg3121/poke-korea/blob/main/next.config.js) — `BUILD_TIME` 환경변수를 빌드 시점에 고정.

```js
env: {
  BUILD_TIME: new Date().toISOString(),
},
```

Next.js가 빌드를 시작할 때 한 번 평가되고 클라이언트/서버 양쪽에서 동일 값이 사용된다.

### 3. sitemap.ts 리팩토링

[`src/app/sitemap.ts`](https://github.com/jsg3121/poke-korea/blob/main/src/app/sitemap.ts):

#### a) revalidate 변경

```ts
// 변경 전
export const revalidate = 0  // 매 요청마다 재생성

// 변경 후
export const revalidate = 21600  // 6시간(21,600초)
```

> **Why**: BUILD_TIME과 외부 데이터 updatedAt 모두 짧은 주기로 변동하지 않으므로 매 요청 재생성이 불필요. 백엔드 캐시 TTL(12시간)과의 정합성을 고려해 6시간 선택.

#### b) BUILD_TIME 상수 도입

```ts
const BUILD_TIME = new Date(
  process.env.BUILD_TIME ?? new Date().toISOString()
)
```

#### c) 카테고리별 lastmod 분리

| 페이지 카테고리 | lastmod 소스 | 갱신 주기 |
| --- | --- | --- |
| 정적 도구 (`/`, `/list`, `/quiz/*`, `/type-effectiveness`, `/champions`, `/champions/list`, `/champions/tier`) | `BUILD_TIME` | 배포 시 |
| 포켓몬 도감 (`/detail/[id]`, `/detail/[id]/mega`, `/detail/[id]/region`, `/detail/[id]/gigantamax`, `/detail/[id]/form`) | `BUILD_TIME` | 배포 시 |
| 기술/특성 상세 (`/moves/[id]`, `/ability/[id]`) | `BUILD_TIME` | 배포 시 |
| 필터 페이지 (`/list?type=...`, `/list?generation=...` 등) | `BUILD_TIME` | 배포 시 |
| **챔피언스 상세** (`/champions/list/[externalDexId]`) | `getChampionsPokemonList.updatedAt` | 외부 데이터 갱신 시 (수일~주 단위) |

```ts
// 챔피언스만 별도 처리
const championsListResponse = championsData.getChampionsPokemonList
const championsLastModified = new Date(championsListResponse.updatedAt)

const championsDetailPages = championsListResponse.edges.map(
  (edge: ChampionsPokemonEdge) => ({
    url: `https://poke-korea.com/champions/list/${edge.node.externalDexId}`,
    lastModified: championsLastModified,  // 외부 데이터 갱신 시각
    changeFrequency: 'daily',
    priority: 0.8,
  }),
)
```

## 검증

로컬 dev 서버에서 `/sitemap.xml`을 호출해 검증.

### 정적/도감 페이지 (BUILD_TIME)

```xml
<url>
  <loc>https://poke-korea.com</loc>
  <lastmod>2026-05-04T16:27:41.519Z</lastmod>
  ...
</url>
<url>
  <loc>https://poke-korea.com/detail/1</loc>
  <lastmod>2026-05-04T16:27:41.519Z</lastmod>
  ...
</url>
```

dev 서버 시작 시점(`16:27:41`) 고정. 1분 35초 뒤 재호출해도 동일 값 → **요청마다 변하지 않음 확인**.

### 챔피언스 상세 페이지 (외부 데이터 갱신 시각)

```xml
<url>
  <loc>https://poke-korea.com/champions/list/903</loc>
  <lastmod>2026-05-04T05:33:47.683Z</lastmod>
  ...
</url>
```

백엔드 안내문에 명시된 `battle_meta.json.updated_at` 값(`2026-05-04T05:33:47.683049Z`)과 일치 → **외부 데이터 갱신 시각 정확 반영**.

### 챔피언스 페이지 통일성

```bash
curl -s http://localhost:3000/sitemap.xml \
  | awk '/champions\/list\/[0-9]/{getline; print}' \
  | sort -u
# → <lastmod>2026-05-04T05:33:47.683Z</lastmod>  (단 1개)
```

200여 개 챔피언스 상세 페이지 모두 동일 lastmod로 통일 (글로벌 외부 데이터 갱신 시각).

## 영향 범위

### 긍정 효과

- **lastmod 신호 신뢰도 회복**: 거짓 신선도가 사라져 구글이 lastmod를 학습 가능
- **크롤링 효율**: 변경 없는 페이지는 재크롤링 우선순위 ↓ → 크롤 예산을 변경된 페이지로 집중
- **챔피언스 정확성**: 외부 메타 데이터가 실제로 갱신되는 시점만 lastmod 변경 → 메타 변경 후 빠른 재크롤링 유도
- **디스커버 노출 가능성**: 디스커버는 시의성 신호에 민감하며, 정확한 lastmod는 핵심 입력 중 하나

### 회귀 위험

- 정적/도감 페이지는 배포 전까지 lastmod가 고정되므로, 배포 없이 콘텐츠가 바뀌는 경우(예: GraphQL 응답 변경)는 lastmod에 반영되지 않음 → 본 프로젝트는 모든 콘텐츠 변경이 빌드/배포로 이어지므로 문제 없음
- `revalidate = 21600`(6시간)으로 sitemap 자체 재생성 주기가 길어졌으므로, 외부 데이터가 갱신된 직후에도 최대 6시간까지는 sitemap 응답에 반영되지 않을 수 있음 → 일 단위 크롤링 주기에는 영향 없음

## 다음 작업

본 작업으로 lastmod 신호가 정확화되었으나, 구글 디스커버 노출까지의 다른 차단 요소가 남아 있습니다:

- **OG 이미지 종횡비 개선**: 현재 1200×630(16:9) → 디스커버 큰 카드 노출을 위해 1200×1200(1:1) 또는 1200×900(4:3) 추가 필요 (`getOgImageUrls` 파이프라인 수정)
- **Changelog 활용 강화**: 정기적인 패치 노트/메타 업데이트 포스팅으로 디스커버 후보 콘텐츠 확보

## 변경 파일

- `src/gql/query.graphql` — `GetChampionsPokemonList`에 `updatedAt` 필드 추가
- `src/graphql/typeGenerated.ts`, `src/graphql/gqlGenerated.ts`, `src/graphql/schema.graphql` — codegen 자동 생성
- `next.config.js` — `env.BUILD_TIME` 추가
- `src/app/sitemap.ts` — `BUILD_TIME` 도입, 챔피언스 외부 데이터 `updatedAt` 사용, `revalidate = 21600`
