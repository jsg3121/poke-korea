---
slug: type-file-naming
title: '타입 정의 파일명을 .types.ts 복수형으로 통일'
description: '파일명 규칙(타입 정의는 이름.types.ts)과 어긋나 있던 quiz.type.ts, detailContext.type.ts를 복수형으로 바꾸고 import 경로 16곳을 정리했습니다.'
authors: [jsg3121, claude]
tags: [refactoring]
---

# 타입 정의 파일명을 .types.ts 복수형으로 통일

> **작업 날짜**: 2026-10-19
> **브랜치**: `feature/1.62.0-type-file-naming`

## 📋 작업 개요

**작업 유형**: 리팩토링
**담당**: jsg3121, claude

## 🎯 작업 목표

타입 정의 파일의 이름 형식을 `naming.md` 규칙(`이름.types.ts`) 하나로 맞춘다.

<!-- truncate -->

## 📉 왜 필요했나

- `src/`의 타입 정의 파일 6개 중 2개만 단수형(`.type.ts`)이었다. 1.61.0 이름 규칙 정리에서 빠진 부분이다.
- 같은 성격의 파일이 두 형식으로 섞여 있으면, 새 파일을 만들 때 어느 쪽을 따를지 헷갈린다. 1.62.0 이벤트 타입(`analyticsEvent.types.ts`)을 추가하면서 발견했다.

## ✨ 주요 변경사항

| 변경 전 | 변경 후 |
| --- | --- |
| `src/types/quiz.type.ts` | `src/types/quiz.types.ts` |
| `src/types/detailContext.type.ts` | `src/types/detailContext.types.ts` |

- 두 파일을 참조하는 import 경로 16곳을 고쳤다(detail 라우트 모듈, 퀴즈 컴포넌트·컨텍스트, 모듈·상수·유틸).
- `git mv`로 옮겨 파일 이력을 유지했다.

## 🔍 검증

- `tsc --noEmit` 통과, 변경 파일 ESLint·Prettier 통과
- 경로만 바뀌어 화면·동작 변화는 없다.
