# ADR-0019: 린트·포맷 지침 분리와 import 계층 정렬 도입

- **상태**: 승인
- **날짜**: 2026-09-17
- **담당**: jsg3121 + Claude

## 맥락

`linting.md`를 점검하면서 세 가지 문제가 드러났다.

**1. 동작하지 않는 설정을 규칙으로 문서화하고 있었다.**

`.prettierrc`에 `importOrder`가 정의돼 있으나, 이를 처리할 플러그인이 설치되지 않았다. Prettier는 실행할 때마다 경고를 낸다.

```text
[warn] Ignored unknown option { importOrder: ["^react", "<THIRD_PARTY_MODULES>", "^[./]"] }
```

문서는 이 설정을 유효한 규칙처럼 표에 적어놨다. 지침을 읽고 "import는 자동 정렬된다"고 판단하면 사실과 다르다. 게다가 이 설정에는 `~/` 경로를 위한 그룹이 없어, 플러그인을 설치하더라도 내부 모듈이 서드파티 그룹에 섞인다.

**2. 성격이 다른 두 도구가 한 문서에 있었다.** 제목은 "린팅 가이드"인데 첫 절이 Prettier다. ESLint는 코드 품질(버그 예방), Prettier는 표기 형식으로 목적이 다르다.

**3. 설정값 나열만 있고 근거가 없었다.** `.prettierrc`·`.eslintrc`를 표로 옮겨 적었을 뿐이라, 파일을 직접 보는 것과 차이가 없었다.

추가로, 미사용 import가 `@typescript-eslint/no-unused-vars`(error)에 걸리지만 **이 규칙은 `--fix`를 지원하지 않아** 매번 손으로 지워야 했다.

## 결정

### 1. 문서를 둘로 나눈다

| 문서            | 담당                                            |
| --------------- | ----------------------------------------------- |
| `linting.md`    | ESLint — 코드 품질 규칙, 미사용 import **제거** |
| `formatting.md` | Prettier — 표기 형식, import **정렬**           |

두 도구의 역할이 겹치지 않는다. Prettier는 코드를 지우지 않고, ESLint는 정렬을 건드리지 않는다.

### 2. `@ianvs/prettier-plugin-sort-imports`를 도입하고 계층 순서로 정렬한다

```json
"importOrder": [
  "^react$", "^next(/.*)?$", "<THIRD_PARTY_MODULES>", "",
  "^~/types/(.*)$", "^~/constants/(.*)$", "^~/graphql/(.*)$",
  "^~/utils/(.*)$", "^~/modules/(.*)$", "^~/hooks/(.*)$",
  "^~/context/(.*)$", "^~/components/(.*)$", "^~/containers/(.*)$",
  "^~/views/(.*)$", "", "^[./]"
]
```

### 3. 미사용 import는 ESLint가 자동 제거한다

`eslint-plugin-unused-imports`를 도입해 `unused-imports/no-unused-imports`를 error로 둔다. 미사용 **변수**는 기존 `@typescript-eslint/no-unused-vars`가 계속 담당한다.

### 4. `source.organizeImports`는 켜지 않는다

VSCode 내장 정리 기능은 자체 방식으로 정렬해 계층 순서를 덮어쓴다.

## 근거

**계층 순서를 택한 이유.** 순서가 의존 방향과 일치한다. 추상적인 것(타입·상수)에서 구체적인 것(컴포넌트·뷰)으로 내려가므로, import 목록만 봐도 이 파일이 어느 계층에 의존하는지 읽힌다. [ADR-0016](./ADR-0016-folder-structure-by-domain-usage.md)의 "하위는 상위를 참조하지 않는다"를 어긴 경우도 눈에 띈다 — `components`가 `containers`를 import하면 순서상 아래쪽에 나타나 이질적으로 보인다.

알파벳순은 기계적으로 안정적이지만 아무것도 알려주지 않는다. `components`가 `utils`보다 먼저 온다고 해서 얻는 정보가 없다.

**`@ianvs`를 택한 이유.** `@trivago`의 후속 포크로 설정 문법이 거의 같으면서 표현력이 넓다. 특히 빈 문자열(`""`)로 **원하는 위치에만 빈 줄**을 넣을 수 있어, 외부 의존성 / 내부 모듈 / 상대 경로를 시각적으로 구분할 수 있다. `@trivago`는 `importOrderSeparation`이 전체 on/off라 그룹마다 빈 줄이 들어가 목록이 길어진다. 유지보수 활성도도 `@ianvs`가 높다.

두 플러그인을 격리 환경에 설치해 실제 파일로 출력을 비교했고, `@ianvs` 설정이 의도한 계층 그룹을 정확히 만들어내는 것을 확인했다.

**`unused-imports`가 필요한 이유.** `@typescript-eslint/no-unused-vars`는 검출만 하고 자동 수정을 제공하지 않는다. 반면 `unused-imports/no-unused-imports`는 `--fix` 대상이라 저장 시 자동 제거가 된다. 두 규칙은 역할이 갈리므로 함께 쓴다 — import는 전자, 변수는 후자.

**`organizeImports`를 배제한 이유.** VSCode 내장 기능과 Prettier 플러그인이 모두 저장 시 동작하면 서로 다른 순서로 재정렬해, 파일을 저장할 때마다 import 블록 diff가 튄다. 정렬 주체를 하나로 고정해야 한다.

**`exhaustive-deps`를 warn으로 유지하는 이유.** 이 규칙은 의도적으로 의존성을 뺀 경우를 구분하지 못해 오탐이 있다. error로 올리면 `eslint-disable`이 남발되어 규칙 자체가 무력해진다. warn으로 두되 억제할 때 이유를 주석으로 남기게 한다.

## 대안

| 대안                              | 장점                           | 단점                                         | 불채택 사유                                                 |
| --------------------------------- | ------------------------------ | -------------------------------------------- | ----------------------------------------------------------- |
| **`@trivago` 플러그인**           | 현재 `.prettierrc` 문법 그대로 | 그룹 구분 빈 줄이 전체 on/off, 유지보수 뜸함 | 계층 그룹을 시각적으로 나누려면 위치별 빈 줄이 필요하다     |
| **알파벳순 정렬**                 | 판정이 단순                    | 순서에 의미가 없음                           | 계층 위반을 드러내지 못한다                                 |
| **`importOrder` 설정 제거**       | 변경 0건                       | import 순서가 계속 제각각                    | 이미 설정이 있었고 의도도 있었다. 동작하게 만드는 편이 맞다 |
| **VSCode `organizeImports` 사용** | 플러그인 불필요                | 계층 순서를 덮어씀                           | 정렬 주체가 둘이면 diff가 튄다                              |
| **`linting.md` 한 문서 유지**     | 문서 수 감소                   | ESLint·Prettier 역할이 뒤엉킴                | `comments.md`를 분리한 것과 같은 기준을 적용한다            |

## 결과

- `conventions/guides/formatting.md` 신설, `linting.md`는 ESLint 전용으로 개정.
- 후속 작업(코드·설정 변경):
  - `@ianvs/prettier-plugin-sort-imports`, `eslint-plugin-unused-imports` 설치
  - `.prettierrc`의 `importOrder`를 계층 순서로 교체하고 `plugins` 추가
  - `.eslintrc`에 `unused-imports` 플러그인·규칙, `eqeqeq` 추가
  - `.prettierignore` 신설 — codegen 생성물 제외
  - `.vscode/settings.json` 신설 — `formatOnSave`, `source.fixAll.eslint`
  - `package.json`의 `lint` 스크립트에 `--fix` 변형 추가 검토
  - 전체 파일 재포맷 — import 순서가 바뀌므로 diff가 크다. 파일 재배치(ADR-0016·0017 후속)와 함께 진행한다

## 참고 자료

- [@ianvs/prettier-plugin-sort-imports](https://github.com/IanVS/prettier-plugin-sort-imports) — 빈 줄 구분자와 설정 문법
- [eslint-plugin-unused-imports](https://github.com/sweepline/eslint-plugin-unused-imports) — `--fix` 지원 근거
- [Prettier — Option Philosophy](https://prettier.io/docs/en/option-philosophy) — 옵션을 적게 두는 이유
- [ADR-0016](./ADR-0016-folder-structure-by-domain-usage.md) — 계층 참조 규칙, import 순서의 근거
