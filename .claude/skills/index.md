# skills/

커스텀 스킬을 정의하는 폴더입니다. 각 스킬은 `<name>/SKILL.md` 구조이며, 파일명이 아니라 frontmatter의 `name`이 호출 이름(`/<name>`)이 됩니다.

## 개발 스킬

| 스킬           | 설명                                       | 산출물             |
| -------------- | ------------------------------------------ | ------------------ |
| `/create-pr`   | PR 생성 (검증 옵션을 선택받아 조건부 실행) | PR                 |
| `/lint-check`  | Prettier + ESLint 검사                     | 보고만             |
| `/code-review` | 서브에이전트 기반 코드 리뷰                | 보고만             |
| `/a11y-check`  | WCAG 접근성 검사                           | 보고만             |
| `/seo-audit`   | 메타태그·JSON-LD·sitemap 감사              | 보고만             |
| `/research`    | 외부 정보 조사 (공식 문서 우선)            | `research/` 보고서 |

## 비즈니스 분석 스킬

| 스킬            | 설명                                        | 산출물             |
| --------------- | ------------------------------------------- | ------------------ |
| `/biz-strategy` | 전략 분석 파이프라인 (MI → BA → STR 순차)   | `research/` 보고서 |

## 트리거 방식

모든 스킬은 `/<name>`으로 직접 호출할 수 있다. 추가로 각 `SKILL.md`의 `description`에 있는 **TRIGGER / DO NOT TRIGGER 조건**에 따라 자동으로 선택되기도 한다.

> **Why 조건을 description에 두는가:** Claude는 스킬 선택에 보수적이라, 트리거 조건을 넓게 적어두지 않으면 적절한 상황에서도 호출하지 않는다. 동시에 DO NOT TRIGGER로 인접 스킬·에이전트와의 경계를 명시해야 오호출을 막을 수 있다.

## 검사 스킬은 자동 수정하지 않는다

`/lint-check`·`/code-review`·`/a11y-check`·`/seo-audit`는 **검사 결과만 보고**하고 코드를 고치지 않는다. 수정은 보고를 본 사용자가 판단해 별도로 지시한다.

> **Why:** 검사와 수정을 한 번에 하면 무엇이 왜 바뀌었는지 사용자가 검토할 지점이 사라진다. 특히 접근성·SEO는 자동 수정이 의도를 훼손하기 쉽다.

## 스킬 폴더 구조

```text
skills/
├── <skill-name>/
│   ├── SKILL.md              # 스킬 정의 (frontmatter + 실행 절차)
│   ├── references/           # 상세 참조 문서 (선택, 필요 시에만 로드)
│   └── templates/            # 산출물 템플릿 (선택)
└── index.md                  # 이 파일
```

`SKILL.md`는 500줄 이하로 유지하고, 길어지면 상세를 `references/`로 분리한다(Progressive Disclosure). 컨텍스트를 매번 전부 로드하지 않기 위함이다.
