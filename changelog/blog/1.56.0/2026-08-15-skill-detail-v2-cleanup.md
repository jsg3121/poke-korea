---
slug: skill-detail-v2-cleanup
title: '기술 도감 통합 데이터 전환 + 페이로드 정리'
description: '기술 상세의 "이 기술을 배우는 포켓몬" 목록에서 기술 가르침·알 기술로 배우는 포켓몬이 누락되던 문제를 해결했습니다. 사이트맵과 목록 쿼리의 불필요한 페이로드도 함께 정리했습니다.'
authors: [jsg3121, claude]
tags: [feature-improvement, performance, graphql]
---

# 기술 도감 통합 데이터 전환 + 페이로드 정리

> **작업 날짜**: 2026-08-15
> **브랜치**: `feature/1.56.0-skills-expansion`

## 📋 작업 개요

**작업 유형**: 기능 개선 / 성능 개선
**담당**: jsg3121, claude

## 🎯 작업 목표

기술 상세(`/moves/[id]`)의 "이 기술을 배우는 포켓몬" 목록이 레거시 데이터를 쓰고 있어, 백엔드가 새로 적재한 습득법(기술 가르침·알 기술)으로 배우는 포켓몬이 **통째로 누락**되고 있었다. 통합 테이블 기반 쿼리로 전환한다.

<!-- truncate -->

## ✨ 주요 변경사항

### 변경 1: `getPokemonsBySkillV2` 전환

응답 형태가 레거시와 완전히 동일해(필드 구조 실측 확인) 쿼리명만 교체했다.

불꽃펀치(울트라썬·울트라문) 기준 실측 변화다.

| 항목 | 레거시 | V2 |
| --- | ---: | ---: |
| 총 개수 | 16 | **187** |
| 기술 가르침 | 0 | **100** |
| 알 기술 | 0 | **12** |
| 레벨업 | 16 | 14 |

**기술 가르침으로 배우는 포켓몬 100종이 아예 안 나오던 상태**였다.

### 변경 2: 캐시 정책 필드명 동기화

무한 스크롤의 edges 누적 병합은 Apollo `typePolicies`가 담당하는데, 이 정책이 **필드명에 걸려 있다.**

```ts
const PAGINATED_QUERY_FIELDS = {
  getPokemonsBySkillV2: [['input', ['filter']]],  // ← 함께 바꿔야 한다
}
```

쿼리만 바꾸고 이걸 놓치면 병합 정책이 적용되지 않아 **더보기가 조용히 깨진다.** 타입 체크로는 잡히지 않는 종류라 주의가 필요했다.

### 변경 3: 메가진화 분기 제거

V2는 메가진화를 목록에서 제외한다 — 메가는 기술을 새로 배우지 않고 원본 종의 러닝셋을 그대로 쓰므로(실측상 메가 폼 러닝셋 전량이 원본과 중복), 노출하면 같은 종이 두 번 나온다.

카드의 `MEGA` 분기(라벨 + URL 생성) 두 곳이 죽은 코드가 되어 제거했다. 향후 메가 전용 기술이 생기면 백엔드가 다시 내려주므로 그때 되살린다.

### 변경 4: 습득법 라벨 SSR 반영

전환 후 확인해 보니 습득법 배지에 **enum 원문(`TUTOR`)이 그대로 렌더**되고 있었다. 라벨을 클라이언트 쿼리로만 받아 SSR HTML에 한글이 없었기 때문이다.

`moveDetail.fetch`에서 `GetLearnMethods`를 함께 실행해 Apollo 캐시에 심는다. 이 fetch는 `extractApolloState`로 캐시를 통째로 클라이언트에 넘기므로, 반환값을 쓰지 않아도 `useQuery(cache-first)`가 네트워크 없이 읽는다.

### 변경 5: 사이트맵 경량화

사이트맵은 기술 ID만 필요한데 `GetPokemonSkillList(first:1000)`로 **기술당 12개 필드(description 포함)를 받아놓고 `id` 하나만** 쓰고 있었다. 6시간마다 재생성되므로 누적 낭비가 컸다.

```graphql
query GetAllSkillIds {
  getAllSkillIds   # ID 배열만
}
```

### 변경 6: 목록 쿼리에서 `description` 제거

기술 도감 목록 카드는 `description`을 렌더하지 않는데(하단은 고정 문구) 쿼리는 받고 있었다. 무한 스크롤로 20개씩 누적되므로 가장 무거운 필드를 빼는 효과가 크다.

`identifier`·`firstGenerationId`·`signatureMoves`도 카드에서 쓰지 않으나, 필터·JSON-LD 등 다른 경로에서 쓸 여지가 있어 이번엔 두었다.

### 변경 7: `GmaxMove` 분류 표기

거다이맥스 기술은 **고정 분류가 없고** 기반 기술의 분류를 따른다(Bulbapedia 전 거다이맥스 기술 `damagecategory=Varies`). 기존엔 `'물리 / 특수'`를 문자열로 지어냈는데 애초에 표현 불가능한 값이었다.

백엔드 `dependsOnBaseMove`를 근거로 "기반 기술에 따름"으로 표기한다.

### 변경 8: `description` 개행 치환 제거

백엔드가 적재 시점에 개행을 정규화하도록 바뀌었다(표본 200건에서 개행·소프트하이픈 0건 확인). 프론트 치환은 `MoveDescription`을 쓰는 곳에만 적용돼 **화면마다 처리가 달랐는데**, 출처에서 해결되어 그 불일치도 사라졌다.

## 📊 변경 요약

| 항목 | 변경 전 | 변경 후 |
| --- | --- | --- |
| 기술별 포켓몬 목록 | 레거시 (신규 습득법 누락) | V2 (기술 가르침 100종 복구) |
| 메가진화 카드 | 원본 종과 중복 노출 | 제외 |
| 습득법 배지 | `TUTOR` (enum 원문) | `기술 가르침` |
| 사이트맵 쿼리 | 1000건 × 12필드 | ID 배열만 |
| 목록 쿼리 | `description` 포함 | 제외 |
| 거다이맥스 분류 | `물리 / 특수` (지어낸 값) | `기반 기술에 따름` |

## 🔧 기술적 세부사항

**수정 파일**

- `src/gql/query.graphql` — `getPokemonsBySkillV2` 전환, `GetAllSkillIds` 신설, 목록 `description` 제거
- `src/module/apolloClient.ts` — 페이지네이션 캐시 정책 필드명
- `src/hook/usePokemonsBySkill.ts`, `src/app/moves/[id]/**` — 응답 필드명
- `src/app/moves/[id]/_fetch/moveDetail.fetch.ts` — 라벨 캐시 주입
- `src/app/sitemap.ts` — 경량 쿼리
- `src/components/moves/PokemonBySkillCard.component.tsx` — 메가 분기 제거
- `src/container/detail/DetailExclusiveMoves.container.tsx` — 거다이맥스 표기
- `src/container/detail/components/MoveDescription.component.tsx` — 개행 치환 제거

**실측 검증**

로컬 개발 서버에 `curl`로 확인했다.

| 확인 | 결과 |
| --- | --- |
| 라우트 7종 (`/moves`·`/moves/7`·버전·사이트맵·습득 기술) | 전부 200 |
| 습득법 배지 한글 | 기술 가르침 32회·알 기술 7회 |
| enum 원문 노출 | 0회 |
| 메가진화 배지 | 0회 |
| 사이트맵 기술 URL | 919건 정상 생성 |

## 📌 참고 사항

- `src/graphql/`은 자동 생성 디렉토리(gitignore)이므로, 이 브랜치를 받은 뒤 백엔드 서버(`localhost:4000`)를 띄우고 `npm run codegen`을 실행해야 한다.
- 검증: `tsc --noEmit` 에러 0 / `npm run lint` 신규 경고 0 / 라우트 실측 통과
- **무한 스크롤 확인 권장** — 캐시 정책 필드명을 바꿨으므로 `/moves/7`에서 더보기가 정상 누적되는지 봐야 한다.
