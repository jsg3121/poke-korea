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

- [seo-specialist](seo-specialist.md) — 시맨틱 HTML, 메타태그, 구조화 데이터, 다국어 SEO 전문
- [ui-publisher](ui-publisher.md) — 페이지, UI 컴포넌트 구현, Tailwind 스타일링 전문
- [ux-designer](ux-designer.md) — 사용자 플로우, 레이아웃, 인터랙션, 반응형 설계 전문

### 품질 검증 에이전트

- [qa-orchestrator](qa-orchestrator.md) — QA 검사 선별·병렬 실행·통합 판정 오케스트레이션

### 비즈니스 분석 에이전트

- [market-intelligence](market-intelligence.md) — 시장 규모, 경쟁사, 산업 트렌드, 거시환경 조사 전문
- [business-analyst](business-analyst.md) — 서비스 경쟁력, 포지셔닝, 내부 역량 분석 전문
- [strategy-planner](strategy-planner.md) — MI+BA 분석 종합 후 전략 방향 도출 전문

## 공통 규칙

### UI/UX 작업 시 실제 화면 확인 필수

UI/UX 관련 에이전트(`ux-designer`, `ui-publisher`)가 현재 페이지 상태를 분석하거나 개선안을 제시할 때는 **반드시 Playwright를 사용하여 실제 UI를 캡처하고 확인**해야 한다. 코드만 보고 판단하지 않는다.

```bash
# 개발 서버 실행 확인
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000

# 스크린샷 캡처
node .claude/playwright/capture-screenshots.js
```

캡처된 스크린샷은 `.claude/playwright/screenshots/`에 저장되며, 이를 기반으로 UI 분석을 진행한다.

필요 시 특정 페이지만 캡처하는 임시 스크립트를 작성하여 실행할 수 있다.

## 활용 패턴

작업 유형에 따라 적절한 에이전트 조합과 아키텍처 패턴을 선택한다.

### 새 기능 기획 → 구현 (Pipeline)

```
product-planner → ux-designer → ui-publisher
(기획서 작성)     (설계)         (구현)
```

### 기존 기획 기반 구현 (Pipeline)

```
ux-designer → ui-publisher
(설계)        (구현)
```

### 페이지 구현 (Expert Pool)

작업 성격에 따라 적절한 에이전트 선택:

- SEO 관련 → seo-specialist
- UI/컴포넌트 관련 → ui-publisher
- UX/플로우 관련 → ux-designer

### 품질 검증 (Fan-out / Fan-in)

```
                  ┌─ lint-check ──┐
qa-orchestrator ──┼─ code-review ─┼──→ 통합 판정
(변경 범위 분석)   ├─ a11y-check ──┤    (중복 제거·심각도 정렬·게이트)
                  └─ seo-audit ───┘
```

변경 파일을 분석해 **필요한 검사만** 선별한 뒤 독립 서브에이전트로 병렬 실행한다.
각 검사는 사전 맥락 없이 수행되어 작성자가 넘긴 가정을 잡아낸다.

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
