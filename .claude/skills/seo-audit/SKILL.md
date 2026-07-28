---
name: seo-audit
description: |
  SEO 감사 스킬. Next.js Metadata API·JSON-LD 상수·sitemap/robots를 검사해 메타태그, 헤딩 구조, 구조화 데이터, canonical, OG 태그의 결함과 개선점을 보고한다.
  TRIGGER when: "SEO 검사", "SEO 감사", "SEO 체크", "메타태그 확인", "구조화 데이터 확인" 요청, 특정 페이지 SEO 상태 점검 필요
  DO NOT TRIGGER when: SEO 설계/구현(seo-specialist 에이전트 사용), 접근성 검사(a11y-check 사용), 새 SEO 랜딩 페이지 생성
disable-model-invocation: true
---

# SEO 감사 스킬

poke-korea(Next.js 14 App Router, **단일 언어=한국어**, 포켓몬 도감)의 SEO 구현 상태를 검사하고 개선점을 우선순위별로 보고한다. **감사만 수행하고 자동 수정하지 않는다** — 수정이 필요하면 사용자에게 보고 후 확인을 받는다.

## 이 프로젝트의 SEO 구조 (감사 전 파악)

- **메타데이터**: Next.js Metadata API. 정적 페이지는 `export const metadata`(또는 `createMetadata` 헬퍼, `src/constants/seoMetaData.ts`), 동적 라우트는 `generateMetadata()`. 각 라우트의 `_metadata/` 폴더 또는 인접 모듈에 생성기가 있다.
- **브랜드 접미사**: 루트 `src/app/layout.tsx`의 `title.template`(`%s | 포케 코리아`)이 자동으로 붙인다. 각 페이지 title은 **접미사 없이** 페이지명만 둔다(홈·404는 `title.absolute`로 우회). og/twitter title은 template 미적용이라 `- 포케 코리아`를 명시 부착한다.
- **JSON-LD**: `src/constants/*JsonLd.ts` 상수 파일로 관리(pokemonJsonLd·movesJsonLd·championsJsonLd·quizJsonLd·typeEffectivenessJsonLd·abilityJsonLd·websiteJsonLd 등). 각 page.tsx가 `<script type="application/ld+json">`로 삽입.
- **robots/sitemap**: `src/app/robots.ts`, `src/app/sitemap.ts`(GraphQL 동적 수집 + revalidate + 빌드 타임스탬프 lastmod).
- **단일 언어**: hreflang·다국어 alternates는 **해당 없음**. 검사 항목에서 제외한다.
- **페이지네이션**: list/moves는 커서 기반 무한스크롤이라 `?page=N` URL이 생성되지 않는다(canonical 불필요). 필터 쿼리(`?type=`·`?typeFilter=` 등)는 canonical에 반영되고 sitemap에도 등록된다.

## 검사 프로세스

### 1. 대상 선택

사용자가 특정 페이지를 지정하지 않으면 **대표 라우트 유형별로 1개씩** 검사한다(동적 라우트가 40+개라 전수는 비효율):
홈(`/`) · 도감 리스트(`/list`) · 포켓몬 상세(`/detail/[pokemonId]`) · 기술 목록/상세(`/moves`, `/moves/[id]`) · 타입 상성(`/type-effectiveness`) · 퀴즈 허브(`/quiz`) · 챔피언스 홈/상세(`/champions/[format]`, `.../list/[pokemonId]`).

각 라우트는 `page.tsx` + metadata 생성기 + JSON-LD 상수 + view/container 계층(h1/main 확인)을 함께 읽는다.

### 2. 검사 항목

#### 메타태그
- `title` 존재 및 대략 60자 이내. 동적 라우트는 데이터 기반으로 **고유**한지.
- ⚠️ **이중 접미사 검사**: title.template이 `| 포케 코리아`를 붙이므로, 페이지 title에 수동 접미사가 남아 있으면 `... | 포케 코리아 | 포케 코리아`가 된다. `grep`으로 페이지 title 필드의 브랜드 접미사 잔존을 확인.
- `description` 존재, 고유, 120~160자 권장.
- `alternates.canonical` 존재. 동적 라우트·필터 쿼리 페이지에서 특히.
- 브랜드 표기 일관성: 붙여쓰기(`포케코리아`)와 띄어쓰기(`포케 코리아`) 혼용 여부(alternateName 별칭은 예외).

#### Open Graph / Twitter Card
- `openGraph`(title/description/type/url/images), `twitter`(card/title) 존재.
- og:image URL 유효성. 상세는 동적 OG, 목록/도구는 공용 `/assets/image/ogImage.png`.
- og/twitter title에 브랜드 접미사(`- 포케 코리아`)가 명시돼 있는지(template 미적용이므로).

#### 시맨틱 구조
- `<h1>`이 페이지당 **하나만**(PageHeader 또는 Hero 컨테이너, sr-only 포함 — view가 아니라 container 계층에 있을 수 있으니 따라갈 것).
- heading 계층 순차성(h1→h2→h3), `<main>` 태그 존재.

#### 구조화 데이터 (JSON-LD)
- `<script type="application/ld+json">` 존재 및 문법 유효성.
- 페이지 유형별 스키마 적정성:
  - 홈: **WebSite + SearchAction**(홈에만 1회 — 전역 삽입 중복 금지).
  - 리스트/목록: WebPage + BreadcrumbList + ItemList.
  - 상세: WebPage + BreadcrumbList (+ 엔티티는 Thing/PropertyValue. ⚠️ 포켓몬 같은 가상 캐릭터는 Google 리치결과 지원 타입이 없어 Thing이 현실적 — 타입 교체의 실익은 낮음).
- BreadcrumbList의 item URL이 실제 canonical과 일치하는지.

#### robots / sitemap
- `robots.ts` disallow가 실제 라우트와 충돌하지 않는지, sitemap 등록.
- `sitemap.ts`가 실제 존재하는 라우트를 커버하는지. 존재하지 않는 조합 URL을 생성하지 않는지.

### 3. 결과 보고

```markdown
## SEO 감사 결과

### 요약
- 검사 라우트: {N}개
- 🔴 필수 수정: {N}건 · 🟡 권장 개선: {N}건 · ✅ 양호: {N}건

### 🔴 필수 수정
#### [{라우트}] {이슈}
- **현재**: {코드 근거 파일:라인}
- **문제**: {왜 SEO 결함인지}
- **수정 방안**: {구체적 방법 + 근거(공식 문서)}

### 🟡 권장 개선
- {라우트}: {개선 내용}

### 라우트별 상세
| 라우트 | title | desc | canonical | OG/Twitter | JSON-LD(타입) | h1/main |
|--------|-------|------|-----------|------------|---------------|---------|
| / | ✅ | ✅ | ✅ | ✅ | WebSite | ✅ |
```

## 참고 자료

- 이전 감사: `.claude/research/reports/SEO-2026-07-28-route-audit.md`
- [Google 검색 센터 — 구조화 데이터 일반 가이드라인](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Google — BreadcrumbList](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)
- [Google — 사이트링크 검색창(SearchAction)](https://developers.google.com/search/docs/appearance/structured-data/sitelinks-searchbox)
- [Next.js — Metadata / generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
