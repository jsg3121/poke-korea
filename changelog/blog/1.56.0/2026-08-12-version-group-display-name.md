---
slug: version-group-display-name
title: '버전 그룹 표기 통일 — displayName 도입·버전 매칭 죽은 코드 제거'
description: '같은 게임 버전이 화면마다 다른 이름으로 표기되던 문제를, 백엔드가 새로 제공하는 displayName 단일 필드로 통일했습니다. 상세 컨텍스트의 버전 매칭 로직에 있던 도달 불가 코드와 폴백 연산자 불일치도 함께 정리했습니다.'
authors: [jsg3121, claude]
tags: [refactoring, bug-fix, graphql]
---

# 버전 그룹 표기 통일 — displayName 도입·버전 매칭 죽은 코드 제거

> **작업 날짜**: 2026-08-12
> **브랜치**: `feature/1.56.0-skills-expansion`

## 📋 작업 개요

**작업 유형**: 리팩토링 / 버그 수정
**담당**: jsg3121, claude

## 🎯 작업 목표

`VersionGroup`에 `name`·`nameKo`·`baseVersionGroupName` 세 필드가 공존해 어느 것이 표시용인지 불명확했고, 그 결과 **같은 버전이 화면마다 다른 이름으로 표기**되고 있었다. 백엔드가 새로 제공하는 `displayName`(DLC를 베이스 시리즈로 정규화한 표시 전용 필드)으로 통일한다.

함께, 상세 컨텍스트의 버전 매칭 로직에 있던 실제 버그도 정리한다.

<!-- truncate -->

## ✨ 주요 변경사항

### 변경 1: 도달 불가 코드 제거 (버그)

`Detail.context.tsx`의 `getVersionInfo()`에 실행되지 않는 분기가 있었다.

**변경 전**

```ts
const normalVersionGroup = { levelUpSkillVersion: ..., machineSkillVersion: ... }
const defaultVersionGroup = { levelUpSkillVersion: ..., machineSkillVersion: ... }

return normalVersionGroup ?? defaultVersionGroup
```

`normalVersionGroup`은 **객체 리터럴이라 절대 nullish가 아니므로**, `defaultVersionGroup`은 영원히 반환되지 않는다. 그럼에도 그 안의 `find` 4회는 매 렌더마다 실행되고 있었다.

의도는 "폼에 값이 없으면 기본 폼으로 폴백"이었는데, 그 폴백은 이미 `normalVersionGroup` **내부의 `??`가 수행**하고 있다. 바깥 분기는 처음부터 불필요했다.

**변경 후** — 죽은 분기 삭제. 함수가 57줄에서 24줄로 줄었다.

### 변경 2: 폴백 연산자 불일치 정정 (버그)

같은 객체 안에서 두 필드가 다른 연산자를 쓰고 있었다.

```ts
levelUpVersionGroupId  ?? pokemonBaseInfo...   // nullish 병합
machineVersionGroupId  || pokemonBaseInfo...   // 논리 OR  ← 불일치
```

`||`는 `0`도 폴백 대상으로 삼는다. 두 필드의 폴백 규칙이 달라야 할 이유가 없어 `??`로 통일했다.

### 변경 3: `displayName`으로 버전 표기 통일

같은 버전이 화면마다 다르게 표기되던 것을 단일 필드로 정리했다.

| 화면 | 변경 전 | 변경 후 |
| --- | --- | --- |
| 기술 상세 버전 nav | `nameKo` | `displayName` |
| 습득 기술 sticky nav | `baseVersionGroupName` | `displayName` |
| 습득 기술 목록 | `baseVersionGroupName` | `displayName` |
| 습득 기술 히어로(최초/최신 등장) | `baseVersionGroupName` | `displayName` |

`displayName`은 백엔드가 DLC를 베이스 시리즈로 정규화한다(예: 왕관설원 → 소드·실드). 기존 필드는 폴백으로 남겨 두었다.

### 변경 4: `getVersionGroupsBySkill` 전환

기존 `getVersionGroups`는 `activeIndex`/`activeType`/`generationId`/`pokemonId`/`skillId`/`versionGroupIds` **6가지 용도가 한 입력에 혼재**해, 호출부마다 다른 조합을 조립해야 했다.

기술 상세 2곳(`moveDetail.fetch.ts`, `moveDetailMetadata.fetch.ts`)을 목적 전용 쿼리로 전환했다.

```graphql
getVersionGroupsBySkill(skillId: Int!): [VersionGroup!]!
```

이 쿼리는 삭제된 기술(`isAvailable=false`)만 있는 버전을 제외하므로, **첫 항목이 곧 "이 기술의 최신 사용 가능 버전"**이다.

> 포켓몬 쪽(`getVersionGroupsByPokemon`) 전환은 이번에 하지 않았다. 해당 5개 파일은 다음 작업(`getPokemonLearnset` 통합 쿼리)에서 통째로 재작성되므로, 지금 전환하면 두 번 일이 된다.

### 변경 5: 배열 순서 계약 명시

백엔드가 `order` 내림차순(최신 우선) 정렬을 **계약으로 보장**하게 되어, 기존의 암묵적 가정 3곳에 근거를 주석으로 남겼다.

`DetailMovesHero`의 변수명도 정정했다 — `lastVersionInfo = versionGroup[0]`은 "마지막"이 배열 끝이 아니라 "최신"을 뜻해 읽기 혼란스러웠다. `latestVersionInfo`로 바꿨다.

### 변경 6: `PokemonDetail.signatureSkills` 쿼리 반영

백엔드가 전용기 전용 필드를 추가했다. 기존 방식(레벨업/머신 목록을 순회해 `signatureMoves=true` 필터링)은 **현재 버전 러닝셋에 없는 전용기를 누락**시켰다.

실측 확인된 복구 사례:

| 포켓몬 | 기존 | 신규 필드 |
| --- | --- | --- |
| 무한다이노 | 다이맥스포 | 다이맥스포, **무한다이빔** |
| 갈라르 야도킹 | (없음) | **섬뜩한주문, 썰렁개그** |
| 꿈트렁 | (없음) | **소금절이** |

이번에는 쿼리에 필드만 추가했고, 화면 적용은 다음 작업에서 한다.

## 📊 변경 요약

| 항목 | 변경 전 | 변경 후 |
| --- | --- | --- |
| `getVersionInfo()` | 57줄 (죽은 분기 포함) | 24줄 |
| 매 렌더 `find` 호출 | 4회 (무의미) | 0회 |
| 폴백 연산자 | `??` / `\|\|` 혼재 | `??` 통일 |
| 버전 표기 필드 | 화면마다 다름 (3종) | `displayName` 통일 |
| 기술 상세 버전 쿼리 | 다형 필터 | 목적 전용 쿼리 |

## 🔧 기술적 세부사항

**수정 파일**

- `src/context/Detail.context.tsx` — 죽은 코드·연산자 정리
- `src/container/moves/MoveDetailVersionNav.container.tsx`
- `src/container/detail/moves/` — `DetailMovesStickyNav`, `DetailMovesList`, `DetailMovesHero`
- `src/app/moves/[id]/_fetch/` — `moveDetail.fetch.ts`, `moveDetailMetadata.fetch.ts`
- `src/gql/query.graphql` — `GetVersionGroupsBySkill` 추가, `PokemonDetail`에 `signatureSkills` 추가

**`LATEST_SENTINEL_ID`를 유지한 이유**

기술 상세 버전 nav의 `versionGroupId = 0` sentinel은 백엔드의 `isLatest`로 대체되지 않는다. "최신" 탭은 **최신 버전 항목이 아니라 버전 미지정 URL**(`/moves/[id]`)을 가리키는 별개 항목이기 때문이다. `isLatest`는 목록 안에서 어느 버전이 최신인지를 알려줄 뿐이다. 주석으로 근거를 남겼다.

## 📌 참고 사항

- `src/graphql/`은 자동 생성 디렉토리(gitignore)이므로, 이 브랜치를 받은 뒤 백엔드 서버(`localhost:4000`)를 띄우고 `npm run codegen`을 실행해야 한다.
- 검증: `tsc --noEmit` 에러 0 / `npm run lint` 신규 경고 0 / `npm run build` 성공
- 후속 작업: `getPokemonLearnset` 통합 쿼리 전환 — 습득 쿼리 3종 통합(5쿼리 2왕복 → 1쿼리), 습득법 탭 데이터 기반 렌더, `conditionLabel` 적용, 전용기 카드 신규 필드 적용
