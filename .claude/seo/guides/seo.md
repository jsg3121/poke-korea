# SEO 구성 가이드

## 적용 기법

| 기법 | 설명 | 관련 파일 |
|------|------|-----------|
| Next.js Metadata API | 각 페이지별 `metadata` export 또는 `generateMetadata()` 동적 생성 | 각 `page.tsx` |
| JSON-LD 구조화 데이터 | WebSite, WebPage, BreadcrumbList, ItemList, FAQPage, Thing 스키마 | `src/constants/*JsonLd.ts` (7개) |
| 동적 사이트맵 | GraphQL 데이터 기반 5,000+ URL 동적 생성 | `src/app/sitemap.ts` |
| Robots 설정 | 환경별 분기 (프로덕션: index/follow, 개발: noindex) | `src/app/robots.ts`, `src/module/metadata.module.ts` |
| Canonical URL | 모든 페이지에 Path 기반 canonical URL 설정 | 각 `page.tsx` |
| OpenGraph / Twitter Card | 모든 주요 페이지에 OG 태그 + Twitter `summary_large_image` | 각 `page.tsx` |
| 동적 OG 이미지 | 포켓몬 상세 페이지별 개별 OG 이미지 생성 | `src/app/detail/[pokemonId]/opengraph-image.tsx` |
| SEO 메타데이터 모듈 | 포켓몬명/타입/능력치 기반 동적 title/description 생성 | `src/module/generateDetailSeoMetaData.ts` |

## SEO 적용 현황

- **메타데이터 커버리지**: title, description, OG, Twitter Card, canonical — 전 페이지 100%
- **JSON-LD**: 포켓몬 상세(능력치/특성 포함), 특성, 기술, 퀴즈, 타입 상성 등 주요 페이지 적용
- **리다이렉트**: 레거시 쿼리 파라미터 URL → Path 기반 URL 영구 리다이렉트 (`next.config.js`)

## SEO 작업 시 체크리스트

1. 새 페이지 추가 시 반드시 `metadata` 또는 `generateMetadata()` 설정
2. title은 60자 이내, description은 120~160자
3. canonical URL 설정
4. OG/Twitter Card 태그 포함
5. 해당하는 경우 JSON-LD 구조화 데이터 추가
6. `src/app/sitemap.ts`에 새 URL 패턴 반영 여부 확인
