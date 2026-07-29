# RES-001: 홈페이지 UI·UX 개편 레퍼런스 조사

- 조사일: 2026-07-03
- 스킬: research (general-purpose 서브에이전트 3개 병렬 조사 후 취합)

## 요약

주요 포켓몬 서비스 5곳 모두 홈에 대형 히어로 배너 없이 **첫 화면부터 실콘텐츠**(뉴스/데이터)를 배치하고, 검색·도감 진입은 헤더에 영구 고정한다. 모바일 사용자 70%는 홈 전체를 훑으며 서비스 범위를 판단하므로 콘텐츠 카테고리의 30~40%를 홈에 시각 노출해야 하며, 검색 유입 83%인 poke-korea에서 홈의 실질 역할은 검색 순위가 아니라 **링크 허브 + 재방문 훅(데일리 콘텐츠) + 탐색 장치**다.

## 조사 배경

DS 구축(1.54.0 원자·organism, PR #178)이 완료되어 4단계 전략의 2단계 "페이지 단위 재구성"에 진입. 첫 대상인 홈(/)의 재설계(ux-designer) 입력으로 쓰기 위해 외부 레퍼런스를 3개 초점으로 조사했다. 기존 홈 개편물(container/home/, Phase B)은 DS 미비 시점 산출물이라 폐기하고 재설계하기로 결정(2026-07-01).

- 서비스 맥락: 모바일 55.6% / 검색 유입 83%(Google 40.5%·Naver 모바일 30.1%) / MAU 23K → 30K 목표(2026-09) / AdSense 수익.
- 현재 홈 구성(구버전 데/모 2벌): Header → 광고 → 챔피언스 인기 메타 → 오늘의 포켓몬 → 데일리 퀴즈 3종 → 광고 → Footer.

## 조사 내용

### ① 포켓몬 서비스 벤치마킹 (5곳 모두 WebFetch 직접 접근, 2026-07-03)

| 사이트 | Above the fold 핵심 | 홈의 정체성 |
|---|---|---|
| PokemonDB | 내비 통합 검색바 + 뉴스 | 홈은 뉴스 피드, 도구는 내비 드롭다운+하단 퀵링크 |
| Serebii | 퀵링크 바(Pokédex Hub) + 최신 뉴스 | 뉴스 허브 + **Pokémon of the Week**(주간 큐레이션) |
| Bulbapedia | 검색바 + **아이콘 타일형 카테고리 그리드** | 백과사전형 포털 (BulbaVector 스킨으로 데/모 동일 URL 반응형 통합) |
| Pikalytics | **현재 시즌 메타 사용률 대시보드 그 자체** | 랜딩=라이브 데이터 (Top 20 랭킹 그리드, 데이터가 곧 내비게이션) |
| Smogon | 소개 + 여정별 섹션 | **Learn → Train & Battle → Participate** 사용자 여정형 포털 |

**교차 공통점(사실):**
1. 5곳 모두 검색 또는 도감 직행 링크를 헤더에 상시 노출
2. 대형 마케팅 히어로 배너 0곳 — 첫 화면부터 실콘텐츠
3. 도감·도구류는 본문이 아니라 영구 내비게이션(드롭다운)에 집약 — 본문은 큐레이션, 내비는 데이터 진입이라는 역할 분리

**모바일 이력:** PokemonDB 2018 리디자인은 모바일 탭 타깃 확대·검색박스 상시 노출이 핵심. Serebii는 2019년에 3단 레이아웃을 햄버거 접힘으로 개편. Bulbapedia는 m. 서브도메인을 버리고 반응형 단일로 통합.

### ② 모바일 반응형 홈 레이아웃 (NN/g·W3C·MDN·web.dev·Baymard·Smashing 직접 확인)

- **홈 훑기 행동**: 모바일 사용자 70%가 첫 방문 시 홈 전체를 스크롤로 훑으며 사이트 범위를 판단(데스크톱 25%). 상위 사이트 42%가 홈만 보고 범위를 오해하게 만듦 → 카테고리의 **30~40%를 홈에 시각 노출**, 접힌 메뉴 뒤에 숨기지 말 것 (Baymard).
- **카드 그리드**: `repeat(auto-fit, minmax(카드최소폭, 1fr))` RAM 패턴으로 1열→다열 자동 전환(MDN·web.dev). 페이지 구조 변경은 `grid-template-areas` 재정의 — 데/모 뷰 분리 없는 단일 반응형 가능.
- **가로 스크롤/캐러셀**: 동질적 항목 + 3~4 스와이프 내 도달일 때만. **다음 항목이 가장자리에 반쯤 보이는 "연속성 착시"가 가장 강한 시그니파이어**. 자동 넘김 금지. 이질적 기능 진입점(도감·퀴즈)은 캐러셀 금지 (NN/g·Smashing).
- **터치 타겟**: WCAG 2.5.8(AA) 24px 하한, 실무 목표 44~48px + 인접 8px 간격 (W3C·web.dev) — 프로젝트 DS의 `min-h-touch`(44px) 정책과 일치.
- **Above the fold**: 시선 시간 80.3%가 폴드 위(NN/g 아이트래킹). 폴드 위는 "게이트키퍼" — 범주 링크가 아니라 **구체적 콘텐츠 샘플**을 노출하고 최우선 과업만 강조. 섹션 접힘이 필요하면 가로 탭(27% 놓침) 대신 세로 접힘(8%) (Baymard).

### ③ SEO/진입 관점 (Google Search Central·Ahrefs·NN/g·HubSpot·Duolingo 직접 확인)

- **내부 링크**: 홈은 통상 백링크가 가장 많은 최고 권위 페이지 — 홈 **본문**에서 중요 허브로 서술형 앵커로 링크하면 권위가 전달된다(본문 링크 > 푸터 링크, Ahrefs). Google 공식: 중요 페이지는 관련 페이지로부터 링크받아야 하며, 링크 구조가 사이트링크 자동 생성에 직접 영향.
- **홈의 역할**: 검색 유입은 대부분 상세 착지 → 홈 유입은 (a) 브랜드 재방문자 (b) 상세→홈 상승자. NN/g: 홈은 "안전한 귀항점"이자 "이 서비스에 뭐가 더 있는지" 보여주는 발견 장치 — 엘리베이터 피치 + 콘텐츠 지도 역할.
- **데일리 콘텐츠 효과**: Duolingo 스트릭 실험 D7 리텐션 +14%(공식 블로그), NYT 게임 2023년 80억 플레이(Axios) — "하루 1회, 모두 같은 문제" 형식이 습관·공유를 만든다. 효과의 본질은 SEO가 아니라 **검색 비의존 직접 유입 + 세션당 페이지뷰(AdSense)**.
- **허브-스포크**: 홈→허브→스포크 하향 + 스포크→허브 상향 링크를 일관된 앵커로. 내부 링크 증가와 순위 상승의 상관은 HubSpot 자체 실험 확인(상관관계 한계 유의). "topical authority"는 Google 공식 랭킹 요소로 명시된 바 없음.

## 결론 및 추천

### poke-korea 홈 적용 시사점 (설계 입력)

1. **폴드 위 = 정체성 + 1순위 과업 + 오늘의 콘텐츠 1개.** 로고·태그라인 + 도감 검색 진입을 최상단, 바로 아래 "오늘의 포켓몬" 같은 매일 갱신 콘텐츠 샘플. 히어로 배너 금지(업계 0곳). 다음 섹션 상단이 살짝 보이게 스크롤 단서.
2. **허브 직링크 블록을 본문 상단에.** 도감·타입상성·기술·특성·챔피언스 5~6개 허브로 가는 서술형 앵커 링크를 푸터/햄버거가 아닌 본문에 — Bulbapedia식 아이콘 타일 그리드가 모바일 탭 타깃(44px+)까지 겸비. 사이트링크·권위 분배 근거.
3. **데일리 퀴즈를 재방문 훅으로 승격.** NYT/Duolingo 모델 — "오늘의 퀴즈" 상단 배치, 가능하면 연속 참여 상태 노출. 목적은 직접 유입 + 페이지뷰.
4. **챔피언스 메타는 "이번 주 Top N" 큐레이션 카드로.** Serebii 주간 포켓몬·Pikalytics Top 20 패턴 이식. 데이터가 곧 콘텐츠이자 상세로의 신선한 내부 링크.
5. **여정형 섹션 구성(Smogon 패턴) 채택 검토.** 뉴스가 없는 서비스이므로 "찾아보기(도감·상성) → 즐기기(퀴즈) → 경쟁 메타(챔피언스)" 목적별 세로 스택이 뉴스 피드 흉내보다 적합.
6. **레이아웃 원칙**: 섹션 세로 스택 + 카드 그리드 RAM 패턴 통일, 가로 스크롤은 동질 목록(챔피언스 카드 등) 1~2곳만(반쯤 보이기+3~4 스와이프+전체 보기 링크), 터치 타겟 44px(DS 정책 그대로).

### 권고 사항

1. 위 시사점을 ux-designer 홈 재설계의 제약 조건으로 전달한다.
2. 광고 슬롯(AdSense)은 폴드 위 콘텐츠를 밀어내지 않는 위치로 재검토한다(현재 Header 직후 TopBanner가 첫 콘텐츠보다 위).
3. 상세 페이지 → 허브 상향 링크 정비는 홈 개편과 별도 트랙으로 후속 진행한다.

### 고려 사항

- Pikalytics·Smogon의 모바일 레이아웃 차이는 미확인(추측 배제).
- "폴드 위 시선 57%" 후속 수치, "스트릭 2.4배 복귀" 등 2차 인용 수치는 원문 미확인으로 채택하지 않음.
- 재방문 증가가 검색 순위에 직접 반영된다는 공식 근거 없음 — 데일리 콘텐츠의 KPI는 직접 유입·페이지뷰로 설정할 것.

## 참고 자료

**벤치마킹 (직접 접근)**
- [PokemonDB](https://pokemondb.net/) · [Serebii](https://www.serebii.net/) · [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Main_Page) · [Pikalytics](https://www.pikalytics.com/) · [Smogon](https://www.smogon.com/)
- [PokemonDB v4 리디자인 공지](https://pokemondb.net/news/234/welcome-to-pokemon-database-version-4) — 모바일 탭 타깃·검색 상시 노출 교훈

**레이아웃/접근성 (직접 접근)**
- [NN/g — Homepage Design: 5 Fundamental Principles](https://www.nngroup.com/articles/homepage-design-principles/)
- [NN/g — Carousels on Mobile Devices](https://www.nngroup.com/articles/mobile-carousels/)
- [NN/g — Scrolling and Attention](https://www.nngroup.com/articles/scrolling-and-attention-original-research/) — 폴드 위 80.3% 수치
- [Baymard — Mobile Homepage Usability](https://baymard.com/blog/mobile-homepage-usability) — 70% 훑기·30~40% 노출 권고
- [Smashing — Better Carousel UX](https://www.smashingmagazine.com/2022/04/designing-better-carousel-ux/)
- [W3C — Understanding SC 2.5.8 Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [web.dev — Accessible tap targets](https://web.dev/articles/accessible-tap-targets)
- [MDN — Common grid layouts](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Common_grid_layouts)

**SEO/재방문 (직접 접근)**
- [Google — Link Best Practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [Google — SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google — Sitelinks](https://developers.google.com/search/docs/appearance/sitelinks)
- [Ahrefs — Internal Links for SEO](https://ahrefs.com/blog/internal-links-for-seo/) · [Ahrefs — Homepage SEO](https://ahrefs.com/blog/homepage-seo/)
- [HubSpot — Topic Clusters](https://blog.hubspot.com/marketing/topic-clusters-seo)
- [Duolingo — 스트릭 리텐션 실험](https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/)
- [Axios — NYT Games 80억 플레이](https://www.axios.com/2024/01/29/wordle-nyt-games-news-media-layoffs)
