# 원자 컴포넌트 DS 구축 계획서 — poke-korea

> **작성일**: 2026-06-25
> **버전**: 1.54.0
> **상태**: 구축 순서 확정 (2026-06-25) · Button부터 순차 진행
> **근거**: [ADR-0010](../decisions/records/ADR-0010-atomic-first-ds-build-order.md) (원자 우선 DS 구축)
> **연결**: [mobile-redesign-plan.md](./mobile-redesign-plan.md) 1단계 (b) 원자 컴포넌트

---

## 1. 목적

[ADR-0010](../decisions/records/ADR-0010-atomic-first-ds-build-order.md)에 따라, 페이지/컨테이너
조립 전에 **원자(atom) 컴포넌트를 먼저 일괄 DS화**한다. 본 문서는 코드베이스 전수 조사
결과와 그에 따른 구축 우선순위·순서를 정리한다.

조사 원칙(ADR-0010): **추측 선제작 금지** — 코드베이스에 실제 사용처가 있는 원자만 만든다.

이미 DS화된 것(Tag, PokemonCard, ChampionsCard, QuizCard, SectionHeading,
HorizontalScrollList, PokemonCardShell)은 제외한다.

---

## 2. 전수 조사 결과 (사용량 · 스타일 편차 · 우선순위)

| 원자 | 사용 횟수 | 스타일 | 우선순위 | 비고 |
| --- | --- | --- | --- | --- |
| **버튼/CTA** | ~73회 | 매우 제각각 | 🔴 높음 | rounded/px/py/배경색/hover 전부 불통일 |
| **링크** | ~123회 | 제각각(3종) | 🟠 중상 | 텍스트 링크 / 버튼형 링크 / 탭 링크 분류 필요 |
| **탭** | ~15회 | 2종 | 🟠 중상 | 하단 네비 탭 / 인라인 폼·포맷 탭 |
| **칩/뱃지** | ~42회 | 절반 DS화 | 🟠 중상 | 미분류 ~20회(Z기술 칩, 세대 칩, 레벨/머신 배지) |
| **인풋/검색** | ~6회 | 3종 | 🟡 중 | 기본 텍스트 / 검색 / floating label |
| **모달/다이얼로그** | ~6회 | 구조화 필요 | 🟡 중 | 크기 옵션 + header/body/footer 구역 |
| **셀렉트/드롭다운** | ~3회 | 제각각 | 🟡 중 | native select, 필터용 |
| 라디오 | ~1회 | 통일됨 | 🟢 낮음 | 이미 커스텀 포켓볼, 거의 미사용 |
| 체크박스 | ~6회 | 통일됨 | 🟢 낮음 | 이미 커스텀 완성 |
| 토글/스위치 | ~2회 | 통일됨 | 🟢 낮음 | 이미 커스텀 완성 |
| 인디케이터 | ~11회 | 통일됨 | 🟢 낮음 | 이미 스타일 통일 |
| 아이콘 버튼 | ~4회 | 통일됨 | 🟢 낮음 | 사용 극소, 통일 |
| 스켈레톤 로더 | ~7회 | 약간 제각각 | 🟢 낮음 | 크기·색상 토큰화만 |

### 주요 스타일 편차 (버튼 예시)

- 모서리: `rounded-lg` / `rounded-md` / `rounded-full` / `rounded-[20px]` / `rounded-[0.725rem]`
- 패딩: `px-4` / `px-[2rem]` / `px-3`
- 높이: `h-8` / `h-12` / `h-[3rem]` / `h-[4rem]`
- 배경: `bg-primary-1~4` / `bg-[#b8bfc9]`
- hover: `hover:bg-primary-1` / `hover:scale-[1.025]` / `hover:shadow-lg`

---

## 3. 구축 순서 (제안)

ADR-0010 + 사용량/편차 기준. 🟢 낮음(이미 통일·미사용)은 **이번 일괄 구축에서 제외**하고,
필요 시 개별 처리한다.

**진행 방식 (확정)**: 원자별 **순차** 구축 — 하나씩 만들고 Storybook으로 확인·커밋 후
다음으로. 라운드 1 안에서 **Button부터** 시작.

### 라운드 1 — 즉시 (높음 + 중상)

1. **Button** (🔴) — 가장 제각각·빈번. 액션용 `<button>`. Phase B 인라인 CTA 교체 대상.
2. **LinkButton** (🟠) — 링크용 CTA(`<Link>`). Button과 **시각 스타일을 공유**하되 별도
   컴포넌트로 분리(의미 명확성). 공유 스타일은 상수/유틸로 중복 제거.
3. **Tab** (🟠) — 하단 네비 / 인라인 탭.
4. **칩/뱃지 확장** (🟠) — 기존 chip-type/badge-damage 체계에 미분류 칩 통합.

### 라운드 2 — 다음

1. **Input/Search** (🟡)
2. **Modal/Dialog** (🟡)
3. **Select** (🟡)

### 제외 (이번 일괄 구축 안 함)

라디오·체크박스·토글·인디케이터·아이콘버튼·스켈레톤 — 이미 통일됐거나 사용 극소.
필요할 때 개별 DS화.

---

## 4. variant 설계 (라운드 1, 구축 시 확정)

> 구축 착수 시 실제 사용처를 다시 확인해 variant를 확정한다. 아래는 조사 기반 초안.

### Button / LinkButton (분리, 스타일 공유 — 확정)

`<button>`(액션)과 `<Link>`(이동)는 **시각 CTA가 동일**하지만, 의미 명확성을 위해 별도
컴포넌트로 둔다. 공유 스타일(variant/size 클래스)은 상수/유틸로 추출해 중복을 없앤다.

| 축 | 값(초안, 구축 시 사용처 재확인) |
| --- | --- |
| variant | `primary`(bg-primary-1) / `secondary`(bg-primary-3) / `ghost`(투명+테두리) |
| size | `sm` / `md` / `lg` (터치 타겟 min-h-touch 보장) |
| 옵션 | `showArrow`(→), `fullWidth`, `disabled`(Button만) |

- **Button**: `onClick` 액션, `<button type>`.
- **LinkButton**: `href` 이동, `next/link`. variant/size는 Button과 동일 스타일 공유.

### Link (텍스트 링크)

CTA가 아닌 본문 인라인 텍스트 링크. LinkButton(버튼형)과 구분. 사용처 적으면 라운드 1에서
제외하고 필요 시 추가.

### Tab variant

탭 링크(네비게이션)는 Tab 컴포넌트로 분리한다(LinkButton과 별개).

| 종류 | 특징 |
| --- | --- |
| 하단 네비 탭 | 고정 높이, 아이콘+라벨, active 하단 테두리 |
| 인라인 탭 | 다중 선택, 폼/포맷 선택, active 채움 |

### Tab

| 종류 | 특징 |
| --- | --- |
| 하단 네비 탭 | 고정 높이, 아이콘+라벨, active 하단 테두리 |
| 인라인 탭 | 다중 선택, 폼/포맷 선택, active 채움 |

---

## 5. 구축 방식 (각 원자 공통)

- 토큰 기반 신규 컴포넌트(임의값 제거, 모바일 퍼스트 — ADR-0009/0010, styling.md)
- 기존 컴포넌트 추출 금지, 참고만 ([ds-build-new-components])
- Storybook story 필수(variant 전부 렌더)
- 기존 사용처는 즉시 교체하지 않음 — 원자 구축 후 페이지 개편(2단계)에서 교체

---

## 6. 참고

- [ADR-0010 원자 우선 DS 구축](../decisions/records/ADR-0010-atomic-first-ds-build-order.md)
- [mobile-redesign-plan.md 4단계 전략](./mobile-redesign-plan.md)
- [styling.md 모바일 퍼스트·토큰 규칙](../conventions/guides/styling.md)
