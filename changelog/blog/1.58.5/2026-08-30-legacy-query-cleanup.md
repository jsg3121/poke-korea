---
slug: legacy-query-cleanup
title: '레거시 GraphQL 쿼리 정의 제거 — codegen 실패 해소'
description: '백엔드가 캐시 없는 레거시 쿼리 3종을 스키마에서 제거하면서 codegen이 실패했습니다. 호출은 이미 신규 쿼리로 전환돼 있었고, 정의만 남아 있던 것을 정리했습니다.'
authors: [jsg3121, claude]
tags: [refactoring, graphql]
---

# 레거시 GraphQL 쿼리 정의 제거

> **작업 날짜**: 2026-08-30
> **브랜치**: `hotfix/1.58.5`

## 📋 작업 개요

**작업 유형**: 리팩토링 (죽은 코드 제거)
**담당**: jsg3121, claude

## 🎯 작업 목표

백엔드가 캐시 없는 레거시 쿼리를 스키마에서 제거하면서 `npm run codegen`이 실패하기 시작했다. 호출부는 이미 신규 쿼리로 전환돼 있었으나 `query.graphql`에 정의만 남아 있던 것이 원인이다. 사용하지 않는 정의를 제거해 빌드를 정상화한다.

<!-- truncate -->

## 📉 배경

백엔드에서 CPU 사용량 절감 작업의 일환으로 확인 요청이 왔다. 같은 기능을 하는 쿼리가 레거시/신규 두 벌 존재하는데, **신규에는 응답 캐시(LRU)가 있고 레거시는 매 요청마다 DB를 조회**하는 상황이었다.

프론트 사용 여부를 조사해 회신했다.

| 항목 | 레거시 | 조사 결과 |
| --- | --- | --- |
| 기술 → 포켓몬 역방향 | `getPokemonsBySkill` | 호출 0건 (`getPokemonsBySkillV2`로 전환 완료) |
| 포켓몬 → 습득 기술 | `getPokemonLearnableSkills` 외 2종 | 호출 0건 (`getPokemonLearnset`로 전환 완료) |
| 버전 그룹 | `getVersionGroups` | **사용 중** — 상세 페이지 4개 지점 |

회신 후 백엔드가 레거시 쿼리를 제거했고, 그 시점부터 codegen이 깨졌다.

## 🐛 발생한 문제

```text
✖ GraphQL Document Validation failed with 6 errors;
  Error 1: Cannot query field "getPokemonLearnableSkills" on type "Query".
    at src/gql/query.graphql:550:3
  Error 3: Cannot query field "getPokemonRegionFormLearnableSkills" on type "Query".
    at src/gql/query.graphql:599:3
  Error 5: Cannot query field "getPokemonNormalFormLearnableSkills" on type "Query".
    at src/gql/query.graphql:651:3
```

### 원인

**회신 내용이 틀린 것은 아니었다.** 호출은 실제로 0건이 맞다.

codegen은 `query.graphql` **전체**를 스키마와 대조한다. 호출 여부와 무관하게, 파일에 정의가 적혀 있으면 그 필드가 스키마에 존재해야 한다. 백엔드가 필드를 제거하자 대조에 실패했다.

즉 런타임 문제가 아니라 **죽은 코드가 빌드를 막은 상황**이다. 회신 시 "사용하지 않는 정의를 정리하겠다"고 했던 작업이 실행되지 않은 채 남아 있었다.

## ✨ 주요 변경사항

### 미사용 쿼리 정의 3종 제거

`src/gql/query.graphql`에서 143줄을 삭제했다.

| 삭제한 operation | 대체 |
| --- | --- |
| `GetPokemonLearnableSkills` | `GetPokemonLearnset` |
| `GetPokemonRegionFormLearnableSkills` | `GetPokemonLearnset` (`formType: REGION`) |
| `GetPokemonNormalFormLearnableSkills` | `GetPokemonLearnset` (`formType: NORMAL`) |

신규 `getPokemonLearnset`은 `formType` + `formIndex` 인자로 base·노말폼·리전폼을 한 쿼리에서 처리한다. 폼 상속 처리와 `conditionLabel` 생성도 백엔드로 옮겨져 있다.

### 주석 갱신

`GetPokemonLearnset` 상단 주석에 레거시가 스키마에서 제거된 사실을 명시했다. 대체 이력 자체는 남겨둔다 — 나중에 "왜 폼별로 쿼리가 나뉘어 있지 않은지" 의문이 생길 때 답이 되는 정보다.

## 🔧 기술적 세부사항

### 삭제 전 재검증

정의만 지우면 되는 상황이었지만, 실제로 미사용인지 삭제 직전에 다시 확인했다. codegen 생성물(`src/graphql/`)은 검색에서 제외해야 한다 — 생성물에는 정의가 있으면 무조건 타입이 만들어지므로 사용 여부의 근거가 되지 못한다.

```bash
for op in GetPokemonLearnableSkills \
          GetPokemonRegionFormLearnableSkills \
          GetPokemonNormalFormLearnableSkills; do
  grep -rn "$op" src/ --include="*.ts" --include="*.tsx" | grep -v 'src/graphql/'
done
```

3종 모두 0건이었다.

### 검증

| 항목 | 결과 |
| --- | --- |
| `npm run codegen` | 성공 |
| `npx tsc --noEmit` | 타입 에러 없음 |
| 잔존 레거시 필드 | 없음 |

스키마에 남은 `getPokemonLearnableSkills` 문자열 2건은 백엔드가 신규 쿼리에 붙인 **설명 주석**이며 실제 필드가 아니다.

## 📌 참고 사항

- **`getVersionGroups`는 이번 정리 대상이 아니다.** 상세 페이지 4개 지점에서 아직 사용 중이며, 백엔드에도 유지를 요청했다.
  - `src/app/detail/[pokemonId]/(form)/modules/fetchDetailData.ts` (3곳)
  - `src/app/detail/[pokemonId]/moves/_fetch/defaultMovesMetadata.fetch.ts` (1곳)
- `getVersionGroupsByPokemon`으로의 전환은 별도 작업으로 남아 있다. 인자 구조가 달라(`filter` → `pokemonId` + `formType` + `formIndex`) 단순 치환이 되지 않으므로 호출 문맥 확인이 선행돼야 한다. 상세 페이지는 검색 노출의 49%를 받는 경로라 캐시 적용 시 효과가 클 것으로 보인다.
- **이번 건의 교훈**: 신규 쿼리로 전환할 때 레거시 정의를 함께 지웠다면 발생하지 않았을 문제다. 사용하지 않는 GraphQL 정의는 런타임에 무해해 보이지만, 스키마가 바뀌는 순간 빌드를 막는다.

## 🔗 참고 자료

- [GraphQL Code Generator — Documents validation](https://the-guild.dev/graphql/codegen/docs/config-reference/documents-field)
- [GraphQL Spec — Validation](https://spec.graphql.org/October2021/#sec-Validation)
