---
name: e2e-check
description: |
  E2E 테스트 검사 스킬. 변경 파일과 관련된 Playwright spec을 골라 개발 서버에 대고 실행하고, 실패를 회귀·불안정·환경 문제로 분류해 보고한다. 사용자 흐름이 바뀌었는데 spec이 없으면 테스트 부재로 알린다.
  TRIGGER when: "E2E 돌려줘", "e2e 검사", "playwright 테스트", "통합 테스트 실행", "흐름 테스트", "회귀 테스트", 검색·필터·폼 등 사용자 흐름 변경 후 검증 필요, qa-orchestrator의 E2E 검사 단계
  DO NOT TRIGGER when: 화면 캡처·시각 확인(사용자가 브라우저로 확인), 정적 검사(lint-check), 접근성 정적 검사(a11y-check), 테스트 작성 방법 질문(conventions/guides/testing.md 참조)
disable-model-invocation: true
---

# E2E 검사 스킬

변경 파일과 관련된 E2E spec을 실행하고 결과를 판정한다. **보고만 하고 코드나 테스트를 고치지 않는다.** spec 작성 규칙은 `.claude/conventions/guides/testing.md`가 권위 원본이다.

## 1. 사전 확인

E2E는 사용자가 띄운 개발 서버에 붙어서 돈다. 서버를 직접 띄우지 않는다(`npm run dev`·`npm run build` 금지 — 개발 서버는 사용자가 관리하고, 빌드는 실행 중인 서버를 죽인다).

```bash
curl -s -o /dev/null -w "%{http_code}" --max-time 15 http://localhost:3000/
curl -s -o /dev/null -w "%{http_code}" --max-time 15 -X POST \
  -H 'content-type: application/json' -d '{"query":"{__typename}"}' \
  http://localhost:4000/graphql
```

둘 중 하나라도 200이 아니면 **실행하지 않고 "실행 불가"로 보고**한다. 통과로 처리하지 않는다. 보고에 "개발 서버(`npm run dev`)와 GraphQL 서버를 띄운 뒤 다시 실행"을 안내한다.

## 2. 대상 spec 선별

변경 파일 목록(호출자가 넘겨준 것, 없으면 `git diff {대상 브랜치}...HEAD --name-only`)을 보고 실행할 spec을 정한다.

| 변경 파일                                                                      | 실행할 spec                                                                 |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| `e2e/**` 자체                                                                  | 바뀐 spec                                                                   |
| `src/app/{라우트}/**`, `src/containers/{도메인}/**`, `src/components/{도메인}/**`, `src/views/{도메인}/**` | `e2e/{라우트·도메인}/` (폴더가 있을 때)                                     |
| 공용 코드 — `src/hooks/**`, `src/modules/**`, `src/utils/**`, `src/components/common/**`, `src/context/**`, 헤더·푸터(`containers/desktop/`, `containers/mobile/`), `app/layout.tsx` | 바뀐 파일을 import하는 곳을 `grep`으로 찾아 해당 도메인 spec. 판단이 어려우면 **전체** |
| `playwright.config.ts`, `package.json`                                         | 전체                                                                        |
| 문서(`.md`)·스타일만 변경                                                      | 실행하지 않음 (스킵 사유 보고)                                              |

도메인 이름과 `e2e/` 폴더는 라우트 이름으로 대응한다(`testing.md` "파일 위치와 이름"). **애매하면 넓게 실행한다.** 전체 실행도 수십 초 수준이다.

## 3. 실행

```bash
npx playwright test {spec 경로...} --reporter=list
```

두 프로젝트(`mobile`, `desktop`)가 모두 돈다. 출력에서 테스트별 통과·실패와 실패 위치(`파일:라인`), 기대값·실제값을 수집한다.

## 4. 실패 분류

실패한 테스트만 **한 번** 다시 실행한다.

```bash
npx playwright test {실패한 spec}:{라인} --project={프로젝트} --reporter=list
```

| 분류      | 기준                                                                              | 등급        |
| --------- | --------------------------------------------------------------------------------- | ----------- |
| 회귀      | 다시 실행해도 같은 검증에서 실패                                                  | 🔴          |
| 불안정    | 다시 실행하면 통과                                                                | 🟡          |
| 환경 문제 | 서버 응답 없음·타임아웃·컴파일 에러 화면·GraphQL 에러 등 테스트 대상과 무관한 원인 | 실행 불가   |

회귀로 판정하면 실패한 검증이 무엇을 기대했는지(테스트 이름·기대값)와 관련 변경 파일을 연결해 원인 후보를 적는다. **테스트를 고쳐 통과시키지 않는다.** 테스트가 틀렸다고 판단되면 그 판단과 근거를 보고하고 결정은 사용자에게 맡긴다.

## 5. 테스트 부재 확인

다음에 해당하는데 대응하는 spec이 없으면 🟡 "테스트 부재"로 보고한다.

- 사용자 입력·클릭에 반응하는 로직(핸들러, URL 쓰기, 폼 제출)이 바뀐 도메인에 `e2e/{도메인}/`이 없다
- 커밋 메시지·변경 내용상 버그 수정인데, 그 버그를 재현하는 테스트가 추가되지 않았다

## 6. 결과 보고

```markdown
## E2E 검사 결과

### 요약

- 실행: {spec 목록} ({N}개 테스트 × 프로젝트 2)
- 결과: ✅ 통과 {N} · 🔴 회귀 {N} · 🟡 불안정 {N} · ⏭️ 실행 불가 {N}
- 선별 근거: {변경 파일 → spec 대응}

### 🔴 회귀

#### [{spec 파일}:{라인}] {테스트 이름} `{프로젝트}`

- **기대**: {기대값} / **실제**: {실제값}
- **관련 변경**: {파일}
- **원인 후보**: {설명}

### 🟡 불안정 · 테스트 부재

- [{spec 파일}:{라인}] {테스트 이름} — 재실행에서 통과
- {도메인}: {바뀐 흐름}에 대한 spec 없음

### 실행 불가 · 스킵

- {사유 — 서버 미기동, 문서만 변경 등}
```

## 하지 않는 것

- 개발 서버·GraphQL 서버 기동, `npm run build`
- 코드·테스트 수정, 실패한 테스트의 기대값 변경
- 실행 불가·스킵을 통과로 보고
- 화면 캡처로 시각 판정

## 참고 자료

- `.claude/conventions/guides/testing.md` — spec 작성 규칙
- [Playwright — Command line](https://playwright.dev/docs/test-cli)
- [Playwright — Retries (flaky 판정)](https://playwright.dev/docs/test-retries)
