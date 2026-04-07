# agents/

도메인 전문 에이전트를 정의하는 폴더입니다.

## 개발 에이전트

| 에이전트 | 역할 |
|----------|------|
| `seo-specialist.md` | SEO 전문가 — 메타태그, JSON-LD, OG 이미지, sitemap |
| `ui-publisher.md` | UI 구현 전문가 — 컴포넌트 구현, desktop/mobile 분리 패턴 |
| `graphql-specialist.md` | GraphQL 전문가 — 쿼리/스키마 변경, codegen 관리 |
| `tool-designer.md` | 도구/계산기 설계 전문가 — 게임 메커니즘 기반 로직, 계산 모듈 설계 |

## 성장 분석 에이전트

| 에이전트 | 역할 |
|----------|------|
| `growth-analyst.md` | 유입/퍼널/리텐션 데이터 분석 |
| `competitive-watcher.md` | 경쟁사 동향, 시장점유율 모니터링 |
| `user-insight-analyst.md` | 사용자 행동 패턴, VOC, 이탈 원인 분석 |
| `growth-strategist.md` | 세 에이전트 결과 종합 → 실행 액션 도출 |

## 에이전트 협업 패턴

### 개발 워크플로우

- **새 페이지 추가**: ui-publisher → seo-specialist (구현 후 SEO 적용)
- **API 변경**: graphql-specialist → ui-publisher (스키마 변경 후 UI 반영)
- **SEO 개선**: seo-specialist 단독
- **새 도구/계산기 추가**: tool-designer → graphql-specialist → ui-publisher → seo-specialist
- **기존 도구 개선**: tool-designer → ui-publisher
- **동시 조사**: 여러 에이전트 병렬 (Fan-out/Fan-in)

### 성장 분석 워크플로우

```
사용자 요청
    ↓
[오케스트레이터 — CLAUDE.md]
    ↓
    ├── growth-analyst          → 유입/퍼널/리텐션 데이터 분석
    ├── competitive-watcher     → 경쟁사 동향 모니터링
    ├── user-insight-analyst    → VOC, 행동 패턴, 이탈 원인 분석
    └──────────┐
               ↓
        growth-strategist       → 세 에이전트 결과 종합 → 실행 액션 도출
```

- **주간 성장 리뷰**: growth-analyst + competitive-watcher + user-insight-analyst (병렬) → growth-strategist (취합)
- **성장 실험 설계**: growth-strategist (최근 분석 결과 기반)
- **경쟁사 긴급 대응**: competitive-watcher → growth-strategist

### 개발 × 성장 연계

- **성장 실험 → 기능 구현**: growth-strategist → tool-designer / ui-publisher (실험 설계 → 코드 구현)
- **SEO 성장**: growth-analyst(검색 지표 분석) → seo-specialist(개선 실행)
