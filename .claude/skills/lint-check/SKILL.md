Prettier + ESLint 전체 검사를 실행하고 결과를 보고해줘.

## 실행 절차

1. Prettier 포맷 검사 실행 (`npx prettier --check "src/**/*.{ts,tsx}"`)
2. ESLint 코드 품질 검사 실행 (`npm run lint`)
3. 에러/경고를 분류하여 보고

## 주의사항

- 코드를 바로 수정하지 않는다. 결과만 보고하고 사용자가 요청할 때 수정한다.
- `.claude/conventions/guides/linting.md`의 규칙을 참조하여 의도적 예외인지 판단한다.
