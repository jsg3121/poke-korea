# agents/

프로젝트 전용 에이전트를 정의하는 폴더이다.

## 이 폴더의 역할

- 전문 역할을 가진 에이전트를 정의하여 복잡한 작업을 위임한다
- 에이전트 팀 또는 서브에이전트로 활용하며, 작업 유형에 따라 적절한 패턴을 선택한다
- 각 에이전트는 독립 `.md` 파일로 정의되며 파일명이 에이전트 이름이 된다

## 폴더 구조

- `index.md` — 이 파일. 폴더 역할 설명 및 에이전트 목록
- `{agent-name}.md` — 에이전트 정의 파일

## 에이전트 목록

### 기획 에이전트

- [product-planner](product-planner.md) — 기능 기획서(SPEC) 작성/업데이트, ADR 연결 관리 전문

### 개발 에이전트

- [config-maker](config-maker.md) — 설정 파일 스키마, 옵션 정의, 생성 로직 전문
- [seo-specialist](seo-specialist.md) — 시맨틱 HTML, 메타태그, 구조화 데이터, 다국어 SEO 전문
- [ui-publisher](ui-publisher.md) — Astro/Svelte 컴포넌트 구현, Tailwind 스타일링 전문
- [ux-designer](ux-designer.md) — 사용자 플로우, 레이아웃, 인터랙션, 반응형 설계 전문
- [qa-agent](qa-agent.md) — QA 오케스트레이터. 서브에이전트를 조율하여 종합 QA 리포트 생성

### QA 서브에이전트

- [unit-tester](unit-tester.md) — Vitest 단위 테스트 실행 및 결과 분석
- [e2e-tester](e2e-tester.md) — Playwright E2E 테스트 실행 및 결과 분석
- [static-analyzer](static-analyzer.md) — ESLint, Prettier, TypeScript 정적 분석

### 비즈니스 분석 에이전트

- [market-intelligence](market-intelligence.md) — 시장 규모, 경쟁사, 산업 트렌드, 거시환경 조사 전문
- [business-analyst](business-analyst.md) — 서비스 경쟁력, 포지셔닝, 내부 역량 분석 전문
- [strategy-planner](strategy-planner.md) — MI+BA 분석 종합 후 전략 방향 도출 전문

## 활용 패턴

작업 유형에 따라 적절한 에이전트 조합과 아키텍처 패턴을 선택한다.

### 새 기능 기획 → 구현 (Pipeline)

```
product-planner → ux-designer → ui-publisher → qa-agent
(기획서 작성)     (설계)         (구현)          (검증)
```

### 기존 기획 기반 구현 (Pipeline)

```
ux-designer → ui-publisher → qa-agent
(설계)        (구현)          (검증)
```

### 새 설정 파일 추가 (Pipeline)

```
config-maker → ui-publisher → qa-agent
(스키마/로직)   (UI 연동)      (유효성 검증)
```

### 여러 설정 스키마 동시 조사 (Fan-out/Fan-in)

```
config-maker (ESLint 조사)  ─┐
config-maker (Prettier 조사) ─┼→ 통합
config-maker (TSConfig 조사) ─┘
```

### 설정 생성 + 검증 루프 (Producer-Reviewer)

```
config-maker ──생성──→ qa-agent
     ↑                    │
     └──── 피드백 ────────┘
```

### QA 검증 파이프라인 (Fan-out/Fan-in)

```
                    qa-agent (오케스트레이터)
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
      unit-tester     e2e-tester    static-analyzer
      (Vitest)        (Playwright)  (ESLint/TS)
           │               │               │
           └───────────────┼───────────────┘
                           ▼
                    QA 리포트 생성
```

### 페이지 구현 (Expert Pool)

작업 성격에 따라 적절한 에이전트 선택:

- SEO 관련 → seo-specialist
- 설정 스키마 관련 → config-maker
- UI/컴포넌트 관련 → ui-publisher
- UX/플로우 관련 → ux-designer
- 테스트/검증 관련 → qa-agent

### 비즈니스 전략 분석 (Pipeline)

```
market-intelligence → business-analyst → strategy-planner
(시장/경쟁사/트렌드)   (경쟁력/포지셔닝)   (전략 방향 도출)
```

`/biz-strategy` 스킬로 전체 파이프라인을 오케스트레이션하거나, 개별 에이전트를 직접 호출할 수 있다.

### 신규 서비스 기획 (Pipeline)

```
market-intelligence → business-analyst → strategy-planner → ux-designer → ui-publisher
(시장 조사)           (경쟁력 분석)       (전략 수립)         (UX 설계)     (구현)
```
