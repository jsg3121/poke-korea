---
name: metrics-analysis
description: |
  서비스 지표 분석 스킬. GA4·Search Console·애드센스·BigQuery를 API로 그 시점에 조회하고, 해석 주의사항을 적용해 결과를 보고한다. 문서에 적힌 수치를 현재값으로 쓰지 않는다.
  TRIGGER when: "지표 분석해줘", "트래픽 확인해줘", "MAU 얼마야", "검색 성과", "CTR 확인", "유입 분석", "수익 확인", "RPM", "배포 효과 비교", "전후 비교", "이벤트 집계", "GA4 확인", "서치콘솔 확인", "빅쿼리 조회", 분석 에이전트(market-intelligence·business-analyst·strategy-planner·product-planner)나 biz-strategy에 넘길 트래픽 수치가 필요할 때
  DO NOT TRIGGER when: 외부 시장·경쟁사 조사(market-intelligence), 코드의 SEO 구현 검사(seo-audit), Lighthouse 성능 측정(analyzer의 lighthouse 스크립트), 기술 리서치(research)
---

# 지표 분석 스킬

서비스 지표를 **조회 시점의 최신 데이터**로 확인하고, 이 서비스 고유의 집계 함정을 걸러 해석해 보고한다.

## 원칙

1. **수치는 항상 그 시점에 조회한다.** 기획서·보고서·메모리에 적힌 수치는 작성 당시 값이다. 현재 상태를 말할 때 인용하지 않는다.
2. **조회는 메인 세션이 한다.** 분석 에이전트는 도구가 Read/Glob/Grep/WebSearch/WebFetch로 제한돼 API를 호출할 수 없다. 메인 세션이 이 스킬로 조회한 결과를 에이전트 프롬프트에 담아 넘긴다.
3. **조회 결과를 파일로 고정하지 않는다.** 결과 JSON이 필요하면 스크래치패드에 둔다. `.claude/analyzer/`에 저장하지 않는다.
4. **해석은 [`references/interpretation.md`](references/interpretation.md)의 주의사항을 통과시킨 뒤 한다.**

> **Why:** 2026-05에 측정한 기준값 문서(`metrics-baseline.md`)를 10월 분석까지 참조했다. 그 사이 MAU가 2배 넘게 변했는데도 문서 수치가 "현재 지표"로 읽혔다. 에이전트가 직접 조회할 수 없는 구조라 낡은 문서가 유일한 수치 출처가 된 것이 원인이다.

## 절차

### 1. 질문 정리

조회 전에 무엇을 확인하려는지 한 문장으로 정한다. 다음을 정하지 않으면 조회 범위가 퍼진다.

- **기간**: 최근 28일이 기본. 월 단위는 끝난 달만 쓴다(진행 중인 달은 부분 기간)
- **비교 대상**: 없음 / 직전 기간 / 배포 전후 / 전년 같은 기간
- **범위**: 사이트 전체 / 특정 라우트(`/detail/`, `/type-effectiveness` 등) / 특정 이벤트

### 2. 소스 선택

| 알고 싶은 것 | 소스 | 스크립트 |
| --- | --- | --- |
| 사용자·세션·PV·유입 채널·디바이스·랜딩 | GA4 Data API | `ga4.js` |
| 검색 노출·클릭·CTR·순위·검색어 | Search Console | `search-console.js` |
| 수익·RPM·광고 노출 | 애드센스 | `adsense.js` |
| 커스텀 이벤트 매개변수, 사용자 단위 퍼널, 세션 내 경로 | BigQuery (GA4 Export) | `bigquery.js` |

표준 지표를 BigQuery로 다시 세지 않는다. 스크립트 사용법·사전 준비는 [`.claude/analyzer/index.md`](../../analyzer/index.md)가 권위 원본이다.

### 3. 조회

[`references/queries.md`](references/queries.md)의 표준 쿼리에서 고른다. 없는 조합은 각 스크립트 상단 주석의 옵션으로 만든다.

- 스크립트는 프로젝트 루트에서 `node .claude/analyzer/scripts/<스크립트>`로 실행한다
- BigQuery는 `--dry`로 스캔량을 먼저 본다
- 소스마다 확정 지연이 다르다 — Search Console 3일, 애드센스·BigQuery 1일. 기본 종료일이 이를 반영하므로 임의로 당기지 않는다

### 4. 해석

[`references/interpretation.md`](references/interpretation.md)를 읽고 해당 항목을 적용한다. 특히 PV 기반 지표, "(not set)", 부분 기간, 배포 전후 비교는 거의 매번 걸린다.

### 5. 보고

```markdown
## 조회 기준
- 조회일: YYYY-MM-DD / 기간: YYYY-MM-DD ~ YYYY-MM-DD / 소스: GA4, Search Console …

## 핵심 수치
| 지표 | 값 | 비교 | 변화 |

## 해석
- 수치가 말하는 것 / 주의사항 적용 결과

## 한계
- 확인하지 못한 것, 상관과 인과를 구분해야 하는 지점
```

**기본은 대화로만 보고한다.** `.claude/research/`에 문서로 남기는 것은 사용자가 요청할 때만 한다(CLAUDE.md "문서를 작성할 때"). 문서로 남기면 상단에 조회일을 적어 시점 기록임을 밝힌다.

## 배포 전후 비교

저장해 둔 기준값을 쓰지 않는다. **비교할 때 두 기간을 각각 조회한다.**

1. 배포일을 확인한다 — `gh pr view <번호> --json mergedAt` (main 머지 시각. 실제 배포는 그 뒤일 수 있다)
2. 배포 당일을 빼고, **같은 길이·같은 요일 구성**으로 전후 기간을 잡는다(예: 전 14일 / 후 14일)
3. 같은 쿼리를 두 기간에 실행한다. Search Console은 후 기간이 3일 이상 지나야 확정된다
4. 같은 시기의 다른 변화(다른 배포, 게임 발매·업데이트, 계절)를 함께 적는다

## 에이전트 연계

`biz-strategy` 스킬이나 분석 에이전트를 호출하기 전에 이 스킬로 필요한 수치를 조회하고, 프롬프트에 **조회일·기간·소스와 함께** 넣는다.

```text
[지표 — 조회일 2026-11-03, GA4·Search Console]
- 월 활성 사용자: 2026-09 53,310 / 2026-10 42,642
- Google 검색(2026-10-01~10-31): 클릭 27,200, CTR 1.10%, 평균 순위 6.1~6.5
```

에이전트가 저장소 문서에서 찾은 수치를 현재값으로 쓰지 않도록, 프롬프트에 "제공된 수치만 현재값으로 사용"이라고 명시한다.

## 참조

- 표준 쿼리: [`references/queries.md`](references/queries.md)
- 해석 주의사항: [`references/interpretation.md`](references/interpretation.md)
- 스크립트·인증·설정: [`.claude/analyzer/index.md`](../../analyzer/index.md)
