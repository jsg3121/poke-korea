# 챔피언스 Pikalytics 고도화 SPEC

> **목적**: poke-korea 챔피언스 영역을 Pikalytics 수준으로 고도화하기 위한 Phase별 실행 계획
> **연결 문서**:
> - 근거 보고서: `.claude/research/reports/MI-BA-2026-05-28-champions-pikalytics.md`
> - 데이터 소스 가이드: `.claude/specs/champions-data-sources.md`
> - 기존 챔피언스 계획서: `.claude/specs/champions-implementation-plan.md` (고도화 트랙 분리 섹션과 연결)
> **작성일**: 2026-05-28
> **상태**: 계획 — 사용자 확정 우선순위 반영, 백엔드 작업 미착수

---

## 0. SPEC 메타

| 항목 | 내용 |
| --- | --- |
| 작업 단위 | 1.45.0 루트 아래 다단계 Phase |
| 목표 시점 | 2026-09-30 (단기 KPI 시한) |
| 추정 총 소요 | 약 16주 (Phase 1~5 누적) |
| 데이터 파이프라인 | 하이브리드 (Smogon 직접 + Pikalytics `/ai/` 보완) |
| 라우트 변경 | Phase 1, Phase 5에서 발생 |
| 백엔드 작업 | 본 SPEC 범위에 포함되나 실제 코드 변경은 별도 |

---

## 1. 전제 조건 (선행 작업)

본 SPEC 실행 전 다음이 선행되어야 한다.

| 선행 작업 | 담당 | 완료 조건 |
| --- | --- | --- |
| GraphQL 스키마 확장 (`format`, `usageByRating`, `counters`, `evSpreads`, `tournaments`) | 백엔드 | `champions-data-sources.md`의 페이지×엔드포인트 매핑 표에 따라 |
| Smogon stats 수집 cron 구축 | 백엔드 | 매월 5일 03:00 KST |
| Pikalytics `/ai/` 수집 cron 구축 | 백엔드 | 매월 7일 03:00 + 매주 월요일 09:00 (대회) |
| 영문 → 한국어 포켓몬명 매핑 테이블 | 백엔드 | 챔피언스 외 일반 포켓몬 포함 |

> **본 SPEC의 프론트 작업은 백엔드 GraphQL 필드 추가 이후 시작**한다.

---

## 2. Phase 1 — 포맷 분리 (VGC/BSS)

### 2-1. 목표

- VGC(더블)와 BSS(싱글) 포맷을 라우트 레벨에서 분리해 SEO 인덱싱 페이지를 2배로 확장
- 양 커뮤니티의 타겟 유저를 모두 흡수
- 기존 색인 손실 없이 전환 (301 리다이렉트)

### 2-2. 라우트 구조

```
신규 라우트
/champions/[format]                       # format = vgc | bss
/champions/[format]/list
/champions/[format]/list/[pokemonId]
/champions/[format]/tier

리다이렉트
/champions/list           → /champions/vgc/list           (301)
/champions/list/[id]      → /champions/vgc/list/[id]      (301)
/champions/tier           → /champions/vgc/tier           (301)
```

> 기본값을 VGC로 두는 이유: 현재 eurekaffeine이 `championstournaments`(토너먼트=VGC 위주) 포맷을 사용하므로 기존 색인 콘텐츠 연속성이 가장 높음.

### 2-3. 작업 항목

#### 백엔드 (선행)
- [ ] GraphQL: `enum ChampionsFormat { VGC_DOUBLES, BSS_SINGLES }` 추가
- [ ] `ChampionsPokemonListInput`, `ChampionsMetaSummaryFilterInput`에 `format: ChampionsFormat!` 추가
- [ ] Smogon 포맷별 엔드포인트(`gen9championsvgc2026regma`, `gen9championsbssregma`) 수집 분기
- [ ] DB에 `format` 컬럼 추가, 기존 데이터 마이그레이션 (VGC로 매핑)

#### 프론트
- [ ] `src/app/champions/[format]/` 동적 라우트 신설
- [ ] `src/app/champions/[format]/list/page.tsx`, `tier/page.tsx`, `list/[pokemonId]/page.tsx` 생성
- [ ] 기존 `src/app/champions/list/`, `tier/`, `list/[pokemonId]/` 라우트는 `next.config.js`의 `redirects()`로 301 처리
- [ ] 포맷 토글 UI 컴포넌트 (탭 또는 선택자)
- [ ] 메타데이터 함수에 포맷별 분기 (제목/설명/JSON-LD `name` 차별화)
- [ ] `sitemap.ts` 갱신 — `[format]` 동적 생성
- [ ] `generateStaticParams`로 빌드 시점에 두 포맷 모두 생성

### 2-4. 메타데이터 정책

| 포맷 | 페이지 타이틀 예시 |
| --- | --- |
| VGC | "포켓몬 챔피언스 VGC(더블) 포켓몬 목록 - 포케코리아" |
| BSS | "포켓몬 챔피언스 BSS(싱글) 포켓몬 목록 - 포케코리아" |

### 2-5. 사이트맵 및 색인 전략

- 신규 8개 정적 경로 추가 (포맷 × 페이지)
- 동적 경로: `[format] × [pokemonId]` 곱집합
- 301 리다이렉트는 영구 처리 (구글이 색인 이관)
- Search Console에서 신규 URL 등록 + 기존 URL 변경 모니터링

### 2-6. 검증 기준 (DoD)

- [ ] 두 포맷의 동일 페이지 URL 차이만으로 정상 동작
- [ ] 기존 `/champions/list` 등 URL 진입 시 301 리다이렉트 (404 아님)
- [ ] 새 sitemap.xml에 신규 경로 포함
- [ ] JSON-LD에 포맷별 메타 차별화 적용
- [ ] 두 포맷 모두 빈 데이터 응답 시 폴백 UI 정상 노출

### 2-7. 리스크 및 완화

| 리스크 | 완화 |
| --- | --- |
| 기존 색인 손실 | 영구 301 리다이렉트 + Search Console에서 변경 모니터링 |
| sitemap 동적 생성 오류 | 빌드 시 사이트맵 검증 단위 테스트 추가 |
| BSS 포맷 데이터 부재 시 빈 화면 | 폴백 UI ("이 포맷의 데이터가 아직 준비되지 않았습니다") |

### 2-8. 추정 소요

3~4주

---

## 3. Phase 2 — 레이팅별 사용률 분리

### 3-1. 목표

레이팅 컷오프(0/1500/1630/1760)별 사용률을 동일 포켓몬 상세 페이지에서 비교 가능하게 노출. 고수 유저 재방문 유발.

### 3-2. 작업 항목

#### 백엔드 (선행)
- [ ] GraphQL: `UsageByRating { r0: Float, r1500: Float, r1630: Float, r1760: Float }` 타입 추가
- [ ] `ChampionsMetaStats.usageRate: Float?` → `usageByRating: UsageByRating!` (또는 두 필드 공존, 기존 fallback)
- [ ] Smogon 4개 엔드포인트 병렬 수집 (`[format]-{0,1500,1630,1760}.txt`)
- [ ] 누락 레이팅에 대한 폴백 (null 허용)

#### 프론트
- [ ] `/champions/[format]/list/[pokemonId]` 페이지 사용률 섹션 확장
- [ ] 레이팅 탭 또는 가로 바 차트 컴포넌트
- [ ] 데이터 없는 컷오프 ("측정 데이터 부족" 라벨)

### 3-3. UI 옵션

| 옵션 | 설명 |
| --- | --- |
| A. 탭 형태 | 0/1500/1630/1760 탭 클릭 시 사용률 표시 (단순) |
| B. 가로 바 차트 | 4개 레이팅 동시 비교 가능 (시각화 강함) |
| C. 라인 차트 | 레이팅 상승에 따른 사용률 추이 (메타 변화 가시화) |

권장: 옵션 B (한눈에 비교 가능, 모바일 친화)

### 3-4. 검증 기준 (DoD)

- [ ] 모든 레이팅 컷오프의 데이터가 표시되거나 누락 시 폴백 라벨 표시
- [ ] 모바일/데스크탑 반응형 작동
- [ ] 기존 단일 usageRate fallback이 정상 동작 (Phase 1 데이터와의 호환성)

### 3-5. 추정 소요

2주

---

## 4. Phase 3 — 카운터/체크

### 4-1. 목표

`/champions/[format]/list/[pokemonId]` 페이지에 "이 포켓몬의 천적" 섹션 신규 추가. "[포켓몬명] 카운터" SEO 트래픽 획득.

### 4-2. 작업 항목

#### 백엔드 (선행)
- [ ] GraphQL: `CounterEntry { pokemonId: Int!, pokemonName: String!, koRate: Float!, switchRate: Float!, sampleCount: Int }` 타입 추가
- [ ] `ChampionsMetaStats.counters: [CounterEntry!]!` 필드 추가
- [ ] Smogon chaos JSON `Checks and Counters` 파서 구현
- [ ] 카운터 영문 포켓몬명 → 자사 pokemonId 매핑 (선행 매핑 테이블 사용)
- [ ] 매핑 실패 케이스 처리: 영문 그대로 표시 + 운영 알림

#### 프론트
- [ ] 상세 페이지 카운터 섹션 컴포넌트
- [ ] 카운터 포켓몬 카드 (이미지 + 한국어명 + KO율)
- [ ] 카운터 포켓몬 상세 페이지로 링크 (양방향 SEO + 내부 링크 강화)
- [ ] 챔피언스에 없는 일반 포켓몬 카운터는 `/list/[id]` 일반 도감으로 링크

### 4-3. 노출 정책

| 항목 | 정책 |
| --- | --- |
| 노출 개수 | 상위 5개 (KO율 기준) |
| 정렬 | KO율 내림차순 |
| 챔피언스 포함 여부 표시 | 카운터 카드에 "챔피언스" 뱃지 |
| 영문 매핑 실패 | 영문명 그대로 + 무링크 노출, 운영 알림 |

### 4-4. SEO 인풋

| 키워드 카테고리 | 예시 |
| --- | --- |
| 포켓몬별 카운터 | "글라이온 카운터", "[포켓몬명] 천적" |
| 메타 분석 | "VGC 카운터 픽", "BSS 천적 포켓몬" |

### 4-5. 검증 기준 (DoD)

- [ ] 챔피언스 포켓몬 상세 페이지에서 카운터 섹션이 정상 노출
- [ ] 카운터 카드 클릭 시 해당 포켓몬 상세로 이동
- [ ] 매핑 실패 케이스에 대한 폴백 처리
- [ ] 모바일/데스크탑 반응형

### 4-6. 추정 소요

2~3주

---

## 5. Phase 4 — EV 스프레드

### 5-1. 목표

`/champions/[format]/list/[pokemonId]` 페이지에 "추천 EV 빌드" 섹션 신규 추가. "[포켓몬명] EV 배분" / "[포켓몬명] 노력치" SEO 트래픽 획득.

### 5-2. 작업 항목

#### 백엔드 (선행)
- [ ] GraphQL: `EvSpread { nature: String!, hp: Int!, atk: Int!, def: Int!, spa: Int!, spd: Int!, spe: Int!, usageRate: Float! }` 타입 추가
- [ ] `ChampionsMetaStats.evSpreads: [EvSpread!]!` 필드 추가
- [ ] Smogon chaos JSON `Spreads` 파서 구현 (포맷: `"성격:HP/Atk/Def/SpA/SpD/Spe"` → 가중치)
- [ ] 상위 N개 노출 기준 (권장 3~5개)

#### 프론트
- [ ] EV 스프레드 섹션 컴포넌트
- [ ] 각 스프레드 카드: 성격 라벨 + 6스탯 바 차트 + 사용률 %
- [ ] 데이터 부재 폴백 ("측정 데이터 부족")

### 5-3. 노출 정책

| 항목 | 정책 |
| --- | --- |
| 노출 개수 | 상위 5개 (사용률 기준) |
| 정렬 | 사용률 내림차순 |
| 합계 254/508 등 비정상 스프레드 | 그대로 노출 (Smogon 원본 존중) |
| 능력치 계산기 연동 | 향후 옵션: "이 스프레드로 능력치 계산" 버튼 |

### 5-4. SEO 인풋

| 키워드 카테고리 | 예시 |
| --- | --- |
| 포켓몬별 EV | "[포켓몬명] EV 배분", "[포켓몬명] 노력치" |
| 빌드 키워드 | "[포켓몬명] 실전 빌드", "[포켓몬명] 챔피언스 스프레드" |

### 5-5. 검증 기준 (DoD)

- [ ] 상세 페이지에서 EV 스프레드 섹션 정상 노출
- [ ] 데이터 부재 시 폴백 라벨
- [ ] 6스탯 바 차트 모바일 가독성

### 5-6. 추정 소요

2~3주

---

## 6. Phase 5 — 최근 탑팀 (대회)

### 6-1. 목표

신규 라우트 `/champions/tournaments` + `/champions/tournaments/[slug]`로 대회 입상팀 콘텐츠 노출. 대회마다 갱신되어 재방문 자석.

### 6-2. 라우트 구조

```
/champions/tournaments              # 대회 목록
/champions/tournaments/[slug]       # 대회 상세 + 입상 6마리 풀빌드
```

### 6-3. 작업 항목

#### 백엔드 (선행)
- [ ] GraphQL:
  - `Tournament { slug: String!, name: String!, date: String!, format: ChampionsFormat!, source: String! }`
  - `TopPlacement { rank: Int!, playerName: String!, team: [TeamSlot!]! }`
  - `TeamSlot { pokemonId: Int!, moves: [String!]!, ability: String!, item: String!, evs: EvSpread!, teraType: String }`
- [ ] Pikalytics `/ai/topteams/[format]`, `/ai/tournaments/[source]/[slug]` 파서
- [ ] 대회 슬러그 관리 (수동 트리거 인터페이스 권장)
- [ ] 주 1회 cron + 수동 트리거

#### 프론트
- [ ] `/champions/tournaments/page.tsx` (목록)
- [ ] `/champions/tournaments/[slug]/page.tsx` (상세)
- [ ] 대회 카드 (이름, 날짜, 포맷, 입상자 수)
- [ ] 입상팀 카드 (선수명 + 순위 + 6마리 풀빌드)
- [ ] 메인 허브(`/champions/[format]`)에 "최근 대회" 섹션 인입

### 6-4. SEO 인풋

| 키워드 카테고리 | 예시 |
| --- | --- |
| 대회별 | "[대회명] 우승팀", "[대회명] 결과" |
| 메타 | "포켓몬 챔피언스 최신 메타", "VGC 탑팀" |

### 6-5. 검증 기준 (DoD)

- [ ] 대회 목록에서 클릭 시 상세 페이지 진입
- [ ] 6마리 풀빌드(기술 4 + 특성 + 아이템 + EV + 테라스탈) 정상 노출
- [ ] 풀빌드 내 포켓몬 클릭 시 챔피언스 상세 페이지로 이동
- [ ] Pikalytics 응답 실패 시 기존 캐시 데이터 표시 + stale 표기

### 6-6. 리스크 및 완화

| 리스크 | 완화 |
| --- | --- |
| Pikalytics `/ai/` 정책 변경 | DB 캐시 유지 + 응답 실패 모니터링 + 운영 알림 |
| 대회 운영 부담 | 수동 트리거 인터페이스 제공 |
| 6마리 풀빌드 데이터 누락 | 슬롯별 부분 노출 허용 |

### 6-7. 추정 소요

3~4주

---

## 7. 누적 일정

| Phase | 소요 (주) | 누적 (주) | 완료 추정 시점 |
| --- | --- | --- | --- |
| Phase 1 | 3~4 | 4 | 2026-06-25 |
| Phase 2 | 2 | 6 | 2026-07-09 |
| Phase 3 | 2~3 | 9 | 2026-07-30 |
| Phase 4 | 2~3 | 12 | 2026-08-20 |
| Phase 5 | 3~4 | 16 | 2026-09-17 |

> **2026-09-30 단기 KPI 시한 13일 전 Phase 5 완료 가능** (백엔드 작업 속도 가정)

---

## 8. KPI 영향 (단기 KPI 시한 ~2026-09-30 기준)

본 SPEC이 영향을 주는 단기 KPI 항목:

| KPI | 영향 |
| --- | --- |
| MAU 30K (North Star) | 챔피언스 페이지 4종에 콘텐츠 깊이 추가 → 검색 유입 증가 가능 |
| 신규 인기 페이지 TOP 10 진입 (AC4) | `/champions/tournaments`, `/champions/[format]/tier` 등 신규 라우트가 후보 |
| /type-effectiveness 의존도 분산 (AC3) | 챔피언스 트래픽 증가로 단일 페이지 의존도 자연 감소 |
| 검색 노출/클릭 (A1, A2) | 신규 SEO 키워드 카테고리 다수 추가로 노출 증가 |

> 광고 수익 KPI(R1)에 대한 영향은 트래픽 증가 후 별도 평가.

---

## 9. 미결 항목 (사용자 결정 또는 백엔드 작업 진행 시 확정 필요)

1. **VGC Regulation 갱신 주기**: 현재 Reg M-A. Reg M-B 전환 시 백엔드 환경변수 갱신 책임자 결정
2. **BSS 포맷 선택**: `gen9championsbssregma` vs `gen9championsou` 중 한국 챔피언스 유저가 주로 어디인지 확인 후 채택
3. **카운터 매핑 운영 SOP**: 영문 → 한국어 매핑 누락 시 처리 절차 (백엔드 작업자 합의)
4. **대회 트리거 인터페이스**: 수동 트리거를 어드민 UI로 만들지, CLI 명령으로 만들지
5. **EV 스프레드 능력치 계산기 연동**: Phase 4 완료 후 후속 작업으로 검토

---

## 10. 참고 자료

- 본 SPEC의 근거 보고서: `.claude/research/reports/MI-BA-2026-05-28-champions-pikalytics.md`
- 데이터 소스 매핑: `.claude/specs/champions-data-sources.md`
- 기존 챔피언스 계획서: `.claude/specs/champions-implementation-plan.md`
- 외부:
  - [Pikalytics llms.txt](https://www.pikalytics.com/llms.txt)
  - [Smogon Stats Index](https://www.smogon.com/stats/)
  - [eurekaffeine/pokemon-champions-scraper](https://github.com/eurekaffeine/pokemon-champions-scraper)
