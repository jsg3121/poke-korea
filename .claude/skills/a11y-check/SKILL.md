---
name: a11y-check
description: |
  접근성(WCAG) 준수 검사 스킬. 시맨틱 HTML, aria 속성, 색상 대비, 키보드 내비게이션, 이미지 alt 텍스트 등을 검증한다.
  TRIGGER when: "접근성 체크", "a11y 검사", "WCAG 확인", "접근성 검토", "스크린 리더", "키보드 접근성" 요청, 컴포넌트/페이지 접근성 검증 필요
  DO NOT TRIGGER when: SEO 검사(seo-audit 사용), 일반 코드 리뷰(code-review 사용), 단순 HTML 구조 질문
disable-model-invocation: true
---

# 접근성 검사 스킬

변경된 파일 또는 전체 페이지를 대상으로 WCAG 2.1 AA 기준의 접근성 준수 여부를 검사한다.

## 검사 프로세스

### 1. 대상 파일 수집

사용자가 특정 파일/페이지를 지정하지 않으면 `src/` 하위의 `.astro`, `.svelte` 파일을 전체 검사한다.

### 2. 검사 항목

#### 시맨틱 구조

- `<main>`이 페이지당 하나 존재하는지
- heading 계층이 순차적인지 (h1 → h2 → h3, 레벨 건너뜀 없음)
- `<nav>`, `<header>`, `<footer>` 등 랜드마크 태그 사용 여부
- `<div>`, `<span>`이 시맨틱 태그 대신 사용된 곳

#### 이미지 및 미디어

- `<img>` 태그에 `alt` 속성이 있는지
- 장식용 이미지에 `alt=""` 처리 여부
- 아이콘 버튼에 `aria-label` 또는 스크린 리더용 텍스트가 있는지

#### 폼 요소

- 모든 `<input>`, `<select>`, `<textarea>`에 연결된 `<label>`이 있는지
- 에러 메시지가 프로그래밍적으로 연결되어 있는지 (`aria-describedby` 등)
- 필수 필드에 `required` 또는 `aria-required` 표시 여부

#### 색상 및 시각

- 텍스트와 배경의 색상 대비 비율 (AA 기준: 일반 텍스트 4.5:1, 큰 텍스트 3:1)
- 색상만으로 정보를 전달하는 곳이 없는지
- focus 상태가 시각적으로 표시되는지

#### 키보드 내비게이션

- 인터랙티브 요소가 Tab 키로 접근 가능한지
- `tabindex` 남용 여부 (양수 tabindex 사용 금지)
- 모달/드롭다운의 포커스 트랩 처리 여부

#### ARIA 속성

- `aria-*` 속성이 올바르게 사용되었는지
- 불필요한 ARIA 사용 (네이티브 HTML로 충분한 경우)
- `role` 속성과 실제 동작의 일치 여부

### 3. 결과 보고

```markdown
## 접근성 검사 결과

### 요약
- 검사 파일: {N}개
- 🔴 위반 (WCAG A/AA 필수): {N}건
- 🟡 경고 (권장 사항): {N}건
- ✅ 통과

### 🔴 위반 사항

#### [{파일}:{라인}] {위반 내용}
- **WCAG 기준**: {기준 번호} ({기준명})
- **문제**: {설명}
- **수정 방법**: {구체적 수정 안내}

### 🟡 경고 사항

- {파일}: {내용}

### 참고 자료
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
```

## 참고 자료

- [WCAG 2.1](https://www.w3.org/TR/WCAG21/)
- [MDN - Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [The A11Y Project Checklist](https://www.a11yproject.com/checklist/)
