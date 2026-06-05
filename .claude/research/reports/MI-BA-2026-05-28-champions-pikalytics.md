# MI-BA-2026-05-28 챔피언스 Pikalytics 고도화 분석 보고서

> **목적**: poke-korea 챔피언스 페이지를 Pikalytics 수준으로 고도화하기 위한 외부 환경 조사 및 내부 갭 분석
> **작성일**: 2026-05-28
> **작성 흐름**: market-intelligence → business-analyst (새 "상용 구현 확인 의무" 지침 첫 적용)
> **연결 SPEC**: `.claude/specs/champions-pikalytics-enhancement.md`, `.claude/specs/champions-data-sources.md`

---

## 0. Executive Summary

- 현재 백엔드는 외부 API `eurekaffeine.github.io/pokemon-champions-scraper` 를 사용. 이 API는 Pikalytics를 크롤링하며 Pikalytics는 원본을 Smogon에서 수집한다 (3-Tier 데이터 흐름 확정).
- 자사 챔피언스 4개 라우트(`/champions`, `/champions/list`, `/champions/tier`, `/champions/list/[pokemonId]`)는 **모두 구현 완료** 상태 (메타데이터, ISR, JSON-LD, sitemap 포함).
- Pikalytics 대비 핵심 격차는 "데이터 부재"가 아니라 **"데이터 구조 단순화"**. EV 스프레드/카운터/레이팅별 분리 등은 모두 Smogon에 공개된 데이터이나 자사가 받지 않고 있다.
- **권장 데이터 파이프라인**: Smogon 직접 + Pikalytics `/ai/` 보완 (하이브리드). eurekaffeine 의존은 단계적 축소.
- 단기(~2026-09-30) Phase 1~3까지 약 10주 분량으로 완수 가능 (현재 시점 약 18주 남음).

---

## 1. Market Intelligence

### 1-1. 3-Tier 데이터 흐름

```
Smogon (원본 통계)
   ↓
Pikalytics (가공/노출 + 토너먼트 독자 수집)
   ↓
eurekaffeine scraper (크롤링/JSON 재노출)
   ↓
poke-korea 백엔드 (소비) → 내부 DB 능력치 머지 → 프론트
```

### 1-2. Pikalytics 데이터 출처 (llms.txt 검증)

Pikalytics의 4개 데이터 출처 중 챔피언스 관련:

| 출처 | 설명 |
| --- | --- |
| 공식 닌텐도/Game Freak 랭크 사다리 | Battle Stadium 실전 데이터 |
| 공식 VGC 토너먼트 팀 시트 | 오프라인 대회 결과 |

### 1-3. eurekaffeine scraper 분석

| 항목 | 내용 |
| --- | --- |
| URL | `https://eurekaffeine.github.io/pokemon-champions-scraper/` |
| 호스팅 | GitHub Pages 정적 파일 |
| 라이선스 | MIT |
| 데이터 출처 | Pikalytics `/api/l/{date}/championstournaments-1760` + `/ai/pokedex/championstournaments/{pokemon}` |
| 갱신 주기 | 매주 월요일 02:00 UTC (GitHub Actions) |
| 인증 | 불필요 |
| 제공 포맷 | `championstournaments` (토너먼트 통합 포맷) 1개 고정 |
| 제공 레이팅 | 1760 (최고 경쟁 구간) 고정 |

**핵심 한계**:
- `winRate` 필드는 스키마에 있으나 실제 null
- `tera_types`, `spreads` 빈 배열 (미구현)
- 싱글/더블 포맷 분리 없음
- 레이팅 컷오프 분리 없음
- 팀 코어, 토너먼트 탑팀 미수집

### 1-4. Smogon 원본 데이터

`https://www.smogon.com/stats/[YYYY-MM]/` 월별 디렉토리에서 인증 없이 직접 다운로드 가능.

| 엔드포인트 | 내용 |
| --- | --- |
| `[format]-[rating].txt` | 사용률 요약 (Rank, Pokemon, Usage%, Raw, Real) |
| `chaos/[format]-[rating].json` | 상세 JSON (Spreads, Checks and Counters, Moves, Items, Abilities, Teammates, Happiness 등) |
| `metagame/[format].txt` | 플레이스타일 분포 (Balance/Offense/Trick Room 등) |
| `leads/[format].txt` | 선발(Lead) 통계 (일부 포맷 미지원) |

**Champions 관련 포맷**:
- `gen9championsvgc2026regma` (VGC 더블)
- `gen9championsvgc2026regmabo3` (VGC BO3)
- `gen9championsou` (싱글 OU)
- `gen9championsbssregma` (Battle Stadium Singles)
- `championstournaments` (eurekaffeine이 사용)

**레이팅 컷오프**: -0 / -1500 / -1630 / -1760 (4단계)

### 1-5. 한국 챔피언스 유저 메타 컨텍스트

- VGC(더블)와 BSS(싱글)는 별개 메타 — 사용자 결정으로 **둘 다 동등 우선 도입**
- Battle Usage(사다리)와 Tournaments(대회)도 별개 데이터 — 사용자 결정으로 **둘 다 동등 우선 도입**
- 한국어 차별화는 별도 강화 없이 현재 UI 수준 유지 (Pikalytics가 이미 KOR 지원 중이라 단순 번역만으로는 차별화 약함)

### 1-6. 라이선스 검토

| 출처 | 라이선스 | 위험도 |
| --- | --- | --- |
| Smogon stats | 공식 라이선스 없음. 커뮤니티 합의로 "공개 도메인 수준" 취급 | 낮음 (다수 프로젝트가 상업 사용 중) |
| Pikalytics | 공식 ToS 부재 (/privacy 404). `/ai/` 엔드포인트 공식 제공 + Attribution 요청 | 중간 |
| eurekaffeine | MIT (코드만, 데이터는 별개) | 낮음 |

---

## 2. Business Analyst — 자사 상용 구현 확인

> **새 가드 지침 적용**: `business-analyst.md` "상용 구현 확인 의무" 절을 본 작업이 첫 적용. `src/app/champions/`, GraphQL 타입, 컴포넌트를 모두 직접 확인 후 작성.

### 2-1. 라우트 구현 상태

| 항목 | 라우트/파일 | 구현 상태 | 확인 근거 |
| --- | --- | --- | --- |
| 챔피언스 메인 허브 | /champions | **구현됨** | 메타, JSON-LD(BreadcrumbList), ISR 86400, UA 분기 |
| 챔피언스 도감 목록 | /champions/list | **구현됨** | 메타, JSON-LD(Breadcrumb+ItemList), ISR, 타입/검색 필터, 커서 페이지네이션 |
| 챔피언스 티어 리스트 | /champions/tier | **구현됨** | 메타, JSON-LD, ISR, S/A/B/C/D 5단 |
| 챔피언스 포켓몬 상세 | /champions/list/[pokemonId] | **구현됨** | 동적 메타, JSON-LD, ISR, notFound 처리 |
| 사이트맵 등록 | sitemap.ts | **구현됨** | 정적 3개 + 동적 챔피언스 포켓몬 상세 (updatedAt lastmod) |

### 2-2. 백엔드 GraphQL 타입 (ChampionsMetaStats)

| 필드 | 타입 | 비고 |
| --- | --- | --- |
| pokemonId | Int | |
| usageRate | Float? | |
| winRate | Float? | **스키마에는 존재, 데이터 소스가 null 반환 중** |
| tier | String? | S/A/B/C/D |
| topMoves | [ChampionsMetaMove] | name + usageRate |
| topItems | [ChampionsMetaItem] | name + usageRate |
| topAbilities | [ChampionsMetaAbility] | name + usageRate |
| topPartners | [ChampionsMetaPartner] | pokemonId, name, imagePath, usageRate |
| source | String | 출처 표기 |
| updatedAt | String | 갱신 시각 |
| isStale | Boolean | 캐시 stale 여부 |

### 2-3. 백엔드에 부재한 필드 (Pikalytics 격차)

| 부재 필드 | 데이터 소스 |
| --- | --- |
| EV 스프레드 (성격+EV+사용률) | Smogon chaos JSON `Spreads` |
| 카운터/체크 (KO율, 교체유도율) | Smogon chaos JSON `Checks and Counters` |
| 레이팅 컷오프 분리 (0/1500/1630/1760) | Smogon `[format]-[rating].txt` 4개 |
| 포맷 파라미터 (VGC/BSS) | Smogon 포맷별 엔드포인트 |
| 팀 코어 조합 | Pikalytics `/ai/topteams/[format]` |
| 최근 탑팀 (대회 입상 풀빌드) | Pikalytics `/ai/tournaments/[source]/[slug]` |
| Battle Usage 사다리 통계 | Smogon stats (전체 컷오프) |
| 메타게임 아키타입 분포 | Smogon `metagame/[format].txt` |
| 선발(Lead) 통계 | Smogon `leads/[format].txt` |

### 2-4. 자사 차별화 자산 (Pikalytics에 없음)

- 한국어 UI (Pikalytics도 KOR 있으나 깊이 다름)
- 데미지 계산기, 타입 상성표, 능력치 계산기 (내장)
- JSON-LD + Next.js ISR + 사이트맵 자동화 (SEO 인프라 완비)
- 챔피언스 페이지군 광고 슬롯 6개 도입 완료 (1.44.0)

---

## 3. 사용자 결정 사항 (인풋)

| 결정 | 값 |
| --- | --- |
| 데이터 파이프라인 | **하이브리드** — Smogon 직접(통계/메타) + Pikalytics `/ai/` 보완(팀/탑팀/winRate/대회) |
| 타겟 메타 | **VGC + BSS 둘 다 동등** |
| Battle Usage vs Tournaments | **둘 다 동등** |
| 한국어 차별화 | 별도 강화 없음 |
| 평가 가중치 | 트래픽 자석 + 재방문 유발 동등. 광고 수익은 본 작업 범위 제외 |

---

## 4. TOP 5 우선순위 (사용자 확정 순서)

> **주의**: BA 원안은 1=EV, 2=카운터, 3=레이팅, 4=포맷, 5=탑팀 순이었으나 사용자가 "라우트 구조부터 잡기" 합리적 판단으로 다음 순서로 재정렬.

| 순위 | 기능 | 케이스 | 데이터 소스 | 라우트 변경 | Phase |
| --- | --- | --- | --- | --- | --- |
| **1** | **포맷 분리 (VGC/BSS)** | C 신규 | Smogon 포맷별 엔드포인트 | `/champions/[format]/*` | Phase 1 |
| **2** | **레이팅별 사용률 분리** (0/1500/1630/1760) | B 확장 | Smogon `[format]-[rating].txt` 4개 병렬 | 없음 | Phase 2 |
| **3** | **카운터/체크** | C 신규 | Smogon chaos JSON `Checks and Counters` | 없음 | Phase 3 |
| **4** | **EV 스프레드** | C 신규 | Smogon chaos JSON `Spreads` | 없음 | Phase 4 |
| **5** | **최근 탑팀** (대회 풀빌드) | C 신규 | Pikalytics `/ai/tournaments/` | `/champions/tournaments` | Phase 5 |

### 재정렬 근거

- **Phase 1을 포맷 분리로 두는 이유**: 라우트 구조를 먼저 잡지 않으면 Phase 2~4의 데이터 모두 단일 포맷 가정으로 작성되어 나중에 재작업이 필요. 구조를 먼저 잡고 데이터를 채우는 순서가 효율적.
- **Phase 5(대회 탑팀)을 마지막에 두는 이유**: Pikalytics 의존이라 데이터 소스가 가장 불안정. 다른 Phase가 Smogon 직접 의존으로 안정화된 후 마지막에 보강.

---

## 5. Phase별 상세 작업 인풋

### Phase 1: 포맷 분리 (VGC/BSS) — 약 3~4주

**라우트 구조**:
```
/champions/[format]/list                # format = vgc | bss
/champions/[format]/tier
/champions/[format]/list/[pokemonId]
```

**기존 URL 처리**: `/champions/list` → `/champions/vgc/list` 301 리다이렉트

**백엔드 변경**:
- `ChampionsPokemonListInput`, `ChampionsMetaSummaryFilterInput`에 `format: ChampionsFormat!` enum 파라미터 추가
- enum: `VGC_DOUBLES` / `BSS_SINGLES`
- 포맷별 Smogon 엔드포인트 호출 분기

**프론트 변경**:
- 동적 라우트 `[format]` 추가
- 포맷 토글 UI (탭 또는 선택자)
- 사이트맵 재생성 (포맷별 페이지 자동 포함)

**SEO 키워드 카테고리**:
- "포켓몬 챔피언스 VGC 사용률", "더블 배틀 메타", "BSS 싱글 티어"

**리스크**:
- 기존 색인 URL 손실 → 301 리다이렉트 필수
- sitemap.ts 동적 생성 로직 검증

---

### Phase 2: 레이팅별 사용률 분리 — 약 2주

**대상**: `/champions/[format]/list/[pokemonId]` 페이지에 레이팅 컷오프별 사용률 비교 추가

**백엔드 변경**:
- `usageRate: Float?` → `usageByRating: UsageByRating` 구조 변경
- `UsageByRating { r0, r1500, r1630, r1760 }` 신규 타입
- 기존 단일 값 fallback 유지

**프론트 변경**:
- 상세 페이지 사용률 섹션에 레이팅 탭 또는 바 차트
- 데이터 없는 컷오프 폴백 처리

**SEO 키워드 카테고리**:
- "[포켓몬명] 사용률", "[포켓몬명] 고레이팅 메타"

---

### Phase 3: 카운터/체크 — 약 2~3주

**대상**: `/champions/[format]/list/[pokemonId]` 페이지에 "이 포켓몬의 천적" 섹션 신규

**백엔드 변경**:
- `counters: [CounterEntry]` 필드 추가
- `CounterEntry { pokemonId, pokemonName, koRate, switchRate, sampleCount }`
- Smogon chaos JSON `Checks and Counters` 파서 구현
- **카운터 포켓몬 영문명 → 자사 한국어명/ID 매핑 테이블 필요** (운영 부담 항목)

**프론트 변경**:
- 카운터 섹션 컴포넌트 (포켓몬 카드 + KO율 표시)
- 카운터 포켓몬 상세 페이지로 링크 (양방향 SEO)

**SEO 키워드 카테고리**:
- "[포켓몬명] 카운터", "[포켓몬명] 천적", "[포켓몬명] 약점 포켓몬"

**리스크**:
- 챔피언스에 없는 포켓몬이 카운터로 등장 시 처리 방침 설계
- 영문/한국어 매핑 누락 케이스 운영

---

### Phase 4: EV 스프레드 — 약 2~3주

**대상**: `/champions/[format]/list/[pokemonId]` 페이지에 "추천 EV 빌드" 섹션 신규

**백엔드 변경**:
- `evSpreads: [EvSpread]` 필드 추가
- `EvSpread { nature, hp, atk, def, spa, spd, spe, usageRate }`
- Smogon chaos JSON `Spreads` 파서 구현
- 상위 3~5개 스프레드만 노출 기준 설계

**프론트 변경**:
- EV 스프레드 섹션 (성격 + 6스탯 바 차트 + 사용률)

**SEO 키워드 카테고리**:
- "[포켓몬명] EV 배분", "[포켓몬명] 노력치 배분", "[포켓몬명] 실전 빌드"

---

### Phase 5: 최근 탑팀 (대회) — 약 3~4주

**대상**: 신규 라우트 `/champions/tournaments` + `/champions/tournaments/[slug]`

**백엔드 변경**:
- 신규 타입 `Tournament`, `TopTeam`, `TeamSlot`
- Pikalytics `/ai/topteams/[format]`, `/ai/tournaments/[source]/[slug]` 파서
- 대회 일정/슬러그 관리 로직

**프론트 변경**:
- `/champions/tournaments` 목록 페이지
- `/champions/tournaments/[slug]` 상세 (6마리 풀빌드 카드)
- 메인 허브에 "최근 대회" 섹션 인입

**SEO 키워드 카테고리**:
- "포켓몬 챔피언스 대회 우승팀", "VGC 탑팀", "포켓몬 챔피언스 최신 메타"

**리스크**:
- Pikalytics `/ai/` 엔드포인트 정책 변경 시 데이터 단절
- 대회 운영 부담 (수동 트리거 필요할 수 있음)

---

## 6. 데이터 소스 매핑 요약

상세는 `.claude/specs/champions-data-sources.md` 참조.

### Smogon에서 가져올 항목

| 항목 | 엔드포인트 |
| --- | --- |
| 포맷별/레이팅별 사용률 | `stats/[YYYY-MM]/[format]-[rating].txt` |
| 사용률 상세 (Moves/Items/Abilities/Teammates/Spreads/Counters/Happiness) | `stats/[YYYY-MM]/chaos/[format]-[rating].json` |
| 메타게임 아키타입 분포 | `stats/[YYYY-MM]/metagame/[format].txt` |
| 선발(Lead) 통계 | `stats/[YYYY-MM]/leads/[format].txt` |

### Pikalytics에서만 가져올 항목

| 항목 | 엔드포인트 |
| --- | --- |
| 팀 코어 (2~4인 조합) | `/ai/topteams/[format]` |
| 최근 탑팀 (대회 풀빌드) | `/ai/topteams/[format]`, `/ai/tournaments/[source]/[slug]` |
| 승률(winRate) + W-L-Draw | `/ai/pokedex/[format]/[pokemon]` |

### 캐싱 권장

- Smogon (월 1회 갱신): DB 캐시 + ISR `revalidate=86400` (24h)
- Pikalytics 대회 (비정기): DB 캐시 + ISR `revalidate=3600` (1h)
- 외부 API 단절 리스크 차단을 위해 **모든 데이터는 DB 캐시 후 GraphQL 제공**

---

## 7. 단계적 진입 추정 일정

| Phase | 작업 | 추정 소요 | 누적 |
| --- | --- | --- | --- |
| 1 | 포맷 분리 (VGC/BSS) | 3~4주 | 4주 |
| 2 | 레이팅 컷오프 분리 | 2주 | 6주 |
| 3 | 카운터/체크 | 2~3주 | 9주 |
| 4 | EV 스프레드 | 2~3주 | 12주 |
| 5 | 최근 탑팀 (대회) | 3~4주 | 16주 |

**2026-09-30 단기 KPI 시한까지 약 18주 남음 → Phase 1~5 전부 완수 가능 (단 백엔드 작업 속도 가정)**.

---

## 8. 한계 및 가정

1. **백엔드 작업 속도 가정**: 본 보고서는 분석/SPEC만 다루며 실제 백엔드 변경 일정은 별도. 백엔드 작업이 지연되면 프론트 작업도 지연됨.
2. **Pikalytics ToS 회색 지대**: `/ai/` 엔드포인트 사용은 사실상 허용 신호로 해석되나 공식 ToS 없음. 정책 변경 시 Phase 5 영향.
3. **Smogon 라이선스 비공식**: 통계는 사실상 공개 도메인 취급되나 공식 문서 부재. Attribution 표기 권장.
4. **카운터 매핑 운영 부담**: Smogon 영문명 → 자사 한국어명/ID 매핑은 챔피언스 외 일반 포켓몬도 포함되므로 매핑 누락 케이스 발생.
5. **레이팅 컷오프 가용성**: 모든 포맷이 4단계(0/1500/1630/1760) 모두 제공하지 않을 수 있음. Phase 2에서 폴백 설계 필요.

---

## 9. 참고 자료

- [Pikalytics llms.txt](https://www.pikalytics.com/llms.txt)
- [Pikalytics llms-full.txt](https://www.pikalytics.com/llms-full.txt)
- [Pikalytics AI Hub](https://www.pikalytics.com/ai)
- [eurekaffeine/pokemon-champions-scraper GitHub](https://github.com/eurekaffeine/pokemon-champions-scraper)
- [Smogon Stats Index](https://www.smogon.com/stats/)
- [Smogon Champions 포맷 직접 확인 (2026-04)](https://www.smogon.com/stats/2026-04/)
- [pkmn/stats OUTPUT.md — chaos JSON schema](https://github.com/pkmn/stats/blob/main/stats/OUTPUT.md)
- [pkmn/smogon wrapper — license clarification](https://github.com/pkmn/smogon)
- 내부 문서:
  - `.claude/specs/champions-api-spec.md`
  - `.claude/specs/champions-api-frontend-spec.md`
  - `.claude/specs/champions-implementation-plan.md`
  - `.claude/specs/champions-data-sources.md` (본 작업 산출물)
  - `.claude/specs/champions-pikalytics-enhancement.md` (본 작업 산출물)
