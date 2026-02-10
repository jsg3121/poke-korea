---
slug: home-optimization
title: 홈 페이지 공통 컴포넌트 최적화
authors: [jsg3121, claude]
tags: [performance]
---

# 홈 페이지 공통 컴포넌트 최적화

## 📋 작업 개요

**브랜치**: `feature/1.29.0-home-optimization`
**작업 유형**: 리팩토링
**작업 기간**: 2026-01-05
**담당**: Claude Code

<!-- truncate -->

## 🎯 작업 목표

홈 페이지의 모바일/데스크톱 컴포넌트에서 중복된 코드를 제거하여 코드 유지보수성을 향상시키고, Tailwind CSS의 장점을 살리기 위해 스타일 상수 대신 유틸리티 클래스를 직접 사용하도록 개선

## ✨ 주요 변경사항

### 1. 공통 컴포넌트 추출

모바일/데스크톱에서 완전히 동일한 컴포넌트를 공통 폴더로 이동:

**변경 전**:

```
src/container/mobile/home/home.quiz/components/
  ├── QuizAnswerButton.tsx (동일)
  └── QuizCardHeader.tsx (동일)

src/container/desktop/home/home.quiz/components/
  ├── QuizAnswerButton.tsx (동일)
  └── QuizCardHeader.tsx (동일)
```

**변경 후**:

```
src/components/home/quiz/
  ├── QuizAnswerButton.tsx (공통)
  └── QuizCardHeader.tsx (공통)
```

### 2. Import 경로 업데이트

모든 퀴즈 카드 컨테이너에서 공통 컴포넌트 참조 경로 변경:

**변경 전**:

```tsx
import QuizAnswerButton from '../components/QuizAnswerButton'
import QuizCardHeader from '../components/QuizCardHeader'
```

**변경 후**:

```tsx
import QuizAnswerButton from '~/components/home/quiz/QuizAnswerButton'
import QuizCardHeader from '~/components/home/quiz/QuizCardHeader'
```

### 3. 스타일 상수 제거

Tailwind CSS 철학에 맞게 유틸리티 클래스를 직접 사용하도록 변경:

**변경 전**:

```tsx
// src/styles/home.constants.ts
export const HOME_STYLES = {
  quizCard: 'bg-primary-4 rounded-2xl p-6 shadow-lg',
  quizContent: 'w-full h-40 mb-4 rounded-xl p-4 bg-white',
  quizAnswerGroup: 'space-y-2',
}

// 사용
<article className={HOME_STYLES.quizCard}>
```

**변경 후**:

```tsx
// 직접 사용
<article className="bg-primary-4 rounded-2xl p-6 shadow-lg">
```

**제거 이유**:

- Tailwind IntelliSense 자동완성 활성화
- PurgeCSS 최적화 지원
- 코드 가독성 향상
- Utility-first 철학 준수

## 📊 최적화 결과

| 항목                | 변경 전          | 변경 후          | 개선율        |
| ------------------- | ---------------- | ---------------- | ------------- |
| 중복 컴포넌트 파일  | 4개              | 2개              | **50% 감소**  |
| 홈 페이지 번들 크기 | 5.07 kB (161 KB) | 5.02 kB (161 KB) | 약 1% 감소    |
| 총 중복 코드 라인   | ~100줄           | 0줄              | **100% 제거** |

## 🔧 기술적 세부사항

### 영향받은 파일

**생성된 파일**:

- [src/components/home/quiz/QuizAnswerButton.tsx](../../src/components/home/quiz/QuizAnswerButton.tsx)
- [src/components/home/quiz/QuizCardHeader.tsx](../../src/components/home/quiz/QuizCardHeader.tsx)

**삭제된 파일**:

- `src/container/mobile/home/home.quiz/components/` (폴더 전체)
- `src/container/desktop/home/home.quiz/components/` (폴더 전체)
- `src/styles/home.constants.ts`

**수정된 파일** (import 경로 업데이트):

**모바일**:

- [src/container/mobile/home/home.quiz/quiz.quizCard/SilhouetteQuizCard.cntainer.tsx](../../src/container/mobile/home/home.quiz/quiz.quizCard/SilhouetteQuizCard.cntainer.tsx)
- [src/container/mobile/home/home.quiz/quiz.quizCard/PokemonTypeQuizCard.container.tsx](../../src/container/mobile/home/home.quiz/quiz.quizCard/PokemonTypeQuizCard.container.tsx)
- [src/container/mobile/home/home.quiz/quiz.quizCard/AbilityQuizCard.container.tsx](../../src/container/mobile/home/home.quiz/quiz.quizCard/AbilityQuizCard.container.tsx)

**데스크톱**:

- [src/container/desktop/home/home.quiz/quiz.quizCard/SilhouetteQuizCard.cntainer.tsx](../../src/container/desktop/home/home.quiz/quiz.quizCard/SilhouetteQuizCard.cntainer.tsx)
- [src/container/desktop/home/home.quiz/quiz.quizCard/PokemonTypeQuizCard.container.tsx](../../src/container/desktop/home/home.quiz/quiz.quizCard/PokemonTypeQuizCard.container.tsx)
- [src/container/desktop/home/home.quiz/quiz.quizCard/AbilityQuizCard.container.tsx](../../src/container/desktop/home/home.quiz/quiz.quizCard/AbilityQuizCard.container.tsx)

## 📝 향후 작업

1. **추가 공통 컴포넌트 추출**: 퀴즈 카드 컨테이너들도 구조가 거의 동일하므로 추가 통합 가능
2. **다른 페이지 최적화**: 리스트, 상세 페이지 등에도 동일한 패턴 적용
3. **동적 임포트 적용**: SSR을 고려한 조건부 컴포넌트 로딩 (추후 작업)

## 📌 참고 사항

- Tailwind CSS 유틸리티 클래스를 직접 사용하므로 IDE IntelliSense가 정상 작동합니다
- PurgeCSS가 정확하게 사용된 클래스만 감지할 수 있어 번들 크기 최적화에 유리합니다
- 공통 컴포넌트는 모바일/데스크톱 모두에서 동일하게 사용되므로 한 곳만 수정하면 양쪽에 반영됩니다
