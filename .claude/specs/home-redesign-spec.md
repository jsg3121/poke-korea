# 홈 페이지 재설계 기획서 — 포케코리아 (poke-korea)

> **작성일**: 2026-06-16
> **버전**: 1.54.0
> **상태**: 설계 확정 (구현 대기)
> **범위**: 홈(`/`) 페이지 반응형 단일 뷰 재구성 — [UI 전면 개편 4단계 전략](./mobile-redesign-plan.md)의 2단계 첫 페이지
> **렌더링**: 반응형(Responsive) 단일 컴포넌트, 모바일 퍼스트 ([ADR-0007](../decisions/records/ADR-0007-responsive-rendering-strategy.md))

이 문서는 `ux-designer` 에이전트의 홈 화면 비평(Playwright 실화면 캡처 기반) 결과를 정리한 것이다. 캡처: `.claude/playwright/screenshots/01-home-{mobile,desktop}.png`.

---

## 1. 현황 — 홈 구조

홈은 3개 섹션으로 구성된다.

| 섹션 | 내용 | 현재 파일 |
| --- | --- | --- |
| **Banner** | "오늘의 포켓몬" 가로 스크롤 카드 | `container/{mobile,desktop}/home/home.banner/` |
| **Champions** | "인기 챔피언스 포켓몬" 카드 + CTA | `container/{mobile,desktop}/home/home.champions/` |
| **Quiz** | "오늘의 퀴즈" 3종 카드 | `container/{mobile,desktop}/home/home.quiz/` |

현재 `src/app/page.tsx`에서 UA 분기(`isMobile ? <HomeMobile/> : <HomeDesktop/>`)로 mobile/desktop 뷰가 파일 분리되어 있다. 이를 **반응형 단일 뷰**로 통합한다.

---

## 2. Design Critique — 4축 비평

> 심각도: `Critical`(사용 불가/접근성 차단) > `Major`(주요 사용성 저해) > `Minor`(개선 권장)

### 🔴 Critical

| # | 영역 | 문제 | 개선안 |
| --- | --- | --- | --- |
| C1 | Usability | **모바일에서 챔피언스 섹션 미노출** (콘텐츠 동등성 위반) — 단, 캡처 환경 영향 여부 검증 필요 | 반응형 통합 시 분기 제거로 해소. 실제 누락이면 별도 확인 |
| C2 | Usability | **모바일 퀴즈 3열에서 카드 잘림** (제목 강제 줄바꿈, 버튼 오버플로, 터치 타겟 미달) | 모바일 1열(`grid-cols-1`), `desktop:grid-cols-3`. 버튼 `min-h-touch` |
| C3 | Accessibility | **QuizCardHeader `id` 중복** — 3개 카드 모두 `id="silhouette-quiz-title"` 하드코딩 (WCAG 4.1.1) | `headingId` prop으로 카드별 고유 id 주입 |
| C4 | Accessibility | **탭바 레이블 `text-[9px]`** — 규칙(11px 최소) 위반 (WCAG 1.4.4) | `text-2xs`(11px)로 교체, 아이콘 축소로 공간 확보 |

### 🟡 Major

| # | 영역 | 문제 | 개선안 |
| --- | --- | --- | --- |
| M1 | Usability | 모바일 "오늘의 포켓몬" 가로 스크롤 단서 없음 (peek/표시자 부재) | 마지막 카드 peek 노출 (카드 너비 `calc`로 2.3개 보이게) |
| M2 | Hierarchy | 섹션 헤딩 임의값 폰트(`text-[2.5rem]`, `text-[2rem]`) | 토큰화 + `SectionHeading` DS 컴포넌트 추출 |
| M3 | Usability | QuizResultPopup 포커스 트랩 없음 (키보드 접근성) | 모달 진입 포커스 이동 + Tab 순환 + Escape 닫기 |
| M4 | Consistency | 챔피언스 `aria-labelledby` id가 mobile/desktop 다름 (`-mobile` 접미어) | 반응형 통합 시 통일 |

### 🟢 Minor

| # | 영역 | 문제 | 개선안 |
| --- | --- | --- | --- |
| m1 | Hierarchy | 데스크톱 퀴즈 섹션 `max-w` 누락 (타 섹션과 정렬 불일치) | `max-w-[1280px]` 통일 |
| m2 | Accessibility | 탭바 7개 항목 좁음 ("챔피언스" overflow 위험) | 약자 처리 또는 5개로 IA 축소 검토 |

---

## 3. 반응형 재설계 (모바일 퍼스트)

UA 분기를 제거하고 단일 `HomeView`로 통합한다. 각 섹션은 base(모바일) → `desktop:` 확장.

### 전체 래퍼

```text
base:    w-full min-h-screen pb-16          (모바일 탭바 높이 예약)
desktop: max-w-[1280px] mx-auto pt-28 pb-0  (헤더 고정 높이 예약, 탭바 없음)
```

### 섹션별

| 섹션 | base (모바일) | desktop: 확장 |
| --- | --- | --- |
| **Banner** | 가로 스크롤, 카드 `w-[calc((100vw-2.5rem)/2.3)]`(peek), 헤딩 `text-3xl` | 카드 `w-56`, 헤딩 `text-4xl`, 스크롤바 표시 |
| **Champions** | 가로 스크롤 카드 `w-[175px]`, CTA `min-h-touch` | `flex-wrap justify-center`, 카드 `w-[240px]` |
| **Quiz** | `grid-cols-1`, 버튼 `min-h-touch` | `grid-cols-3`, `max-w-[1280px]` |

> 색상·폰트 무드 유지(primary 파랑 계열, Gmarket Sans). 변경은 레이아웃·간격·터치·가독성에 국한.

---

## 4. DS 컴포넌트 승격 후보

승격 기준(2곳 이상 재사용 + variant 명확) 충족:

| 컴포넌트 | 재사용처 | variant | 해결하는 이슈 |
| --- | --- | --- | --- |
| **SectionHeading** | Banner/Champions/Quiz (3곳+) | `size`(모바일 3xl/데스크톱 4xl) | M2 (임의값 폰트) |
| **HorizontalScrollList** | Banner/Champions (2곳) | `gap`, `showScrollbar` | M1, 스크롤바 중복 |
| **QuizCard** | Silhouette/Ability/Type (3곳) | `silhouette`/`ability`/`pokemon-type` | C3 (id 중복), 셸 중복 |
| **PokemonCard 통합** | mobile/desktop 90% 동일 | 반응형 단일 | 모드별 2벌 제거 |

---

## 5. 구현 순서 (작은 단위 → 큰 단위)

**컴포넌트 → 컨테이너 → 섹션** 순으로, 의존 관계를 고려해 진행한다.

### Phase A — DS 컴포넌트 (독립 단위)

의존 없는 것부터. 각 컴포넌트 완성 시 Storybook story(`*.stories.tsx`)로 디자인 시스템에 등록([ADR-0008](../decisions/records/ADR-0008-storybook-design-system.md)).

1. **SectionHeading** — 의존 없음, 3섹션 공통. 가장 먼저
2. **PokemonCard 통합** — Banner/Champions 카드의 기반
3. **HorizontalScrollList** — Banner/Champions 래퍼 (PokemonCard를 자식으로)
4. **QuizCard** — Quiz 전용 (C3 id 버그 동시 해결)

### Phase B — 컨테이너 (컴포넌트 조합)

DS 컴포넌트를 조합해 섹션 컨테이너를 반응형 단일로 작성.

5. **HomeBanner.container** — SectionHeading + HorizontalScrollList + PokemonCard
6. **HomeChampions.container** — SectionHeading + HorizontalScrollList + PokemonCard + CTA
7. **HomeQuiz.container** — SectionHeading + QuizCard ×3

### Phase C — 섹션 통합 (뷰 + 페이지)

8. **HomeView** — 3개 컨테이너 조합한 반응형 단일 뷰
9. **page.tsx** — UA 분기 제거, HomeView 단일 렌더링

### Phase D — 구버전 제거

10. 구 mobile/desktop 홈 뷰·컨테이너·분리 컴포넌트 사용처 0건 확인 후 제거

> **신규 컴포넌트 위치**: `src/components/`(공통), `src/container/home/`(반응형 단일), `src/views/home/Home.view.tsx`. 구버전은 Phase D까지 유지(다른 미개편 페이지가 쓸 수 있음).

---

## 6. 검증 · 리스크

### 검증

- 각 컴포넌트: 모바일·데스크톱 폭 실화면 확인 (사용자 dev 서버 `localhost:3000`)
- 접근성: `a11y-check` 스킬로 C3/C4/M3 해소 확인
- 빌드: `npm run build` 회귀 없음

### 리스크

| 리스크 | 완화 |
| --- | --- |
| C1(챔피언스 누락)이 실제 버그 | 구현 전 사용자 모바일 실기기 확인. 버그면 별도 처리 |
| PokemonCard 통합이 타 페이지(list 등)에 파급 | list 등은 미개편이므로 구 PokemonCard 유지, 홈은 신규 사용. Phase D에서 통합 |
| 반응형 전환이 데스크톱 회귀 | 데스크톱 폭 시각 검증 후 교체 |

---

## 참조

- [.claude/specs/mobile-redesign-plan.md](./mobile-redesign-plan.md) — UI 전면 개편 4단계 전략
- [.claude/decisions/records/ADR-0007-responsive-rendering-strategy.md](../decisions/records/ADR-0007-responsive-rendering-strategy.md) — 반응형 전환
- [.claude/conventions/guides/styling.md](../conventions/guides/styling.md) — 모바일 퍼스트 반응형 규칙
- `.claude/playwright/screenshots/01-home-{mobile,desktop}.png` — 비평 근거 실화면
