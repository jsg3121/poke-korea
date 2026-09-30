# 포맷팅 가이드

코드의 **표기 형식**을 규정한다. 설정은 `.prettierrc`에 있고 Prettier가 강제하므로, 이 문서는 **왜 그 값인지**를 담는다.

코드 품질 규칙과 미사용 import 제거는 `linting.md`, 이름 짓기는 `naming.md`가 담당한다.

---

## 기본 원칙: 포맷은 논쟁하지 않는다

들여쓰기·따옴표·줄바꿈은 취향 문제이고 정답이 없다. 규칙을 정해 도구에 맡기고, 리뷰에서는 다루지 않는다.

> **Why:** 포맷 논의는 리뷰에서 실제 문제(로직·설계)를 밀어낸다. Prettier가 [의도적으로 옵션을 적게 제공](https://prettier.io/docs/en/option-philosophy)하는 이유도 같다 — 선택지가 많을수록 팀이 그것을 논의하는 데 시간을 쓴다.

---

## 주요 설정

| 옵션             | 값       | 이유                                                                                     |
| ---------------- | -------- | ---------------------------------------------------------------------------------------- |
| `semi`           | `false`  | 세미콜론 없이 쓴다. `(`·`[`로 시작하는 줄의 ASI 함정은 Prettier가 앞에 `;`를 넣어 막는다 |
| `singleQuote`    | `true`   | JS 문자열은 작은따옴표                                                                   |
| `jsxSingleQuote` | `false`  | JSX 속성은 큰따옴표 — HTML 관례와 맞춘다                                                 |
| `printWidth`     | `80`     | 한 줄 길이 상한                                                                          |
| `tabWidth`       | `2`      | 들여쓰기 2칸                                                                             |
| `trailingComma`  | `all`    | 마지막 요소 뒤에도 쉼표                                                                  |
| `arrowParens`    | `always` | 화살표 함수 인자에 항상 괄호                                                             |
| `endOfLine`      | `lf`     | 줄바꿈 LF 고정                                                                           |
| `bracketSpacing` | `true`   | `{ foo }` 형태로 공백                                                                    |

### `trailingComma: all`

마지막 요소에도 쉼표가 있으면 **항목을 추가할 때 diff가 한 줄만 바뀐다.** 쉼표가 없으면 기존 마지막 줄까지 수정되어 blame이 흐려진다.

### `printWidth: 80`

에디터를 분할해 두 파일을 나란히 볼 수 있는 폭이다. 100~120으로 늘리면 한 줄에 더 담기지만, 코드 리뷰 도구의 좌우 분할 뷰에서 가로 스크롤이 생긴다.

### `endOfLine: lf`

Windows에서 작업해도 저장소에는 LF만 들어간다. CRLF가 섞이면 줄 전체가 변경된 것으로 보여 diff가 무의미해진다.

---

## import 정렬

`@ianvs/prettier-plugin-sort-imports`가 import를 **계층 순서**로 정렬한다.

```json
"importOrder": [
  "^react$",
  "^next(/.*)?$",
  "<THIRD_PARTY_MODULES>",
  "",
  "^~/types/(.*)$",
  "^~/constants/(.*)$",
  "^~/graphql/(.*)$",
  "^~/utils/(.*)$",
  "^~/modules/(.*)$",
  "^~/hooks/(.*)$",
  "^~/context/(.*)$",
  "^~/components/(.*)$",
  "^~/containers/(.*)$",
  "^~/views/(.*)$",
  "",
  "^[./]"
]
```

빈 문자열(`""`)은 그 위치에 빈 줄을 넣는다 — 외부 의존성 / 내부 모듈 / 상대 경로가 시각적으로 갈린다.

> **Why 계층 순서인가:** 순서가 의존 방향과 일치한다. 추상적인 것(타입·상수)에서 구체적인 것(컴포넌트·뷰)으로 내려가므로, import 목록만 봐도 이 파일이 어느 계층에 의존하는지 읽힌다. `structure.md`의 "하위는 상위를 참조하지 않는다"를 어긴 경우도 눈에 띈다 — `components`가 `containers`를 import하면 순서상 아래쪽에 나타난다.

> **Why 알파벳순이 아닌가:** 알파벳순은 기계적으로 안정적이지만 아무것도 알려주지 않는다. `components`가 `utils`보다 먼저 온다고 해서 얻는 정보가 없다.

**정렬만 하고 지우지는 않는다.** 미사용 import 제거는 ESLint가 담당한다(`linting.md`).

---

## 포맷 대상 제외

`.prettierignore`로 자동 생성물을 제외한다. codegen 결과물을 포맷하면 재생성할 때마다 불필요한 diff가 생긴다.

```text
src/graphql/gqlGenerated.ts
src/graphql/typeGenerated.ts
src/graphql/schema.graphql
.next/
```

---

## 저장 시 자동 적용

`.vscode/settings.json`에 설정해 저장할 때마다 포맷이 적용되게 한다.

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

**`source.organizeImports`는 켜지 않는다.** VSCode 내장 기능이라 자체 방식으로 정렬해, 위에서 정한 계층 순서를 덮어쓴다. 두 도구가 저장할 때마다 서로 다른 순서로 바꾸면 diff가 계속 튄다.

### 수동 실행

```bash
npx prettier --write "src/**/*.{ts,tsx,css,json}"   # 적용
npx prettier --check "src/**/*.{ts,tsx,css,json}"   # 검사만
```
