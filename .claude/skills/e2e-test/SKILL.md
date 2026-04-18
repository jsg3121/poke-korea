---
name: e2e-test
description: |
  E2E 테스트 작성 스킬. Playwright로 사용자 플로우(옵션 선택, 미리보기, 다운로드, SEO 랜딩)를 테스트한다.
  TRIGGER when: "E2E 테스트 작성", "Playwright 테스트 만들어줘", "브라우저 테스트 추가", 새 사용자 플로우에 대한 테스트 작성 필요
  DO NOT TRIGGER when: 단위 테스트(test-writer 사용), 테스트 실행만 필요(qa-agent 사용), 기존 테스트 실행/분석
disable-model-invocation: true
---

# E2E 테스트 스킬

Playwright를 사용하여 ConfigDeck의 핵심 사용자 플로우를 브라우저 환경에서 검증한다.

## 테스트 대상 플로우

### 1. 설정 생성기 플로우

- 스택 선택 (Frontend, Backend 등)
- 세부 옵션 체크박스/라디오/셀렉트 조작
- 옵션 변경 시 미리보기 코드 즉시 반영 확인
- 코드 복사 버튼 동작
- 단건 파일 다운로드
- ZIP 전체 다운로드
- 공유 링크 생성 및 URL 파라미터 복원

### 2. 프리셋 플로우

- 프리셋 선택 시 옵션 자동 적용
- 프리셋 기반 커스터마이징

### 3. SEO 랜딩 페이지

- 파일별 랜딩 페이지 렌더링 확인 (/files/*)
- 스택별 랜딩 페이지 렌더링 확인 (/stacks/*)
- 메타태그 존재 여부 (title, description, OG, hreflang)
- 구조화 데이터(JSON-LD) 유효성

### 4. 다국어

- 언어 전환 동작
- hreflang 태그 상호 참조 확인
- URL 구조 (/en/*, /ko/*) 정상 라우팅

## 테스트 작성 규칙

### 파일 구조

```
tests/
├── e2e/
│   ├── generator.spec.ts      # 설정 생성기 플로우
│   ├── presets.spec.ts         # 프리셋 플로우
│   ├── share-link.spec.ts     # 공유 링크 생성/복원
│   ├── seo-landing.spec.ts    # SEO 랜딩 페이지
│   ├── i18n.spec.ts           # 다국어 전환
│   └── a11y.spec.ts           # 접근성 (axe-core 연동)
└── playwright.config.ts
```

### 테스트 코드 패턴

```typescript
import { test, expect } from '@playwright/test'

test.describe('설정 생성기', () => {
  test('ESLint 옵션 선택 시 미리보기가 업데이트된다', async ({ page }) => {
    await page.goto('/en/generator')

    // 스택 선택
    await page.getByRole('button', { name: 'Frontend' }).click()

    // ESLint 옵션 선택
    await page.getByLabel('ESLint').check()
    await page.getByLabel('Strict mode').check()

    // 미리보기에 해당 설정이 반영되었는지 확인
    const preview = page.getByTestId('code-preview')
    await expect(preview).toContainText('eslint')
  })
})
```

### 실행 방법

```bash
# 전체 E2E 테스트
pnpm playwright test

# 특정 파일만
pnpm playwright test tests/e2e/generator.spec.ts

# UI 모드 (디버깅)
pnpm playwright test --ui

# 특정 브라우저
pnpm playwright test --project=chromium
```

## 테스트 작성 시 주의사항

- 빌드된 사이트를 대상으로 테스트한다 (`pnpm build && pnpm preview` 후 실행)
- 선택자는 `data-testid`, `role`, `label` 기반을 우선한다 (CSS 클래스 선택자 지양)
- 각 테스트는 독립적이어야 한다 (이전 테스트 상태에 의존하지 않음)
- 네트워크 요청이 없는 정적 사이트이므로 API 모킹은 불필요하다

## 참고 자료

- [Playwright - Getting Started](https://playwright.dev/docs/intro)
- [Playwright - Best Practices](https://playwright.dev/docs/best-practices)
- [Astro - Testing](https://docs.astro.build/en/guides/testing/)
