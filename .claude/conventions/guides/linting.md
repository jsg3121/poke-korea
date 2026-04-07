# 린팅 가이드

## 코드 포맷팅 (Prettier)

설정 파일: `.prettierrc`

| 규칙 | 설정값 |
|------|--------|
| 세미콜론 | 사용 안 함 (`semi: false`) |
| 따옴표 | 작은따옴표 (`singleQuote: true`) |
| JSX 따옴표 | 큰따옴표 (`jsxSingleQuote: false`) |
| 탭 크기 | 2칸 (`tabWidth: 2`) |
| 줄 길이 | 80자 (`printWidth: 80`) |
| 후행 쉼표 | 모든 곳 (`trailingComma: all`) |
| 화살표 함수 괄호 | 항상 (`arrowParens: always`) |
| 줄 끝 | LF (`endOfLine: lf`) |

## ESLint 주요 규칙

설정 파일: `.eslintrc`

- TypeScript strict 규칙 적용 (`@typescript-eslint/recommended`)
- React Hooks 규칙 적용 (`react-hooks/rules-of-hooks`: warn)
- 미사용 변수 에러 (`@typescript-eslint/no-unused-vars`: error, `_` 접두어 예외)
- `any` 타입 경고 (`@typescript-eslint/no-explicit-any`: warn)
- import/export 유효성 검사
- Prettier 연동 (`prettier/prettier`: warn)
- 접근성 규칙 (`jsx-a11y/aria-role`)
- `.js`, `.jsx` 파일은 lint 무시 (`ignorePatterns`)

## 실행 명령어

```bash
npm run lint        # ESLint 코드 품질 검사
```

**Why:** Prettier와 ESLint를 연동하여 코드 스타일과 품질을 동시에 관리. `_` 접두어 예외는 의도적으로 사용하지 않는 변수(콜백 파라미터 등)를 허용하기 위함.
