# hooks/

규칙을 판독에 맡기지 않고 **물리적으로 강제**하는 가드입니다.

등록은 [`../settings.json`](../settings.json)의 `hooks`에서 합니다. 스크립트만 추가해서는 동작하지 않습니다.

## PreToolUse — 실행 전 차단

| 스크립트                     | 대상 도구        | 차단하는 것                                                                                                           |
| ---------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------- |
| `block-main-branch-edit.sh`  | `Write` · `Edit` | 현재 브랜치가 `main`·`master`일 때의 파일 편집                                                                        |
| `block-version-root-edit.sh` | `Write` · `Edit` | 통합 브랜치(`feature/X.Y.Z`)에서의 파일 편집 — 작업은 `feature/X.Y.Z-{주제}`에서 한다                                 |
| `guard-git-push.sh`          | `Bash`           | main을 향하는 push (명시 지정, `HEAD:main` refspec, `--all`/`--mirror`, upstream이 main인 브랜치, 현재 브랜치가 main) |
| `block-claude-html.sh`       | `Write` · `Edit` | `.claude/` 하위 `.html` 생성 — 시안은 `public/preview/`에 둔다                                                        |

## PostToolUse — 실행 후 검사

| 단계 | 구성                                                          | 역할                                                      |
| ---- | ------------------------------------------------------------- | --------------------------------------------------------- |
| 1    | `detect-new-comment.sh` (`command`, `if: Edit/Write(src/**)`) | 편집에 새 주석이 들어갔는지만 본다. 없으면 빈 출력으로 끝 |
| 2    | `prompt` 훅 (기본 Haiku)                                      | 1단계가 실은 주석 줄을 `comments.md` 기준으로 판정        |

> **Why 2단으로 나누는가:** `prompt` 훅은 편집마다 LLM을 호출한다. `src/` 편집 대부분은 주석을 건드리지 않으므로, 1단계에서 걸러내면 호출 자체가 일어나지 않는다. 1단계는 판정하지 않고 **주석 유무만** 본다.

`continueOnBlock: true`라 위반이어도 턴이 끊기지 않고 사유가 피드백으로 전달된다. 주석은 되돌리기 쉬운 변경이라 차단보다 지적이 맞다.

`eslint-disable`·`@ts-expect-error`·`prettier-ignore`는 주석 형태지만 **동작하는 지시문**이라 1단계에서 제외한다. 실제로 주석 정리 작업에서 이것들을 지웠다가 lint 경고로 발견한 적이 있다.

`src/graphql/`은 codegen 생성물이라 검사하지 않는다.

## 왜 훅으로 강제하는가

규칙이 문서에 있어도 지켜지지 않을 수 있다. "main에서 작업하지 않는다"는 CLAUDE.md의 절대 규칙이었는데도 뚫린 적이 있다 — 브랜치를 만들었다고 보고한 뒤 어떤 이유로 main으로 돌아온 채 파일을 쓴 사례다. 브랜치 생성과 파일 편집 사이에 checkout이 끼면 그 사이를 확인하는 절차가 없었기 때문이다.

편집·push 시점마다 물리적으로 검사해야 재발하지 않는다.

## 차단됐을 때

**우회하지 않는다.** 차단 메시지에 교정 명령이 함께 출력되므로 그대로 실행해 정상화한 뒤 진행한다.

훅이 **오탐**하는 경우(정상 작업을 막는 경우)는 스크립트를 고친다. 예로 `guard-git-push.sh`는 `git <무엇이든> push` 패턴을 넓게 잡아 `git stash push`까지 막았고, stash는 원격을 건드리지 않으므로 예외 처리를 추가했다.

## 스크립트 작성 규칙

- 입력은 stdin으로 들어오는 `{ tool_name, tool_input: { command, ... } }` JSON
- 차단 시 `permissionDecision: "deny"` JSON을 출력하고 `exit 0`
- 통과 시 빈 출력 + `exit 0` (기본 허용)
- 차단 사유와 **교정 방법**을 메시지에 함께 담는다 — 이유만 알려주면 다음 행동을 알 수 없다
- 각 스크립트 상단 주석에 "왜 이 훅이 필요한가"를 남긴다

## 관련 문서

- 브랜치 규칙: [`../conventions/guides/workflow.md`](../conventions/guides/workflow.md)
- 시안 저장 위치: [`../agents/ui-publisher.md`](../agents/ui-publisher.md)
