---
slug: detail-components-placement
title: '상세 페이지 하위 컴포넌트를 사용처 기준 위치로 이동'
description: 'containers/detail/components/에 모여 있던 하위 컴포넌트 3개를 사용처 개수 기준 배치 규칙에 맞춰 shared/와 부모 옆으로 옮기고, 빈 components/ 폴더를 없앴다.'
authors: [jsg3121, claude]
tags: [refactoring]
---

# 상세 페이지 하위 컴포넌트 배치 정리

> **작업 날짜**: 2026-10-27
> **브랜치**: `feature/1.62.0-code-cleanup`

## 📋 작업 개요

**작업 유형**: 리팩토링
**담당**: Claude Code

## 🎯 작업 목표

`containers/detail/components/`의 컴포넌트 3개를 `structure.md`의 배치 규칙(사용처 개수로 위치 결정)에 맞는 자리로 옮긴다. 코드 내용과 화면 동작은 바꾸지 않는다.

<!-- truncate -->

## 📉 왜 필요했나

`structure.md`는 한 도메인 안 여러 곳에서 쓰는 코드는 `<도메인>/shared/`, 한 곳에서만 쓰는 하위 컴포넌트는 부모와 같은 폴더에 두도록 정한다. `containers/detail/components/`는 이 기준이 생기기 전 폴더라, 사용처가 8곳인 컴포넌트와 1곳인 컴포넌트가 섞여 있었다. 1.62.0 이름 입력 작업 중 정리 대상으로 기록해 두었던 항목이다.

## ✨ 주요 변경사항

| 컴포넌트 | 사용처 | 변경 전 | 변경 후 |
| --- | --- | --- | --- |
| `InfoCardTitle` | detail 컨테이너 8곳 | `detail/components/` | `detail/shared/` |
| `DetailQuizCta` | detail 컨테이너 2곳 | `detail/components/` | `detail/shared/` |
| `EvolutionConditionCard` | `DetailEvolution` 1곳 | `detail/components/` | `detail/` (부모 옆) |

- 파일은 `git mv`로 옮겨 이력을 유지했다. 파일 내용은 그대로다.
- 사용처 8개 파일의 import 경로를 바꾸고, Prettier import 정렬에 맞춰 순서를 다시 맞췄다.
- 비게 된 `containers/detail/components/` 폴더를 지웠다.

## 🔍 검증

- `tsc --noEmit`: 통과
- `eslint src/containers/detail`: 경고 0건
- `prettier --check src/containers/detail`: 통과
- diff에서 import 줄 외 변경이 없음을 확인했다
- 렌더 결과는 바뀌지 않는 이동이라 브라우저 확인은 하지 않았다
