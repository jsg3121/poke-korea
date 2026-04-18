---
name: test-writer
description: |
  단위 테스트 작성 스킬. Vitest로 설정 생성 로직, 유틸 함수, 스키마 검증 등의 테스트를 작성한다.
  TRIGGER when: "테스트 작성", "테스트 만들어줘", "유닛 테스트 추가", "vitest 테스트" 요청, 새 함수/모듈에 대한 테스트 작성 필요
  DO NOT TRIGGER when: E2E 테스트(e2e-test 사용), 테스트 실행만 필요(qa-agent 사용), 기존 테스트 실행/분석
disable-model-invocation: true
---

# 단위 테스트 작성 스킬

Vitest를 사용하여 ConfigDeck의 로직에 대한 단위 테스트를 작성한다.

## 테스트 대상

### 우선순위 높음

- **설정 생성 로직** (`src/lib/generators/`) — 옵션 입력 → 설정 파일 코드 출력의 정확성
- **스키마 검증** (`src/lib/schemas/`) — 옵션 스키마의 유효성, 옵션 간 충돌 감지
- **URL 파라미터 인코딩/디코딩** — 공유 링크의 옵션 직렬화/역직렬화 정확성

### 우선순위 중간

- **유틸 함수** (`src/lib/utils/`) — 코드 포맷팅, 들여쓰기 변환 등
- **i18n 관련** — 번역 키 누락 감지, locale 전환 로직

## 테스트 작성 프로세스

### 1. 기존 패턴 분석

테스트 작성 전 기존 테스트 파일을 읽어 프로젝트의 테스트 스타일을 파악한다:

```bash
find src -name "*.test.ts" -o -name "*.spec.ts" | head -5
```

### 2. 테스트 파일 생성

테스트 파일은 대상 파일과 같은 디렉토리에 `.test.ts` 확장자로 생성한다:

```
src/lib/generators/eslintGenerator.ts
src/lib/generators/eslintGenerator.test.ts
```

### 3. 테스트 코드 패턴

```typescript
import { describe, it, expect } from 'vitest'
import { generateEslintConfig } from './eslintGenerator'

describe('generateEslintConfig', () => {
  it('기본 옵션으로 유효한 ESLint 설정을 생성한다', () => {
    const result = generateEslintConfig({
      framework: 'react',
      typescript: true,
      strict: false,
    })

    expect(result).toContain('eslint')
    expect(result).toContain('typescript')
  })

  it('strict 모드 활성화 시 strict 규칙을 포함한다', () => {
    const result = generateEslintConfig({
      framework: 'react',
      typescript: true,
      strict: true,
    })

    expect(result).toContain('strict')
  })

  it('지원하지 않는 프레임워크에 대해 에러를 던진다', () => {
    expect(() =>
      generateEslintConfig({
        framework: 'unknown' as never,
        typescript: true,
        strict: false,
      }),
    ).toThrow()
  })
})
```

## 테스트 작성 규칙

- **describe**: 테스트 대상 함수/모듈명
- **it**: 한국어로 기대 동작을 서술 (`"~한다"`, `"~를 반환한다"`)
- 하나의 `it`에 하나의 검증 사항만 포함 (단일 책임)
- 엣지 케이스를 반드시 포함: 빈 입력, 잘못된 타입, 경계값
- 테스트 간 상태를 공유하지 않는다
- mock은 최소화하고 실제 로직을 테스트한다

## 실행 방법

```bash
# 전체 테스트
pnpm vitest run

# 감시 모드
pnpm vitest

# 특정 파일
pnpm vitest run src/lib/generators/eslintGenerator.test.ts

# 커버리지
pnpm vitest run --coverage
```

## 참고 자료

- [Vitest - Getting Started](https://vitest.dev/guide/)
- [Vitest - API Reference](https://vitest.dev/api/)
