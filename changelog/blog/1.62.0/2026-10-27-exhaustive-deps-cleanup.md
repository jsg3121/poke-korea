---
slug: exhaustive-deps-cleanup
title: '상성 계산기 이름 입력의 exhaustive-deps 억제 제거'
description: 'TypePokemonNameSearch effect에서 사실과 다른 사유로 남아 있던 exhaustive-deps 억제를 지우고, 참조가 고정된 debounce setter를 의존성 배열에 넣었다.'
authors: [jsg3121, claude]
tags: [refactoring]
---

# 상성 계산기 이름 입력의 exhaustive-deps 억제 제거

> **작업 날짜**: 2026-10-27
> **브랜치**: `feature/1.62.0-code-cleanup`

## 📋 작업 개요

**작업 유형**: 리팩토링
**담당**: Claude Code

## 🎯 작업 목표

`TypePokemonNameSearch`의 선택 변경 effect에서 `react-hooks/exhaustive-deps` 억제를 없애고, 린트가 의존성을 계속 검사하게 한다. 동작은 바꾸지 않는다.

<!-- truncate -->

## 📉 왜 필요했나

억제 사유 주석은 "debounce는 렌더마다 새로 만들어지는 setter 래퍼"라고 적고 있었다. 1.62.0 목록 검색 작업에서 `useDebounce`가 `useState`의 setter를 그대로 돌려주도록 바뀌면서 이 설명은 사실이 아니게 됐다(`2026-10-21-list-search` 참고 사항). 틀린 사유는 다음에 코드를 읽는 사람의 판단을 잘못 이끈다. 억제가 남아 있으면 앞으로 의존성이 빠져도 린트가 알려 주지 않는다.

React 공식 문서는 effect에서 읽는 반응형 값을 모두 의존성에 넣고, 린트 억제는 피하라고 권한다. `useState`의 set 함수는 참조가 고정돼 있어 의존성에 넣어도 effect가 다시 실행되지 않는다.

- [useEffect — Specifying reactive dependencies](https://react.dev/reference/react/useEffect#specifying-reactive-dependencies)
- [useState — set functions](https://react.dev/reference/react/useState#setstate)
- [Removing Effect Dependencies](https://react.dev/learn/removing-effect-dependencies)

## ✨ 주요 변경사항

**변경 전**:

```tsx
    moveToResultTitle(isKeyboardSelectRef.current)
    // ↓ selectedPokemon이 바뀔 때만 실행하는 것이 의도. debounce는 렌더마다 새로 만들어지는 setter 래퍼다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPokemon])
```

**변경 후**:

```tsx
    moveToResultTitle(isKeyboardSelectRef.current)
  }, [selectedPokemon, debounce])
```

## 🔍 검증

- `eslint`: 억제 없이 경고 0건
- `tsc --noEmit`, Prettier: 통과
- `debounce`의 참조는 `useDebounce`가 돌려주는 `useState` setter라 고정돼 있어, effect 실행 시점은 이전과 같다. 브라우저 확인은 하지 않았다.

## 📌 참고 사항

- 이 변경은 `useDebounce`가 참조가 고정된 함수를 돌려준다는 전제에 기댄다. 훅이 매 렌더 새 함수를 돌려주도록 바뀌면 effect가 매번 실행되므로, 그때는 훅 안에서 `useCallback`으로 참조를 고정한다.
