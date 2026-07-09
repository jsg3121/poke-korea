# RES-002: 도감 리스트(/list) 개편 레퍼런스 조사

- 조사일: 2026-07-06
- 스킬: research (general-purpose 서브에이전트 2개 병렬 조사 후 취합)

## 요약

포켓몬 서비스들은 "브라우징용 경량 그리드 vs 비교용 스탯 테이블"을 분리 운영하고, 큰 이미지 카드 그리드는 전량 렌더 대신 Load more/세대 분할을 쓴다. UX 연구(NN/g·Baymard)는 도감류 목표 지향 탐색에 순수 무한스크롤을 비추천하며 **"소량 자동 로드 + 더보기 버튼" 하이브리드**를 권장한다. 가장 중대한 발견: **Google은 스크롤·클릭을 트리거하지 않으므로 무한스크롤 전용 목록은 첫 페이지만 색인**된다 — 검색 유입 83%인 poke-korea에 페이지네이션 병행이 필수다.

## 조사 배경

홈 개편(PR #179) 완료 후 2단계 페이지 재구성 2호 — /list 도감 개편의 ux-designer 입력용. 현행: UA 분기 데/모 2벌, 카드 그리드(데스크톱 5열/모바일 2열, 구버전 카드 2벌), 무한스크롤(Apollo fetchMore + IntersectionObserver, SSR 20개), 타입 필터(최대 2)+추가 필터 모달+이름 검색(전부 URL 반영), ISR revalidate 1년 + `headers()` UA 감지 공존. **FilterBar·FilterModal organism·TypeChip·반응형 PokemonCard가 이 페이지를 위해 이미 DS에 준비됨.**

## 조사 내용

### ① 포켓몬 서비스 도감 리스트 벤치마킹 (전부 직접 접근)

| 서비스 | 리스트 표현 | 로딩 | 필터/검색 |
|---|---|---|---|
| PokemonDB /all | 정렬 가능한 스탯 테이블(~10컬럼) | 1000+ 전량 단일 페이지 | 상단 이름 검색+타입 드롭다운(즉시 반영 추정) |
| PokemonDB /national | 경량 그리드(스프라이트+번호+이름+타입) | 전량, **세대별 9섹션 + Jump to Gen 점프 메뉴** | 없음 |
| Serebii | 텍스트 링크 목록(링크 허브형) | 단일 인덱스 | 타입별 정적 필터 페이지 링크 |
| 공식 Pokemon.com | 카드 그리드 | **"Load more" 버튼** | 타입&약점·번호 슬라이더·특성·키/몸무게·정렬 + **Search/Reset 적용 버튼**(접이식 고급 패널) |
| Bulbapedia | 세대별 테이블(폼은 추가 행) | 전량 단일 | 없음(TOC 세대 점프) |
| pkmn.gg | 카드 그리드(썸네일+이름+번호) | **세대 탭 분할**(151마리씩) | 세대 탭이 1차 내비 |

교차 관찰: ①PokemonDB는 **브라우징 그리드와 비교 테이블을 별도 페이지로 분리**, ②큰 이미지 카드 그리드(공식·pkmn.gg)는 전량 렌더를 피함(Load more/탭 분할), ③세대 점프/앵커가 긴 목록의 공통 탐색 보조, ④조사 대상 어디서도 필터 URL 반영 미확인 — **poke-korea는 이미 반영 중이라 차별화 우위**(공유 가능한 필터 뷰·롱테일 SEO 진입점).

### ② 대량 리스트 UX·기술 패턴 (NN/g·Baymard·Google·web.dev 직접 확인)

**로딩 패턴 (NN/g·Baymard):**
- 무한스크롤은 "목표 없는 동질 항목 훑기"(피드)용 — **도감/카탈로그 같은 목표 지향 탐색엔 부적합**(NN/g). 문제: 푸터 접근 불가, 위치 기억 실패(뒤로가기 시 최상단 튕김), 완료 착각
- Baymard 결론: **"Load More + lazy loading" 조합이 우월**. 권장 수치 — 카테고리 목록: 초기 10–30개 → 자동 lazy 50–100개까지 → 이후 더보기 버튼. **모바일: 15–30개 후 더보기**
- 뒤로가기 위치 복원은 필수인데 "90%가 잘못 구현", 주요 사이트 13%가 복원 실패(모바일 피해 최대)

**SEO (Google 공식):**
- "Google Search does not interact with your page" — 스크롤/클릭으로만 로드되는 항목은 **크롤링 안 됨**
- 권장: 각 청크에 고유 URL(`?page=N`, `#` 금지) + 페이지 간 `<a href>` 순차 링크 + **페이지별 self-canonical** + 스크롤 시 History API로 URL 갱신. `rel=next/prev`는 공식 폐기. 필터 조합 URL은 색인 불필요 시 noindex

**필터 UX (Baymard):**
- 데스크톱 즉시 적용 / **모바일은 일괄 적용 + "결과 N개 보기" 버튼**(실시간 갱신은 화면 흔들림) — 현행 FilterModal(제출 버튼)이 이미 이 패턴 ✓
- 적용된 필터를 목록 상단 **제거 가능한 칩**으로 상시 노출(20% 사이트가 실패), 옵션별 매칭 개수 표시("불꽃 (67)")가 최고 임팩트 개선, 0건 조합 비활성화, 필터·정렬 트리거는 sticky

**성능 (web.dev):**
- 이미지 `width`/`height`(또는 aspect-ratio) 필수 — 미지정 시 0×0으로 계산돼 lazy 전체 무력화 + CLS
- 초기 뷰포트/LCP 이미지는 lazy 금지, 그 밖은 `loading="lazy"` (Safari 15.4+ = 지원 범위 일치)
- **사용자 입력 후 500ms 내 레이아웃 이동은 CLS 미집계** → "더보기" 클릭 로드가 무한스크롤 자동 삽입보다 CLS 유리
- 가상화(react-window)는 SSR/SEO와 상충 — 페이지네이션 병행 구조면 불필요할 가능성(추론)

## 결론 및 추천

### poke-korea /list 적용 시사점 (설계 입력)

1. **로딩: 순수 무한스크롤 → 하이브리드 전환** — 초기 SSR 20 유지 → 스크롤 자동 로드는 ~60–100마리까지 → 이후 "더보기" 버튼. 푸터 접근·피로도·CLS 모두 개선 (Baymard·NN/g·web.dev)
2. **SEO 페이지네이션 병행 — 최우선** — `?page=N` 고유 URL + 페이지 간 `<a href>` + self-canonical을 서버 렌더로 제공, 클라이언트 로드 시 History API 동기화. 검색 유입 83%에서 현재 20마리만 색인 가능성(Search Console 확인 필요). 필터 조합 URL noindex 검토
3. **뒤로가기 위치 복원 보장** — 상세→목록 복귀 시 스크롤·로드 상태 복원(기존 useRouteChangeCache 검증 포함)
4. **필터 UX 정비** — FilterBar(즉시)+FilterModal(일괄)의 현행 분담이 Baymard 패턴과 이미 일치 → DS organism 조립으로 교체하고, **적용 필터 칩 상시 노출 + FilterModal 제출 버튼에 결과 수("N마리 보기")** 추가 검토(결과 수는 추가 쿼리 필요 시 후순위). 세대 필터의 인라인 승격(pkmn.gg 세대 탭 패턴)도 검토 여지
5. **성능** — 카드 이미지 크기 예약(이미 imageSize 지정), 첫 화면만 eager/priority(현행 index<6·15 유지), 나머지 lazy
6. **세대 점프 내비 검토(후순위)** — 필터 아닌 브라우징 모드에서 세대 섹션/점프가 1000+ 스크롤 부담 저감(PokemonDB·Bulbapedia 패턴)

### 고려 사항
- 무한스크롤→하이브리드+페이지네이션은 ListProvider(Apollo fetchMore)·ISR 구조 변경을 수반 — 설계에서 범위 확정 필요
- 조사 대상들의 모바일 열 수·URL 반영은 fetch 한계로 미검증
- "현재 20마리만 색인" 주장은 추론 — 실제 색인 상태는 Search Console에서 확인 필요

## 참고 자료

**벤치마킹 (직접 접근)**: [PokemonDB /all](https://pokemondb.net/pokedex/all) · [PokemonDB /national](https://pokemondb.net/pokedex/national) · [Serebii SV](https://www.serebii.net/pokedex-sv/) · [Pokemon.com 도감](https://www.pokemon.com/us/pokedex) · [Bulbapedia 전국도감](https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_National_Pok%C3%A9dex_number) · [pkmn.gg](https://www.pkmn.gg/pokedex) (Pokemon GO Hub는 403)

**UX/기술 (직접 접근)**:
- [NN/g — Infinite Scrolling: When to Use It, When to Avoid It](https://www.nngroup.com/articles/infinite-scrolling-tips/)
- [Baymard(Smashing) — Pagination, Infinite Scrolling or Load More](https://www.smashingmagazine.com/2016/03/pagination-infinite-scrolling-load-more-buttons/)
- [Baymard — Return Users to the Same Place](https://baymard.com/blog/return-same-place)
- [Baymard — Ecommerce Filter UI](https://baymard.com/learn/ecommerce-filter-ui)
- [Google — Pagination and Incremental Page Loading](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading)
- [Google — Lazy-loading Content](https://developers.google.com/search/docs/crawling-indexing/javascript/lazy-loading)
- [web.dev — Optimize CLS](https://web.dev/articles/optimize-cls) · [Browser-level Lazy Loading](https://web.dev/articles/browser-level-image-lazy-loading) · [Virtualize Long Lists](https://web.dev/articles/virtualize-long-lists-react-window)
