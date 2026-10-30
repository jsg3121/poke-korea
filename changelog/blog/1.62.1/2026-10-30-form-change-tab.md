---
slug: form-change-tab
title: '포켓몬 습득 기술에 폼체인지 탭 추가'
description: '로토무 폼 기술·옷갈아입기 피카츄 전용 기술처럼 폼체인지로 배우는 기술이 탭 4종에 포함되지 않아 보이지 않던 문제를, 해당 기술이 있는 버전에서만 노출되는 폼체인지 탭을 추가해 해결했다.'
authors: [jsg3121, claude]
tags: [feature-improvement, nextjs]
---

# 포켓몬 습득 기술에 폼체인지 탭 추가

> **작업 날짜**: 2026-10-30
> **브랜치**: `feature/1.62.1-form-change-tab`

## 📋 작업 개요

**작업 유형**: 기능 개선 (핫픽스)
**담당**: jsg3121, Claude

## 🎯 작업 목표

폼체인지로 배우는 기술을 포켓몬 습득 기술 페이지에서 볼 수 있게 하되, 그런 기술이 없는 포켓몬에는 빈 탭을 만들지 않는다.

<!-- truncate -->

## 📉 왜 필요했나

히트로토무의 오버히트, 옷갈아입기 피카츄의 코멧펀치처럼 폼을 바꿀 때 배우는 기술은 습득법이 `FORM_CHANGE`다. 백엔드가 이 습득법을 내려주게 됐지만, 습득 기술 페이지 탭은 레벨업·기술머신·알 기술·기술 가르침 4종으로 고정돼 있어 화면에 나오지 않았다.

폼체인지 기술이 있는 포켓몬은 일부 폼뿐이다. 다른 탭처럼 항상 노출하면 1,000여 종에 빈 탭이 생긴다.

## ✨ 주요 변경사항

### 변경 1: 폼체인지 슬러그와 노출 습득법 추가

`movesParams.module.ts`에 `FORM_CHANGE` → `form-change` 슬러그를 추가하고 `VISIBLE_LEARN_METHODS`에 포함했다. 기존 라우트(`/moves/[method]`, `/moves/version/[id]/[method]`, `/moves/form/...`, `/moves/region/...`)가 슬러그 매핑을 공유하므로 경로가 그대로 생긴다.

```text
/detail/479/moves/form/1/version/25/form-change
```

메타데이터 제목에 쓰는 폴백 라벨에도 `폼체인지`를 추가했다.

### 변경 2: 조건부 습득법은 기술이 있을 때만 탭 노출

탭을 항상 보여줄지 조건부로 보여줄지를 `CONDITIONAL_LEARN_METHODS`로 구분했다.

```tsx
const availableMethods = new Set(skillsByMethod?.map(({ method }) => method))
const methodTabs = VISIBLE_LEARN_METHODS.filter(
  (method) =>
    !CONDITIONAL_LEARN_METHODS.has(method) ||
    availableMethods.has(method) ||
    method === activeMethod,
)
```

현재 버전의 `skillsByMethod`에 폼체인지 그룹이 있을 때만 탭이 노출된다. 폼체인지 탭을 보고 있는 중에는 탭이 사라지지 않도록 활성 습득법도 함께 노출한다.

## 🔍 검증

운영 배포 후 실제 페이지를 요청해 탭 링크가 있는지 확인했다.

| 페이지                                       | 폼체인지 탭 |
| -------------------------------------------- | ----------- |
| `/detail/479/moves/form/1/version/25` (히트로토무 SV) | 노출 |
| `/detail/479/moves/form/1` (히트로토무, 최신 Z-A) | 미노출 |
| `/detail/479/moves/version/25` (로토무 SV)    | 미노출      |
| `/detail/1/moves/version/25` (이상해씨 SV)    | 미노출      |

- 히트로토무 SV 폼체인지 페이지에 오버히트가 표시된다.
- 폼체인지 페이지 제목은 "히트로토무 9세대 스칼렛·바이올렛 시리즈 폼체인지 습득 기술 정보"이고, 다른 비기본 습득법과 같이 canonical은 자기 자신이며 robots는 `noindex, follow`다.

## 📌 후속 관찰 대상

- 폼체인지 기술이 없는 포켓몬·버전의 `form-change` URL도 200 빈 페이지로 응답한다. 탭이 숨겨져 있어 링크로 들어오는 경로는 URL 직접 입력과, 폼체인지 탭에서 기술이 없는 버전을 선택하는 경우뿐이다. 1.62.2에서 처리한다.
