# ADR-0018: 코딩 컨벤션 재정의 — 엄격한 타입·Context·핸들러 규칙

- **상태**: 승인
- **날짜**: 2026-09-09
- **담당**: jsg3121 + Claude

## 맥락

[ADR-0016](./ADR-0016-folder-structure-by-domain-usage.md)(폴더)과 [ADR-0017](./ADR-0017-naming-conventions.md)(네이밍)으로 배치와 이름 규칙을 분리한 뒤, `coding.md`에 남은 내용을 점검했다. 두 종류의 문제가 있었다.

**1. 폐기된 규칙이 남아 있었다.**

- `.desktop.tsx`·`.mobile.tsx` 네이밍과 `views/desktop/`·`views/mobile/` 폴더를 규정하는데, 해당 파일·폴더가 **하나도 없다**([ADR-0007](./ADR-0007-responsive-rendering-strategy.md)로 폐기된 구조).
- `isMobile ? <Mobile/> : <Desktop/>` 예시가 남아 있어, ADR-0007이 금지한 패턴을 안내하고 있었다.
- 계층 책임 표가 "views는 components 직접 호출 금지"로 적혀 있어, ADR-0016의 "상위는 모든 하위를 참조할 수 있다"와 정면으로 충돌했다.
- 같은 폴더의 `styling.md`는 ADR-0007을 반영해 "모드별 2벌 분리 금지"를 명시하고 있어, **두 문서가 서로 반대되는 규칙을 담고 있었다.**

**2. 코드 작성 규칙 자체가 없었다.** 실태를 조사하니 판단이 갈리는 지점이 드러났다.

- **Context 소비 방식이 갈렸다.** 11개 중 5개만 커스텀 훅을 제공하고, 나머지는 소비처가 `useContext`를 직접 호출한다. 훅이 있는 것 중에도 `useDevice`는 Provider 밖 가드가 없다.
- **`'use client'` 경계 기준이 없다.** `components` 113개 중 44개, `containers` 79개 중 44개가 클라이언트인데 근거가 문서화돼 있지 않다.
- **타입 엄격도가 `strict: true`에 머물러 있다.** non-null 단언은 없고 `any`도 1건(`useInfiniteScroll`의 `Array<any>`)뿐이라 양호하지만, URL 파라미터를 검증 없이 `as`로 단언하는 곳이 7곳 있다.

## 결정

**`coding.md`를 "코드를 어떻게 작성하는가"로 재정의하고, 다음을 확정한다.**

### 1. 문서 범위 정리

파일 네이밍 절은 `naming.md`로, App Router 프라이빗 폴더 절은 `structure.md`로 옮긴다. 디바이스 반응형 구조 절은 삭제한다(ADR-0007로 폐기). 계층 책임 표는 ADR-0016에 맞춰 수정한다.

### 2. TypeScript 엄격 옵션 추가

`strict: true`에 더해 다음을 켠다.

| 옵션                                    | 현재 코드 에러 |
| --------------------------------------- | -------------- |
| `noUncheckedIndexedAccess`              | 45건           |
| `noImplicitReturns`                     | 0건            |
| `noFallthroughCasesInSwitch`            | 0건            |
| `noUnusedLocals` · `noUnusedParameters` | 0건            |

`exactOptionalPropertyTypes`(86건)는 켜지 않는다.

### 3. 외부 입력은 타입 가드로 검증한다

URL 파라미터·API 응답에 `as`를 쓰지 않고 타입 가드로 좁힌다. `as const`는 예외(타입을 좁히므로 안전).

### 4. Context는 커스텀 훅 + Provider 밖 가드

`createContext<T | null>(null)`로 두고, 훅에서 null을 걸러 에러를 던진다. 소비처는 `useContext`를 직접 호출하지 않는다.

### 5. 이벤트 핸들러를 JSX에 인라인하지 않는다

props로 받은 콜백도 컴포넌트 안에서 이름 있는 핸들러로 감싸 호출한다.

### 6. 조건부 렌더링은 early return 우선

JSX 안에서 `&&`를 쓸 때는 좌변을 불리언으로 명시한다.

### 7. `'use client'`는 트리 아래쪽으로

상태·생명주기·브라우저 API·이벤트 핸들러가 실제로 필요한 컴포넌트에만 붙인다.

## 근거

**엄격 옵션은 측정 후 선별했다.** 6개 옵션을 개별 적용해 에러 수를 실측했고, 4개는 **0건**이라 코드가 이미 그 수준을 만족했다. `noUncheckedIndexedAccess` 45건은 실제 버그를 막는다 — 컴파일러는 배열 길이를 알 수 없으므로 `versionGroup?.[0]`이 존재한다고 보장할 수 없는데, 현재 타입은 값이 있다고 말한다.

**`exactOptionalPropertyTypes`를 제외한 이유.** 86건으로 부담이 가장 크면서 얻는 것이 적다. 이 옵션은 `aria-current={active ? 'page' : undefined}` 같은 **React 정석 패턴**을 에러로 만든다(속성을 렌더하지 않으려면 `undefined`를 넘겨야 한다). 86건을 고치려면 우회 코드가 늘어 오히려 가독성이 떨어진다. TypeScript 팀도 이 옵션을 `strict`에 포함하지 않았고, 공식 문서가 "많은 코드베이스에서 마이그레이션이 어렵다"고 명시한다.

**Context 커스텀 훅이 표준인 이유.** `createContext`에 기본값을 주면 Provider 밖에서 써도 에러가 나지 않고 빈 값이 반환된다 — 화면은 비어 보이는데 원인을 알 수 없는 실패다. 훅에서 null을 걸러내면 즉시 명확한 메시지로 터진다. 부수 효과로 반환 타입이 non-null로 좁혀져 소비처의 옵셔널 체이닝이 사라지고, 타입을 맞추려고 빈 배열·빈 함수로 **가짜 기본값을 만들 필요도 없어진다.** 이 저장소의 `AbilityQuiz`가 이미 가드 방식이고 `Detail`이 기본값 방식이라, 두 방식의 차이가 실제로 존재한다.

**핸들러 인라인 금지의 근거는 메모리다.** JSX 안의 화살표 함수는 렌더마다 새로 생성된다. 리스트가 1,000개면 함수도 1,000개가 만들어지고, 자식이 `memo`여도 props가 매번 바뀌어 메모이제이션이 무효화된다. 이름 있는 핸들러는 스택 트레이스에 함수명을 남겨 디버깅에도 유리하다.

**`&&` 대신 불리언 명시.** `&&`는 좌변을 그대로 반환하는데, `0`과 빈 문자열은 falsy이면서도 React가 렌더할 수 있는 값이다. `{items.length && <List/>}`는 빈 배열에서 화면에 `0`을 출력한다.

## 대안

| 대안                                         | 장점                            | 단점                                               | 불채택 사유                                                       |
| -------------------------------------------- | ------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------- |
| **`exactOptionalPropertyTypes` 포함**        | optional 속성의 의미가 엄밀해짐 | 86건 수정, React props 전달부에 우회 코드 증가     | 얻는 안전성보다 가독성 손실이 크다. TS 팀도 `strict`에서 제외했다 |
| **`strict-boolean-expressions` ESLint 규칙** | 암묵 변환 원천 차단             | 모든 조건문을 명시형으로 바꿔야 해 코드가 장황해짐 | 규칙 대신 컨벤션 문서로 규정하고 리뷰에서 판단한다                |
| **Context 현행 유지**                        | 변경 없음                       | Provider 밖 사용이 조용히 실패                     | 실패가 드러나지 않는 것이 가장 큰 비용이다                        |
| **`coding.md` 폐기**                         | 문서 수 감소                    | 코드 작성 패턴을 담을 곳이 사라짐                  | 계층 책임·Context·핸들러 규칙이 갈 곳이 필요하다                  |

## 결과

- `coding.md` 전면 개정, App Router 절을 `structure.md`로 이관.
- 후속 정리 대상(코드 변경):
  - `tsconfig.json`에 엄격 옵션 5개 추가 — `noUncheckedIndexedAccess` 적용 시 45건 가드 추가 필요
  - Context 6개에 커스텀 훅 추가 + 소비처 20곳 수정, `useDevice`에 가드 추가
  - URL 파라미터 `as` 단언 7곳을 타입 가드로 교체
  - `IF` 접두사 타입명 정리(`naming.md`가 이미 금지)
- 이 ADR로 `coding.md`의 UA 분기 관련 서술이 제거되어, `styling.md`와의 충돌이 해소된다.

### 적용 현황 (1.61.0)

에러가 0건이던 4개 옵션(`noImplicitReturns`·`noFallthroughCasesInSwitch`·`noUnusedLocals`·`noUnusedParameters`)은 `tsconfig.json`에 적용했다.

**`noUncheckedIndexedAccess`는 적용을 보류한다.** 결정 자체를 뒤집는 것이 아니라 시점을 미루는 것이며, 나머지 4개 옵션의 결정은 그대로 유효하다.

보류 근거는 세 가지다.

1. **이 옵션이 드러낸 실제 결함은 이미 고쳤다.** 45건을 훑어 19건을 처리하는 과정에서 두 가지 실질 문제가 나왔고 둘 다 해소했다 — 퀴즈 완료 판정이 문항 수 상수에 묶여 있던 것(백엔드 응답 개수가 달라지면 결과 화면이 열리지 않거나 답이 빈 문항이 섞인다), `Detail.context`의 폼 인덱스 접근 6곳에서 옵셔널 체이닝이 중간에 끊겨 범위 초과 시 크래시하던 것.
2. **남은 26건은 형식적 처리에 가깝다.** 배열 리터럴 직후의 `[0]`·`[1]`처럼 값이 반드시 존재하는 접근이 다수이고, 폴백을 넣으면 실행되지 않는 분기만 늘어난다.
3. **위험 구간을 실측으로 확인했다.** 가장 우려되던 퀴즈 결과 화면은 GraphQL 응답을 직접 조회해 20문항·옵션 4개·`correctAnswerIndex` 0~3(이탈 0건)으로 정상임을 확인했다.

> **Why 보류를 기록하는가:** 근거 없이 미루면 다음 사람이 이유를 모른 채 켜서 26건을 다시 마주하거나, 반대로 영원히 방치된다. "무엇을 이미 해결했고 무엇이 남았는가"를 남겨야 재개 시점을 판단할 수 있다.

**재개 조건:** 남은 26건에 대해 "실행되지 않는 폴백을 만들지 않으면서 타입을 만족시키는 방법"이 정리되면 켠다. 인덱스 접근을 구조 분해나 전용 헬퍼로 바꾸는 방식이 후보다(`typeEffectivenessQuiz.module.ts`의 `pickRandom`이 그 예).

## 참고 자료

- [TypeScript — noUncheckedIndexedAccess](https://www.typescriptlang.org/tsconfig/#noUncheckedIndexedAccess)
- [TypeScript — exactOptionalPropertyTypes](https://www.typescriptlang.org/tsconfig/#exactOptionalPropertyTypes) — `strict`에 포함되지 않은 근거
- [React — Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context) — Provider와 커스텀 훅을 함께 export하는 패턴
- [Next.js — Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) — `'use client'` 경계를 트리 아래로 미는 근거
- [ADR-0007](./ADR-0007-responsive-rendering-strategy.md) — UA 분기 폐기, 디바이스 반응형 절 삭제의 근거
- [ADR-0016](./ADR-0016-folder-structure-by-domain-usage.md) — 계층 참조 규칙의 출처
