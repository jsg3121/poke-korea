# ADR-0005: 단기(~2026-09-30) 트래픽 성장 KPI 도입 및 목표 변경

- **상태**: 승인
- **날짜**: 2026-05-26
- **담당**: jsg3121 + Claude

## 맥락

사용자가 **"국내에서 포딕(podic.kr) 트래픽을 넘어선다"** 는 성장 목표를 제시하면서, 다음 두 가지 의사결정이 동시에 필요해졌다.

1. **목표 정의의 정합성 문제**
   - 기존 `service-overview.md`의 단기 목표는 **"MAU 20K 안정 유지(2026-09-30)"** 였으나, 현재 실측 MAU가 이미 23,047로 이 목표를 초과한 상태였다.
   - "포딕 추월" 이라는 새 목표는 직관적이지만 비교 단위가 다르다(자사 GA4 MAU vs 포딕 Similarweb visits). 단위 정합성 문제로 절대값 직접 비교가 어렵다.

2. **분석 결과를 KPI로 전환할 필요**
   - `market-intelligence` + `business-analyst` 분석 결과(보고서: `MI-BA-2026-05-26-podic-traffic-overtake.md`) 콘텐츠 추가 우선순위는 도출되었으나, 4개월 단기 범위에서 **무엇이 성공이고 무엇이 실패인지 판단할 기준**이 없다.
   - 자체 측정 도구(GA4 + Search Console + AdSense)로 정량 추적 가능한 KPI 체계가 필요하다.

3. **추가로 분석에서 도출된 측정 가능한 핵심 문제**
   - `/type-effectiveness` 단일 페이지의 MAU 의존도가 약 114% (26,228명 / 23,047 MAU)로 비정상적 집중 상태.
   - AdSense 30일 baseline은 $12.32로 service-overview의 "월 $10~$12" 기록과 일치 확인됨.
   - 리텐션(D1/D7/D30)은 GA4 측정 세팅이 안 되어 있고, 단기 작업 공수 부담을 고려하면 본 ADR 범위 밖.

## 결정

다음 3개의 핵심 결정을 채택한다.

### 결정 1: 단기 MAU 목표를 20K 안정 유지 → 30K 성장으로 상향

기간(2026-09-30) 단기 North Star Metric을 **MAU 30,000 도달** 로 갱신한다.
- Baseline: 23,047 (2026-05-03)
- 목표: 30,000 (+30.2%)
- 실패 임계점: 24,200 미만 (현재 대비 +5% 이내)

### 결정 2: "포딕 추월" 절대 비교 → 키워드 점유 중심 KPI로 전환

Similarweb 추정의 단위(visits) vs 자체 GA4(MAU) 정합성 문제로 절대값 추월 KPI는 채택하지 않는다. 대신 Search Console로 직접 측정 가능한 다음 2개 KPI를 채택한다.

- **A5**: 포딕 점유 키워드 중 자사 1위 점유 키워드 수 — 목표 30개 (현재 0 가정)
- **A6**: "[기술명] 효과" 키워드군에서 자사 상위 10위 키워드 수 — 목표 20개

> 추적 대상 키워드 리스트는 별도 작업(`feature/1.45.0-keyword-tracking`)에서 작성한다. 본 ADR은 KPI 정의까지만 다룬다.

Similarweb 추적은 KPI에서 제외하고 **분기 1회(2026-06, 2026-09) 보조 모니터링** 으로 다운그레이드한다.

### 결정 3: /type-effectiveness 의존도 분산을 핵심 KPI로 채택

단일 페이지 의존 구조 자체를 단기 KPI의 핵심 항목으로 채택한다.

- **AC3**: `/type-effectiveness MAU 의존도` (해당 페이지 30일 활성 사용자 / 사이트 전체 MAU)
- Baseline: 약 114% (26,228 / 23,047)
- 목표: 70% 이하
- **실패 임계점**: 현재 비율(114%)이 유지되면 다른 모든 KPI를 달성해도 단기 계획 실패로 판정

## 근거

### 결정 1의 근거

| 평가 기준 | 내용 |
| --- | --- |
| 기존 목표의 부적합성 | "20K 안정 유지" 목표는 이미 23K 실측 상태에서 의미 없음. 목표가 baseline보다 낮음 |
| BA 분석 추정치와 정합성 | TOP 3 작업(`/moves/[id]`, 상세 SEO, `/ability/[id]`)이 6개월 내 MAU +6K~9K 기여 추정 → 4개월 환산 +5K~6K → 약 28K~29K 예상. 30K는 약간 도전적인 수준 |
| 사용자 동의 | 사용자가 직접 "3만으로 목표를 잡아도 좋을 것 같다"고 합의 |
| 측정 가능성 | GA4 월간 활성 사용자로 직접 측정. 추정 데이터 의존도 없음 |

### 결정 2의 근거

| 평가 기준 | 내용 |
| --- | --- |
| Similarweb 한계 | 패널 데이터 기반 추정치로 실제값과 30~50% 오차 가능. 단위(visits) vs MAU 비교 불가 |
| Search Console 신뢰도 | 자사 측 실측 데이터. 키워드별 노출/순위 직접 측정 가능 |
| KPI 책임성 | "측정 불가능한 KPI는 책임 불가". 자체 측정 가능 지표로 한정해야 4개월 후 평가 가능 |
| BA 분석과의 정합성 | 콘텐츠 우선순위(기술/특성/포켓몬 상세 DB)와 키워드 점유 KPI가 직접 연결됨 |

### 결정 3의 근거

| 평가 기준 | 내용 |
| --- | --- |
| 비정상성 명확 | 단일 페이지 30일 활성 사용자(26,228)가 전체 MAU(23,047)보다 큰 상태는 구조적으로 비정상 |
| 위험 신호 | `/type-effectiveness` 알고리즘 변동 시 사이트 전체 트래픽이 동반 추락하는 단일 의존 구조 |
| 측정 가능 | GA4 페이지별 사용자 데이터 / 사이트 MAU로 단순 비율 계산 가능 |
| DAU/MAU 4.2% 문제와 직결 | 검색 → 단일 페이지 확인 → 이탈 패턴의 원인. 해결 시 자연스럽게 리텐션도 개선 |

## 대안

| 대안 | 장점 | 단점 | 불채택 사유 |
| --- | --- | --- | --- |
| **A: 기존 목표 20K 유지** | 변경 비용 없음 | 이미 달성 상태로 KPI 무력화 | baseline보다 낮은 목표는 의미 없음 |
| **B: Similarweb 절대값 추월 KPI** | 직관적("포딕 넘기") | 단위 정합성 부재, 추정 오차 30~50% | 책임 추적 불가능한 KPI |
| **C: KPI 4계층(Acquisition/Activation/Retention/Revenue) 전부** | 종합적 측정 | 리텐션 측정 세팅 공수 부담 | 단기 4개월 범위에서 공수 대비 효과 낮음 |
| **D: 작업별 KPI(예: `/moves/[id]` 색인 800개)** | 작업 평가 명확 | 사이트 전체 흐름 평가 어려움 | 사용자가 "전체 KPI 먼저"로 의사결정 |
| **E: /type-effectiveness 의존도 KPI 미포함** | KPI 단순화 | 단일 페이지 의존 위험 방치 | 사이트 전체 위험의 핵심 지표이므로 제외 불가 |

## 결과

### 즉시 변경되는 문서

- `.claude/specs/service-overview.md`
  - "핵심 성장 목표" 표의 MAU 항목: **"20K 안정 유지" → "30K 도달"**
  - 광고 수익 목표: **월 $20 유지** (변경 없음)
- `.claude/research/reports/MI-BA-2026-05-26-podic-traffic-overtake.md`: 본 ADR의 근거 분석 보고서로 연결

### 신규 도입되는 KPI 측정 루틴

| 주기 | 측정 항목 |
| --- | --- |
| 월 1회 | GA4 (MAU, page_view, 페이지별 사용자, AC3) + Search Console (노출/클릭/CTR/순위 + A5/A6 키워드) + AdSense (수익/RPM/CTR/Coverage) |
| 분기 1회 | Similarweb 포딕/포케토리 추세 (보조 모니터링) + 종합 KPI 리뷰 |

### 후속 작업 (1.45.0 루트 아래)

- `feature/1.45.0-keyword-tracking`: A5/A6 측정용 키워드 추적 리스트 작성 (선행 작업)
- `feature/1.45.0-moves-detail`: `/moves/[id]` 기술 개별 상세 페이지 구현 (BA 1순위)
- 측정 결과에 따른 후속 작업

### 부수적 결정 (Context로 언급, 별도 ADR 미작성)

- **리텐션 KPI 제외**: 단기 공수 부담 고려, 본 ADR 범위 밖
- **AdSense baseline 확정**: 30일 실측 $12.32 / RPM $0.109 / 매칭률 50.2%
- **경쟁사 비교 다운그레이드**: 분기 1회 정성 모니터링

### 실패 임계점 (4개월 후 평가)

다음 중 **하나라도** 해당 시 단기 4개월 계획 실패로 판정한다.

| # | 조건 |
| --- | --- |
| F1 | MAU +5% 이내 성장 (24,200 미만) |
| F2 | /type-effectiveness MAU 의존도 현재 비율(114%) 유지 |
| F3 | Acquisition KPI 6개 중 3개 이상이 +5% 이내 |
| F4 | Revenue +5% 이내 ($12.94 미만) |

## 참고 자료

- 본 ADR의 근거 보고서: `.claude/research/reports/MI-BA-2026-05-26-podic-traffic-overtake.md`
- 영향받는 SPEC: `.claude/specs/service-overview.md`, `.claude/specs/metrics-baseline.md`
- 이전 트래픽 분석 보고서:
  - `.claude/research/reports/MI-2026-05-04-poke-korea-traffic-growth.md`
  - `.claude/research/reports/BA-2026-05-04-poke-korea-competitiveness.md`
  - `.claude/research/reports/STR-2026-05-04-poke-korea-traffic-growth.md`
- 외부 출처:
  - [Similarweb — podic.kr](https://www.similarweb.com/website/podic.kr/)
  - [Similarweb — poketory.com](https://www.similarweb.com/website/poketory.com/)
