# SEO-2026-07-28 대표 라우트 SEO 실측 감사

> 대상: poke-korea (Next.js 14 App Router, 단일 언어=한국어, 포켓몬 도감).
> 방식: 대표 라우트 유형별 `page.tsx` + metadata 생성기 + JSON-LD 상수 + view/container 계층의 h1/main 직접 열람.
> 목적: 1.54.0 릴리즈 전 2단계 SEO 점검. 감사 후 P1+P2 수정 착수.

---

## 0. 전역 인프라

### `src/app/layout.tsx`
- `<html lang="ko">` ✅
- `metadataBase: https://poke-korea.com` ✅
- `title.template: '%s'` — ⚠️ 템플릿이 사실상 무력. 브랜드 접미사를 강제하지 않아 각 페이지가 수동으로 문자열에 박음 → 표기 불일치 유발
- 기본 `description` ✅, `robots: getRobotsConfig()` ✅ (prod에서만 index)
- 루트 레벨 기본 OG/Twitter 없음 ❌ (자체 metadata 없는 신규 페이지 OG 공백 위험)
- 전역 JSON-LD: `WEBSITE_JSON_LD`(WebSite + SearchAction)를 `<body>`에 삽입 — ⚠️ 홈 인라인 WebSite와 중복·target 불일치

### `src/app/robots.ts`
프로덕션 도메인, sitemap 2개, disallow 규칙 적절 ✅. 사용자 라우트와 충돌 없음 ✅.

### `src/app/sitemap.ts`
GraphQL 동적 수집, `revalidate=21600`, `BUILD_TIME` lastmod ✅.
- 갭: shiny(`?shinyMode=shiny`)는 의도적 제외(canonical은 별도 URL 취급하며 sitemap엔 미포함 — 비대칭이나 문서화됨)
- 갭: moves 상세 `version/[versionGroupId]` 서브라우트 sitemap 미포함 (canonical·JSON-LD 헬퍼는 존재)

---

## 1. 라우트별 상태표

범례: ✅있음 · 🟡부분/주의 · ❌없음

| 라우트 | 메타 방식 | title | desc | canonical | OG/Twitter | JSON-LD (타입) | h1/main |
|---|---|---|---|---|---|---|---|
| 홈 `/` | static | ✅ | ✅ | ✅ | ✅ | 🟡 WebSite×2 중복(target 불일치) | ✅ |
| 도감 리스트 `/list` | dynamic | ✅ | ✅ | ✅ 쿼리 반영 | ✅ | ✅ BreadcrumbList + ItemList | ✅ |
| 포켓몬 상세 `/detail/[id]` | dynamic | ✅ | ✅ | ✅ shiny=쿼리 | ✅ | 🟡 WebPage(mainEntity=Thing) + shiny시 FAQ | ✅ |
| 기술 목록 `/moves` | dynamic | ✅ | ✅ | ✅ 쿼리 반영 | ✅ | ✅ WebPage+breadcrumb + ItemList | ✅ |
| 기술 상세 `/moves/[id]` | dynamic | ✅ | ✅ | ✅ | ✅ | 🟡 WebPage만 (Move 엔티티 없음) | ✅ |
| 타입 상성 `/type-effectiveness` | static | ✅ | ✅ | ✅ | ✅ | ✅ WebPage + ItemList | ✅ |
| 퀴즈 허브 `/quiz` | static | ✅ | ✅ | ✅ | ✅ | ✅ WebPage + ItemList | ✅ |
| 챔피언스 홈 `/champions/[format]` | dynamic | ✅ | ✅ | ✅ | ✅ | 🟡 BreadcrumbList만 | ✅ |
| 챔피언스 상세 `.../list/[id]` | dynamic | ✅ | ✅ | ✅ formCode 반영 | ✅ | 🟡 BreadcrumbList만 (포켓몬 엔티티 없음) | ✅ |

> 주의: `champions/[format]/list/[pokemonId]/(form)/page.tsx`는 없음. 기준 페이지는 `.../list/[pokemonId]/page.tsx`이고 `(form)/` 아래엔 mega/region/gigantamax/form 서브라우트만 존재. 모두 공통 `renderChampionsDetail.tsx`·`generateChampionsDetailMetadata.ts` 공유.

---

## 2. 공통 패턴

1. **메타 방식은 일관·적절**: 동적 상세/리스트는 `generateMetadata`, 정적 도구 페이지는 `export const metadata`. 루트 상속만 하는 대상 라우트 없음.
2. **canonical 전 라우트 존재** ✅. 필터 쿼리(`?type=`·`?generation=`·`?typeFilter=`)까지 canonical 반영 + sitemap 등록.
   - **`?page=N`은 non-issue**: list/moves는 커서 기반 `first:20`+hasNextPage(무한스크롤)라 `?page=N` URL 자체가 생성 안 됨. 메모리의 "?page=N SEO 보류"는 처리 불필요.
3. **JSON-LD 편재하나 엔티티 스키마 빈약**: 대부분 WebPage/BreadcrumbList/ItemList(문서·네비 스키마). 도메인 엔티티(포켓몬/기술)를 나타내는 표준 스키마 미사용.
   - 포켓몬 상세: `mainEntity=Thing` + PropertyValue 나열 (Thing이라 "포켓몬" 인식 신호 약함)
   - 기술 상세: WebPage만
   - 챔피언스 홈/상세: BreadcrumbList 단독, 상세엔 엔티티조차 없음
   - 리스트/무브목록의 ItemList는 실제 렌더 목록이 아닌 대표 샘플(콘텐츠-스키마 불일치 소지)
4. **og:image 이원화**: 도구/목록은 정적 `/assets/image/ogImage.png`, 상세만 동적 OG 2사이즈.
5. **브랜드 표기 4종 불일치** (`%s` 템플릿이라 각자 수동): `- 포케 코리아` / `| 포케 코리아` / `| 포케코리아` / `| 대한민국 포켓몬의 모든 정보 - 포케 코리아`.

---

## 3. 결함 우선순위

### P1 (구조 신호 왜곡 / 중복)
- **홈 WebSite JSON-LD 2개 중복 + SearchAction target 불일치**: `layout.tsx`의 `WEBSITE_JSON_LD`(target=`/?name=`) vs 홈 `page.tsx` 인라인 WebSite(target=`/list?name=`). 실제 검색 폼은 `/list`로 리다이렉트하므로 layout 쪽이 틀림 → sitelinks searchbox 신호 혼선.
- **엔티티 JSON-LD 전무**: 포켓몬·기술·챔피언스 상세 어디에도 표준 엔티티 스키마 없음. 도감 핵심 자산이 리치결과 후보에서 이탈.

### P2 (커버리지·일관성)
- 챔피언스 홈·상세 JSON-LD가 BreadcrumbList 단독 — 상세엔 포켓몬 엔티티조차 없음.
- ~~moves `version/[versionGroupId]` sitemap 미등록~~ → **정책 확정(2026-07-28)**: sitemap은 `/moves/{id}`까지만 등록한다. version 서브라우트는 (1) `GetPokemonSkillList` 쿼리가 기술별 유효 버전그룹을 반환하지 않아 정확한 조합 생성이 불가하고(백엔드 의존), (2) canonical·JSON-LD 헬퍼가 이미 있어 내부 링크로 발견·색인 가능하므로 sitemap 미등록이 의도된 정책이다. 코드 변경 없음.
- 브랜드 표기 4종 불일치 — `title.template`를 `%s | 포케 코리아`로 통일 시 근본 해소(단 이미 접미사 박은 title과 이중 접미사 충돌 주의).

### P3 (안전망·경미)
- 루트 layout 기본 OG/Twitter 없음.
- 리스트/무브목록 ItemList가 샘플이라 콘텐츠-스키마 불일치 소지.
- shiny canonical vs sitemap 비대칭(의도됨).

### 세맨틱 구조는 전 라우트 양호
h1 페이지당 1개 + `<main>` 확인 (홈/리스트/detailMoves는 sr-only h1, 나머지는 PageHeader/Hero 컨테이너의 가시 h1).

---

## 4. 조치 계획 (이 세션)

- **범위: P1 + P2** (사용자 결정 2026-07-28)
- 순서: P1-1(홈 중복 제거) → P1-2(엔티티 스키마) → P2(챔피언스 JSON-LD·브랜드 통일·moves sitemap)
- 각 수정은 CLAUDE.md 규칙대로 방안 제시 → 승인 → 진행
- 별도: 오염된 `seo-audit` 스킬을 이 감사 기준으로 재작성
