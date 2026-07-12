# RES-003: 포켓몬 상세 페이지 UI/UX 레퍼런스 조사

- 조사일: 2026-07-09
- 스킬: research

## 요약

경쟁 도감 5곳 벤치마킹, 모바일 상세 페이지 UX 실증 리서치(NN/g·Baymard), SEO 공식 가이드(Google) 3축 조사 결과: **"단일 세로 스크롤 + 상단 이전/다음 내비 + 무거운 기술 표만 접기/가로 스크롤, 탭 분할 회피"**가 공통 결론이다. 폼 변형의 경로 분리(현 구조)는 SEO 정석과 일치하며, 스탯 시각화는 레이더 차트를 쓰는 벤치마크가 0곳(가로 막대+수치 병기가 표준)이다.

## 조사 배경

2단계 페이지 재구성 3호 — 상세 페이지(/detail/[pokemonId]) 개편. 현재 라우트 11개(기본+폼 4종+moves 계열) 전부 UA 분기 2벌 렌더이며, 반응형 단일 뷰로 재설계하기 위한 외부 근거 수집. [RES-001](RES-001-home-ui-ux-reference.md)·[RES-002](RES-002-list-page-reference.md)와 동일한 사이클.

## 조사 내용

### 1. 경쟁 도감 상세 페이지 벤치마킹 (5곳)

조사 대상: pokemon.com 공식 도감, 포켓몬코리아, PokemonDB, Serebii, Bulbapedia, Pikalytics (리자몽 #0006 기준, HTML 소스 레벨 교차 검증 — pokemon.com만 봇 차단으로 렌더링 결과 기준).

**공통 패턴:**

- **첫 화면 공식**: 5곳 전부 "이미지 + 도감번호/이름 + 타입"이 최상단. 스탯·기술은 그 아래 — 식별 정보 먼저, 데이터 나중.
- **이전/다음 내비 = 페이지 최상단 + 번호·이름 병기**가 표준(4곳). PokemonDB는 하단에도 중복 배치.
- **한 페이지 완결형이 지배적**: 길어지면 목차/앵커 탭으로 점프 제공. 완전한 하위 라우트 분리는 PokemonDB의 세대별 기술 페이지(`/moves/{gen}`)가 유일 — 우리 `/detail/[id]/moves`와 같은 발상.
- **기술 표 열 공통분모**: 레벨(습득 수단)/기술명/타입/분류(물리·특수·변화)/위력/명중률. 분류 순서는 "레벨업 → 머신 → 알 기술"로 동일.
- **타입은 색상 칩**, 상성은 "18타입 격자+배율"(PokemonDB·Serebii) 또는 "약점 그룹 나열"(pokemon.com·Bulbapedia — 우리 현 방식) 두 계열.

**서비스 간 차이점:**

| 항목 | pokemon.com | PokemonDB | Serebii | Bulbapedia | 포켓몬코리아 |
|------|------------|-----------|---------|------------|-------------|
| 정보 깊이 | 프로필형(기술 표 없음) | 균형형 | 백과형(실수치 계산표) | 백과형(미디어 기록까지) | 프로필형(스탯도 없음) |
| 폼 전환 | 같은 URL 탭 | 같은 URL 앵커 탭 | 페이지 내 섹션 누적 | 페이지 내 표 반복 | **폼별 별도 URL** |
| 스탯 시각화 | 세그먼트 게이지 | 색상 랭크 가로 막대+min/max | 순수 표 | 스탯별 고정색 가로 막대 | 없음 |
| 모바일 표 전략 | 카드 스택 | **가로 스크롤 컨테이너(resp-scroll)** | 데스크톱 표 그대로 | 데스크톱 표 그대로 | 카드 스택 |

- **레이더(육각) 차트를 쓰는 곳은 0곳** — 전부 가로 막대 또는 숫자 표. 우리 현재 레이더 차트는 업계 유일 패턴.
- 포켓몬코리아식 폼별 URL 분리는 이전/다음 내비가 폼으로 오염되는 부작용 관찰(리자몽 다음이 "메가리자몽X") — 폼 URL을 쓰더라도 내비게이션은 종(種) 단위로 유지해야 함.
- 모바일에서 섹션을 축약(숨김)하는 곳은 없음 — 축약 대신 "표 가로 스크롤" 또는 "카드 세로 스택".

### 2. 모바일 상세 페이지 UX 패턴 (실증 리서치)

- **긴 스크롤 vs 탭 vs 아코디언**: 탭 회피가 실증 결론. Baymard 테스트에서 가로 탭은 스크롤 시 시야에서 사라져 사용자가 핵심 섹션을 반복적으로 놓침 — 데스크톱은 "펼쳐진 섹션", 모바일 긴 페이지는 "접힌 섹션(아코디언)" 권장. NN/g도 섹션 간 정보 비교가 필요한 콘텐츠(스탯↔상성)에 탭 부적합 명시. → **단일 세로 스크롤 + 부피 큰 기술 표만 아코디언**이 근거상 최적.
- **앵커/점프 내비**: 점프 링크의 이점은 화면이 작을수록 커짐(NN/g). 스티키 인페이지 내비 + 현재 섹션 하이라이트 + `scroll-margin-top` 오프셋 필수. 스티키 총높이는 최소화.
- **모바일 데이터 테이블**: 열 우선순위 축소 → 첫 열 고정+가로 스크롤(잘린 요소/화살표 단서 — 점 표시는 인지 안 됨) → 카드 전환 순의 전략(NN/g Mobile Tables). 카드 전환 시 `display:block`이 테이블 시맨틱을 깨므로 ARIA 보정 필요.
- **이전/다음 내비**: 스와이프는 발견성이 낮아 보조 수단일 뿐, 가시적 버튼 필수(NN/g). 터치 타깃 44px급(WCAG 2.5.5). 상세→리스트 복귀 시 스크롤 위치 복원은 웹 관례(Baymard 벤치마크 87% 준수).
- **스탯 시각화 접근성**: 막대에 수치 텍스트 항상 병기(WCAG 1.4.11 부담 완화 + 1.4.1 색 단독 의존 금지). 순수 CSS/DOM 막대가 canvas 차트보다 접근성 우위.

### 3. 상세 페이지 SEO (Google 공식 가이드)

- **폼 변형 색인**: 경로 세그먼트 방식(현 구조)은 각 변형이 자체 canonical을 갖고 개별 색인되는 구조로 취급(이커머스 변형 가이드). 메가/거다이맥스/리전폼은 독자 검색 수요("메가리자몽X")가 있으므로 **개별 색인 + 폼별 고유 title/h1/이미지/alt**가 정석. `/moves/version/[versionGroupId]`는 패싯 변형에 가까워 `/moves`로 canonical 통합(또는 noindex) 후보.
- **구조화 데이터**: 도감 항목에 맞는 리치 결과 공식 지원 타입은 없음. `VideoGame`+`character`(엔티티 명확화, 비리치) + 지원 타입인 `BreadcrumbList`·`ImageObject` 조합이 안전 최적점. 억지 Product/Review 적용은 수동 조치 리스크(명시적 정책 위반). FAQ 리치 결과는 지원 종료(2025-06).
- **아코디언/탭 접힘 콘텐츠**: 초기 HTML(SSR)에 존재하면 전량 색인·가중치 차별 없음(모바일 퍼스트 인덱싱 공식 문서). 단 클릭 시 클라이언트 fetch로 로드하면 색인 제외 — 기술 표를 별도 라우트로 둔 현 구조는 이 관점에서 유리.
- **이전/다음 링크**: `rel=prev/next`는 Google 미사용. **본문 `<a href>` + 대상 페이지명 앵커 텍스트**(예: "No.0007 어니부기")가 공식 권장 — 1000+ 상세 페이지 전체를 잇는 크롤 경로가 됨.
- **이미지**: 폼별로 다른 이미지·다른 alt(한국어 설명형) 지정이 개별 색인 정당화에도 기여. `og:image`/`primaryImageOfPage` 지정.

## 결론 및 추천

### 권고 사항

1. **IA는 단일 세로 스크롤 유지, 탭 분할 금지**: 첫 화면 = 이미지+번호/이름+타입(식별 정보), 스탯·상세는 그 아래. 부피 큰 기술 표만 아코디언/하위 라우트로.
2. **이전/다음 포켓몬 내비 신설**(현재 부재): 상단 배치 + 번호·이름 병기 + `<a href>` 구현. UX(순차 탐색)와 SEO(크롤 경로) 동시 충족. 폼 변형은 내비에서 제외(종 단위 유지).
3. **스탯 레이더 차트 → 가로 막대+수치 병기 전환 검토**: 벤치마크 0/5 + 접근성(텍스트 병기, DOM 기반) + 모바일 공간 효율 모두 막대가 우위.
4. **폼 변형 경로 분리는 유지**(SEO 정석과 일치), 폼별 고유 메타/이미지/alt 강화. moves 버전 하위 라우트만 canonical 통합 검토.
5. **모바일 기술 표는 PokemonDB식 가로 스크롤 컨테이너 또는 핵심 열 축소** — 현재 모바일 카드 스택(1기술=1카드)은 세로 부피가 과도함.
6. **구조화 데이터는 기존 JSON-LD에 BreadcrumbList·ImageObject 보강**, 억지 타입 금지.

### 고려 사항

- 스티키 앵커 내비 도입 시 전역 헤더와의 스티키 총높이 관리 필요(리스트 개편의 top-30 정합 경험 참조).
- 아코디언 콘텐츠는 반드시 SSR HTML에 포함(클라이언트 지연 로드 금지) — 색인 보장 전제.
- 상세→리스트 복귀 스크롤 복원은 리스트 개편에서 세션 스토리지로 구현됨 — 상세 개편에서 회귀 검증 필요.

## 참고 자료

- [Google — Canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization) — 중복 판단·canonical 신호
- [Google — URL structure for ecommerce](https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites) — 변형별 URL 전략
- [Google — Faceted navigation](https://developers.google.com/search/docs/crawling-indexing/crawling-managing-faceted-navigation) — 가치 없는 변형 크롤 차단
- [Google — Mobile-first indexing](https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing) — 아코디언/탭 접힘 콘텐츠 색인 보장
- [Google — Pagination and incremental loading](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading) — rel=prev/next 미사용, a href 권장
- [Google — Structured data gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery) / [SD policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) — 지원 타입·억지 적용 리스크
- [Google — Image SEO](https://developers.google.com/search/docs/appearance/google-images) — alt/파일명/대표 이미지
- [schema.org/VideoGame](https://schema.org/VideoGame) — character/characterAttribute 속성
- [NN/g — Accordions on Mobile](https://www.nngroup.com/articles/mobile-accordions/) / [Tabs, Used Right](https://www.nngroup.com/articles/tabs-used-right/) / [Accordions on Desktop](https://www.nngroup.com/articles/accordions-on-desktop/)
- [Baymard — Avoid Horizontal Tabs](https://baymard.com/blog/avoid-horizontal-tabs) — 탭 발견성 실증 테스트
- [NN/g — In-Page Links](https://www.nngroup.com/articles/in-page-links/) / [Sticky Headers](https://www.nngroup.com/articles/sticky-headers/) / [Back to Top](https://www.nngroup.com/articles/back-to-top/)
- [NN/g — Mobile Tables](https://www.nngroup.com/articles/mobile-tables/) — 모바일 표 전략
- [NN/g — Contextual Swipe](https://www.nngroup.com/articles/contextual-swipe/) — 스와이프는 보조 수단
- [Baymard — Return Users to the Same Place](https://baymard.com/blog/return-same-place) — 리스트 위치 복원 관례
- [WCAG 2.5.8 Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) / [1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html) / [1.4.1 Use of Color](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html)
- [MDN — scroll-margin-top](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin-top) — 스티키 헤더 앵커 오프셋
- 벤치마크 원본: [pokemon.com/pokedex/charizard](https://www.pokemon.com/us/pokedex/charizard), [pokemondb.net/pokedex/charizard](https://pokemondb.net/pokedex/charizard), [serebii.net/pokedex-sv/charizard](https://www.serebii.net/pokedex-sv/charizard/), [bulbapedia — Charizard](https://bulbapedia.bulbagarden.net/wiki/Charizard_(Pok%C3%A9mon)), [pikalytics.com](https://www.pikalytics.com), [pokemonkorea.co.kr/pokedex](https://pokemonkorea.co.kr/pokedex)
