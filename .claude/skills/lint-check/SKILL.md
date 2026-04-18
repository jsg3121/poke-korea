---
name: lint-check
description: |
  Prettier와 ESLint 전체 검사 스킬. 포맷팅 위반과 린트 에러/경고를 검출하여 보고한다.
  TRIGGER when: "린트 체크", "포맷 확인", "코드 검사", "prettier 확인", "eslint 확인" 요청, 작업 완료 후 전체 코드 품질 확인 필요
  DO NOT TRIGGER when: 코드 리뷰(code-review 사용), 종합 QA(qa-agent 사용), 자동 포맷팅 실행만 필요
disable-model-invocation: true
---

# 린트 체크 스킬

작업 완료 후 전체 소스 파일에 대해 Prettier 포맷팅과 ESLint 규칙 준수 여부를 검사하고 결과를 보고한다.

## 검사 프로세스

### 1. Prettier 포맷팅 검사

포맷팅이 어긋난 파일을 목록으로 확인한다 (수정하지 않고 검사만):

```bash
pnpm prettier --check "src/**/*.{ts,svelte,astro,css,json}" 2>&1
```

### 2. ESLint 검사

모든 소스 파일에 대해 린트 검사를 실행한다:

```bash
pnpm eslint "src/**/*.{ts,svelte,astro}" 2>&1
```

### 3. 결과 보고

검사 결과를 아래 형식으로 정리하여 보고한다:

```markdown
## 린트 체크 결과

### Prettier
- ✅ 통과: {N}개 파일
- ❌ 위반: {N}개 파일

위반 파일:
- `src/components/ConfigGenerator.svelte`
- `src/lib/utils/formatCode.ts`

### ESLint
- ✅ 통과: {N}개 파일
- ⚠️ 경고: {N}건
- ❌ 에러: {N}건

| 파일 | 심각도 | 규칙 | 메시지 |
|------|--------|------|--------|
| `src/lib/utils/helpers.ts:12` | error | @typescript-eslint/no-explicit-any | Unexpected any |
| `src/components/Card.astro:5` | warn | no-console | Unexpected console statement |

### 요약
{전체 통과 여부. 에러가 있으면 수정이 필요한 항목을 우선순위별로 정리}
```

## 주의사항

- 이 스킬은 **검사만 수행하고 자동 수정하지 않는다**. 수정이 필요한 경우 사용자에게 보고 후 확인을 받는다.
- Prettier 위반은 `pnpm prettier --write`로, ESLint 에러는 `pnpm eslint --fix`로 자동 수정 가능한 것과 수동 수정이 필요한 것을 구분하여 안내한다.
- 프로젝트에 Prettier/ESLint가 설치되어 있지 않으면 그 사실을 알리고 검사를 중단한다.
