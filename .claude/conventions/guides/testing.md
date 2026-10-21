# 테스트 가이드 (E2E)

**사용자 흐름이 의도대로 동작하는지 브라우저에서 자동으로 확인하는 테스트**를 어떻게 쓰고 돌리는지 규정한다. 도구는 Playwright(`@playwright/test`)다. 검사 절차(QA에서 언제·어떻게 작성하고 돌리고 판정하는가)는 `.claude/skills/e2e-check/SKILL.md`가 담당한다.

---

## spec은 저장하지 않는다

E2E spec은 **검사할 때마다 그 변경에 맞춰 작성하고, 실행한 뒤 지운다.** `e2e/` 폴더는 gitignore 대상이며 커밋하지 않는다. `e2e/` 작성·삭제는 승인 없이 허용돼 있다(`.claude/settings.json`).

> **Why:** spec을 쌓아 두면 이후 검사에서 이번 변경과 무관한 이전 테스트까지 함께 돌고, 오래된 기대값이 새 작업을 막는다. 검사마다 필요한 흐름만 새로 쓰면 결과가 그 변경에 대한 판단으로만 읽힌다. 대신 회귀를 막는 고정 테스트는 없으므로, 공용 코드가 바뀌면 사용처 흐름까지 넓게 도출한다(`e2e-check` 2단계).

---

## 실행

```bash
npx playwright test                           # e2e/에 작성된 spec 전체 (모바일·데스크톱 두 프로젝트)
npx playwright test --project=mobile          # 디바이스 하나
npx playwright test -g "초기화"               # 테스트 이름으로 거르기
```

`npm run test:e2e`는 `npx playwright test`와 같다. `e2e/`가 비어 있으면 실행할 테스트가 없다.

**사용자가 띄운 개발 서버(`localhost:3000`)와 로컬 GraphQL 서버(`localhost:4000`)에 붙어서 돈다.** Playwright가 서버를 직접 띄우지 않고(`webServer` 미사용), 다른 주소는 `BASE` 환경변수로 바꾼다.

> **Why 빌드가 아니라 개발 서버인가:** 프로덕션 빌드는 `src/modules/buildMode.module.ts`에 따라 운영 API(`api.poke-korea.com`)를 호출한다. E2E가 운영 백엔드에 부하를 주고, 결과도 운영 데이터에 따라 흔들린다. 또 개발 서버가 떠 있을 때 `npm run build`를 돌리면 `.next`를 공유해 서버가 죽는다. 개발 서버는 이 프로젝트에서 사용자가 직접 관리하므로, 테스트는 떠 있는 서버에 붙기만 한다.

---

## 무엇을 테스트하는가

| 대상                                             | 예                                          |
| ------------------------------------------------ | ------------------------------------------- |
| 사용자 흐름 — 입력·클릭에 따른 URL·화면 상태 변화 | 검색어 입력 → URL 반영, 초기화 → 입력창 비움 |
| 고친 버그의 재현 시나리오                        | 첫 검색어가 사라지던 문제                   |
| 여러 컴포넌트가 URL을 함께 쓰는 경계             | 필터 모달 제출 후 검색어·타입 파라미터 유지 |

다음은 대상이 아니다.

- **화면 모양(레이아웃·색·간격)** — 사용자가 브라우저에서 직접 확인한다. 스크린샷 비교를 넣지 않는다.
- **정확한 데이터 값·개수** — 로컬 DB 기준이라 데이터가 바뀌면 깨진다. "결과가 있다/없다", "URL에 값이 있다/없다"처럼 흐름을 검증한다.
- **순수 계산 로직** — 함수 단위로 검증할 대상이며 E2E로 돌리지 않는다.

> **Why:** E2E는 느리고 환경(서버·데이터)에 의존한다. 화면 모양이나 데이터 값까지 단정하면 기능과 무관한 변경에도 깨져서, 실패가 나도 아무도 믿지 않게 된다. "사용자가 이 흐름을 끝까지 갈 수 있는가"에 집중해야 실패가 곧 회귀를 뜻한다.

---

## 파일 위치와 이름

```text
e2e/                            # gitignore — 검사 중에만 존재
└── {라우트}/{흐름}.spec.ts     # 예: list/search.spec.ts, list/filter-modal.spec.ts
```

- **폴더는 라우트 이름을 따른다** — `/list` → `e2e/list/`, `/moves` → `e2e/moves/`.
- `describe`는 기능 이름, `test`는 **"~하면 ~한다"** 형태의 사용자 관점 문장으로 쓴다. 보고서에 테스트 이름이 그대로 실리므로, 이름만 읽어도 무엇을 검증했는지 알 수 있어야 한다.
- 헬퍼는 spec 파일 안에 둔다. spec이 매번 지워지므로 공용 헬퍼 폴더를 두지 않는다.

---

## 요소 찾기

**접근 가능한 이름으로 찾는다.** 우선순위는 다음과 같다.

1. `getByRole(역할, { name })` — 버튼·입력·체크박스·대화상자·영역(`search`, `group`)
2. `getByLabel` — 라벨이 붙은 입력
3. `getByText` — 화면에 보이는 글자 (시각적으로 숨긴 input의 라벨을 클릭할 때 등)
4. `getByPlaceholder` — 위 방법이 없을 때만

CSS 클래스·태그 구조로 찾지 않는다. `data-testid`는 위 방법으로 찾을 수 없는 경우에만 쓰고, 그 전에 요소에 접근 가능한 이름이 없는 것이 접근성 문제가 아닌지 먼저 본다.

같은 이름이 여러 곳에 있으면 **감싸는 영역으로 범위를 좁힌다.**

```ts
page
  .getByRole('group', { name: '메가진화 가능 포켓몬 포함' })
  .getByText('존재', { exact: true })
```

> **Why:** 사용자는 클래스가 아니라 역할과 이름으로 화면을 인식한다. 역할·이름 기반 선택자는 스타일을 바꿔도 깨지지 않고, 스크린 리더가 요소를 찾을 수 있는지도 함께 검증한다. Playwright 공식 권장 방식이다.

---

## 기다리기

- **고정 시간 대기(`page.waitForTimeout`)를 쓰지 않는다.**
- 화면 상태는 자동 재시도하는 검증(`await expect(locator).toHaveValue(...)`, `toBeVisible()` 등)으로 기다린다.
- URL처럼 locator가 아닌 값은 `expect.poll`로 기다린다. 디바운스(500ms)도 이 방식으로 처리한다.

```ts
await input.fill('피카')
await expect.poll(() => getSearchParam(page, 'name')).toBe('피카')
```

> **Why:** 고정 대기는 느린 환경에서는 부족하고 빠른 환경에서는 낭비다. 개발 서버는 첫 요청 때 컴파일하느라 응답이 수 초 늦어지기도 한다. 조건이 맞을 때까지 기다리는 검증은 두 경우 모두에서 안정적이다.

---

## 디바이스

`playwright.config.ts`의 두 프로젝트(`mobile` 375px, `desktop` 1440px)에서 모든 spec이 돈다. **헤더·푸터는 화면 폭이 아니라 User-Agent로 나뉘므로**(`app/layout.tsx`) 각 프로젝트는 해당 디바이스의 UA를 함께 보낸다.

디바이스마다 요소가 다르면 `testInfo.project.name`으로 나눈다.

```ts
const getSearchInput = (page: Page, testInfo: TestInfo) =>
  testInfo.project.name === 'mobile'
    ? page.getByRole('search', { name: '포켓몬 이름으로 목록 검색' }).getByRole('textbox')
    : page.getByRole('textbox', { name: '포켓몬 검색' })
```

---

## 테스트 독립성

- 각 테스트는 `page.goto`로 시작해 필요한 상태를 URL로 만든다. 다른 테스트의 결과에 기대지 않는다(병렬 실행).
- 서버 데이터를 바꾸는 동작(쓰기 API)은 E2E에서 실행하지 않는다.

---

## 버그를 고칠 때

1. 버그를 재현하는 spec을 먼저 쓴다.
2. **고치기 전 코드에서 그 spec이 실패하는지 확인한다.** 이미 통과한다면 버그를 재현하지 못한 것이다.
3. 고친 뒤 통과를 확인하고, spec을 지운다.

> **Why:** 처음부터 통과하는 테스트는 그 버그를 잡는다는 보장이 없다. 실패를 한 번 보는 것이 테스트가 제 역할을 하는지 확인하는 유일한 방법이다.

---

## 참고 자료

- [Playwright — Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright — Locators](https://playwright.dev/docs/locators)
- [Playwright — Auto-waiting](https://playwright.dev/docs/actionability), [Assertions (`expect.poll`)](https://playwright.dev/docs/test-assertions#expectpoll)
- [Playwright — Projects](https://playwright.dev/docs/test-projects)
