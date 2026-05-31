# 챔피언스 데이터 소스 가이드

> **목적**: 챔피언스 영역의 각 기능/페이지가 어떤 외부 API의 어느 엔드포인트를 사용해야 하는지 매핑한 백엔드 가이드 문서
> **연결 문서**: `.claude/research/reports/MI-BA-2026-05-28-champions-pikalytics.md`, `.claude/specs/champions-pikalytics-enhancement.md`
> **작성일**: 2026-05-28
> **대상**: 백엔드 작업자 (본 레포의 프론트엔드 변경과 별도 작업)

---

## 0. 핵심 원칙

| 원칙 | 내용 |
| --- | --- |
| 하이브리드 파이프라인 | Smogon 직접(통계/메타) + Pikalytics `/ai/` 보완(팀 데이터/대회/winRate) |
| eurekaffeine 단계적 축소 | 즉시 제거하지 않되 신규 기능은 Smogon/Pikalytics 직접 호출로 구현. Phase 2에서 자연 대체 |
| DB 캐시 후 GraphQL 제공 | 모든 외부 데이터는 DB에 캐시한 후 GraphQL로 제공. 외부 API 단절 리스크 차단 |
| Attribution 표기 | Smogon, Pikalytics 데이터 사용 시 출처(`source` 필드)에 명시 |
| 갱신 주기 정렬 | Smogon: 월 1회 / Pikalytics 대회: 비정기 / ISR revalidate는 갱신 주기의 1/2 권장 |

---

## 1. 데이터 소스 3계층

```
Smogon (원본 통계)
   ↓
Pikalytics (가공/노출 + 토너먼트 독자 수집)
   ↓
eurekaffeine scraper (크롤링/재노출, MIT)
   ↓
poke-korea 백엔드
```

| 계층 | 사용 권장 | 사용 비권장 |
| --- | --- | --- |
| Smogon (원본) | 통계, 메타, EV 스프레드, 카운터, 사용률 상세 | 대회 팀 데이터 (Smogon에 없음) |
| Pikalytics `/ai/` | 팀 코어, 최근 탑팀, winRate, W-L-Draw 전적 | 통계 (Smogon 직접이 더 깔끔) |
| eurekaffeine | 현재 운영 중인 기능 유지보수 한정 | 신규 기능 |

---

## 2. Smogon 엔드포인트

**Base URL**: `https://www.smogon.com/stats/`

### 2-1. 월별 디렉토리 구조

```
https://www.smogon.com/stats/[YYYY-MM]/
├── [format]-0.txt        # 전체 레이팅
├── [format]-1500.txt     # 1500+
├── [format]-1630.txt     # 1630+
├── [format]-1760.txt     # 1760+ (최고 경쟁)
├── chaos/
│   └── [format]-[rating].json   # 상세 JSON
├── metagame/
│   └── [format]-[rating].txt    # 플레이스타일 분포
└── leads/
    └── [format]-[rating].txt    # 선발 통계 (일부 포맷 미지원)
```

### 2-2. Champions 관련 포맷 목록

| 포맷 ID | 설명 | 사용 시점 |
| --- | --- | --- |
| `gen9championsvgc2026regma` | VGC 2026 Regulation M-A (더블) | Phase 1 (VGC) |
| `gen9championsvgc2026regmabo3` | VGC BO3 (더블 BO3) | Phase 1 (옵션) |
| `gen9championsbssregma` | Battle Stadium Singles Reg M-A | Phase 1 (BSS) |
| `gen9championsou` | Champions OU (싱글) | Phase 1 (BSS 대안) |
| `championstournaments` | 토너먼트 통합 (현재 eurekaffeine 사용) | Phase 5 보완 |

> **포맷 ID 정책**: VGC Regulation이 분기마다 갱신됨 (Reg M-A → Reg M-B 등). 백엔드는 "현재 활성 Regulation" 설정을 환경변수 또는 DB로 관리하여 정기적으로 갱신해야 함.

### 2-3. 엔드포인트별 데이터 항목

#### 2-3-1. `[format]-[rating].txt` (사용률 요약)

```
포맷 헤더: Total battles, Avg. weight/team
컬럼: Rank | Pokemon | Usage% | Raw | % | Real | %
```

| 추출 필드 | poke-korea 매핑 |
| --- | --- |
| Rank | `usageRank` |
| Pokemon (영문) | 자사 포켓몬 ID 매핑 필요 |
| Usage% | `usageByRating.[rating]` (Phase 2) |
| Raw / Real | (참고용, 노출 없음) |

#### 2-3-2. `chaos/[format]-[rating].json` (상세 JSON)

포켓몬별 데이터:

| chaos JSON 필드 | poke-korea 매핑 | 사용 Phase |
| --- | --- | --- |
| `Raw count` | (내부 분석용) | - |
| `usage` | usageRate (가중) | Phase 2 |
| `Viability Ceiling` | (GXE 지표, 옵션) | - |
| `Abilities` (object: 명→가중치) | `topAbilities` (기존 보강) | 즉시 가능 |
| `Items` (object: 명→가중치) | `topItems` (기존 보강) | 즉시 가능 |
| `Spreads` (object: "성격:HP/Atk/Def/SpA/SpD/Spe"→가중치) | `evSpreads` (Phase 4 신규) | Phase 4 |
| `Happiness` (object: 친밀도→가중치) | (옵션, 사용률 낮은 데이터) | - |
| `Moves` (object: 기술명→가중치) | `topMoves` (기존 보강) | 즉시 가능 |
| `Teammates` (object: 포켓몬명→가중치) | `topPartners` (기존 보강) | 즉시 가능 |
| `Checks and Counters` (object: 포켓몬명→[n, p(KO율), d(교체율)]) | `counters` (Phase 3 신규) | Phase 3 |

#### 2-3-3. `metagame/[format]-[rating].txt` (메타게임 분포)

```
balance: 60.94%
offense: 38.71%
trickroom: 12.34%
tailwind: ...
sun/rain/sand/hail: ...
```

| 추출 필드 | poke-korea 매핑 |
| --- | --- |
| 아키타입별 비율 | `archetypes: [{name, percentage}]` (장기 옵션) |

#### 2-3-4. `leads/[format]-[rating].txt` (선발 통계)

> 일부 포맷에서만 제공. VGC(더블)는 일반적으로 미제공일 수 있음 → 호출 전 존재 여부 체크 필수.

| 추출 필드 | poke-korea 매핑 |
| --- | --- |
| 선발 사용률 | `leadRate: Float` (장기 옵션) |

### 2-4. 갱신 주기 및 캐싱

- **갱신 주기**: 월 1회 (매월 1~3일 사이 업로드)
- **백엔드 수집 주기**: 월 1회 cron (예: 매월 5일 03:00 KST)
- **DB 저장**: 포맷 × 레이팅 × 월 단위 키
- **GraphQL ISR**: `revalidate=86400` (24h)

### 2-5. 인증 및 제한

- 인증 불필요
- API 키 없음
- robots.txt 별도 제한 없음 (직접 확인 시점 기준)
- Rate Limit 공식 발표 없음 → 백엔드 cron 1회 호출 정도는 안전

### 2-6. 라이선스

- 공식 라이선스 부재
- 커뮤니티 합의: 통계는 사실상 공개 도메인. 분석/세트는 Smogon 저작권
- **권장 처리**: `source` 필드에 "Smogon Stats ([YYYY-MM])" 표기

---

## 3. Pikalytics 엔드포인트

**Base URL**: `https://www.pikalytics.com/`

### 3-1. `/ai/` 엔드포인트 (AI/자동화 공식 제공)

llms.txt에서 공식 제공 의사가 명시된 엔드포인트. AI 에이전트 및 자동화 접근 허용.

| 엔드포인트 | 데이터 | 사용 Phase |
| --- | --- | --- |
| `/ai/pokedex/[format]` | 포맷별 사용률 인덱스 (Markdown) | (Smogon 우선이라 미사용) |
| `/ai/pokedex/[format]/[pokemon]` | 포켓몬 상세 (winRate, W-L-Draw 포함) | 즉시 가능 (winRate null 즉시 해결) |
| `/ai/topteams/[format]` | 팀 코어, 최근 탑팀 | Phase 5 |
| `/ai/tournaments/[source]/[slug]` | 대회별 입상팀 상세 | Phase 5 |

### 3-2. 엔드포인트별 데이터 항목

#### 3-2-1. `/ai/pokedex/[format]/[pokemon]` (포켓몬 상세)

| Pikalytics 항목 | poke-korea 매핑 | 사용 시점 |
| --- | --- | --- |
| Win Rate (%) | `winRate` (기존 필드, null 복구) | 즉시 |
| Wins/Losses/Draws | `winRecord: {wins, losses, draws}` (신규 필드) | 즉시 |
| Moves with usage % | (Smogon이 더 정확) | 미사용 |
| Items with usage % | (Smogon 사용) | 미사용 |
| Spreads (Champions 포맷에서 일부 제한) | (Smogon 우선) | 미사용 |

#### 3-2-2. `/ai/topteams/[format]` (팀 코어 + 탑팀)

| 항목 | 매핑 |
| --- | --- |
| Team Cores (2~4인 조합) | `teamCores: [{pokemons[], frequency}]` |
| Top Teams (대회 입상 6마리) | `topTeams: [{pokemons: 6슬롯}]` |

#### 3-2-3. `/ai/tournaments/[source]/[slug]` (대회별 상세)

| 항목 | 매핑 |
| --- | --- |
| Tournament name, date, source | `Tournament { name, date, source }` |
| Top placements (선수, 팀 6마리 풀빌드) | `topPlacements: [{playerName, rank, team: [TeamSlot × 6]}]` |
| TeamSlot 세부 (포켓몬, 기술 4, 특성, 아이템, EV, 테라스탈 타입) | `TeamSlot { pokemonId, moves[4], ability, item, evs, teraType }` |

### 3-3. 갱신 주기 및 캐싱

- **포켓몬 상세**: 월 1회 (Smogon 갱신과 동기)
- **팀 코어**: 월 1회
- **대회 데이터**: 비정기 (대회 종료 후 1~7일 내)
- **백엔드 수집 주기**:
  - 포켓몬 상세 / 팀 코어: 월 1회 (Smogon과 같은 시점)
  - 대회 데이터: 주 1회 cron + 수동 트리거 가능 인터페이스
- **GraphQL ISR**:
  - 포켓몬 상세: `revalidate=86400` (24h)
  - 대회 데이터: `revalidate=3600` (1h)

### 3-4. 인증 및 제한

- 인증 불필요
- API 키 없음
- `/ai/` 엔드포인트는 llms.txt에서 공식 제공
- Rate Limit 미공개 → 보수적으로 호출 간격 1초 이상 권장

### 3-5. 라이선스

- 공식 ToS 부재 (/privacy 404 확인됨)
- llms-full.txt에서 "Pikalytics usage data"로 Attribution 표기 요청
- **권장 처리**: `source` 필드에 "Pikalytics" 표기. 데이터 재배포 시 출처 링크 포함

### 3-6. 정책 변경 리스크 대응

- Pikalytics가 `/ai/` 정책을 변경할 가능성 존재
- 대응 방안:
  - 모든 데이터를 DB 캐시 (외부 단절 시에도 기존 데이터 노출 유지)
  - 응답 실패율 모니터링 (예: 24시간 내 3회 이상 실패 시 알림)
  - Phase 5 작업 전 가장 최근 endpoint 동작 재확인

---

## 4. eurekaffeine scraper (기존 유지)

**Base URL**: `https://eurekaffeine.github.io/pokemon-champions-scraper/`

### 4-1. 현재 사용 중인 엔드포인트

| 엔드포인트 | 데이터 |
| --- | --- |
| `/battle_meta.json` | 전체 메타 (schema_version, updated_at, season, pokemon_usage[]) |
| `/pokemon/{dex_id}.json` | 포켓몬 개별 상세 |

### 4-2. 사용 한계 (이미 발견된 부족점)

| 항목 | 상태 |
| --- | --- |
| winRate | 필드는 있으나 null 반환 |
| tera_types | 빈 배열 |
| spreads | 빈 배열 |
| 포맷 분리 | `championstournaments` 1개만 |
| 레이팅 컷오프 | 1760 고정 |

### 4-3. 단계적 축소 계획

| Phase | 처리 |
| --- | --- |
| Phase 1 | 신규 라우트(`/champions/[format]/*`)는 Smogon 직접 호출. eurekaffeine은 기존 라우트(`/champions/list` 등) 호환만 유지 |
| Phase 2~4 | Smogon 직접 호출 기반 데이터로 자연 대체 |
| Phase 5 이후 | eurekaffeine 의존 완전 제거 검토 |

---

## 5. 페이지/기능 × 엔드포인트 매핑 표

> 본 표가 백엔드 작업의 최종 매핑 가이드. SPEC `champions-pikalytics-enhancement.md`의 각 Phase와 1:1 대응.

| 페이지/기능 | GraphQL 필드 (신규/확장) | 데이터 소스 | 엔드포인트 | 갱신 주기 | ISR revalidate |
| --- | --- | --- | --- | --- | --- |
| **Phase 1**: 포맷 분리 `/champions/[format]/list` | `format: ChampionsFormat!` 입력 | Smogon | `stats/[YYYY-MM]/[format]-[rating].txt` (포맷별) | 월 1회 | 86400 |
| **Phase 1**: 포맷 분리 `/champions/[format]/tier` | `format` 입력 | Smogon | 동상 | 월 1회 | 86400 |
| **Phase 1**: 포맷 분리 `/champions/[format]/list/[pokemonId]` | `format` 입력 | Smogon | 동상 | 월 1회 | 86400 |
| **Phase 2**: 레이팅별 사용률 | `usageByRating: UsageByRating` | Smogon | `stats/[YYYY-MM]/[format]-{0,1500,1630,1760}.txt` 4개 병렬 | 월 1회 | 86400 |
| **Phase 3**: 카운터/체크 | `counters: [CounterEntry]` | Smogon | `chaos/[format]-[rating].json` → `Checks and Counters` | 월 1회 | 86400 |
| **Phase 4**: EV 스프레드 | `evSpreads: [EvSpread]` | Smogon | `chaos/[format]-[rating].json` → `Spreads` | 월 1회 | 86400 |
| **Phase 5**: 대회 목록 `/champions/tournaments` | `tournaments: [Tournament]` | Pikalytics | `/ai/topteams/[format]` + `/ai/tournaments/[source]/[slug]` | 비정기 | 3600 |
| **Phase 5**: 대회 상세 `/champions/tournaments/[slug]` | `tournament: Tournament` | Pikalytics | `/ai/tournaments/[source]/[slug]` | 비정기 | 3600 |
| (옵션) winRate 복구 | `winRate` 필드 (기존, null 복구) | Pikalytics | `/ai/pokedex/[format]/[pokemon]` | 월 1회 | 86400 |
| (옵션) 메타게임 아키타입 | `archetypes: [Archetype]` | Smogon | `stats/[YYYY-MM]/metagame/[format].txt` | 월 1회 | 86400 |
| (옵션) 선발 통계 | `leadRate: Float` | Smogon | `stats/[YYYY-MM]/leads/[format].txt` | 월 1회 | 86400 |

---

## 6. 백엔드 운영 체크리스트

### 6-1. 신규 데이터 도입 시 공통 절차

1. Smogon/Pikalytics 엔드포인트의 최근 응답 직접 확인 (응답 포맷 변경 여부)
2. 파서 작성 + 단위 테스트
3. DB 스키마 추가 (포맷 × 레이팅 × 월 단위 키)
4. cron 작업 등록 (월 1회 또는 주 1회)
5. GraphQL 타입 추가 + 리졸버 구현
6. ISR revalidate 값 적용
7. `source` 필드에 Attribution 표기
8. 실패 시 폴백 정책 (DB 캐시 fallback)

### 6-2. 한국어명 매핑

Smogon은 영문 포켓몬명 사용. 자사 한국어 DB와 매핑이 필요한 항목:

| 영향 항목 | 처리 |
| --- | --- |
| 사용률 목록 (Pokemon 컬럼) | 영문 → 자사 pokemonId 매핑 테이블 |
| 카운터/체크 (Pokemon명) | 동상 (Phase 3) |
| 팀메이트 (Pokemon명) | 동상 (기존 보강) |

매핑 누락 시 처리 방침:
- 매핑 실패 항목은 영문 그대로 표시하되 운영 알림 발송
- 신규 포켓몬 추가 시 매핑 테이블 갱신을 운영 SOP에 포함

### 6-3. 갱신 cron 일정 권장

| 작업 | 주기 | 권장 시각 (KST) |
| --- | --- | --- |
| Smogon 월간 갱신 수집 | 매월 5일 03:00 | (월간 데이터는 1~3일 사이 업로드되므로 5일 안전) |
| Pikalytics 포켓몬 상세 수집 | 매월 7일 03:00 | (Smogon 갱신 후 Pikalytics가 반영하는 시간 고려) |
| Pikalytics 대회 데이터 수집 | 매주 월요일 09:00 + 수동 트리거 | (대회 종료 후 1~7일 내 추가 데이터 발생) |

---

## 7. 외부 API 호출 보호

### 7-1. 백엔드 호출 패턴

```
[cron] → [Smogon/Pikalytics 호출] → [파서] → [DB 저장]
                                          ↓
                                    [GraphQL 리졸버]
                                          ↓
                                    [프론트 ISR 캐시]
```

### 7-2. 실패 대응

| 단계 | 실패 시 처리 |
| --- | --- |
| 외부 호출 실패 | 3회 재시도 (지수 백오프) → 실패 시 DB 기존 데이터 유지 + 알림 |
| 파서 실패 (포맷 변경) | 알림 발송 + DB 기존 데이터 유지 + 수동 점검 트리거 |
| DB 저장 실패 | 트랜잭션 롤백 |
| GraphQL 리졸버 실패 | `isStale: true` 표기로 응답 + 클라이언트는 stale 표시 |

### 7-3. 모니터링 지표

- 외부 API 호출 성공률 (월간)
- 파서 실행 시간 (트렌드)
- DB 저장된 가장 최근 갱신 시각
- `isStale: true`로 응답된 비율

---

## 8. 후속 작업 핸드오프

본 가이드는 백엔드 변경 작업의 인풋이다. 백엔드 작업이 시작될 때 다음을 함께 참조해야 한다.

| 문서 | 역할 |
| --- | --- |
| `.claude/specs/champions-pikalytics-enhancement.md` | Phase별 작업 정의 (프론트 + 백엔드 요구사항) |
| `.claude/research/reports/MI-BA-2026-05-28-champions-pikalytics.md` | 분석 근거 (왜 이 우선순위인지) |
| `.claude/specs/champions-api-spec.md` | 기존 백엔드 API 명세 |
| `.claude/specs/champions-api-frontend-spec.md` | 기존 프론트엔드 연동 명세 |
| 본 문서 | 외부 API → GraphQL 필드 매핑 |

---

## 9. 한계 및 가정

1. **Smogon 포맷 ID는 시즌마다 변경**: VGC Regulation이 갱신될 때마다 환경변수/DB 갱신 필요.
2. **Pikalytics `/ai/` 응답 포맷**: 현재 Markdown으로 추정되며, 정확한 스키마 확정은 백엔드 작업 시점에 재검증 필요.
3. **레이팅 컷오프 가용성**: 일부 포맷에서 일부 레이팅이 누락될 수 있음. Phase 2에서 폴백 설계 필요.
4. **카운터 매핑 운영**: Smogon 영문 포켓몬명 → 자사 한국어명/ID 매핑 누락 케이스 운영 SOP 필요.
5. **본 가이드는 분석 기반 권장사항**: 실제 백엔드 구현 시 응답 스키마/제약을 재확인 후 조정 가능.
