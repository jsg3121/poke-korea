# 린팅 가이드

ESLint가 잡는 **코드 품질** 규칙을 규정한다. 설정은 `.eslintrc`에 있다.

표기 형식(들여쓰기·따옴표·import 정렬)은 `formatting.md`가 담당한다. 두 도구의 역할이 겹치지 않도록 `eslint-config-prettier`로 포맷 관련 ESLint 규칙을 꺼둔다.

---

## 역할 구분

| 도구     | 담당                              | 예                           |
| -------- | --------------------------------- | ---------------------------- |
| Prettier | 표기 형식, import **정렬**        | 줄바꿈, 따옴표, 순서         |
| ESLint   | 코드 품질, 미사용 import **제거** | 훅 규칙, 타입 안전성, 접근성 |

> **Why 나누는가:** 같은 것을 두 도구가 다르게 고치면 저장할 때마다 diff가 튄다. Prettier는 코드를 지우지 않고, ESLint는 정렬을 건드리지 않는다.

---

## 적용 규칙 세트

| 세트                                       | 목적                                    |
| ------------------------------------------ | --------------------------------------- |
| `eslint:recommended`                       | 기본 오류 검출                          |
| `@typescript-eslint/recommended`           | 타입 안전성                             |
| `plugin:react/recommended` · `react-hooks` | React·훅 규칙                           |
| `plugin:@next/next/recommended`            | Next.js 규칙                            |
| `plugin:import/recommended`                | import 유효성                           |
| `jsx-a11y`                                 | 접근성                                  |
| `eslint-config-prettier`                   | 포맷 관련 규칙 해제 (**마지막에 둔다**) |

`eslint-config-prettier`가 마지막이어야 앞선 세트의 포맷 규칙을 덮어 끌 수 있다.

---

## 주요 개별 규칙

### 미사용 import는 자동 제거한다

```json
"unused-imports/no-unused-imports": "error"
```

`@typescript-eslint/no-unused-vars`도 미사용을 잡지만 **`--fix`를 지원하지 않아** 직접 지워야 한다. `unused-imports` 플러그인은 자동 제거가 되므로 import에 한해 이 규칙을 쓴다.

미사용 **변수**는 계속 `@typescript-eslint/no-unused-vars`가 담당한다. `_` 접두사는 예외로 둔다 — 콜백 인자처럼 자리는 필요하지만 쓰지 않는 값을 표현한다.

```json
"@typescript-eslint/no-unused-vars": ["error", {
  "argsIgnorePattern": "^_",
  "varsIgnorePattern": "^_",
  "caughtErrorsIgnorePattern": "^_"
}]
```

### 훅 규칙

| 규칙                          | 수준  | 의미                              |
| ----------------------------- | ----- | --------------------------------- |
| `react-hooks/rules-of-hooks`  | error | 조건문·반복문 안에서 훅 호출 금지 |
| `react-hooks/exhaustive-deps` | warn  | 의존성 배열 누락 검출             |

`exhaustive-deps`를 억제할 때는 **반드시 이유를 주석으로 남긴다.**

```tsx
// eslint-disable-next-line react-hooks/exhaustive-deps
// ↑ debounce된 keyword가 바뀔 때만 실행하는 것이 의도
```

> **Why warn인가:** 이 규칙은 의도적으로 의존성을 뺀 경우를 구분하지 못해 오탐이 있다. error로 두면 `eslint-disable`이 남발되어 오히려 규칙이 무력해진다. warn으로 두고 억제할 때 이유를 적게 한다.

### 타입 안전성

| 규칙                                    | 수준 |
| --------------------------------------- | ---- |
| `@typescript-eslint/no-explicit-any`    | warn |
| `@typescript-eslint/ban-ts-comment`     | warn |
| `@typescript-eslint/no-empty-function`  | warn |
| `@typescript-eslint/no-empty-interface` | warn |

`any`와 `@ts-ignore`는 타입 검사를 무력화한다. 쓰지 않는 것이 원칙이며(`coding.md`), 불가피하면 이유를 주석으로 남긴다.

### 비교 연산

```json
"eqeqeq": ["error", "always"]
```

`==`는 암묵 형변환을 수행해 `0 == ''`가 참이 된다. 항상 `===`를 쓴다.

---

## 검사에서 제외되는 것

```json
"ignorePatterns": ["**/*.js", "**/*.jsx"]
```

`.js` 파일은 설정 파일(`next.config.js`·`tailwind.config.js`)과 스크립트뿐이라 타입 기반 규칙을 적용할 수 없다.

자동 생성물(`src/graphql/`)도 검사 대상이 아니다 — codegen이 만든 코드를 고칠 수 없기 때문이다.

---

## 실행

```bash
npx next lint              # 검사
npx next lint --fix        # 자동 수정 (미사용 import 제거 포함)
```

저장 시 자동 수정을 켜려면 `.vscode/settings.json`에 다음을 둔다.

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

`explicit`은 명시적 저장(⌘S)에만 동작한다 — 자동 저장 중에는 실행되지 않아, 타이핑 도중 코드가 지워지는 일을 막는다.
