---
slug: card-form-name
title: '특성·기술 도감 상세 카드에 폼별 이름 표시'
description: '특성·기술 도감 상세의 포켓몬 카드가 메가진화·리전폼·노말폼을 원종 이름으로 보여주던 문제를 고쳐, 메가라이츄Y처럼 각 폼의 이름을 표시하고 중복되던 폼 배지를 정리했습니다.'
authors: [jsg3121, claude]
tags: [bug-fix, ux]
---

# 특성·기술 도감 상세 카드에 폼별 이름 표시

> **작업 날짜**: 2026-10-01
> **브랜치**: `feature/1.61.1-card-form-name`

## 📋 작업 개요

**작업 유형**: 버그 수정
**담당**: Claude Code

## 🎯 작업 목표

특성 도감 상세(`/ability/[id]`)와 기술 도감 상세의 포켓몬 카드가 메가진화·리전폼·노말폼마다 그 폼의 이름(예: 메가라이츄Y, 꼬마돌 알로라의 모습)을 표시하게 한다.

<!-- truncate -->

## 📉 왜 필요했나

특성 99 노가드를 가진 포켓몬은 메가라이츄Y인데 카드 제목에는 "라이츄"로 나왔다. 메가진화가 X·Y 두 가지인 포켓몬은 "메가진화" 배지만으로는 어느 쪽인지 알 수 없다.

두 API 모두 폼의 `name`에는 원종 이름을, `formName`에는 그 폼의 전체 이름을 담는다. 그런데 카드는 항상 `name`을 제목으로 쓰고, 폼 정보는 하단 배지로만 보여줬다.

```json
{ "id": "M0026060", "name": "라이츄", "formName": "메가라이츄Y", "formType": "MEGA" }
```

배지 방식에는 다른 문제도 있었다.

- 노말폼은 배지가 `formName`을 그대로 써서 "루가루암" 제목 아래 "루가루암 한밤중의 모습" 배지가 붙는 등 이름이 두 번 나왔다.
- 백엔드는 원시회귀(원시가이오가·원시그란돈)도 `formType: 'MEGA'`로 내려주므로 원시회귀에도 "메가진화" 배지가 붙었다.

## ✨ 주요 변경사항

### 폼 이름을 제목으로 쓰고 폼 배지 제거

`PokemonByAbilityCard`, `PokemonBySkillCard` 두 카드 모두 표시 이름을 `formName || name`으로 정한다. 원종은 `formName`이 `null`이라 원종 이름이 그대로 나온다. 이 값을 제목, 이미지 alt, aria-label에 똑같이 쓴다.

**변경 전**:

```tsx
const formLabel = useMemo(() => {
  switch (pokemonData.formType) {
    case 'MEGA':
      return '메가진화'
    // REGION_FORM, NORMAL_FORM ...
  }
}, [...])

<h3 className="... text-right">{pokemonData.name}</h3>
{formLabel && <span>{formLabel}</span>}
```

**변경 후**:

```tsx
const displayName = pokemonData.formName || pokemonData.name
const nameHeaderClass = getNameHeaderClass(displayName)

<h3 className={`... ${nameHeaderClass}`}>{displayName}</h3>
```

폼 타입으로 분기하지 않으므로, 특성 API(`REGION_FORM`/`NORMAL_FORM`)와 기술 API(`REGION`/`NORMAL`)의 `formType` 값이 서로 달라도 같은 코드로 처리된다. "숨겨진 특성" 배지와 습득 방법 배지는 폼 정보가 아니라서 그대로 둔다.

### 긴 이름은 챔피언스 카드와 같은 규칙으로 처리

가장 긴 폼 이름은 "켄타로스 팔데아의 모습 (블레이즈종)"(20자)이다. 챔피언스 카드가 쓰는 `getNameHeaderClass`를 두 카드에도 적용해, 이름 길이에 따라 글자 크기와 정렬이 같은 기준으로 바뀌게 했다.

| 이름 길이 | 모바일 | 데스크톱 | 정렬 |
| --------- | ------ | -------- | ---- |
| 7자 이하  | xs     | base     | 오른쪽 |
| 10자 이하 | 2xs    | sm       | 오른쪽 |
| 11자 이상 | 2xs    | xs       | 왼쪽 |

## 🔍 검증

- `eslint`, `prettier`, `tsc --noEmit` 통과
- 로컬 API로 `formName` 실측
  - 특성 API(전체 310종): 메가 85, 리전 59, 노말 279건 모두 `formName`이 있고, 전부 원종 이름이 들어간 전체 이름이다.
  - 기술 API(21종 샘플): 리전 59, 노말 248건이 같은 조건을 만족한다.
  - 기술 API는 메가진화를 응답에 포함하지 않는다.
- QA(이전 단계): lint-check·code-review·a11y-check 모두 차단 0건. 원시회귀 배지 불일치와 메가 중복 낭독은 이번 배지 제거로 해소됐다.
- 실제 화면 렌더링은 확인하지 않았다.

## 📌 참고 사항

- 원종 카드의 제목 글자 크기도 `getNameHeaderClass` 기준으로 바뀐다. 이전에는 크기 클래스 없이 상속값을 썼다.
- 같은 화면에서 메가라이츄Y 카드가 메가라이츄X 상세로 연결되던 문제는 백엔드가 원인이다. 특성으로 걸러진 목록 안에서 이미지 index를 매겨 `imagePath`가 `102600`(X)으로 나갔다. 수정은 `poke-korea-server`에 반영돼 있으며, 서버를 배포하면 링크와 카드 이미지가 함께 바로잡힌다. 프론트 변경은 없다.
