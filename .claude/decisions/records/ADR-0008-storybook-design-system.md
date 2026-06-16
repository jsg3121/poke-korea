# ADR-0008: 디자인 시스템 도구로 Storybook 채택 (claude.ai/design 폐기)

- **상태**: 승인
- **날짜**: 2026-06-16
- **담당**: jsg3121 + Claude

## 맥락

UI 전면 개편([mobile-redesign-plan.md](../../specs/mobile-redesign-plan.md))과 함께 내부 디자인 시스템을 구축하기로 했고, 초기에는 **claude.ai/design**(`poke-korea-design-system` 프로젝트)을 시각적 single source of truth로 삼아 Foundations/Components 카드를 업로드했다.

그러나 claude.ai/design은 **정적 HTML/CSS 프리뷰**만 보관한다(React를 실행하지 않음). 그래서 실제 컴포넌트를 올리려면 둘 중 하나여야 했는데 모두 결함이 있었다.

1. **손으로 HTML/CSS 재현** — `globals.css`의 프로젝트 전용 스타일(`.type-tag`, `chip-type-*`, `card-corner-fold`, `Ball.component` 등)을 누락해 실제 디자인과 어긋난다. 실제로 PokemonCard 프리뷰가 포켓볼·태그·그라데이션·스탯 정렬이 모두 깨졌다.
2. **렌더 스크린샷 임베드** — 정확하지만 "그림"일 뿐, 실제로 사용·동작하는 컴포넌트가 아니다. 코드와 연결되지 않고, 코드 변경이 자동 반영되지 않는다.

즉 claude.ai/design으로는 **"실제 컴포넌트가 그대로 살아있는 디자인 시스템"** 을 만들 수 없다.

## 결정

**디자인 시스템 도구로 Storybook을 채택하고, claude.ai/design 기반 디자인 시스템은 폐기한다.**

1. Storybook을 설치해 Next.js + Tailwind와 연동한다.
2. 실제 React 컴포넌트(`src/components/*`)를 그대로 import해 story로 작성한다. 손으로 재현하거나 스크린샷을 찍지 않는다.
3. Foundations(토큰)도 Storybook의 docs/story로 표현한다.
4. claude.ai/design(`poke-korea-design-system`)은 더 이상 디자인 시스템 저장소로 사용하지 않는다. 기존 업로드 카드는 Storybook으로 마이그레이션 후 정리한다.
5. `DesignSync` 도구 및 `ux-designer.md`의 claude.ai/design 연동 워크플로우는 비활성화/갱신한다.

## 근거

- **실제 컴포넌트 그대로**: Storybook은 React 컴포넌트를 직접 렌더한다. 손으로 베끼거나 스크린샷을 찍을 필요가 없어, 디자인 시스템이 코드와 100% 일치한다.
- **코드 변경 자동 반영**: 컴포넌트를 고치면 story도 즉시 반영된다. "코드는 바뀌었는데 디자인 문서는 옛것"인 불일치가 원천 차단된다.
- **업계 표준**: Storybook은 React 디자인 시스템의 사실상 표준이다. variant/상태별 story, 접근성(a11y) 애드온, 인터랙션 테스트 등 생태계가 풍부하다.
- **Tailwind 그대로**: 프로젝트의 `globals.css`·`tailwind.config`를 Storybook에 주입하면 실제와 동일한 스타일로 렌더된다. claude.ai/design처럼 스타일이 누락되지 않는다.
- **claude.ai/design의 구조적 한계**: 정적 HTML만 보관하는 claude.ai/design으로는 "살아있는 컴포넌트"를 담을 수 없다는 것이 실제 작업에서 확인되었다.

## 대안

| 대안 | 장점 | 단점 | 불채택 사유 |
|------|------|------|-------------|
| Storybook (채택) | 실제 컴포넌트 렌더, 코드 일치, 업계 표준, Tailwind 그대로 | 설치·빌드 파이프라인 추가 | — |
| claude.ai/design 유지 (손 재현) | 별도 설치 없음 | 프로젝트 스타일 누락으로 디자인 깨짐 | 실제 디자인 보존 불가 |
| claude.ai/design 유지 (스크린샷) | 시각 정확 | 그림일 뿐, 실제 컴포넌트 아님·코드 미연결 | "쓸 수 있는 컴포넌트" 요구 미충족 |
| 자체 미리보기 페이지 | 실제 렌더 | story 관리·문서화·a11y 등 생태계 부재, 직접 구축 비용 | Storybook이 이미 제공하는 것을 재발명 |

## 결과

- Storybook 설치 + Next.js/Tailwind/경로 별칭(`~/`) 연동.
- 기존 디자인 시스템 산출물을 Storybook story로 마이그레이션:
  - Foundations(Colors/Typography/Spacing 토큰) → docs story
  - Components(SectionHeading) → story (PokemonCard는 폐기된 PR이므로 Storybook 환경에서 재작성)
- claude.ai/design `poke-korea-design-system` 프로젝트는 마이그레이션 완료 후 정리(원격 카드 삭제).
- `DesignSync` 연동을 다루던 문서 갱신:
  - [mobile-redesign-plan.md](../../specs/mobile-redesign-plan.md) §3.3 DS 트랙: claude.ai/design → Storybook
  - [ux-designer.md](../../agents/ux-designer.md): DesignSync 역할 분리 워크플로우 → Storybook
- 메모리의 claude.ai/design 관련 항목(프로젝트 ID, DS 카드 스크린샷 방식) 갱신/폐기.
- 이후 디자인 시스템 구축은 Storybook에서 Foundations → Components → Patterns 순으로 진행([home-redesign-spec.md](../../specs/home-redesign-spec.md) 계획 유지).

## 참고 자료

- [Storybook for Next.js](https://storybook.js.org/docs/get-started/frameworks/nextjs)
- [Storybook with Tailwind CSS](https://storybook.js.org/recipes/tailwindcss)
- [mobile-redesign-plan.md](../../specs/mobile-redesign-plan.md) — UI 전면 개편 4단계 전략
- [home-redesign-spec.md](../../specs/home-redesign-spec.md) — 홈 재설계 (DS 컴포넌트 계획)
