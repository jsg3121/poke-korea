---
name: biz-strategy
description: |
  비즈니스 전략 분석 파이프라인. market-intelligence → business-analyst → strategy-planner를 순차 실행한다.
  TRIGGER when: "시장 분석해줘", "경쟁력 평가해줘", "전략 수립해줘", "비즈니스 분석", "Go-to-Market", "TAM/SAM 분석", 종합적인 비즈니스 전략 보고서 필요
  DO NOT TRIGGER when: 기술 리서치(research 스킬 사용), 단순 경쟁사 정보 질문, 특정 분석만 필요(개별 에이전트 직접 호출)
---

# 비즈니스 전략 분석 스킬

market-intelligence → business-analyst → strategy-planner 파이프라인을 오케스트레이션하여 종합적인 비즈니스 전략 보고서를 생성한다.

## 파이프라인 구조

```
[market-intelligence]  →  [business-analyst]  →  [strategy-planner]
 시장/경쟁사/트렌드        경쟁력/포지셔닝         전략 방향 도출
       ↓                       ↓                       ↓
   MI 보고서               BA 보고서             전략 보고서
```

## 서비스 기본 정보

| 항목 | 내용 |
| --- | --- |
| 서비스 | 포케코리아 (<https://poke-korea.com>) — 포켓몬 게임 정보·도구 웹사이트, 한국어 단일 |
| 타겟 | 한국 포켓몬 게이머 — 상세는 `.claude/specs/service/target-segment.md` |
| 수익 모델 | Google AdSense 광고 (페이지뷰 기반) |
| 기능 현황 | 문서에 목록을 두지 않는다. `src/app/` 라우트를 직접 확인한다 |
| 지표 | 문서에 두지 않는다. Step 0에서 그 시점에 조회한다 |

> **Why 기능·지표를 적지 않는가:** 예전 `service-overview.md`는 실제로 없는 "데미지 계산기·능력치 계산기"를 주요 기능으로, 5월 MAU를 10월까지 "현재 지표"로 적고 있었다. 목록과 수치는 반드시 낡는다.

## 실행 순서

### Step 0: 지표 조회

1. `/metrics-analysis` 스킬로 분석 주제에 필요한 지표를 조회한다(규모·유입·검색·수익 중 필요한 것)
2. 조회 결과를 **조회일·기간·소스와 함께** 이후 모든 에이전트 프롬프트에 넣는다
3. 프롬프트에 "제공된 수치만 현재값으로 사용"을 명시한다

> **Why:** 분석 에이전트는 Bash가 없어 API를 직접 호출할 수 없다. 메인 세션이 조회해 넘기지 않으면 에이전트는 저장소 문서의 낡은 수치를 쓰게 된다.

### Step 1: 시장 조사 (Market Intelligence)

1. `.claude/specs/service/target-segment.md`에서 타겟 시장을 확인한다
2. market-intelligence 에이전트를 실행한다(Step 0 지표 포함)
3. 조사 결과를 `.claude/research/market/{YYYY-MM-DD}-{주제}.md`로 저장한다

### Step 2: 경쟁력 분석 (Business Analysis)

1. Step 1의 MI 보고서를 인풋으로 확인한다
2. business-analyst 에이전트를 실행한다
3. 분석 결과를 `.claude/research/business/{YYYY-MM-DD}-{주제}.md`로 저장한다

### Step 3: 전략 수립 (Strategy Planning)

1. Step 1의 MI 보고서와 Step 2의 BA 보고서를 인풋으로 확인한다
2. strategy-planner 에이전트를 실행한다
3. 전략 보고서를 `.claude/research/strategy/{YYYY-MM-DD}-{주제}.md`로 저장한다

## 부분 실행

전체 파이프라인이 아닌 특정 단계만 실행할 수도 있다:

- "시장 조사만 해줘" → Step 1만 실행
- "경쟁력 분석해줘" → Step 1 결과 확인 후 Step 2 실행 (MI 결과 없으면 먼저 실행 요청)
- "전략 수립해줘" → Step 1, 2 결과 확인 후 Step 3 실행

## 분석 원칙

- 모든 주장은 출처 명시 또는 논리적 근거 필수
- 정성 분석과 정량 데이터를 반드시 병행
- 결론보다 인사이트 도출에 집중
- 불확실한 내용은 가정(Assumption)으로 명시

## 참조 문서

- `.claude/skills/metrics-analysis/SKILL.md` — 지표 조회 (Step 0)
- `.claude/specs/service/target-segment.md` — 타겟 사용자
- `references/frameworks.md` — 분석 프레임워크 (PESTLE, SWOT, Porter's 등)
- `references/data-sources.md` — 신뢰할 수 있는 데이터 소스 목록
- `references/template-mi.md` — MI 보고서 템플릿 (market-intelligence용)
- `references/template-ba.md` — BA 보고서 템플릿 (business-analyst용)
- `references/template-str.md` — STR 보고서 템플릿 (strategy-planner용)
