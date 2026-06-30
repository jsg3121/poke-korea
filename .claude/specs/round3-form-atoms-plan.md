# 라운드3 원자 컴포넌트 DS 구축 계획서 — poke-korea

> **작성일**: 2026-06-30
> **버전**: 1.54.0
> **브랜치**: `feature/1.54.0-ds-round3-atoms`
> **근거**: [ADR-0010](../decisions/records/ADR-0010-atomic-first-ds-build-order.md) (원자 우선 DS 구축)
> **선행**: 라운드1([atomic-components-plan.md](./atomic-components-plan.md)) · 라운드2 완료

---

## 1. 목적

라운드1·2(Button·LinkButton·TabItem·Chip·Tag·SelectInput·SearchInput·CloseIconButton)
구축 후, **organism 조립 단계로 넘어가기 전에 원자 전수 재점검**을 했더니 누락된 원자가
드러났다. organism(FilterModal 등)이 이 원자들에 의존하므로, 조립 전에 먼저 채운다
(ADR-0010 원자→조립 순서, "임시 원자→재작업" 방지).

**판정 기준(DS 완료):** ① Storybook story 존재 ② 단일 컴포넌트(데/모 2벌 아님)
③ 토큰만 사용(임의값·비토큰 색 없음) ④ 원자 수준.

---

## 2. 라운드3 구축 대상 (확정 — 핵심 4개)

전수 점검 결과 11개 후보 중, **ADR-0010 "2곳 이상 + 자명"** 기준으로 핵심 4개만 원자화한다.

컴포넌트별 폴더(A안)로 구축한다(라운드1·2의 `button/`·`input/` 패턴).

| 원자 | 폴더 | 누락 사유 | 사용처 | 어디에 필요 |
| --- | --- | --- | --- | --- |
| **Ball** | `components/ball/` | story 없음 | 9곳 | Radio/Checkbox + 카드 7곳 |
| **Radio** | `components/radio/` | story 없음 + 임의값 | 2곳 | FilterModal 조립 |
| **Checkbox** | `components/checkbox/` | story 없음 + 임의값 | 2곳 | FilterModal 조립 |
| **PageHeader** | `components/pageHeader/` | story 없음 + **데/모 2벌** | 16곳 | 모든 페이지 제목 |

### 구축 순서 (의존성 기준) — 완료

1. **Ball** — Radio/Checkbox + 카드 7곳에서 쓰는 **브랜드 자산**. `size`(sm/md/lg + 부모맞춤)
   추가 + story. **색은 토큰화하지 않음** — 포켓볼 전용 그래픽 디테일이라 공유되지 않으므로
   임의값 유지(토큰화 이득 없음, 전역 토큰 오염 방지).
2. **Radio** — `useId`로 id 충돌 방지, 임의값→토큰, 흰 원 고정 모션. story.
3. **Checkbox** — Radio와 동일 + 사각 박스 모서리 비침 방지(체크 시 박스 opacity-0). story.
4. **PageHeader** — 데/모 2벌을 **CSS 반응형 단일 신규 컴포넌트**로 만든다(통합·교체 아님,
   [ds-build-new-components] 원칙). 기존 2벌(`PageHeader.tsx`, `mobile/PageHeader.tsx`)은
   **건드리지 않고**, 페이지 개편 단계에서 교체·삭제. story.

---

## 3. 제외 — 1곳 사용 / 도메인 특화 (DS 안 함)

사용처가 1곳이거나 도메인 특화인 것은 **원자로 만들지 않고, 현행대로 해당 컨테이너 폴더의
`components/`에서 로컬 관리**한다(추측 선제작 금지, ADR-0010).

| 컴포넌트 | 사용처 | 처리 |
| --- | --- | --- |
| Indicator | 1곳 | 컨테이너 로컬 유지 |
| NextFormButton / PrevFormButton | 각 1곳 | 컨테이너 로컬 유지 |
| ShinyRate / ShinyTooltip 버튼 | 각 1곳 | 컨테이너 로컬 유지 |
| QuizAnswerButton / QuizCardHeader | 7곳(퀴즈 도메인) | 조립 단계에서 기존 원자 조립 판단 |

- **RadioGroup**: Radio 원자를 반복 배치 → organism(원자 아님). organism 단계에서.
- **MobileTabBar**: 앱 레벨 템플릿 → 별도(원자 아님).
- **Portal / Image**: 유틸 래퍼(시각 X) → DS 불필요.

---

## 4. 구 Tag 처리 — 마이그레이션은 미룸

`components/Tag.component.tsx`(구버전, 31곳 사용, 검정 글자 고정으로 WCAG 대비 미달)는
신규 `tag/Tag.component.tsx`(라운드2 완료, 0곳)로 교체해야 한다. 그러나:

- **이번 라운드3에서는 교체/삭제하지 않는다.** 신규 Tag는 이미 DS로 존재하므로 추가 작업 없음.
- **구 Tag 마이그레이션(31곳)과 삭제는 페이지 UI 전면 개편 단계에서** 수행한다(조립·페이지
  단계). 원자는 만들되 사용처 교체는 그때 일괄.

> **Why:** 라운드1·2 원칙과 동일 — "원자 구축 후 기존 사용처는 즉시 교체하지 않고 페이지
> 개편 때 교체"([atomic-components-plan.md](./atomic-components-plan.md) §5).

---

## 5. 구축 방식 (각 원자 공통)

- 토큰 기반(임의값·비토큰 색 제거). 단 Ball의 포켓볼 색은 예외 — 단일 그래픽 전용이라
  토큰화하지 않는다(공유 안 되는 렌더링 디테일).
- 데/모 2벌은 **CSS 반응형 단일**로 통합(UA 분기·`display:none` 금지 — [ADR-0007](../decisions/records/ADR-0007-responsive-rendering-strategy.md), styling.md).
- Storybook story 필수(상태 전부 — 체크/미체크/비활성 등).
- 기존 사용처는 즉시 교체하지 않음(페이지 개편 단계에서 교체).

---

## 6. 참고

- [ADR-0010 원자 우선 DS 구축](../decisions/records/ADR-0010-atomic-first-ds-build-order.md)
- [ADR-0007 반응형 렌더링 전략](../decisions/records/ADR-0007-responsive-rendering-strategy.md)
- [atomic-components-plan.md 라운드1 계획](./atomic-components-plan.md)
- [styling.md 모바일 퍼스트·토큰 규칙](../conventions/guides/styling.md)
