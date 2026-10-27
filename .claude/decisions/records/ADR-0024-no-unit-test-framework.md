# ADR-0024: 단위 테스트 도구를 도입하지 않고 E2E만 유지

- **상태**: 승인
- **날짜**: 2026-10-27
- **담당**: jsg3121, Claude

## 맥락

1.62.0 상세 능력치 탭(종족값 / Lv50 실수치)의 기획서는 실행 계획 2단계를 "계산 함수·단위 테스트 설계"로 잡았다. 그런데 저장소에는 단위 테스트 도구가 없다. 테스트 도구는 2026-10-21 도입한 Playwright E2E가 유일하며, E2E spec도 저장하지 않고 검사할 때마다 작성·실행·삭제한다(`testing.md`).

2단계를 시작하려면 단위 테스트를 어떻게 돌릴지 정해야 했다. 검토 시점의 조건은 다음과 같다.

- 테스트 대상은 실수치 계산 순수 함수 하나다. 공식은 게임 규칙이라 바뀔 일이 거의 없다.
- 기대값은 기획서에 이미 있다 — 한카리아스 표(3-4), 껍질몬 HP 1 고정(3-5), 망나뇽 게임 화면 역산값(3-6).
- 그 밖에 상시 테스트로 보호하자는 요구가 나온 순수 로직은 아직 없다.

## 결정

**단위 테스트 도구를 도입하지 않는다. 자동 테스트는 E2E만 유지한다.**

- 순수 계산 로직은 구현할 때 **기대값과 한 번 대조**해 확인한다. 임시 스크립트로 함수를 실행해 기획서의 기대값과 비교하고, 확인 후 스크립트를 지운다. 대조한 케이스와 결과는 changelog 검증 절에 남긴다.
- **재검토 조건**: 상시 보호가 필요한 순수 로직이 여러 개 생기면(예: 상성 배율 계산을 변경 방지 대상으로 묶고 싶어질 때) 도입을 다시 검토한다. 그때는 아래 비교에 따라 Vitest를 우선 후보로 둔다.

## 근거

**상시 테스트의 가치는 변경 방지에 있는데, 지금 대상에서는 그 가치가 작다.** 테스트 파일을 저장소에 두는 이유는 누군가 함수를 고쳤을 때 결과가 바뀌지 않았는지 자동으로 확인하기 위해서다. 바뀔 일이 거의 없는 게임 공식 하나를 위해 도구·설정·의존성을 추가하면 유지 비용이 이득보다 크다. 이번 작업에 실제로 필요한 것은 처음 구현이 기획서 기대값과 맞는지 한 번 확인하는 일이다.

**E2E spec을 저장하지 않기로 한 판단과 같은 방향이다.** 이 저장소는 테스트 자산을 쌓아 두기보다, 검사가 필요한 순간에 그 변경에 맞춰 확인하는 방식을 택했다. 계산 로직도 같은 방식으로 다루면 테스트 정책이 하나의 원칙으로 설명된다.

**도입할 때를 대비해 후보는 비교해 두었다.** Vitest는 TypeScript·ESM을 별도 변환 설정 없이 실행하고 Jest 호환 API를 제공한다. Next.js 공식 문서도 Vitest·Jest 설정 가이드를 모두 제공한다. 이 저장소에는 Jest·Babel 설정이 없어 어느 쪽이든 처음부터 도입해야 하므로, 설정이 적은 Vitest가 유리하다. Storybook 10의 공식 테스트 연동도 Vitest 기반이다.

## 대안

| 대안 | 장점 | 단점 | 불채택 사유 |
| --- | --- | --- | --- |
| **Vitest 즉시 도입** | TS·ESM 바로 실행, Jest 호환 API, Storybook 연동. 함수가 바뀌면 자동으로 잡는다 | `vitest` 의존성과 설정 추가. `~/` 별칭을 `vite-tsconfig-paths`나 `resolve.alias`로 따로 맞춰야 하고, 앱(SWC/webpack)과 테스트(Vite/esbuild)의 변환 경로가 둘이 된다 | 대상이 함수 하나라 변경 방지 가치가 작다. 재검토 조건을 만나면 1순위 후보 |
| **Jest** | 생태계가 가장 넓다. `next/jest`가 SWC 변환을 제공 | TS 실행에 `next/jest`나 ts-jest 설정 필요. ESM 지원이 아직 실험 기능 | 도입한다면 Vitest보다 설정 부담이 크다 |
| **Node 내장 `node:test` 상시 사용** | 의존성 0개. Node 22의 타입 제거 기능으로 `.ts` 직접 실행 | `~/` 별칭을 해석하지 못하고, import에 `.ts` 확장자를 붙여야 해 기존 코드 관례와 맞지 않는다 | 상시 테스트 기반으로 쓰기에는 코드베이스와 어긋난다 |

## 결과

- 상세 능력치 탭 기획서 9절 2단계는 "계산 함수·기대값 대조"로 바뀐다.
- `testing.md`에 순수 계산 로직을 기대값 대조로 확인하는 방식을 적는다.
- 계산 함수가 나중에 바뀌어도 자동으로 잡아 주는 테스트는 없다. 계산 로직을 고칠 때는 기획서 기대값으로 다시 대조해야 한다.
- 기대값 대조용 임시 스크립트를 Node로 직접 돌리려면 계산 함수가 `~/` 별칭 import 없이 동작해야 한다. 실제 실행 방식은 2단계 착수 때 확인한다.

## 참고 자료

- [Vitest — Why Vitest](https://vitest.dev/guide/why)
- [Next.js — Setting up Vitest](https://nextjs.org/docs/app/guides/testing/vitest)
- [Next.js — Setting up Jest](https://nextjs.org/docs/app/guides/testing/jest)
- [Jest — ECMAScript Modules](https://jestjs.io/docs/ecmascript-modules)
- [Node.js — Modules: TypeScript](https://nodejs.org/api/typescript.html)
- [Node.js — Test runner](https://nodejs.org/api/test.html)
- 상세 능력치 탭 기획서: `.claude/specs/features/detail-stats-real-value-tab-spec.md`
- E2E 도입과 spec 비저장 방식: `.claude/conventions/guides/testing.md`
