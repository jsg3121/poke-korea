# 렌더링 및 데이터 연동 가이드

## Next.js 설정 (`next.config.js`) 주요 항목

| 항목 | 설명 |
|------|------|
| `reactStrictMode` | `true` |
| `removeConsole` | 프로덕션에서 console 제거 |
| `poweredByHeader` | `false` (X-Powered-By 헤더 비활성화) |
| `redirects` | 레거시 쿼리 파라미터 → Path URL 영구 리다이렉트 (메가진화, 리전폼, 기본폼) |
| `headers` | 페이지별 Cache-Control 설정 (상세/리스트: 1년 캐시, 홈: SWR) |
| `webpack` | SVG → React 컴포넌트 변환, 프로덕션 CSS 분리 최적화, ES2022 타겟 |

## GraphQL 연동

| 항목 | 설명 |
|------|------|
| 스키마 엔드포인트 | `http://localhost:4000/graphql` (개발) / `https://api.poke-korea.com` (프로덕션) |
| 원본 파일 | `src/gql/fragment.graphql`, `src/gql/query.graphql` |
| 생성 파일 | `src/graphql/schema.graphql`, `src/graphql/gqlGenerated.ts`, `src/graphql/typeGenerated.ts` |
| Apollo 설정 | `src/module/apolloClient.ts` (SSR/SSG 지원) |
| 코드 생성 설정 | `codegen.ts` |

`src/gql/` 파일 수정 후 반드시 `npm run codegen` 실행하여 타입을 재생성해야 합니다.
`src/graphql/` 내 파일은 자동 생성되므로 직접 수정하지 않습니다.

## 페이지 라우트 맵

```text
src/app/
├── layout.tsx                                  # 루트 레이아웃 (공통 메타/프로바이더/GA/폰트)
├── page.tsx                                    # 홈 (/)
├── providers.tsx                               # 전역 프로바이더 (Apollo, Device 등)
├── error.tsx                                   # 에러 페이지
├── not-found.tsx                               # 404 페이지
├── robots.ts                                   # robots.txt 동적 생성
├── sitemap.ts                                  # sitemap.xml 동적 생성 (5,000+ URL)
│
├── list/
│   └── page.tsx                                # 포켓몬 도감 리스트 (/list)
│
├── detail/[pokemonId]/
│   ├── opengraph-image.tsx                     # 동적 OG 이미지 생성
│   ├── (form)/                                 # 라우트 그룹: 폼별 상세
│   │   ├── page.tsx                            #   기본 상세 (/detail/:id)
│   │   ├── form/[[...index]]/page.tsx          #   폼체인지 (/detail/:id/form/:index?)
│   │   ├── mega/[[...index]]/page.tsx          #   메가진화 (/detail/:id/mega/:index?)
│   │   ├── region/[[...index]]/page.tsx        #   리전폼 (/detail/:id/region/:index?)
│   │   └── gigantamax/[[...index]]/page.tsx    #   거다이맥스 (/detail/:id/gigantamax)
│   └── moves/                                  # 습득 기술
│       ├── page.tsx                            #   기본 기술 (/detail/:id/moves)
│       ├── form/[[...index]]/page.tsx          #   폼체인지 기술
│       └── region/[[...index]]/page.tsx        #   리전폼 기술
│
├── ability/
│   ├── page.tsx                                # 특성 도감 (/ability)
│   └── [id]/page.tsx                           # 특성 상세 (/ability/:id)
│
├── moves/
│   ├── page.tsx                                # 기술 도감 (/moves)
│   ├── [id]/page.tsx                           # 기술 상세 (/moves/:id)
│   └── [id]/generation/[generationId]/page.tsx # 세대별 기술 (/moves/:id/generation/:gen)
│
├── type-effectiveness/
│   └── page.tsx                                # 타입 상성 계산기 (/type-effectiveness)
│
└── quiz/
    ├── page.tsx                                # 퀴즈 메인 (/quiz)
    ├── silhouette/page.tsx                     # 실루엣 퀴즈
    ├── ability/page.tsx                        # 특성 퀴즈
    ├── pokemon-type/page.tsx                   # 타입 퀴즈
    └── type-effectiveness/page.tsx             # 타입 상성 퀴즈
```
